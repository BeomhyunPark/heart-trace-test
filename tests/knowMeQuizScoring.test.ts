import { describe, expect, it } from 'vitest';

import { KNOW_ME_QUESTIONS } from '../src/features/know-me-quiz/data/questions';
import { getQuizScore } from '../src/features/know-me-quiz/domain/scoring';

describe('나를 맞혀봐 채점', () => {
  it('주인공의 답과 같은 예상만 정답으로 센다', () => {
    expect(getQuizScore(
      ['q1', 'q2', 'q3'],
      { q1: 0, q2: 1, q3: 2 },
      { q1: 0, q2: 2, q3: 2 },
    )).toBe(2);
  });

  it('모든 질문 ID와 선택지가 유효하다', () => {
    expect(new Set(KNOW_ME_QUESTIONS.map((question) => question.id)).size).toBe(KNOW_ME_QUESTIONS.length);
    expect(KNOW_ME_QUESTIONS.length).toBeGreaterThanOrEqual(10);
    expect(KNOW_ME_QUESTIONS.every((question) => question.options.length === 3)).toBe(true);
  });
});
