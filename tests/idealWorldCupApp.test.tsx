// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { IdealWorldCupApp } from '../src/features/ideal-world-cup/IdealWorldCupApp';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('음식 최애 월드컵 화면', () => {
  it('세 주제와 32강, 16강 가운데 시작 구성을 고를 수 있다', () => {
    render(<IdealWorldCupApp onBackHome={vi.fn()} />);

    expect(screen.getByRole('button', { name: '든든한 한 끼' }).getAttribute('aria-pressed'))
      .toBe('true');
    expect(screen.getByRole('button', { name: '디저트' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '야식' })).toBeTruthy();
    expect(screen.queryByText(/오늘 한 끼로|행복이 필요|밤이 깊을수록/)).toBeNull();
    expect(screen.getByRole('button', { name: /32강, 총 31번의 선택/ }).getAttribute('aria-pressed'))
      .toBe('true');

    fireEvent.click(screen.getByRole('button', { name: '디저트' }));
    fireEvent.click(screen.getByRole('button', { name: /16강, 총 15번의 선택/ }));

    expect(screen.getByRole('button', { name: '디저트' }).getAttribute('aria-pressed'))
      .toBe('true');
    expect(screen.getByRole('button', { name: /16강, 총 15번의 선택/ }).getAttribute('aria-pressed'))
      .toBe('true');
    expect(screen.getByRole('button', { name: '디저트 16강 시작하기' })).toBeTruthy();
  });

  it('한 번 누르면 다음 대결로 가고, 바로 전 선택을 취소할 수 있다', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<IdealWorldCupApp onBackHome={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /16강, 총 15번의 선택/ }));
    fireEvent.click(screen.getByRole('button', { name: '든든한 한 끼 16강 시작하기' }));

    const firstChoice = screen.getAllByRole('button', { name: / 선택$/ })[0];
    const firstChoiceName = firstChoice.getAttribute('aria-label');
    fireEvent.click(firstChoice);

    expect(screen.getByText('전체 1 / 15')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /방금 선택 취소/ }));

    expect(screen.getByText('전체 0 / 15')).toBeTruthy();
    expect(screen.getByRole('button', { name: firstChoiceName ?? '' })).toBeTruthy();
  });

  it('나갔다 돌아오면 저장된 대진을 이어서 할 수 있다', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const firstRender = render(<IdealWorldCupApp onBackHome={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /16강, 총 15번의 선택/ }));
    fireEvent.click(screen.getByRole('button', { name: '든든한 한 끼 16강 시작하기' }));
    fireEvent.click(screen.getAllByRole('button', { name: / 선택$/ })[0]);
    firstRender.unmount();

    render(<IdealWorldCupApp onBackHome={vi.fn()} />);

    expect(screen.getByRole('heading', { name: '든든한 한 끼 · 16강' })).toBeTruthy();
    expect(screen.getByText('16강 · 선택 1개 저장')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '이어하기' }));
    expect(screen.getByText('전체 1 / 15')).toBeTruthy();
  });

  it('16강의 모든 라운드를 거쳐 우승 결과까지 도달한다', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<IdealWorldCupApp onBackHome={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /16강, 총 15번의 선택/ }));
    fireEvent.click(screen.getByRole('button', { name: '든든한 한 끼 16강 시작하기' }));

    for (let selection = 0; selection < 15; selection += 1) {
      fireEvent.click(screen.getAllByRole('button', { name: / 선택$/ })[0]);

      const continueButton = screen.queryByRole('button', { name: /계속하기$/ });
      if (continueButton) {
        fireEvent.click(continueButton);
      }
    }

    expect(screen.getByText('든든한 한 끼 월드컵 우승')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
    expect(screen.getByRole('button', { name: '16강 다시 하기' })).toBeTruthy();
  });
});
