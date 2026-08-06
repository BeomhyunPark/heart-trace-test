import { describe, expect, it } from 'vitest';

import {
  createInitialTestState,
  testReducer,
  type TestState,
} from '../src/app/testReducer';
import { QUESTIONS } from '../src/data/questions';
import {
  MAX_SKIPPED_ANSWERS,
  countSkippedAnswers,
} from '../src/domain/answers';
import { calculateScores } from '../src/domain/scoring';
import {
  RESULT_TYPE_IDS,
  type ChoiceId,
  type ResultTypeId,
} from '../src/domain/types';

function startTest(): TestState {
  return testReducer(createInitialTestState(), { type: 'START' });
}

function answerAll(answerSequence: readonly ResultTypeId[]): TestState {
  return answerSequence.reduce(
    (state, resultType, questionIndex) => {
      const question = QUESTIONS[questionIndex];
      const option = question.options.find(
        (candidate) => candidate.resultType === resultType,
      );

      if (!option) {
        throw new Error(`${question.id}번 문항에서 ${resultType} 선택지를 찾지 못했습니다.`);
      }

      return testReducer(state, {
        type: 'ANSWER',
        questionId: question.id,
        optionId: option.id,
      });
    },
    startTest(),
  );
}

function answerCurrent(
  state: TestState,
  questionIndex: number,
  optionId: ChoiceId,
): TestState {
  return testReducer(state, {
    type: 'ANSWER',
    questionId: QUESTIONS[questionIndex].id,
    optionId,
  });
}

function skipCurrent(state: TestState, questionIndex: number): TestState {
  return testReducer(state, {
    type: 'SKIP',
    questionId: QUESTIONS[questionIndex].id,
  });
}

function createBalancedAnswers(): ResultTypeId[] {
  return RESULT_TYPE_IDS.flatMap((resultType) =>
    Array.from({ length: 4 }, () => resultType),
  );
}

describe('검사 상태 흐름', () => {
  it('항상 저장된 답변 없이 인트로에서 시작한다', () => {
    const firstLoad = createInitialTestState();
    const refreshedLoad = createInitialTestState();

    expect(firstLoad).toEqual({
      phase: 'intro',
      currentQuestionIndex: 0,
      answers: {},
      result: null,
      tiedTypes: [],
    });
    expect(refreshedLoad).toEqual(firstLoad);
    expect(refreshedLoad.answers).not.toBe(firstLoad.answers);
  });

  it('START로 인트로에서 첫 번째 문항으로 이동한다', () => {
    expect(startTest()).toMatchObject({
      phase: 'question',
      currentQuestionIndex: 0,
    });
  });

  it('답변을 저장하고 즉시 다음 문항으로 이동한다', () => {
    const state = answerCurrent(startTest(), 0, 'A');

    expect(state.currentQuestionIndex).toBe(1);
    expect(state.answers[QUESTIONS[0].id]).toEqual({
      kind: 'selected',
      optionId: 'A',
    });
  });

  it('같은 문항의 중복 탭 이벤트가 다음 문항을 답하지 못하게 한다', () => {
    const action = {
      type: 'ANSWER',
      questionId: QUESTIONS[0].id,
      optionId: 'A',
    } as const;
    const afterFirstTap = testReducer(startTest(), action);
    const afterDuplicateTap = testReducer(afterFirstTap, action);

    expect(afterDuplicateTap).toBe(afterFirstTap);
    expect(afterDuplicateTap.currentQuestionIndex).toBe(1);
    expect(afterDuplicateTap.answers[QUESTIONS[1].id]).toBeUndefined();
  });

  it('문항 ID별 기존 답변을 복원하고 새 선택 하나로 덮어쓴다', () => {
    const afterAnswer = answerCurrent(startTest(), 0, 'A');
    const previous = testReducer(afterAnswer, { type: 'PREVIOUS' });

    expect(previous.currentQuestionIndex).toBe(0);
    expect(previous.answers[QUESTIONS[0].id]).toEqual({
      kind: 'selected',
      optionId: 'A',
    });

    const changed = answerCurrent(previous, 0, 'E');
    expect(changed.answers).toEqual({
      [QUESTIONS[0].id]: {
        kind: 'selected',
        optionId: 'E',
      },
    });
    expect(Object.keys(changed.answers)).toHaveLength(1);
    expect(changed.answers[QUESTIONS[1].id]).toBeUndefined();
    expect(changed.currentQuestionIndex).toBe(1);
  });

  it('첫 세 문항을 문항 ID별 skipped 상태로 저장하고 이동한다', () => {
    const afterFirstSkip = skipCurrent(startTest(), 0);
    const afterSecondSkip = skipCurrent(afterFirstSkip, 1);
    const afterThirdSkip = skipCurrent(afterSecondSkip, 2);

    expect(afterThirdSkip.currentQuestionIndex).toBe(3);
    expect(afterThirdSkip.answers).toMatchObject({
      [QUESTIONS[0].id]: { kind: 'skipped' },
      [QUESTIONS[1].id]: { kind: 'skipped' },
      [QUESTIONS[2].id]: { kind: 'skipped' },
    });
    expect(countSkippedAnswers(afterThirdSkip.answers)).toBe(
      MAX_SKIPPED_ANSWERS,
    );
  });

  it('네 번째 패스 시 이동하거나 기존 답변 상태를 변경하지 않는다', () => {
    const afterThreeSkips = skipCurrent(
      skipCurrent(skipCurrent(startTest(), 0), 1),
      2,
    );
    const blocked = skipCurrent(afterThreeSkips, 3);

    expect(blocked).toBe(afterThreeSkips);
    expect(blocked.currentQuestionIndex).toBe(3);
    expect(blocked.answers[QUESTIONS[3].id]).toBeUndefined();
    expect(countSkippedAnswers(blocked.answers)).toBe(MAX_SKIPPED_ANSWERS);
  });

  it('답변한 문항을 패스하면 selected를 skipped 하나로 덮어쓴다', () => {
    const afterAnswer = answerCurrent(startTest(), 0, 'A');
    const previous = testReducer(afterAnswer, { type: 'PREVIOUS' });
    const skipped = skipCurrent(previous, 0);

    expect(skipped.answers[QUESTIONS[0].id]).toEqual({ kind: 'skipped' });
    expect(countSkippedAnswers(skipped.answers)).toBe(1);
    expect(skipped.currentQuestionIndex).toBe(1);
  });

  it('패스 문항에 답하면 selected로 바뀌고 사용량이 감소해 다시 패스할 수 있다', () => {
    const afterSkip = skipCurrent(startTest(), 0);
    const previous = testReducer(afterSkip, { type: 'PREVIOUS' });
    const answered = answerCurrent(previous, 0, 'E');

    expect(answered.answers[QUESTIONS[0].id]).toEqual({
      kind: 'selected',
      optionId: 'E',
    });
    expect(countSkippedAnswers(answered.answers)).toBe(0);

    const skippedAnotherQuestion = skipCurrent(answered, 1);
    expect(skippedAnotherQuestion.answers[QUESTIONS[1].id]).toEqual({
      kind: 'skipped',
    });
    expect(countSkippedAnswers(skippedAnotherQuestion.answers)).toBe(1);
  });

  it('패스와 답변 변경을 반복해도 점수와 패스 개수가 최종 상태와 일치한다', () => {
    const firstSkip = skipCurrent(startTest(), 0);
    const previous = testReducer(firstSkip, { type: 'PREVIOUS' });
    const firstAnswer = answerCurrent(previous, 0, 'A');
    const secondSkip = skipCurrent(firstAnswer, 1);
    const previousAgain = testReducer(secondSkip, { type: 'PREVIOUS' });
    const changedAnswer = answerCurrent(previousAgain, 1, 'B');
    const thirdSkip = skipCurrent(changedAnswer, 2);
    const scores = calculateScores(QUESTIONS, thirdSkip.answers);

    expect(countSkippedAnswers(thirdSkip.answers)).toBe(1);
    expect(RESULT_TYPE_IDS.reduce(
      (total, resultType) => total + scores[resultType],
      0,
    )).toBe(2);
  });

  it('첫 문항에서는 PREVIOUS가 상태를 바꾸지 않는다', () => {
    const firstQuestion = startTest();
    expect(testReducer(firstQuestion, { type: 'PREVIOUS' })).toBe(
      firstQuestion,
    );
  });

  it('마지막 답변 후 단독 최고점이면 결과 상태로 이동한다', () => {
    const answers = createBalancedAnswers();
    answers[0] = 'spring';
    const state = answerAll(answers);

    expect(state).toMatchObject({
      phase: 'result',
      currentQuestionIndex: QUESTIONS.length - 1,
      result: 'spring',
      tiedTypes: [],
    });
  });

  it('마지막 답변 후 동점이면 동점 추가 질문 상태로 이동한다', () => {
    const state = answerAll(createBalancedAnswers());

    expect(state).toMatchObject({
      phase: 'tie-breaker',
      result: null,
      tiedTypes: RESULT_TYPE_IDS,
    });
  });

  it('패스 세 개가 포함된 답변도 기존 동점 추가 질문으로 연결한다', () => {
    const resultTypes: ResultTypeId[] = [
      ...Array<ResultTypeId>(4).fill('bear'),
      ...Array<ResultTypeId>(4).fill('spring'),
      ...Array<ResultTypeId>(3).fill('effort'),
      ...Array<ResultTypeId>(3).fill('pause'),
      ...Array<ResultTypeId>(3).fill('express'),
    ];
    const afterSelections = resultTypes.reduce(
      (state, resultType, questionIndex) => {
        const option = QUESTIONS[questionIndex].options.find(
          (candidate) => candidate.resultType === resultType,
        );

        if (!option) {
          throw new Error(`${questionIndex + 1}번 문항의 선택지를 찾지 못했습니다.`);
        }

        return answerCurrent(state, questionIndex, option.id);
      },
      startTest(),
    );
    const completed = skipCurrent(
      skipCurrent(skipCurrent(afterSelections, 17), 18),
      19,
    );

    expect(completed).toMatchObject({
      phase: 'tie-breaker',
      result: null,
      tiedTypes: ['bear', 'spring'],
    });
    expect(countSkippedAnswers(completed.answers)).toBe(3);
  });

  it('동점 후보를 선택하면 해당 결과로 확정한다', () => {
    const tieState = answerAll(createBalancedAnswers());
    const baseScores = calculateScores(QUESTIONS, tieState.answers);
    const resultState = testReducer(tieState, {
      type: 'SELECT_TIE_BREAKER',
      answer: 'express',
    });

    expect(resultState).toMatchObject({
      phase: 'result',
      result: 'express',
    });
    expect(resultState.answers).toBe(tieState.answers);
    expect(calculateScores(QUESTIONS, resultState.answers)).toEqual(baseScores);
  });

  it('동점 후보가 아닌 선택은 무시한다', () => {
    const twoWayTie = answerAll([
      ...Array<ResultTypeId>(5).fill('bear'),
      ...Array<ResultTypeId>(5).fill('spring'),
      ...Array<ResultTypeId>(4).fill('effort'),
      ...Array<ResultTypeId>(3).fill('pause'),
      ...Array<ResultTypeId>(3).fill('express'),
    ]);

    expect(twoWayTie.tiedTypes).toEqual(['bear', 'spring']);
    expect(
      testReducer(twoWayTie, {
        type: 'SELECT_TIE_BREAKER',
        answer: 'express',
      }),
    ).toBe(twoWayTie);
  });

  it('결과 또는 동점 화면에서 이전으로 가면 마지막 문항을 수정할 수 있다', () => {
    const tieState = answerAll(createBalancedAnswers());
    const previousFromTie = testReducer(tieState, { type: 'PREVIOUS' });

    expect(previousFromTie).toMatchObject({
      phase: 'question',
      currentQuestionIndex: QUESTIONS.length - 1,
      result: null,
      tiedTypes: [],
    });

    const lastQuestionIndex = QUESTIONS.length - 1;
    const bearOption = QUESTIONS[lastQuestionIndex].options.find(
      (option) => option.resultType === 'bear',
    );

    if (!bearOption) {
      throw new Error('마지막 문항에서 bear 선택지를 찾지 못했습니다.');
    }

    const changedResult = answerCurrent(
      previousFromTie,
      lastQuestionIndex,
      bearOption.id,
    );
    expect(changedResult).toMatchObject({
      phase: 'result',
      result: 'bear',
    });

    const previousFromResult = testReducer(changedResult, {
      type: 'PREVIOUS',
    });
    expect(previousFromResult).toMatchObject({
      phase: 'question',
      currentQuestionIndex: QUESTIONS.length - 1,
      result: null,
    });
  });

  it('RESTART는 진행 중이거나 완료된 상태를 모두 초기화한다', () => {
    const completed = answerAll(createBalancedAnswers());
    expect(testReducer(completed, { type: 'RESTART' })).toEqual(
      createInitialTestState(),
    );
  });

  it('새 초기 상태는 진행 중인 패스와 무관하게 항상 비어 있다', () => {
    const progressed = skipCurrent(skipCurrent(startTest(), 0), 1);

    expect(countSkippedAnswers(progressed.answers)).toBe(2);
    expect(createInitialTestState()).toEqual({
      phase: 'intro',
      currentQuestionIndex: 0,
      answers: {},
      result: null,
      tiedTypes: [],
    });
  });
});
