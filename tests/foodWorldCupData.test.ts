import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { WORLD_CUP_CANDIDATES } from '../src/features/ideal-world-cup/data/candidates';
import { WORLD_CUP_CATEGORIES } from '../src/features/ideal-world-cup/data/categories';
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
      expect(candidate.image).toBe(`/images/world-cup/food/${candidate.id}.webp`);
      expect(existsSync(join(process.cwd(), 'public', candidate.image.slice(1)))).toBe(true);
    }
  });

  it('한 끼, 디저트, 야식은 각각 32개의 음식 후보만 둔다', () => {
    const validIds = new Set(FOOD_CANDIDATES.map((candidate) => candidate.id));
    const foodCategories = WORLD_CUP_CATEGORIES.filter(({ id }) => id !== 'travel');

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
      expect(candidate.image.endsWith('.webp')).toBe(true);
      expect(existsSync(join(process.cwd(), 'public', candidate.image.slice(1)))).toBe(true);
    }
  });

  it('모든 주제와 후보의 참조가 유효하고 대표 이미지가 존재한다', () => {
    const validIds = new Set(WORLD_CUP_CANDIDATES.map((candidate) => candidate.id));

    expect(WORLD_CUP_CATEGORIES.map(({ title }) => title)).toEqual([
      '든든한 한 끼',
      '디저트',
      '야식',
      '여행지',
    ]);

    for (const category of WORLD_CUP_CATEGORIES) {
      expect(new Set(category.candidateIds).size).toBe(category.candidateIds.length);
      expect(category.candidateIds.every((id) => validIds.has(id))).toBe(true);
      expect(existsSync(join(process.cwd(), 'public', category.image.slice(1)))).toBe(true);
    }
  });

  it('라멘과 라면을 별도 후보로 구분한다', () => {
    expect(FOOD_CANDIDATES.find(({ id }) => id === 'ramen')?.name).toBe('라멘');
    expect(FOOD_CANDIDATES.find(({ id }) => id === 'ramyeon')?.name).toBe('라면');
  });
});
