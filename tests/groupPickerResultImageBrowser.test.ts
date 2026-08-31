// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getGroupPickerResultImageSize,
  shareGroupPickerResultFile,
} from '../src/features/group-picker/services/resultImage';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('모임 도구 결과 이미지 공유', () => {
  it('짧은 결과도 세로형이며 인원이 늘면 이미지 높이가 함께 늘어난다', () => {
    expect(getGroupPickerResultImageSize(1)).toEqual({ width: 720, height: 900 });
    expect(getGroupPickerResultImageSize(32)).toEqual({ width: 720, height: 2590 });
  });

  it('파일 공유가 가능하면 텍스트 없이 이미지만 공유한다', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      share,
      canShare: vi.fn(() => true),
    });
    const file = new File(['result'], 'ongi-group-result.png', { type: 'image/png' });

    expect(await shareGroupPickerResultFile(file)).toBe('shared');
    expect(share).toHaveBeenCalledWith({ files: [file] });
  });

  it('사용자가 공유창을 닫으면 저장하지 않는다', async () => {
    const cancellation = new Error('cancelled');
    cancellation.name = 'AbortError';
    const share = vi.fn().mockRejectedValue(cancellation);
    vi.stubGlobal('navigator', {
      share,
      canShare: vi.fn(() => true),
    });
    const createObjectURL = vi.spyOn(URL, 'createObjectURL');
    const file = new File(['result'], 'ongi-group-result.png', { type: 'image/png' });

    expect(await shareGroupPickerResultFile(file)).toBe('cancelled');
    expect(createObjectURL).not.toHaveBeenCalled();
  });
});
