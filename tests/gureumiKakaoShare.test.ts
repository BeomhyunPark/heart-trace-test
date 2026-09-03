// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';

import { shareGureumiResult } from '../src/features/gureumi/services/kakaoShare';

afterEach(() => {
  delete window.Kakao;
  vi.unstubAllEnvs();
});

describe('구르미 카카오톡 공유', () => {
  it('미리 로드된 SDK를 탭 시점에 바로 호출하고 결과 이미지와 테스트 링크를 보낸다', async () => {
    vi.stubEnv('VITE_KAKAO_JAVASCRIPT_KEY', '0123456789abcdef0123456789abcdef');
    const init = vi.fn();
    const sendDefault = vi.fn();
    window.Kakao = {
      init,
      isInitialized: () => false,
      Share: { sendDefault },
    };

    const action = await shareGureumiResult({
      name: '아롱이',
      descriptor: '사람과 새로움에\n즐겁게 뛰어드는 열정가',
      characterKey: 'arong',
    });

    expect(action).toBe('kakao');
    expect(init).toHaveBeenCalledTimes(1);
    expect(sendDefault).toHaveBeenCalledWith(expect.objectContaining({
      objectType: 'feed',
      content: expect.objectContaining({
        title: '나는 아롱이!',
        description: '사람과 새로움에 즐겁게 뛰어드는 열정가',
        imageUrl: expect.stringContaining('/images/results/gureumi/arong-story.png'),
      }),
      buttons: [{
        title: '나도 테스트하러 가기',
        link: expect.objectContaining({ mobileWebUrl: expect.stringContaining('/share/gureumi/') }),
      }],
    }));
  });
});
