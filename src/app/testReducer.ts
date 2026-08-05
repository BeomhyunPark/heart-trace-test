import { calculateResult } from '../domain/scoring';
import { resolveTie } from '../domain/tieBreaker';
import {
  TEST_QUESTION_COUNT,
  type Answer,
  type ResultTypeId,
} from '../domain/types';

export type TestPhase = 'intro' | 'question' | 'tie-breaker' | 'result';

export type TestState = {
  phase: TestPhase;
  currentQuestionIndex: number;
  answers: readonly Answer[];
  result: ResultTypeId | null;
  tiedTypes: readonly ResultTypeId[];
};

export type TestAction =
  | { type: 'START' }
  | {
      type: 'ANSWER';
      questionIndex: number;
      answer: ResultTypeId;
    }
  | { type: 'PREVIOUS' }
  | {
      type: 'SELECT_TIE_BREAKER';
      answer: ResultTypeId;
    }
  | { type: 'RESTART' };

export function createInitialTestState(): TestState {
  return {
    phase: 'intro',
    currentQuestionIndex: 0,
    answers: Array<Answer>(TEST_QUESTION_COUNT).fill(null),
    result: null,
    tiedTypes: [],
  };
}

function finishTest(
  state: TestState,
  answers: readonly Answer[],
): TestState {
  const outcome = calculateResult(answers);

  if (outcome.status === 'resolved') {
    return {
      ...state,
      phase: 'result',
      answers,
      result: outcome.result,
      tiedTypes: [],
    };
  }

  if (outcome.status === 'tie') {
    return {
      ...state,
      phase: 'tie-breaker',
      answers,
      result: null,
      tiedTypes: outcome.tiedTypes,
    };
  }

  return {
    ...state,
    answers,
  };
}

export function testReducer(
  state: TestState,
  action: TestAction,
): TestState {
  switch (action.type) {
    case 'START': {
      if (state.phase !== 'intro') {
        return state;
      }

      return {
        ...createInitialTestState(),
        phase: 'question',
      };
    }

    case 'ANSWER': {
      if (
        state.phase !== 'question' ||
        action.questionIndex !== state.currentQuestionIndex ||
        action.questionIndex < 0 ||
        action.questionIndex >= TEST_QUESTION_COUNT
      ) {
        return state;
      }

      const answers = [...state.answers];
      answers[action.questionIndex] = action.answer;

      if (action.questionIndex === TEST_QUESTION_COUNT - 1) {
        return finishTest(state, answers);
      }

      return {
        ...state,
        currentQuestionIndex: action.questionIndex + 1,
        answers,
        result: null,
        tiedTypes: [],
      };
    }

    case 'PREVIOUS': {
      if (state.phase === 'intro') {
        return state;
      }

      if (state.phase === 'question') {
        if (state.currentQuestionIndex === 0) {
          return state;
        }

        return {
          ...state,
          currentQuestionIndex: state.currentQuestionIndex - 1,
          result: null,
          tiedTypes: [],
        };
      }

      return {
        ...state,
        phase: 'question',
        currentQuestionIndex: TEST_QUESTION_COUNT - 1,
        result: null,
        tiedTypes: [],
      };
    }

    case 'SELECT_TIE_BREAKER': {
      if (state.phase !== 'tie-breaker') {
        return state;
      }

      const result = resolveTie(state.tiedTypes, action.answer);

      if (result === null) {
        return state;
      }

      return {
        ...state,
        phase: 'result',
        result,
      };
    }

    case 'RESTART':
      return createInitialTestState();
  }
}
