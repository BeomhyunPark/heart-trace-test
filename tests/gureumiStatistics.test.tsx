// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from '../src/app/App';

const ADMIN_KEY = 'beta-admin-key';
const RESULT_NAMES = ['아롱이', '달몽이', '후우', '쯨이', '촉촉이', '몽실이', '찌릿이', '포근이'];

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function statisticsResponse() {
  return {
    version: 'GUREUMI_BETA_V01',
    availableVersions: [{ code: 'GUREUMI_BETA_V01', status: 'ACTIVE' }],
    completedAnswersOnly: true,
    firstAttemptOnly: true,
    funnel: {
      started: 100,
      q9Reached: 90,
      q9Rate: 90,
      q18Reached: 80,
      q18Rate: 80,
      completed: 70,
      completionRate: 70,
      feedbackSubmitted: 50,
      feedbackRate: 71.4,
    },
    questions: Array.from({ length: 27 }, (_, index) => ({
      order: index + 1,
      code: `${['N', 'R', 'W'][index % 3]}${String(index + 1).padStart(2, '0')}`,
      prompt: `${index + 1}번 상황`,
      axis: ['NOVELTY', 'RELATION', 'WORRY'][index % 3],
      responseCount: 70,
      aVeryCount: 7,
      aVeryPercentage: 10,
      aLittleCount: 14,
      aLittlePercentage: 20,
      bLittleCount: 21,
      bLittlePercentage: 30,
      bVeryCount: 28,
      bVeryPercentage: 40,
      averageScore: 2.35,
      averageResponseMs: 3200,
    })),
    axes: [
      { key: 'NOVELTY', label: '새로움', completedCount: 70, highCount: 42, highPercentage: 60, lowCount: 28, lowPercentage: 40, boundaryCount: 14, boundaryPercentage: 20, averageScore: 24.2 },
      { key: 'WORRY', label: '걱정', completedCount: 70, highCount: 35, highPercentage: 50, lowCount: 35, lowPercentage: 50, boundaryCount: 21, boundaryPercentage: 30, averageScore: 22.5 },
      { key: 'RELATION', label: '관계', completedCount: 70, highCount: 49, highPercentage: 70, lowCount: 21, lowPercentage: 30, boundaryCount: 7, boundaryPercentage: 10, averageScore: 25.1 },
    ],
    results: RESULT_NAMES.map((displayName, index) => ({
      resultType: `TYPE_${index + 1}`,
      displayName,
      count: index + 5,
      percentage: 10 + index,
      feedbackCount: index + 1,
      averageRating: 3.2,
      ratings: [1, 2, 3, 4].map((rating) => ({ rating, count: 1, percentage: 25 })),
    })),
    feedback: {
      submittedCount: 50,
      completionResponsePercentage: 71.4,
      averageRating: 3.36,
      ratings: [
        { rating: 1, count: 2, percentage: 4 },
        { rating: 2, count: 6, percentage: 12 },
        { rating: 3, count: 14, percentage: 28 },
        { rating: 4, count: 28, percentage: 56 },
      ],
    },
  };
}

afterEach(() => {
  cleanup();
  window.sessionStorage.clear();
  window.history.replaceState({}, '', '/');
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('구르미 Beta 내부 통계', () => {
  it('숨겨진 주소로 진입해도 키 인증 전에는 집계 API를 호출하지 않는다', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    window.history.replaceState({}, '', '/?page=gureumi-beta-stats');

    const { container } = render(<App />);

    expect(await screen.findByRole('heading', { name: '통계 화면 잠금 해제' })).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByRole('link', { name: /통계/ })).toBeNull();
    expect((await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } },
    })).violations).toEqual([]);
  });

  it('관리자 키로 익명 집계를 열고 필터를 서버 조건으로 전달한다', async () => {
    const fetchMock = vi.fn(async (
      _input: string | URL | Request,
      _init?: RequestInit,
    ) => json(statisticsResponse()));
    vi.stubGlobal('fetch', fetchMock);
    window.history.replaceState({}, '', '/?page=gureumi-beta-stats');
    const { container } = render(<App />);

    fireEvent.change(await screen.findByLabelText('관리자 키'), { target: { value: ADMIN_KEY } });
    fireEvent.click(screen.getByRole('button', { name: '통계 보기' }));

    expect(await screen.findByRole('heading', { name: '구르미 Beta 통계', level: 1 })).toBeTruthy();
    expect(screen.getByText('27번 상황')).toBeTruthy();
    expect(screen.getByRole('heading', { name: '축 분포와 Boundary' })).toBeTruthy();
    expect(screen.getByText('아롱이')).toBeTruthy();
    expect(screen.getByText('포근이')).toBeTruthy();
    expect(screen.getByText(/3.36 \/ 4/)).toBeTruthy();
    expect(screen.getByText(/개인정보와 raw token은 표시하지 않음/)).toBeTruthy();
    expect(window.sessionStorage.getItem('ongi_gureumi_admin_key_v1')).toBe(ADMIN_KEY);
    expect(window.localStorage.getItem('ongi_gureumi_admin_key_v1')).toBeNull();
    expect(window.location.search).not.toContain(ADMIN_KEY);

    const firstCall = fetchMock.mock.calls[0];
    const firstUrl = new URL(String(firstCall[0]));
    expect(firstUrl.pathname).toBe('/api/gureumi/internal/statistics');
    expect(firstUrl.searchParams.get('completedAnswersOnly')).toBe('true');
    expect(firstUrl.searchParams.get('firstAttemptOnly')).toBe('true');
    expect(new Headers(firstCall[1]?.headers).get('X-Gureumi-Admin-Key')).toBe(ADMIN_KEY);

    fireEvent.click(screen.getByRole('button', { name: '완료자 응답' }));
    fireEvent.click(screen.getByRole('button', { name: '최초 검사' }));

    await waitFor(() => {
      const urls = fetchMock.mock.calls.map(([input]) => new URL(String(input)));
      expect(urls.some((url) => (
        url.searchParams.get('completedAnswersOnly') === 'false'
        && url.searchParams.get('firstAttemptOnly') === 'false'
      ))).toBe(true);
    });
    expect((await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } },
    })).violations).toEqual([]);
  });

  it('잘못된 키는 현재 탭에도 남기지 않고 다시 입력받는다', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => json({
      code: 'GUREUMI_ADMIN_UNAUTHORIZED',
      detail: '관리자 키가 올바르지 않습니다.',
    }, 401)));
    window.history.replaceState({}, '', '/?page=gureumi-beta-stats');
    render(<App />);

    fireEvent.change(await screen.findByLabelText('관리자 키'), { target: { value: 'wrong-key' } });
    fireEvent.click(screen.getByRole('button', { name: '통계 보기' }));

    expect((await screen.findByRole('alert')).textContent).toBe('관리자 키가 올바르지 않습니다.');
    expect(screen.getByRole('heading', { name: '통계 화면 잠금 해제' })).toBeTruthy();
    expect(window.sessionStorage.getItem('ongi_gureumi_admin_key_v1')).toBeNull();
  });
});
