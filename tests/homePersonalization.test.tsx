// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import axe from 'axe-core';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from '../src/app/App';
afterEach(() => {
  cleanup();
  window.localStorage.clear();
  window.history.replaceState({}, '', '/');
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  vi.restoreAllMocks();
});

function getFeaturedActivityName(): string | null {
  const section = screen.getByRole('heading', { name: '추천 놀거리' }).closest('section');

  return within(section as HTMLElement).getByRole('button').getAttribute('aria-label');
}

describe('홈 상태와 직접 링크', () => {
  it('도구를 실행하고 돌아와도 홈의 추천과 스크롤 위치를 복원한다', async () => {
    render(<App />);
    const featuredActivityName = getFeaturedActivityName();

    document.documentElement.scrollTop = 420;
    fireEvent.click(screen.getByRole('button', { name: '나눔 순서' }));

    expect(window.location.search).toBe('?tool=sharing');
    expect((await screen.findByRole('button', {
      name: '먼저 나눌 사람',
    }, { timeout: 5000 })).getAttribute('aria-pressed')).toBe('true');

    document.documentElement.scrollTop = 0;
    fireEvent.click(screen.getByRole('button', { name: '홈' }));

    expect(getFeaturedActivityName()).toBe(featuredActivityName);
    expect(document.documentElement.scrollTop).toBe(420);
    expect(window.location.search).toBe('');
    expect(screen.queryByText('내 도구')).toBeNull();
    expect(screen.queryByRole('button', { name: /즐겨찾기/ })).toBeNull();
  });

  it('도구 링크로 바로 진입하고 내부에서 고른 모드를 주소에 반영한다', async () => {
    window.history.replaceState({}, '', '/?tool=groups');
    render(<App />);

    expect((await screen.findByRole('button', {
      name: '나눔 조 짜기',
    })).getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: '원투원 짝 정하기' }));
    expect(window.location.search).toBe('?tool=pairs');

    fireEvent.click(screen.getByRole('button', { name: '홈' }));
    expect(screen.getByRole('heading', { name: '우리 사이에 온기를' })).toBeTruthy();
    expect(window.location.search).toBe('');
  });

  it('홈에 자동 접근성 위반이 없다', async () => {
    const { container } = render(<App />);
    const audit = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } },
    });

    expect(audit.violations).toEqual([]);
  });
});
