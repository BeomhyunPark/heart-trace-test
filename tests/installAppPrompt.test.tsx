// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { InstallAppPrompt } from '../src/components/InstallAppPrompt';

function mockDevice(userAgent: string, platform: string, maxTouchPoints = 0) {
  vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(userAgent);
  vi.spyOn(window.navigator, 'platform', 'get').mockReturnValue(platform);
  Object.defineProperty(window.navigator, 'maxTouchPoints', {
    configurable: true,
    value: maxTouchPoints,
  });
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches: false,
    media: '(display-mode: standalone)',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })));
}

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(window.navigator, 'maxTouchPoints');
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('모바일 홈 화면 설치 안내', () => {
  it('iOS Safari에서는 홈 화면 추가 절차를 안내한다', async () => {
    mockDevice(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1',
      'iPhone',
      5,
    );

    render(<InstallAppPrompt />);

    fireEvent.click(await screen.findByRole('button', { name: '추가' }));

    expect(screen.getByRole('dialog', { name: '홈 화면에 온기를 추가해요' })).toBeTruthy();
    expect(screen.getByText(/홈 화면에 추가/)).toBeTruthy();
    expect(screen.getByText(/웹 앱으로 열기/)).toBeTruthy();
  });

  it('Android에서는 브라우저의 네이티브 설치 프롬프트를 호출한다', async () => {
    mockDevice(
      'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/140.0 Mobile Safari/537.36',
      'Linux armv8l',
      5,
    );
    const prompt = vi.fn(async () => undefined);
    const installEvent = new Event('beforeinstallprompt');
    Object.assign(installEvent, {
      prompt,
      userChoice: Promise.resolve({ outcome: 'accepted', platform: 'web' }),
    });

    render(<InstallAppPrompt />);

    await act(async () => {
      window.dispatchEvent(installEvent);
    });

    await act(async () => {
      fireEvent.click(await screen.findByRole('button', { name: '추가' }));
    });

    expect(prompt).toHaveBeenCalledOnce();
    expect(screen.queryByRole('button', { name: '추가' })).toBeNull();
  });
});
