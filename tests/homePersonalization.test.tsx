// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import axe from 'axe-core';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from '../src/app/App';
import { COMMUNITY_TOOL_PREFERENCES_KEY } from '../src/features/home/services/communityToolPreferences';

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

describe('홈 개인화와 직접 링크', () => {
  it('실행한 도구를 최근 사용으로 저장하고 홈 상태를 그대로 복원한다', async () => {
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

    expect(screen.getByRole('button', {
      name: '최근 사용한 도구 나눔 순서 열기',
    })).toBeTruthy();
    expect(getFeaturedActivityName()).toBe(featuredActivityName);
    expect(document.documentElement.scrollTop).toBe(420);
    expect(window.location.search).toBe('');
    expect(JSON.parse(window.localStorage.getItem(COMMUNITY_TOOL_PREFERENCES_KEY) ?? '{}')).toMatchObject({
      recentMode: 'sharing',
    });
  });

  it('도구를 최대 3개까지 즐겨찾기에 고정하고 새로 렌더링해도 유지한다', () => {
    const rendered = render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '사다리 즐겨찾기 추가' }));
    fireEvent.click(screen.getByRole('button', { name: '제비 즐겨찾기 추가' }));
    fireEvent.click(screen.getByRole('button', { name: '나눔 순서 즐겨찾기 추가' }));
    fireEvent.click(screen.getByRole('button', { name: '조 편성 즐겨찾기 추가' }));

    expect(screen.getByText('즐겨찾기는 3개까지 고정할 수 있어요.')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /^즐겨찾기 .* 열기$/ })).toHaveLength(3);
    expect(screen.getByRole('button', {
      name: '조 편성 즐겨찾기 추가',
    }).getAttribute('aria-pressed')).toBe('false');

    rendered.unmount();
    render(<App />);

    expect(screen.getAllByRole('button', { name: /^즐겨찾기 .* 열기$/ })).toHaveLength(3);
    expect(screen.getByRole('button', { name: '즐겨찾기 사다리 열기' })).toBeTruthy();
  });

  it('브라우저 저장소 쓰기가 실패해도 현재 화면의 즐겨찾기는 동작한다', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '조 편성 즐겨찾기 추가' }));

    expect(screen.getByRole('button', { name: '즐겨찾기 조 편성 열기' })).toBeTruthy();
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

  it('개인화된 홈에도 자동 접근성 위반이 없다', async () => {
    window.localStorage.setItem(COMMUNITY_TOOL_PREFERENCES_KEY, JSON.stringify({
      recentMode: 'sharing',
      favoriteModes: ['ladder', 'groups', 'pairs'],
    }));
    const { container } = render(<App />);
    const audit = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } },
    });

    expect(audit.violations).toEqual([]);
  });
});
