// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';

import { saveResultImageFile } from '../src/utils/resultImage';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('결과 이미지 저장', () => {
  it('Galaxy에서는 공유창 대신 실제 이미지 주소로 바로 다운로드한다', async () => {
    const share = vi.fn();
    const clickedLinks: HTMLAnchorElement[] = [];

    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (Linux; Android 15; SM-S938N) AppleWebKit/537.36 SamsungBrowser/28.0',
      platform: 'Linux armv81',
      maxTouchPoints: 5,
      canShare: vi.fn(() => true),
      share,
    });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      clickedLinks.push(this);
    });

    const file = new File(['result-image'], 'result-bear.png', { type: 'image/png' });
    const action = await saveResultImageFile(
      file,
      '/images/result-cards/result-bear.png',
    );

    expect(action).toBe('downloaded');
    expect(share).not.toHaveBeenCalled();
    expect(clickedLinks).toHaveLength(1);

    const clickedLink = clickedLinks.at(0);

    if (!clickedLink) {
      throw new Error('다운로드 링크가 클릭되지 않았습니다.');
    }

    expect(clickedLink.getAttribute('href')).toBe('/images/result-cards/result-bear.png');
    expect(clickedLink.download).toBe('result-bear.png');
  });

  it('공유할 때는 부가 텍스트 없이 이미지 파일만 전달한다', async () => {
    const share = vi.fn(async () => undefined);

    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',
      platform: 'iPhone',
      maxTouchPoints: 5,
      canShare: vi.fn(() => true),
      share,
    });

    const file = new File(['result-image'], 'result-spring.png', { type: 'image/png' });
    const action = await saveResultImageFile(
      file,
      '/images/result-cards/result-spring.png',
    );

    expect(action).toBe('shared');
    expect(share).toHaveBeenCalledTimes(1);
    expect(share).toHaveBeenCalledWith({ files: [file] });
  });
});
