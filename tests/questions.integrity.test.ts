import { describe, expect, it } from 'vitest';

import { QUESTIONS } from '../src/features/heart-trace/data/questions';
import { calculateResult } from '../src/features/heart-trace/domain/scoring';
import {
  ANSWER_OPTION_IDS,
  RESULT_TYPE_IDS,
  TEST_QUESTION_COUNT,
  type Answers,
  type ResultTypeId,
} from '../src/features/heart-trace/domain/types';

const EXPECTED_MAPPINGS: readonly (readonly ResultTypeId[])[] = [
  ['bear', 'spring', 'effort', 'pause', 'express'],
  ['pause', 'bear', 'express', 'spring', 'effort'],
  ['express', 'effort', 'pause', 'bear', 'spring'],
  ['pause', 'bear', 'spring', 'express', 'effort'],
  ['bear', 'spring', 'effort', 'pause', 'express'],
  ['spring', 'express', 'effort', 'pause', 'bear'],
  ['effort', 'pause', 'bear', 'express', 'spring'],
  ['pause', 'bear', 'express', 'spring', 'effort'],
  ['express', 'bear', 'spring', 'effort', 'pause'],
  ['spring', 'effort', 'pause', 'bear', 'express'],
  ['express', 'effort', 'pause', 'bear', 'spring'],
  ['bear', 'spring', 'express', 'effort', 'pause'],
  ['bear', 'express', 'spring', 'effort', 'pause'],
  ['pause', 'bear', 'express', 'spring', 'effort'],
  ['effort', 'express', 'pause', 'bear', 'spring'],
  ['bear', 'pause', 'spring', 'effort', 'express'],
  ['effort', 'express', 'pause', 'bear', 'spring'],
  ['express', 'spring', 'effort', 'bear', 'pause'],
  ['effort', 'bear', 'spring', 'express', 'pause'],
  ['effort', 'pause', 'bear', 'spring', 'express'],
];

describe('질문 데이터 무결성', () => {
  it('1번부터 20번까지 순서대로 존재한다', () => {
    expect(QUESTIONS).toHaveLength(TEST_QUESTION_COUNT);
    expect(QUESTIONS.map(({ id }) => id)).toEqual(
      Array.from({ length: TEST_QUESTION_COUNT }, (_, index) => index + 1),
    );
  });

  it('각 문항에 중복 없는 A~E 선택지가 하나씩 있다', () => {
    for (const question of QUESTIONS) {
      expect(question.text.trim()).not.toBe('');
      expect(question.options).toHaveLength(ANSWER_OPTION_IDS.length);
      expect(question.options.map(({ id }) => id)).toEqual(ANSWER_OPTION_IDS);
      expect(new Set(question.options.map(({ id }) => id)).size).toBe(
        ANSWER_OPTION_IDS.length,
      );

      for (const option of question.options) {
        expect(option.text.trim()).not.toBe('');
        expect(RESULT_TYPE_IDS).toContain(option.resultType);
      }
    }
  });

  it('Google Docs 매핑표와 동일하게 연결되어 있다', () => {
    expect(
      QUESTIONS.map((question) =>
        question.options.map((option) => option.resultType),
      ),
    ).toEqual(EXPECTED_MAPPINGS);
  });

  it('각 문항에서 5개 결과 유형을 한 번씩 사용한다', () => {
    for (const question of QUESTIONS) {
      expect(
        [...question.options.map(({ resultType }) => resultType)].sort(),
      ).toEqual([...RESULT_TYPE_IDS].sort());
    }
  });

  it.each(RESULT_TYPE_IDS)('실제 질문 선택지로 %s 결과에 도달할 수 있다', (resultType) => {
    const answers = QUESTIONS.reduce<Answers>((currentAnswers, question) => {
      const option = question.options.find(
        (candidate) => candidate.resultType === resultType,
      );

      if (!option) {
        throw new Error(`${question.id}번 문항에서 ${resultType} 선택지를 찾지 못했습니다.`);
      }

      return {
        ...currentAnswers,
        [question.id]: {
          kind: 'selected',
          optionId: option.id,
        },
      };
    }, {});

    expect(calculateResult(QUESTIONS, answers)).toMatchObject({
      status: 'resolved',
      result: resultType,
    });
  });
});
