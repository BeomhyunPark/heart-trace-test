import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { FOOD_CANDIDATES } from '../src/features/ideal-world-cup/data/foods';

describe('음식 월드컵 후보 데이터', () => {
  it('서로 다른 64개 후보와 WebP 이미지를 제공한다', () => {
    const ids = FOOD_CANDIDATES.map((candidate) => candidate.id);
    const names = FOOD_CANDIDATES.map((candidate) => candidate.name);

    expect(FOOD_CANDIDATES).toHaveLength(64);
    expect(new Set(ids)).toHaveLength(64);
    expect(new Set(names)).toHaveLength(64);

    for (const candidate of FOOD_CANDIDATES) {
      expect(candidate.image).toBe(`/images/world-cup/food/${candidate.id}.webp`);
      expect(existsSync(join(process.cwd(), 'public', candidate.image.slice(1)))).toBe(true);
    }
  });

  it('라멘과 라면을 별도 후보로 구분한다', () => {
    expect(FOOD_CANDIDATES.find(({ id }) => id === 'ramen')?.name).toBe('라멘');
    expect(FOOD_CANDIDATES.find(({ id }) => id === 'ramyeon')?.name).toBe('라면');
  });
});
