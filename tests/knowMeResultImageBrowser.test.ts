// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getKnowMeResultImageSize,
  shareKnowMeResultFile,
} from '../src/features/know-me-quiz/services/resultImage';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('나를 맞혀봐 결과 공유', () => {
  it('결과 이미지는 세로형이며 질문 수에 따라 길어진다', () => {
    expect(getKnowMeResultImageSize(5)).toEqual({ width: 720, height: 1080 });
    expect(getKnowMeResultImageSize(8)).toEqual({ width: 720, height: 1338 });
  });

  it('공유할 때 부가 메시지 없이 이미지 파일만 전달한다', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { share, canShare: vi.fn(() => true) });
    const file = new File(['result'], 'ongi-know-me-result.png', { type: 'image/png' });

    expect(await shareKnowMeResultFile(file)).toBe('shared');
    expect(share).toHaveBeenCalledWith({ files: [file] });
  });
});
