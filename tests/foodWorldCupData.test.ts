import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { WORLD_CUP_CATEGORIES } from '../src/features/ideal-world-cup/data/categories';
import { FOOD_CANDIDATES } from '../src/features/ideal-world-cup/data/foods';

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

  it('한 끼, 디저트, 야식에 각각 32개의 유효한 후보만 둔다', () => {
    const validIds = new Set(FOOD_CANDIDATES.map((candidate) => candidate.id));

    expect(WORLD_CUP_CATEGORIES.map(({ title }) => title)).toEqual([
      '든든한 한 끼',
      '디저트',
      '야식',
    ]);

    for (const category of WORLD_CUP_CATEGORIES) {
      expect(category.candidateIds).toHaveLength(32);
      expect(new Set(category.candidateIds).size).toBe(32);
      expect(category.candidateIds.every((id) => validIds.has(id))).toBe(true);
      expect(existsSync(join(process.cwd(), 'public', category.image.slice(1)))).toBe(true);
    }
  });

  it('라멘과 라면을 별도 후보로 구분한다', () => {
    expect(FOOD_CANDIDATES.find(({ id }) => id === 'ramen')?.name).toBe('라멘');
    expect(FOOD_CANDIDATES.find(({ id }) => id === 'ramyeon')?.name).toBe('라면');
  });
});
