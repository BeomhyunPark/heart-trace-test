// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getWorldCupResultMonogram,
  shareWorldCupResultFile,
  WORLD_CUP_EMOJI_FONT_STACK,
} from '../src/features/ideal-world-cup/services/resultImage';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('최애 월드컵 우승 이미지 공유', () => {
  it('Android 컬러 이모지 폰트와 기기 독립적인 한글 라벨을 함께 사용한다', () => {
    expect(WORLD_CUP_EMOJI_FONT_STACK).toContain('Noto Color Emoji');
    expect(getWorldCupResultMonogram('평생 건강한 치아')).toBe('평생');
    expect(getWorldCupResultMonogram('항공권')).toBe('항공');
  });

  it('부가 메시지나 링크 없이 이미지 파일만 공유한다', async () => {
    const share = vi.fn(async () => undefined);
    const file = new File(['world-cup-result'], 'ongi-world-cup-travel-jeju.png', {
      type: 'image/png',
    });

    vi.stubGlobal('navigator', {
      canShare: vi.fn(() => true),
      share,
    });

    expect(await shareWorldCupResultFile(file)).toBe('shared');
    expect(share).toHaveBeenCalledWith({ files: [file] });
  });

  it('사용자가 공유창을 닫으면 다운로드하지 않는다', async () => {
    const error = new Error('cancelled');
    error.name = 'AbortError';
    const share = vi.fn(async () => Promise.reject(error));
    const file = new File(['world-cup-result'], 'ongi-world-cup-food.png', {
      type: 'image/png',
    });

    vi.stubGlobal('navigator', {
      canShare: vi.fn(() => true),
      share,
    });

    expect(await shareWorldCupResultFile(file)).toBe('cancelled');
  });
});
