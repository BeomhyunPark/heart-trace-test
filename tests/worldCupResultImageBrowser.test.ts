// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';

import { shareWorldCupResultFile } from '../src/features/ideal-world-cup/services/resultImage';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('최애 월드컵 우승 이미지 공유', () => {
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
