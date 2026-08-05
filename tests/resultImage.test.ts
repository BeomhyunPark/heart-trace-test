import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { RESULT_TYPES } from '../src/data/resultTypes';
import { RESULT_TYPE_IDS } from '../src/domain/types';
import {
  getResultImageFilename,
  isIosLikeDevice,
} from '../src/utils/resultImage';

describe('결과 이미지', () => {
  it('5개 유형이 고정된 저장 이미지 파일명과 연결된다', () => {
    for (const resultTypeId of RESULT_TYPE_IDS) {
      const filename = getResultImageFilename(resultTypeId);

      expect(filename).toBe(`result-${resultTypeId}.png`);
      expect(RESULT_TYPES[resultTypeId].resultCardSrc).toBe(
        `/images/result-cards/${filename}`,
      );
    }
  });

  it.each(RESULT_TYPE_IDS)('%s 저장 이미지가 유효한 고해상도 PNG다', (resultTypeId) => {
    const resultType = RESULT_TYPES[resultTypeId];
    const imagePath = resolve('public', resultType.resultCardSrc.replace(/^\//, ''));
    const image = readFileSync(imagePath);
    const pngSignature = image.subarray(0, 8).toString('hex');
    const width = image.readUInt32BE(16);
    const height = image.readUInt32BE(20);

    expect(pngSignature).toBe('89504e470d0a1a0a');
    expect(width).toBeGreaterThanOrEqual(800);
    expect(height).toBeGreaterThanOrEqual(1900);
    expect(image.byteLength).toBeLessThanOrEqual(3 * 1024 * 1024);
  });

  it('일반 iPhone과 iPadOS 데스크톱 모드를 감지한다', () => {
    expect(isIosLikeDevice({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',
      platform: 'iPhone',
      maxTouchPoints: 5,
    })).toBe(true);

    expect(isIosLikeDevice({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)',
      platform: 'MacIntel',
      maxTouchPoints: 5,
    })).toBe(true);
  });

  it('일반 데스크톱을 iOS로 판단하지 않는다', () => {
    expect(isIosLikeDevice({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)',
      platform: 'MacIntel',
      maxTouchPoints: 0,
    })).toBe(false);
  });
});
