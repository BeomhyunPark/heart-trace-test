// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BalanceGameApp } from '../src/features/balance-game/BalanceGameApp';

afterEach(cleanup);

describe('밸런스 게임 기능 진입점', () => {
  it('준비 상태를 표시하고 홈으로 돌아갈 수 있다', () => {
    const onBackHome = vi.fn();

    render(<BalanceGameApp onBackHome={onBackHome} />);

    expect(screen.getByRole('heading', { name: '극과 극 밸런스 게임' })).toBeTruthy();
    expect(screen.getByText('게임 규칙과 질문을 준비하고 있어요.')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '홈' }));
    expect(onBackHome).toHaveBeenCalledOnce();
  });
});
