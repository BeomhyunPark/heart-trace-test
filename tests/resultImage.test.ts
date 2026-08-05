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
