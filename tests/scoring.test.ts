import { describe, expect, it } from 'vitest';

import { QUESTIONS } from '../src/data/questions';
import {
  calculateResult,
  calculateScores,
  findTopResultTypes,
} from '../src/domain/scoring';
import {
  RESULT_TYPE_IDS,
  type Answers,
  type ChoiceId,
  type ResultTypeId,
} from '../src/domain/types';

function selectAnswer(
  answers: Readonly<Answers>,
  questionIndex: number,
  optionId: ChoiceId,
): Answers {
  const question = QUESTIONS[questionIndex];

  return {
    ...answers,
    [question.id]: {
      kind: 'selected',
      optionId,
    },
  };
}

function getOptionIdForResult(
  questionIndex: number,
  resultType: ResultTypeId,
): ChoiceId {
  const question = QUESTIONS[questionIndex];
  const option = question.options.find(
    (candidate) => candidate.resultType === resultType,
  );

  if (!option) {
    throw new Error(`${question.id}번 문항에서 ${resultType} 선택지를 찾지 못했습니다.`);
  }

  return option.id;
}

function createAnswersForTypes(resultTypes: readonly ResultTypeId[]): Answers {
  return resultTypes.reduce<Answers>((answers, resultType, questionIndex) =>
    selectAnswer(
      answers,
      questionIndex,
      getOptionIdForResult(questionIndex, resultType),
    ), {});
}

function createBalancedTypes(): ResultTypeId[] {
  return RESULT_TYPE_IDS.flatMap((resultType) =>
    Array.from({ length: 4 }, () => resultType),
  );
}

function createWinningAnswers(winner: ResultTypeId): Answers {
  const resultTypes = createBalancedTypes();
  const donorIndex = resultTypes.findIndex((resultType) => resultType !== winner);
  resultTypes[donorIndex] = winner;
  return createAnswersForTypes(resultTypes);
}

function getTotalScore(scores: ReturnType<typeof calculateScores>): number {
  return RESULT_TYPE_IDS.reduce(
    (total, resultType) => total + scores[resultType],
    0,
  );
}

describe('점수 계산', () => {
  it('1번 문항 A 선택을 곰곰이 1점으로 계산한다', () => {
    const answers = selectAnswer({}, 0, 'A');

    expect(calculateScores(QUESTIONS, answers)).toEqual({
      bear: 1,
      spring: 0,
      effort: 0,
      pause: 0,
      express: 0,
    });
  });

  it('1번 문항을 E로 변경하면 기존 A 점수 대신 톡톡이 1점만 계산한다', () => {
    const firstAnswers = selectAnswer({}, 0, 'A');
    const changedAnswers = selectAnswer(firstAnswers, 0, 'E');

    expect(calculateScores(QUESTIONS, changedAnswers)).toEqual({
      bear: 0,
      spring: 0,
      effort: 0,
      pause: 0,
      express: 1,
    });
    expect(firstAnswers[QUESTIONS[0].id]?.optionId).toBe('A');
  });

  it('같은 문항을 여러 번 변경해도 최종 선택 한 건만 점수에 포함한다', () => {
    const answers = (['A', 'B', 'C', 'D', 'E'] as const).reduce<Answers>(
      (currentAnswers, optionId) => selectAnswer(currentAnswers, 0, optionId),
      {},
    );
    const scores = calculateScores(QUESTIONS, answers);

    expect(getTotalScore(scores)).toBe(1);
    expect(scores.express).toBe(1);
    expect(Object.keys(answers)).toHaveLength(1);
  });

  it('미응답 문항을 제외하고 답변한 문항 수만큼만 계산한다', () => {
    const answers = selectAnswer(
      selectAnswer({}, 0, 'A'),
      2,
      'B',
    );
    const scores = calculateScores(QUESTIONS, answers);

    expect(getTotalScore(scores)).toBe(2);
    expect(answers[QUESTIONS[1].id]).toBeUndefined();
  });

  it('잘못된 optionId와 존재하지 않는 문항 ID를 명확한 오류로 처리한다', () => {
    const invalidOptionAnswers: Answers = {
      [QUESTIONS[0].id]: {
        kind: 'selected',
        optionId: 'Z' as ChoiceId,
      },
    };
    const unknownQuestionAnswers: Answers = {
      999: {
        kind: 'selected',
        optionId: 'A',
      },
    };

    expect(() => calculateScores(QUESTIONS, invalidOptionAnswers)).toThrow(
      '1번 문항에 Z 선택지가 없습니다.',
    );
    expect(() => calculateScores(QUESTIONS, unknownQuestionAnswers)).toThrow(
      '존재하지 않는 문항 ID의 답변입니다: 999',
    );
  });

  it('원본 answers를 변경하지 않는 순수 계산을 수행한다', () => {
    const answers = selectAnswer({}, 0, 'A');
    const snapshot = structuredClone(answers);

    calculateScores(QUESTIONS, answers);

    expect(answers).toEqual(snapshot);
  });

  it.each(RESULT_TYPE_IDS)('%s 유형의 단독 최고점을 바로 확정한다', (winner) => {
    const outcome = calculateResult(QUESTIONS, createWinningAnswers(winner));

    expect(outcome).toMatchObject({
      status: 'resolved',
      result: winner,
    });
    expect(outcome.scores[winner]).toBe(5);
  });

  it('유형별 점수를 현재 최종 답변 전체에서 다시 집계한다', () => {
    const answers = createAnswersForTypes([
      ...Array<ResultTypeId>(6).fill('bear'),
      ...Array<ResultTypeId>(5).fill('spring'),
      ...Array<ResultTypeId>(4).fill('effort'),
      ...Array<ResultTypeId>(3).fill('pause'),
      ...Array<ResultTypeId>(2).fill('express'),
    ]);

    expect(calculateScores(QUESTIONS, answers)).toEqual({
      bear: 6,
      spring: 5,
      effort: 4,
      pause: 3,
      express: 2,
    });
  });

  it('화면 결과 결정에 사용되는 점수가 전체 답변 재계산 결과와 같다', () => {
    const answers = createWinningAnswers('effort');
    const scores = calculateScores(QUESTIONS, answers);
    const outcome = calculateResult(QUESTIONS, answers);

    expect(outcome).toMatchObject({
      status: 'resolved',
      result: 'effort',
      scores,
    });
  });

  it('완료된 답변을 변경하면 이전 점수를 남기지 않고 결과를 다시 결정한다', () => {
    const balancedAnswers = createAnswersForTypes(createBalancedTypes());
    const bearAnswers = selectAnswer(
      balancedAnswers,
      7,
      getOptionIdForResult(7, 'bear'),
    );
    const effortAnswers = selectAnswer(
      balancedAnswers,
      7,
      getOptionIdForResult(7, 'effort'),
    );

    expect(calculateResult(QUESTIONS, bearAnswers)).toMatchObject({
      status: 'resolved',
      result: 'bear',
    });
    expect(calculateResult(QUESTIONS, effortAnswers)).toMatchObject({
      status: 'resolved',
      result: 'effort',
    });
  });

  it('두 유형이 공동 최고점이면 정확한 동점 후보를 반환한다', () => {
    const answers = createAnswersForTypes([
      ...Array<ResultTypeId>(5).fill('bear'),
      ...Array<ResultTypeId>(5).fill('spring'),
      ...Array<ResultTypeId>(4).fill('effort'),
      ...Array<ResultTypeId>(3).fill('pause'),
      ...Array<ResultTypeId>(3).fill('express'),
    ]);
    const outcome = calculateResult(QUESTIONS, answers);

    expect(outcome.status).toBe('tie');
    if (outcome.status === 'tie') {
      expect(outcome.tiedTypes).toEqual(['bear', 'spring']);
    }
  });

  it('5개 유형이 모두 동점인 경우도 모두 후보로 반환한다', () => {
    const outcome = calculateResult(
      QUESTIONS,
      createAnswersForTypes(createBalancedTypes()),
    );

    expect(outcome.status).toBe('tie');
    if (outcome.status === 'tie') {
      expect(outcome.tiedTypes).toEqual(RESULT_TYPE_IDS);
    }
  });

  it('점수표에서 공동 최고점 유형만 찾는다', () => {
    expect(
      findTopResultTypes({
        bear: 5,
        spring: 3,
        effort: 5,
        pause: 4,
        express: 3,
      }),
    ).toEqual(['bear', 'effort']);
  });
});
