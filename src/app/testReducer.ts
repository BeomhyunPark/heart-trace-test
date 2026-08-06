import { QUESTIONS } from '../data/questions';
import { calculateResult } from '../domain/scoring';
import { resolveTie } from '../domain/tieBreaker';
import {
  TEST_QUESTION_COUNT,
  type Answers,
  type ChoiceId,
  type ResultTypeId,
  type ScoringAnswer,
} from '../domain/types';

export type TestPhase = 'intro' | 'question' | 'tie-breaker' | 'result';

export type TestState = {
  phase: TestPhase;
  currentQuestionIndex: number;
  answers: Answers;
  result: ResultTypeId | null;
  tiedTypes: readonly ResultTypeId[];
};

export type TestAction =
  | { type: 'START' }
  | {
      type: 'ANSWER';
      questionId: number;
      optionId: ChoiceId;
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
    answers: {},
    result: null,
    tiedTypes: [],
  };
}

function finishTest(
  state: TestState,
  answers: Answers,
): TestState {
  const scoringAnswers: ScoringAnswer[] = QUESTIONS.map((question) => {
    const answer = answers[question.id];

    if (!answer) {
      return null;
    }

    return question.options.find((option) => option.id === answer.optionId)?.resultType ?? null;
  });
  const outcome = calculateResult(scoringAnswers);

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
      const currentQuestion = QUESTIONS[state.currentQuestionIndex];

      if (
        state.phase !== 'question' ||
        !currentQuestion ||
        action.questionId !== currentQuestion.id ||
        !currentQuestion.options.some((option) => option.id === action.optionId)
      ) {
        return state;
      }

      const answers: Answers = {
        ...state.answers,
        [action.questionId]: {
          kind: 'selected',
          optionId: action.optionId,
        },
      };

      if (state.currentQuestionIndex === TEST_QUESTION_COUNT - 1) {
        return finishTest(state, answers);
      }

      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
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
