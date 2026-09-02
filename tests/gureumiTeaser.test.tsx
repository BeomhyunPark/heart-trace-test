// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { afterEach, describe, expect, it } from 'vitest';

import { App } from '../src/app/App';

afterEach(() => {
  cleanup();
  window.history.replaceState({}, '', '/');
});

describe('구르미 테스트 티저', () => {
  it('홈의 작은 배너에서 피그마 기반 티저 화면으로 진입한다', async () => {
    const { container } = render(<App />);
    const teaserButton = screen.getByRole('button', { name: '구르미 테스트 티저 보기' });

    expect(teaserButton.classList.contains('gureumi-home-teaser')).toBe(true);
    expect(teaserButton.textContent).toContain('구르미 테스트');

    fireEvent.click(teaserButton);

    expect(await screen.findByRole('heading', {
      name: /두 번째 테스트,.*흔적을 이을 캐릭터는\?/,
      level: 1,
    })).toBeTruthy();
    expect(window.location.search).toBe('?activity=gureumi-teaser');
    expect(screen.getByText('ONGI · SECOND TEST')).toBeTruthy();
    expect(screen.getByText('두 번째 테스트 · 곧 공개')).toBeTruthy();

    const mysteryStage = screen.getByRole('region', {
      name: '공개를 기다리는 구르미 캐릭터 여덟 친구',
    });
    expect(mysteryStage.querySelectorAll('.gureumi-mystery-character')).toHaveLength(8);
    expect((await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } },
    })).violations).toEqual([]);
  });

  it('기존 흔적 테스트로 이어지고 홈으로 돌아올 수 있다', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '구르미 테스트 티저 보기' }));

    fireEvent.click(await screen.findByRole('button', {
      name: '마음의 흔적 테스트 하러 가기',
    }));

    expect(await screen.findByRole('heading', {
      name: '마음속 흔적 찾기',
      level: 1,
    })).toBeTruthy();
    expect(window.location.search).toBe('?activity=heart-trace');

    fireEvent.click(screen.getByRole('button', { name: '홈' }));
    expect(screen.getByRole('button', { name: '구르미 테스트 티저 보기' })).toBeTruthy();
  });
});
