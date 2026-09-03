import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { GUREUMI_RESULTS } from '../src/features/gureumi/data/results';

describe('구르미 결과 8종', () => {
  it('authoritative 결과 이름과 캐릭터 키를 모두 제공한다', () => {
    expect(Object.values(GUREUMI_RESULTS).map(({ name }) => name)).toEqual([
      '아롱이', '달몽이', '후우', '쨍이', '촉촉이', '몽실이', '찌릿이', '포근이',
    ]);
    expect(new Set(Object.values(GUREUMI_RESULTS).map(({ characterKey }) => characterKey)).size).toBe(8);
  });

  it('각 결과의 Figma 공유 이미지를 1080×1920 PNG로 제공한다', () => {
    for (const result of Object.values(GUREUMI_RESULTS)) {
      const image = readFileSync(join(
        process.cwd(),
        'public',
        'images',
        'results',
        'gureumi',
        `${result.characterKey}-story.png`,
      ));

      expect(image.subarray(1, 4).toString('ascii')).toBe('PNG');
      expect(image.readUInt32BE(16)).toBe(1080);
      expect(image.readUInt32BE(20)).toBe(1920);
    }
  });
});
