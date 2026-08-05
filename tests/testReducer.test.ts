import { describe, expect, it } from 'vitest';

import {
  createInitialTestState,
  testReducer,
  type TestState,
} from '../src/app/testReducer';
import {
  RESULT_TYPE_IDS,
  TEST_QUESTION_COUNT,
  type ResultTypeId,
} from '../src/domain/types';

function startTest(): TestState {
  return testReducer(createInitialTestState(), { type: 'START' });
}

function answerAll(answerSequence: readonly ResultTypeId[]): TestState {
  return answerSequence.reduce(
    (state, answer, questionIndex) =>
      testReducer(state, { type: 'ANSWER', questionIndex, answer }),
    startTest(),
  );
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
      answers: Array(TEST_QUESTION_COUNT).fill(null),
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
    const state = testReducer(startTest(), {
      type: 'ANSWER',
      questionIndex: 0,
      answer: 'bear',
    });

    expect(state.currentQuestionIndex).toBe(1);
    expect(state.answers[0]).toBe('bear');
  });

  it('같은 문항의 중복 탭 이벤트가 다음 문항을 답하지 못하게 한다', () => {
    const action = {
      type: 'ANSWER',
      questionIndex: 0,
      answer: 'bear',
    } as const;
    const afterFirstTap = testReducer(startTest(), action);
    const afterDuplicateTap = testReducer(afterFirstTap, action);

    expect(afterDuplicateTap).toBe(afterFirstTap);
    expect(afterDuplicateTap.currentQuestionIndex).toBe(1);
    expect(afterDuplicateTap.answers[1]).toBeNull();
  });

  it('이전 문항으로 돌아가 기존 답변을 유지하고 변경할 수 있다', () => {
    const afterAnswer = testReducer(startTest(), {
      type: 'ANSWER',
      questionIndex: 0,
      answer: 'bear',
    });
    const previous = testReducer(afterAnswer, { type: 'PREVIOUS' });

    expect(previous.currentQuestionIndex).toBe(0);
    expect(previous.answers[0]).toBe('bear');

    const changed = testReducer(previous, {
      type: 'ANSWER',
      questionIndex: 0,
      answer: 'spring',
    });
    expect(changed.answers[0]).toBe('spring');
    expect(changed.currentQuestionIndex).toBe(1);
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
      currentQuestionIndex: TEST_QUESTION_COUNT - 1,
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

  it('동점 후보를 선택하면 해당 결과로 확정한다', () => {
    const tieState = answerAll(createBalancedAnswers());
    const resultState = testReducer(tieState, {
      type: 'SELECT_TIE_BREAKER',
      answer: 'express',
    });

    expect(resultState).toMatchObject({
      phase: 'result',
      result: 'express',
    });
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
      currentQuestionIndex: TEST_QUESTION_COUNT - 1,
      result: null,
      tiedTypes: [],
    });

    const changedResult = testReducer(previousFromTie, {
      type: 'ANSWER',
      questionIndex: TEST_QUESTION_COUNT - 1,
      answer: 'bear',
    });
    expect(changedResult).toMatchObject({
      phase: 'result',
      result: 'bear',
    });

    const previousFromResult = testReducer(changedResult, {
      type: 'PREVIOUS',
    });
    expect(previousFromResult).toMatchObject({
      phase: 'question',
      currentQuestionIndex: TEST_QUESTION_COUNT - 1,
      result: null,
    });
  });

  it('RESTART는 진행 중이거나 완료된 상태를 모두 초기화한다', () => {
    const completed = answerAll(createBalancedAnswers());
    expect(testReducer(completed, { type: 'RESTART' })).toEqual(
      createInitialTestState(),
    );
  });
});
