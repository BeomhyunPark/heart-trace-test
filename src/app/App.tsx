import { useEffect, useReducer, useState } from 'react';

import { QUESTIONS } from '../data/questions';
import { RESULT_TYPES } from '../data/resultTypes';
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

    return (
      <QuestionScreen
        question={question}
        questionIndex={state.currentQuestionIndex}
        selectedAnswer={state.answers[state.currentQuestionIndex]}
        onAnswer={(answer) => dispatch({
          type: 'ANSWER',
          questionIndex: state.currentQuestionIndex,
          answer,
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
