// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BalanceGameApp } from '../src/features/balance-game/BalanceGameApp';

afterEach(cleanup);

describe('밸런스 게임 기능 진입점', () => {
  it('대화 온도와 질문 선택 방법을 고르고 홈으로 돌아갈 수 있다', () => {
    const onBackHome = vi.fn();

    render(<BalanceGameApp onBackHome={onBackHome} />);

    expect(screen.getByRole('heading', { name: '극과 극 밸런스 게임' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /가볍게/ }).getAttribute('aria-pressed')).toBe('true');
    const deepButton = screen.getByRole('button', { name: /조금 깊게/ });
    expect(deepButton.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(deepButton);
    expect(deepButton.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: /가볍게/ }).getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('button', { name: /추천 흐름으로 시작/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /직접 골라 담기/ })).toBeTruthy();
    expect(screen.getByText('창작자 · CK')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '홈' }));
    expect(onBackHome).toHaveBeenCalledOnce();
  });

  it('추천 흐름은 정해진 5문항을 순서대로 진행한다', () => {
    render(<BalanceGameApp onBackHome={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /추천 흐름으로 시작/ }));

    expect(screen.getByRole('progressbar', { name: '밸런스 게임 진행률' }).getAttribute('aria-valuemax')).toBe('5');
    expect(screen.getByRole('heading', { name: '메시지를 받았을 때 나는?' })).toBeTruthy();

    fireEvent.click(screen.getByRole('radio', { name: '칼답' }));
    expect(screen.getByText(/왜 이쪽을 골랐나요/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '다음 질문' }));

    expect(screen.getByRole('heading', { name: '내 생활 방식에 더 가까운 쪽은?' })).toBeTruthy();
  });

  it('리더가 카테고리를 살펴보고 원하는 질문만 골라 시작한다', () => {
    render(<BalanceGameApp onBackHome={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /직접 골라 담기/ }));
    fireEvent.click(screen.getByRole('button', { name: '교회 · 신앙' }));

    expect(screen.getAllByRole('checkbox')).toHaveLength(4);
    fireEvent.click(screen.getByRole('checkbox', { name: /조금 더 집중되는 예배는/ }));
    fireEvent.click(screen.getByRole('checkbox', { name: /성경 통독을 시작한다면/ }));

    expect(screen.getByLabelText('2개 선택')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '선택한 질문으로 시작' }));

    expect(screen.getByRole('progressbar', { name: '밸런스 게임 진행률' }).getAttribute('aria-valuemax')).toBe('2');
    expect(screen.getByRole('heading', { name: '조금 더 집중되는 예배는?' })).toBeTruthy();
  });

  it('깊은 질문을 마치고 다시 고를 때 이미 나눈 문항을 비활성화한다', () => {
    const { container } = render(<BalanceGameApp onBackHome={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /조금 깊게/ }));
    fireEvent.click(screen.getByRole('button', { name: /직접 골라 담기/ }));
    expect(container.querySelector('.balance-picker')?.classList.contains(
      'balance-game-screen--deep',
    )).toBe(true);
    fireEvent.click(screen.getByRole('checkbox', { name: /평화를 택한 침묵/ }));
    fireEvent.click(screen.getByRole('button', { name: '선택한 질문으로 시작' }));

    expect(container.querySelector('.balance-play')?.classList.contains(
      'balance-game-screen--deep',
    )).toBe(true);
    expect(screen.getByText('공동체 안에 반복되는 문제가 있다.')).toBeTruthy();
    fireEvent.click(screen.getByRole('radio', {
      name: '지금은 침묵한다. 공동체의 평화를 우선한다.',
    }));
    fireEvent.click(screen.getByRole('button', { name: '마무리하기' }));
    fireEvent.click(screen.getByRole('button', { name: '다른 질문 골라보기' }));

    const playedQuestion = screen.getByRole('checkbox', { name: /평화를 택한 침묵/ }) as HTMLInputElement;
    expect(playedQuestion.disabled).toBe(true);
    expect(screen.getByText(/이미 나눈 질문/)).toBeTruthy();
  });
});
