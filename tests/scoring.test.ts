import { describe, expect, it } from 'vitest';

import {
  calculateResult,
  calculateScores,
  findTopResultTypes,
} from '../src/domain/scoring';
import {
  RESULT_TYPE_IDS,
  TEST_QUESTION_COUNT,
  type ResultTypeId,
  type ScoringAnswer,
} from '../src/domain/types';

function createBalancedAnswers(): ResultTypeId[] {
  return RESULT_TYPE_IDS.flatMap((resultType) =>
    Array.from({ length: 4 }, () => resultType),
  );
}

function createWinningAnswers(winner: ResultTypeId): ResultTypeId[] {
  const answers = createBalancedAnswers();
  const donorIndex = answers.findIndex((answer) => answer !== winner);
  answers[donorIndex] = winner;
  return answers;
}

describe('점수 계산', () => {
  it.each(RESULT_TYPE_IDS)('%s 유형의 단독 최고점을 계산한다', (winner) => {
    const outcome = calculateResult(createWinningAnswers(winner));

    expect(outcome.status).toBe('resolved');
    if (outcome.status === 'resolved') {
      expect(outcome.result).toBe(winner);
      expect(outcome.scores[winner]).toBe(5);
    }
  });

  it('유형별 점수를 답변 전체에서 다시 집계한다', () => {
    const scores = calculateScores([
      ...Array<ResultTypeId>(6).fill('bear'),
      ...Array<ResultTypeId>(5).fill('spring'),
      ...Array<ResultTypeId>(4).fill('effort'),
      ...Array<ResultTypeId>(3).fill('pause'),
      ...Array<ResultTypeId>(2).fill('express'),
    ]);

    expect(scores).toEqual({
      bear: 6,
      spring: 5,
      effort: 4,
      pause: 3,
      express: 2,
    });
  });

  it('두 유형이 공동 최고점이면 동점 후보를 반환한다', () => {
    const answers: ResultTypeId[] = [
      ...Array<ResultTypeId>(5).fill('bear'),
      ...Array<ResultTypeId>(5).fill('spring'),
      ...Array<ResultTypeId>(4).fill('effort'),
      ...Array<ResultTypeId>(3).fill('pause'),
      ...Array<ResultTypeId>(3).fill('express'),
    ];

    const outcome = calculateResult(answers);

    expect(outcome.status).toBe('tie');
    if (outcome.status === 'tie') {
      expect(outcome.tiedTypes).toEqual(['bear', 'spring']);
    }
  });

  it('5개 유형이 모두 동점인 경우도 모두 후보로 반환한다', () => {
    const outcome = calculateResult(createBalancedAnswers());

    expect(outcome.status).toBe('tie');
    if (outcome.status === 'tie') {
      expect(outcome.tiedTypes).toEqual(RESULT_TYPE_IDS);
    }
  });

  it('이전 답변을 바꾸면 기존 점수 대신 새 답변으로 다시 계산한다', () => {
    const answers = createBalancedAnswers();
    answers[7] = 'bear';
    expect(calculateResult(answers)).toMatchObject({
      status: 'resolved',
      result: 'bear',
    });

    answers[7] = 'effort';
    expect(calculateResult(answers)).toMatchObject({
      status: 'resolved',
      result: 'effort',
    });
  });

  it('마지막 문항의 답변을 바꾸면 결과도 변경된다', () => {
    const firstNineteen: ResultTypeId[] = [
      ...Array<ResultTypeId>(4).fill('bear'),
      ...Array<ResultTypeId>(4).fill('spring'),
      ...Array<ResultTypeId>(4).fill('effort'),
      ...Array<ResultTypeId>(4).fill('pause'),
      ...Array<ResultTypeId>(3).fill('express'),
    ];

    expect(calculateResult([...firstNineteen, 'bear'])).toMatchObject({
      status: 'resolved',
      result: 'bear',
    });
    expect(calculateResult([...firstNineteen, 'spring'])).toMatchObject({
      status: 'resolved',
      result: 'spring',
    });
  });

  it('답변 수가 부족하거나 null이 남아 있으면 결과를 만들지 않는다', () => {
    const missingAnswer = createBalancedAnswers().slice(0, -1);
    const nullAnswer: ScoringAnswer[] = createBalancedAnswers();
    nullAnswer[TEST_QUESTION_COUNT - 1] = null;

    expect(calculateScores(missingAnswer)).toBeNull();
    expect(calculateResult(missingAnswer)).toEqual({ status: 'incomplete' });
    expect(calculateScores(nullAnswer)).toBeNull();
    expect(calculateResult(nullAnswer)).toEqual({ status: 'incomplete' });
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
