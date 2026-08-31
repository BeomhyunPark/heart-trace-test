// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { KnowMeQuizApp } from '../src/features/know-me-quiz/KnowMeQuizApp';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('나를 맞혀봐', () => {
  it('설명 화면 없이 이름과 질문 선택부터 바로 시작한다', () => {
    render(<KnowMeQuizApp onBackHome={vi.fn()} />);

    expect(screen.getByRole('heading', { name: '나를 맞혀봐' })).toBeTruthy();
    expect(screen.getByLabelText('오늘의 주인공 이름')).toBeTruthy();
    expect(screen.getByRole('heading', { name: '질문 고르기' })).toBeTruthy();
    expect(screen.getByText('0/8')).toBeTruthy();
    expect(screen.getByRole('button', { name: '이름을 입력해 주세요' }).hasAttribute('disabled')).toBe(true);
  });

  it('모든 예상을 다 고른 뒤 정답과 오답을 한번에 공개한다', async () => {
    vi.useFakeTimers();
    render(<KnowMeQuizApp onBackHome={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('오늘의 주인공 이름'), { target: { value: '민지' } });
    expect(screen.getByRole('button', { name: '질문 5개 더 골라 주세요' }).hasAttribute('disabled')).toBe(true);
    const questionPicker = document.querySelector('.know-me-question-picker');
    if (!questionPicker) throw new Error('질문 선택 영역을 찾지 못했습니다.');
    within(questionPicker as HTMLElement).getAllByRole('button').slice(0, 5).forEach((button) => fireEvent.click(button));
    fireEvent.click(screen.getByRole('button', { name: '민지의 답 정하기' }));

    for (let index = 0; index < 5; index += 1) {
      const optionGroup = screen.getByRole('group');
      fireEvent.click(within(optionGroup).getAllByRole('button')[0]);
      fireEvent.click(screen.getByRole('button', { name: index === 4 ? '답 숨기기' : '다음 질문' }));
    }

    expect(screen.getByRole('heading', { name: '민지의 답을 숨겼어요' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '이제 맞혀볼게요' }));

    for (let index = 0; index < 5; index += 1) {
      fireEvent.click(within(screen.getByRole('group')).getAllByRole('button')[0]);
      expect(screen.queryByText('정답이에요!')).toBeNull();
      fireEvent.click(screen.getByRole('button', { name: index === 4 ? '정답 확인하기' : '다음 문제' }));
    }

    expect(screen.getByRole('status').textContent).toBe('모든 답을 비교하고 있어요');
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1600);
    });

    expect(screen.getByRole('heading', { name: '5개 중 5개 정답' })).toBeTruthy();
    expect(screen.getAllByText('우리 예상')).toHaveLength(5);
    expect(screen.getAllByText('민지의 답')).toHaveLength(5);
    expect(screen.getByRole('button', { name: '결과 이미지 공유하기' })).toBeTruthy();
  });
});
