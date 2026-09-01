// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

type LazyActivityModule = {
  default: () => ReactNode;
};

const lazyActivity = vi.hoisted(() => {
  let resolveModule: ((module: LazyActivityModule) => void) | undefined;
  const promise = new Promise<LazyActivityModule>((resolve) => {
    resolveModule = resolve;
  });

  return {
    promise,
    resolve(module: LazyActivityModule) {
      resolveModule?.(module);
    },
  };
});

vi.mock('../src/app/activityRegistry', async () => {
  const { lazy } = await import('react');
  const LazyActivity = lazy(() => lazyActivity.promise);

  return {
    getActivityDefinition: (id: string) => ({
      id,
      Component: LazyActivity,
      preload: () => lazyActivity.promise,
    }),
    preloadActivity: () => Promise.resolve(),
  };
});

import { App } from '../src/app/App';

afterEach(() => {
  cleanup();
});

describe('홈에서 콘텐츠로 이동할 때', () => {
  it('지연 로딩 중에 추천 카드를 새로 렌더링하지 않는다', async () => {
    render(<App />);

    const featuredSection = screen.getByRole('heading', {
      name: '추천 놀거리',
    }).closest('section');
    expect(featuredSection).not.toBeNull();

    const featuredButton = within(featuredSection as HTMLElement).getByRole('button');
    const featuredActivityName = featuredButton.getAttribute('aria-label');
    fireEvent.click(featuredButton);

    const pendingFeaturedSection = screen.getByRole('heading', {
      name: '추천 놀거리',
    }).closest('section');
    expect(within(pendingFeaturedSection as HTMLElement).getByRole('button').getAttribute(
      'aria-label',
    )).toBe(featuredActivityName);

    await act(async () => {
      lazyActivity.resolve({
        default: () => <h1>지연 로딩된 콘텐츠</h1>,
      });
      await lazyActivity.promise;
    });

    expect(await screen.findByRole('heading', {
      name: '지연 로딩된 콘텐츠',
    })).toBeTruthy();
  });
});
