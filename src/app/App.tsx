import { useEffect, useReducer, useState } from 'react';

import { QUESTIONS } from '../data/questions';
import { RESULT_TYPES } from '../data/resultTypes';
import {
  MAX_SKIPPED_ANSWERS,
  countSkippedAnswers,
} from '../domain/answers';
import { createTieBreakerQuestion } from '../domain/tieBreaker';
import type { ResultTypeId } from '../domain/types';
import { GuideScreen } from '../screens/GuideScreen';
import { IntroScreen } from '../screens/IntroScreen';
import { LoadingScreen } from '../screens/LoadingScreen';
import { QuestionScreen } from '../screens/QuestionScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { TieBreakerScreen } from '../screens/TieBreakerScreen';
import { getResultImageFilename, preloadResultImage } from '../utils/resultImage';
import { createInitialTestState, testReducer } from './testReducer';
import { RESULT_REVEAL_DELAY_MS } from './timing';

export function App() {
  const [state, dispatch] = useReducer(
    testReducer,
    undefined,
    createInitialTestState,
  );
  const [introStep, setIntroStep] = useState<'intro' | 'guide'>('intro');
  const [revealedResult, setRevealedResult] = useState<ResultTypeId | null>(null);

  const handleRestart = () => {
    setIntroStep('intro');
    setRevealedResult(null);
    dispatch({ type: 'RESTART' });
  };

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

    void preloadResultImage(
      result.resultCardSrc,
      getResultImageFilename(result.id),
    ).catch(() => {
      // 결과 화면에서 다시 시도할 수 있도록 프리로드 실패는 조용히 넘긴다.
    });
  }, [state.result]);

  if (state.phase === 'intro') {
    if (introStep === 'guide') {
      return <GuideScreen onStart={() => dispatch({ type: 'START' })} />;
    }

    return <IntroScreen onContinue={() => setIntroStep('guide')} />;
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

    return <ResultScreen resultId={revealedResult} onRestart={handleRestart} />;
  }

  return <IntroScreen onContinue={() => setIntroStep('guide')} />;
}
