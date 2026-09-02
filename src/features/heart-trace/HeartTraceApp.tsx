import { useEffect, useLayoutEffect, useReducer, useState } from 'react';

import { QUESTIONS } from './data/questions';
import { RESULT_TYPES } from './data/resultTypes';
import {
  MAX_SKIPPED_ANSWERS,
  countSkippedAnswers,
} from './domain/answers';
import { createTieBreakerQuestion } from './domain/tieBreaker';
import type { ResultTypeId } from './domain/types';
import { GuideScreen } from './screens/GuideScreen';
import { IntroScreen } from './screens/IntroScreen';
import { LoadingScreen } from './screens/LoadingScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { ResultScreen } from './screens/ResultScreen';
import { TieBreakerScreen } from './screens/TieBreakerScreen';
import { getResultImageFilename, preloadResultImage } from './services/resultImage';
import {
  clearHeartTraceSession,
  loadHeartTraceSession,
  saveHeartTraceSession,
} from './services/sessionStorage';
import { createInitialTestState, testReducer } from './state/testReducer';
import { RESULT_REVEAL_DELAY_MS } from './state/timing';
import {
  completeContentParticipation,
  startContentParticipation,
} from '../../engagement/tracker';

type HeartTraceAppProps = {
  onBackHome: () => void;
};

export function HeartTraceApp({ onBackHome }: HeartTraceAppProps) {
  const [state, dispatch] = useReducer(
    testReducer,
    undefined,
    createInitialTestState,
  );
  const [introStep, setIntroStep] = useState<'intro' | 'guide'>('intro');
  const [revealedResult, setRevealedResult] = useState<ResultTypeId | null>(null);
  const [savedSession, setSavedSession] = useState(() => loadHeartTraceSession());

  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [introStep, revealedResult, state.currentQuestionIndex, state.phase]);

  const handleRestart = () => {
    clearHeartTraceSession();
    setSavedSession(null);
    setIntroStep('intro');
    setRevealedResult(null);
    dispatch({ type: 'RESTART' });
  };

  const handleStart = () => {
    clearHeartTraceSession();
    setSavedSession(null);
    void startContentParticipation('heart-trace');
    dispatch({ type: 'START' });
  };

  const handleBackHome = () => {
    if (state.phase === 'question' || state.phase === 'tie-breaker') {
      saveHeartTraceSession(state);
      setSavedSession(state);
    }

    onBackHome();
  };

  useEffect(() => {
    if (state.phase === 'question' || state.phase === 'tie-breaker') {
      saveHeartTraceSession(state);
      setSavedSession(state);
      return;
    }

    if (state.phase === 'result') {
      clearHeartTraceSession();
      setSavedSession(null);
    }
  }, [state]);

  useEffect(() => {
    if (state.phase !== 'result' || state.result === null) {
      setRevealedResult(null);
      return;
    }

    const result = state.result;
    const timer = window.setTimeout(() => {
      setRevealedResult(result);
    }, RESULT_REVEAL_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [state.phase, state.result]);

  useEffect(() => {
    if (state.result === null) {
      return;
    }

    const result = RESULT_TYPES[state.result];
    void completeContentParticipation('heart-trace', result.id);

    void preloadResultImage(
      result.resultCardSrc,
      getResultImageFilename(result.id),
    ).catch(() => {
      // 결과 화면에서 다시 시도할 수 있도록 프리로드 실패는 조용히 넘긴다.
    });
  }, [state.result]);

  if (state.phase === 'intro') {
    if (introStep === 'guide') {
      return (
        <GuideScreen
          onStart={handleStart}
          onBackHome={onBackHome}
        />
      );
    }

    return (
      <IntroScreen
        onContinue={() => setIntroStep('guide')}
        onBackHome={onBackHome}
        savedAnswerCount={savedSession ? Object.keys(savedSession.answers).length : 0}
        savedQuestionNumber={savedSession ? savedSession.currentQuestionIndex + 1 : null}
        onResume={() => {
          if (savedSession) {
            dispatch({ type: 'RESTORE', state: savedSession });
          }
        }}
        onClearSaved={() => {
          clearHeartTraceSession();
          setSavedSession(null);
        }}
      />
    );
  }

  if (state.phase === 'question') {
    const question = QUESTIONS[state.currentQuestionIndex];
    const currentAnswer = state.answers[question.id];

    return (
      <QuestionScreen
        question={question}
        questionIndex={state.currentQuestionIndex}
        selectedOptionId={currentAnswer?.kind === 'selected'
          ? currentAnswer.optionId
          : null}
        isSkipped={currentAnswer?.kind === 'skipped'}
        skippedCount={countSkippedAnswers(state.answers)}
        maxSkippedCount={MAX_SKIPPED_ANSWERS}
        onBackHome={handleBackHome}
        onAnswer={(optionId) => dispatch({
          type: 'ANSWER',
          questionId: question.id,
          optionId,
        })}
        onSkip={() => dispatch({
          type: 'SKIP',
          questionId: question.id,
        })}
        onPrevious={() => dispatch({ type: 'PREVIOUS' })}
      />
    );
  }

  if (state.phase === 'tie-breaker') {
    const tieBreakerQuestion = createTieBreakerQuestion(state.tiedTypes);

    if (tieBreakerQuestion) {
      return (
        <TieBreakerScreen
          question={tieBreakerQuestion}
          questionNumber={QUESTIONS.length + 1}
          onBackHome={handleBackHome}
          onSelect={(answer) => dispatch({ type: 'SELECT_TIE_BREAKER', answer })}
          onPrevious={() => dispatch({ type: 'PREVIOUS' })}
        />
      );
    }
  }

  if (state.phase === 'result' && state.result) {
    if (revealedResult === null) {
      return <LoadingScreen />;
    }

    return (
      <ResultScreen
        resultId={revealedResult}
        onRestart={handleRestart}
        onBackHome={onBackHome}
      />
    );
  }

  return (
    <IntroScreen
      onContinue={() => setIntroStep('guide')}
      onBackHome={onBackHome}
      savedAnswerCount={savedSession ? Object.keys(savedSession.answers).length : 0}
      savedQuestionNumber={savedSession ? savedSession.currentQuestionIndex + 1 : null}
      onResume={() => {
        if (savedSession) {
          dispatch({ type: 'RESTORE', state: savedSession });
        }
      }}
      onClearSaved={() => {
        clearHeartTraceSession();
        setSavedSession(null);
      }}
    />
  );
}
