import { describe, expect, it } from 'vitest';

import {
  BALANCE_GAME_QUESTIONS,
  CURATED_LIGHT_QUESTION_IDS,
} from '../src/features/balance-game/data/questions';

describe('밸런스 게임 시범 질문', () => {
  it('가벼운 질문 8개를 일상과 신앙에 고르게 제공한다', () => {
    expect(BALANCE_GAME_QUESTIONS).toHaveLength(8);
    expect(BALANCE_GAME_QUESTIONS.filter((question) => question.category === 'daily')).toHaveLength(4);
    expect(BALANCE_GAME_QUESTIONS.filter((question) => question.category === 'faith')).toHaveLength(4);
    expect(BALANCE_GAME_QUESTIONS.every((question) => question.weight === 'light')).toBe(true);
  });

  it('질문과 추천 흐름의 ID가 중복되거나 누락되지 않는다', () => {
    const questionIds = BALANCE_GAME_QUESTIONS.map((question) => question.id);

    expect(new Set(questionIds).size).toBe(questionIds.length);
    expect(new Set(CURATED_LIGHT_QUESTION_IDS).size).toBe(CURATED_LIGHT_QUESTION_IDS.length);
    expect(CURATED_LIGHT_QUESTION_IDS.every((questionId) => questionIds.includes(questionId))).toBe(true);
  });
});
