import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { WORLD_CUP_CANDIDATES } from '../src/features/ideal-world-cup/data/candidates';
import { WORLD_CUP_CATEGORIES } from '../src/features/ideal-world-cup/data/categories';
import { FREE_PASS_CANDIDATES, LIFE_CHEAT_CANDIDATES } from '../src/features/ideal-world-cup/data/concepts';
import { FOOD_CANDIDATES } from '../src/features/ideal-world-cup/data/foods';
import { TRAVEL_CANDIDATES } from '../src/features/ideal-world-cup/data/travel';

describe('음식 월드컵 후보 데이터', () => {
  it('서로 다른 88개 후보와 WebP 이미지를 제공한다', () => {
    const ids = FOOD_CANDIDATES.map((candidate) => candidate.id);
    const names = FOOD_CANDIDATES.map((candidate) => candidate.name);

    expect(FOOD_CANDIDATES).toHaveLength(88);
    expect(new Set(ids).size).toBe(88);
    expect(new Set(names).size).toBe(88);

    for (const candidate of FOOD_CANDIDATES) {
      if (!candidate.image) {
        throw new Error(`${candidate.name} 음식 이미지가 없습니다.`);
      }
      expect(candidate.image).toBe(`/images/world-cup/food/${candidate.id}.webp`);
      expect(existsSync(join(process.cwd(), 'public', candidate.image.slice(1)))).toBe(true);
    }
  });

  it('한 끼, 디저트, 야식은 각각 32개의 음식 후보만 둔다', () => {
    const validIds = new Set(FOOD_CANDIDATES.map((candidate) => candidate.id));
    const foodCategories = WORLD_CUP_CATEGORIES.filter(({ id }) => (
      id === 'meal' || id === 'dessert' || id === 'late-night'
    ));

    expect(foodCategories.map(({ title }) => title)).toEqual([
      '든든한 한 끼',
      '디저트',
      '야식',
    ]);

    for (const category of foodCategories) {
      expect(category.candidateIds).toHaveLength(32);
      expect(new Set(category.candidateIds).size).toBe(32);
      expect(category.candidateIds.every((id) => validIds.has(id))).toBe(true);
      expect(existsSync(join(process.cwd(), 'public', category.image.slice(1)))).toBe(true);
    }
  });

  it('여행지에 서로 다른 64개 후보와 WebP 이미지를 제공한다', () => {
    const ids = TRAVEL_CANDIDATES.map((candidate) => candidate.id);
    const names = TRAVEL_CANDIDATES.map((candidate) => candidate.name);
    const travelCategory = WORLD_CUP_CATEGORIES.find(({ id }) => id === 'travel');

    expect(TRAVEL_CANDIDATES).toHaveLength(64);
    expect(new Set(ids).size).toBe(64);
    expect(new Set(names).size).toBe(64);
    expect(travelCategory?.title).toBe('여행지');
    expect(travelCategory?.candidateIds).toEqual(ids);

    for (const candidate of TRAVEL_CANDIDATES) {
      if (!candidate.image) {
        throw new Error(`${candidate.name} 여행지 이미지가 없습니다.`);
      }
      expect(candidate.image.endsWith('.webp')).toBe(true);
      expect(existsSync(join(process.cwd(), 'public', candidate.image.slice(1)))).toBe(true);
    }
  });

  it('사진 설명이 아니라 여행지 이름만 노출한다', () => {
    const nameById = new Map(TRAVEL_CANDIDATES.map((candidate) => [candidate.id, candidate.name]));

    expect(nameById.get('travel-finland-aurora')).toBe('핀란드');
    expect(nameById.get('travel-egypt-pyramids')).toBe('이집트');
    expect(nameById.get('travel-kenya-safari')).toBe('케냐');
    expect(nameById.get('travel-nepal-himalayas')).toBe('네팔');
  });

  it('모든 주제와 후보의 참조가 유효하고 대표 이미지가 존재한다', () => {
    const validIds = new Set(WORLD_CUP_CANDIDATES.map((candidate) => candidate.id));

    expect(WORLD_CUP_CATEGORIES.map(({ title }) => title)).toEqual([
      '든든한 한 끼',
      '디저트',
      '야식',
      '여행지',
      '평생 무료 이용권',
      '인생 치트키',
    ]);

    for (const category of WORLD_CUP_CATEGORIES) {
      expect(new Set(category.candidateIds).size).toBe(category.candidateIds.length);
      expect(category.candidateIds.every((id) => validIds.has(id))).toBe(true);
      expect(existsSync(join(process.cwd(), 'public', category.image.slice(1)))).toBe(true);
    }
  });

  it('무료 이용권과 인생 치트키를 각각 32개의 상징형 후보로 제공한다', () => {
    for (const candidates of [FREE_PASS_CANDIDATES, LIFE_CHEAT_CANDIDATES]) {
      expect(candidates).toHaveLength(32);
      expect(new Set(candidates.map(({ id }) => id)).size).toBe(32);
      expect(new Set(candidates.map(({ name }) => name)).size).toBe(32);
      expect(candidates.every(({ symbol, visualTone }) => Boolean(symbol && visualTone))).toBe(true);
    }
  });

  it('모든 월드컵 결과에 주제별 한마디를 제공한다', () => {
    const messageById = new Map(
      WORLD_CUP_CATEGORIES.map(({ id, closingMessage }) => [id, closingMessage]),
    );

    expect(messageById.get('free-pass')).toContain('값없이 주신 은혜');
    expect(messageById.get('life-cheat')).toBe('인생 최고의 치트키는 기도입니다.');
    expect([...messageById.values()].every((message) => message.length > 0)).toBe(true);
  });

  it('라멘과 라면을 별도 후보로 구분한다', () => {
    expect(FOOD_CANDIDATES.find(({ id }) => id === 'ramen')?.name).toBe('라멘');
    expect(FOOD_CANDIDATES.find(({ id }) => id === 'ramyeon')?.name).toBe('라면');
  });
});
