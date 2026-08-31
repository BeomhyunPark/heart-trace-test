// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { IdealWorldCupApp } from '../src/features/ideal-world-cup/IdealWorldCupApp';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('최애 월드컵 화면', () => {
  it('여섯 주제를 고르고 여행지는 64강부터 시작할 수 있다', () => {
    render(<IdealWorldCupApp onBackHome={vi.fn()} />);

    expect(screen.getByRole('button', { name: '든든한 한 끼' }).getAttribute('aria-pressed'))
      .toBe('true');
    expect(screen.getByRole('button', { name: '디저트' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '야식' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '여행지' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '평생 무료 이용권' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '인생 치트키' })).toBeTruthy();
    expect(screen.queryByText(/오늘 한 끼로|행복이 필요|밤이 깊을수록/)).toBeNull();
    expect(screen.queryByRole('button', { name: /64강/ })).toBeNull();
    expect(screen.getByRole('button', { name: /32강, 총 31번의 선택/ }).getAttribute('aria-pressed'))
      .toBe('true');

    fireEvent.click(screen.getByRole('button', { name: '여행지' }));
    fireEvent.click(screen.getByRole('button', { name: /64강, 총 63번의 선택/ }));

    expect(screen.getByRole('button', { name: '여행지' }).getAttribute('aria-pressed'))
      .toBe('true');
    expect(screen.getByRole('button', { name: /64강, 총 63번의 선택/ }).getAttribute('aria-pressed'))
      .toBe('true');
    expect(screen.getByRole('button', { name: '여행지 64강 시작하기' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '디저트' }));

    expect(screen.queryByRole('button', { name: /64강/ })).toBeNull();
    expect(screen.getByRole('button', { name: /32강, 총 31번의 선택/ }).getAttribute('aria-pressed'))
      .toBe('true');
    expect(screen.getByRole('button', { name: '디저트 32강 시작하기' })).toBeTruthy();
  });

  it('상상형 주제는 32강과 16강만 제공하고 상징 카드로 대결한다', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<IdealWorldCupApp onBackHome={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: '인생 치트키' }));

    expect(screen.queryByRole('button', { name: /64강/ })).toBeNull();
    expect(screen.getByRole('button', { name: '인생 치트키 32강 시작하기' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '인생 치트키 32강 시작하기' }));

    expect(screen.getByText('인생 치트키 · 32강')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: / 선택$/ })).toHaveLength(2);
    expect(document.querySelectorAll('.world-cup-candidate-visual--symbol')).toHaveLength(2);
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

  it('여행지 64강을 시작하면 63번의 선택으로 대진을 만든다', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<IdealWorldCupApp onBackHome={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: '여행지' }));
    fireEvent.click(screen.getByRole('button', { name: /64강, 총 63번의 선택/ }));
    fireEvent.click(screen.getByRole('button', { name: '여행지 64강 시작하기' }));

    expect(screen.getByText('여행지 · 64강')).toBeTruthy();
    expect(screen.getByText('전체 0 / 63')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: / 선택$/ })).toHaveLength(2);
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
    expect(screen.getByText(/마음을 살리는 양식은 하나님의 말씀/)).toBeTruthy();
  });
});
