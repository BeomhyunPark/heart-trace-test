// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from '../src/app/App';
import { QUESTIONS } from '../src/data/questions';
import { RESULT_TYPES } from '../src/data/resultTypes';
import { RESULT_TYPE_IDS, type ResultTypeId } from '../src/domain/types';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function startQuestionFlow() {
  fireEvent.click(screen.getByRole('button', { name: '테스트 시작하기' }));
  fireEvent.click(screen.getByRole('button', { name: '검사 시작하기' }));
}

function getOptionText(questionIndex: number, resultType: ResultTypeId): string {
  const option = QUESTIONS[questionIndex].options.find(
    (candidate) => candidate.resultType === resultType,
  );

  if (!option) {
    throw new Error(`${questionIndex + 1}번 문항에서 ${resultType} 선택지를 찾지 못했습니다.`);
  }

  return option.text;
}

function answerWithResultType(questionIndex: number, resultType: ResultTypeId) {
  fireEvent.click(screen.getByRole('radio', {
    name: getOptionText(questionIndex, resultType),
  }));
}

function mockResultImageFetch() {
  vi.stubGlobal('fetch', vi.fn(async () => ({
    ok: true,
    status: 200,
    blob: async () => new Blob(['result-image'], { type: 'image/png' }),
  })));
}

async function getAccessibilityViolations(container: HTMLElement) {
  const audit = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false } },
  });

  return audit.violations;
}

describe('앱 화면 흐름과 접근성', () => {
  it('시작 화면과 질문 화면에 자동 접근성 위반이 없다', async () => {
    const { container } = render(<App />);
    expect(await getAccessibilityViolations(container)).toEqual([]);

    startQuestionFlow();
    expect(await getAccessibilityViolations(container)).toEqual([]);
  });

  it('키보드만으로 시작 화면과 안내 화면을 통과할 수 있다', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.tab();
    expect(document.activeElement?.textContent).toContain('테스트 시작하기');
    await user.keyboard('{Enter}');

    await user.tab();
    expect(document.activeElement?.textContent).toContain('검사 시작하기');
    await user.keyboard(' ');

    expect(screen.getByRole('group', { name: /Q1/ })).toBeTruthy();
    expect(screen.getAllByRole('radio')).toHaveLength(5);

    await user.tab();
    expect(document.activeElement?.getAttribute('type')).toBe('radio');
    await user.keyboard(' ');

    expect(screen.getByText('Q2')).toBeTruthy();
  });

  it('이전 문항의 선택을 표시하고 반복해서 수정한다', () => {
    render(<App />);
    startQuestionFlow();

    answerWithResultType(0, 'bear');
    expect(screen.getByText('Q2')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '이전' }));
    const originalAnswer = screen.getByRole('radio', {
      name: getOptionText(0, 'bear'),
    }) as HTMLInputElement;
    expect(originalAnswer.checked).toBe(true);

    answerWithResultType(0, 'spring');
    fireEvent.click(screen.getByRole('button', { name: '이전' }));

    const changedAnswer = screen.getByRole('radio', {
      name: getOptionText(0, 'spring'),
    }) as HTMLInputElement;
    expect(changedAnswer.checked).toBe(true);
    expect((screen.getByRole('radio', {
      name: getOptionText(0, 'bear'),
    }) as HTMLInputElement).checked).toBe(false);
  });

  it('동점일 때 동점 유형만 표시하고 선택한 결과로 이동한다', async () => {
    mockResultImageFetch();
    const { container } = render(<App />);
    startQuestionFlow();

    const balancedAnswers = RESULT_TYPE_IDS.flatMap((resultType) =>
      Array.from({ length: 4 }, () => resultType),
    );

    balancedAnswers.forEach((resultType, questionIndex) => {
      answerWithResultType(questionIndex, resultType);
    });

    const tieOptions = screen.getAllByRole('radio');
    expect(tieOptions).toHaveLength(RESULT_TYPE_IDS.length);
    expect(tieOptions.map((option) => option.getAttribute('value'))).toEqual(
      RESULT_TYPE_IDS,
    );
    expect(await getAccessibilityViolations(container)).toEqual([]);

    vi.useFakeTimers();
    fireEvent.click(screen.getByRole('radio', {
      name: RESULT_TYPES.spring.name,
    }));

    expect(screen.getByText('가장 선명한 흔적을 찾고 있어요')).toBeTruthy();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1100);
    });
    vi.useRealTimers();

    expect(screen.getByRole('heading', { name: RESULT_TYPES.spring.name })).toBeTruthy();
    expect(await getAccessibilityViolations(container)).toEqual([]);
  });

  it('완료 후 다시 하기를 누르면 모든 상태와 안내 단계를 초기화한다', async () => {
    vi.useFakeTimers();
    mockResultImageFetch();
    render(<App />);
    startQuestionFlow();

    QUESTIONS.forEach((_, questionIndex) => {
      answerWithResultType(questionIndex, 'bear');
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1100);
    });

    expect(screen.getByRole('heading', { name: RESULT_TYPES.bear.name })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '처음부터 다시 하기' }));

    expect(screen.getByRole('heading', { name: '마음속 흔적 찾기' })).toBeTruthy();
    expect(screen.queryByRole('radio')).toBeNull();
  });
});
