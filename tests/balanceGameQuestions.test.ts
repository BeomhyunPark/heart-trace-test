import { describe, expect, it } from 'vitest';

import {
  BALANCE_GAME_QUESTIONS,
  CURATED_DEEP_QUESTION_IDS,
  CURATED_LIGHT_QUESTION_IDS,
} from '../src/features/balance-game/data/questions';

describe('밸런스 게임 시범 질문', () => {
  it('가벼운 질문 8개를 일상과 신앙에 고르게 제공한다', () => {
    const lightQuestions = BALANCE_GAME_QUESTIONS.filter((question) => question.weight === 'light');

    expect(lightQuestions).toHaveLength(8);
    expect(lightQuestions.filter((question) => question.category === 'daily')).toHaveLength(4);
    expect(lightQuestions.filter((question) => question.category === 'faith')).toHaveLength(4);
  });

  it('점수 표기 없이 깊은 질문 9개를 제공한다', () => {
    const deepQuestions = BALANCE_GAME_QUESTIONS.filter((question) => question.weight === 'deep');
    const deepQuestionCopy = deepQuestions.map((question) => [
      question.prompt,
      question.context,
      question.left,
      question.right,
    ].join(' ')).join(' ');

    expect(deepQuestions).toHaveLength(9);
    expect(deepQuestions.filter((question) => question.category === 'daily')).toHaveLength(6);
    expect(deepQuestions.filter((question) => question.category === 'faith')).toHaveLength(3);
    expect(deepQuestionCopy).not.toMatch(/[+−–-]\d/);
  });

  it('질문과 추천 흐름의 ID가 중복되거나 누락되지 않는다', () => {
    const questionIds = BALANCE_GAME_QUESTIONS.map((question) => question.id);

    expect(new Set(questionIds).size).toBe(questionIds.length);
    expect(new Set(CURATED_LIGHT_QUESTION_IDS).size).toBe(CURATED_LIGHT_QUESTION_IDS.length);
    expect(new Set(CURATED_DEEP_QUESTION_IDS).size).toBe(CURATED_DEEP_QUESTION_IDS.length);
    expect(CURATED_LIGHT_QUESTION_IDS.every((questionId) => questionIds.includes(questionId))).toBe(true);
    expect(CURATED_DEEP_QUESTION_IDS.every((questionId) => questionIds.includes(questionId))).toBe(true);
  });
});
