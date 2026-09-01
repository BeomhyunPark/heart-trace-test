// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from '../src/app/App';

beforeEach(() => {
  const canonical = document.createElement('link');
  canonical.rel = 'canonical';
  canonical.href = 'https://ongi.greengroove.app/';
  document.head.append(canonical);
});

afterEach(() => {
  cleanup();
  document.querySelector('link[rel="canonical"]')?.remove();
  window.localStorage.clear();
  window.history.replaceState({}, '', '/');
  vi.restoreAllMocks();
});

describe('놀이와 도구 링크 공유', () => {
  it('놀이 화면에서 해당 놀이의 전용 미리보기 URL을 공유한다', async () => {
    const share = vi.fn(async () => undefined);
    Object.defineProperty(window.navigator, 'share', {
      configurable: true,
      value: share,
    });
    window.history.replaceState({}, '', '/?activity=balance-game');

    render(<App />);
    const shareButton = await screen.findByRole('button', {
      name: '극과 극 밸런스 게임 링크 공유하기',
    });
    expect(shareButton.closest<HTMLElement>('.activity-link-share')?.style.getPropertyValue(
      '--activity-share-accent',
    )).toBe('#ff8c68');
    fireEvent.click(shareButton);

    await waitFor(() => expect(share).toHaveBeenCalledWith({
      title: '극과 극 밸런스 게임 | 온기',
      url: 'https://ongi.greengroove.app/share/balance-game/',
    }));
    expect(await screen.findByText('극과 극 밸런스 게임 링크를 공유했어요.')).toBeTruthy();
  });

  it('밸런스 게임의 가볍게·조금 깊게 테마에 따라 공유 색상을 바꾸어준다', async () => {
    window.history.replaceState({}, '', '/?activity=balance-game');
    render(<App />);

    await screen.findByRole('heading', { name: '극과 극 밸런스 게임' });
    const shell = document.querySelector('.activity-shell');
    expect(shell?.querySelector('.balance-game-screen--light')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /조금 깊게/ }));

    expect(shell?.querySelector('.balance-game-screen--deep')).toBeTruthy();
  });

  it('모임 도구를 바꾸면 공유 대상도 선택한 도구로 바꾸어준다', async () => {
    window.history.replaceState({}, '', '/?tool=prayer');
    render(<App />);

    fireEvent.click(await screen.findByRole('button', { name: '나눔 조 짜기' }));

    const groupsShareButton = await screen.findByRole('button', {
      name: '나눔 조 편성하기 링크 공유하기',
    });
    expect(groupsShareButton.closest<HTMLElement>('.activity-link-share')?.style.getPropertyValue(
      '--activity-share-accent',
    )).toBe('#85a8ed');
    expect(window.location.search).toBe('?tool=groups');
  });
});
