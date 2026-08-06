// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from '../src/app/App';
import { RESULT_REVEAL_DELAY_MS } from '../src/app/timing';
import { QUESTIONS } from '../src/data/questions';
import { RESULT_TYPES } from '../src/data/resultTypes';
import {
  RESULT_TYPE_IDS,
  type ChoiceId,
  type ResultTypeId,
} from '../src/domain/types';
import { LoadingScreen } from '../src/screens/LoadingScreen';

afterEach(() => {
  cleanup();
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function startQuestionFlow() {
  fireEvent.click(screen.getByRole('button', { name: '테스트 시작하기' }));
  fireEvent.click(screen.getByRole('button', { name: '알겠어요' }));
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

function getOptionTextById(questionIndex: number, optionId: ChoiceId): string {
  const option = QUESTIONS[questionIndex].options.find(
    (candidate) => candidate.id === optionId,
  );

  if (!option) {
    throw new Error(`${questionIndex + 1}번 문항에서 ${optionId} 선택지를 찾지 못했습니다.`);
  }

  return option.text;
}

function answerWithOptionId(questionIndex: number, optionId: ChoiceId) {
  fireEvent.click(screen.getByRole('radio', {
    name: getOptionTextById(questionIndex, optionId),
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
  it('결과 로딩 진행률과 분석 단계가 시간에 따라 실제로 바뀐다', async () => {
    vi.useFakeTimers();
    const { container } = render(<LoadingScreen />);
    const progressBar = screen.getByRole('progressbar', { name: '결과 분석 진행률' });
    const progressValue = container.querySelector<HTMLElement>('.progress-bar__value');
    const soulOrb = container.querySelector('.soul-orb');

    expect(progressBar.getAttribute('aria-valuenow')).toBe('0');
    expect(soulOrb?.getAttribute('data-stage')).toBe('1');
    expect(soulOrb?.querySelectorAll('.soul-orb__stage')).toHaveLength(8);
    expect(soulOrb?.querySelector('.soul-orb__core')).toBeTruthy();
    expect(screen.getByRole('heading', { name: '마음의 대답을 모으고 있어요' })).toBeTruthy();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(32);
    });

    const earlyProgress = Number.parseFloat(progressValue?.style.width ?? '0');
    expect(earlyProgress).toBeGreaterThan(0);
    expect(earlyProgress).toBeLessThan(2);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1568);
    });

    expect(progressBar.getAttribute('aria-valuenow')).toBe('40');
    expect(soulOrb?.getAttribute('data-stage')).toBe('2');
    expect(screen.getByRole('heading', { name: '흔적의 결을 비교하고 있어요' })).toBeTruthy();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2400);
    });

    expect(progressBar.getAttribute('aria-valuenow')).toBe('100');
    expect(soulOrb?.getAttribute('data-stage')).toBe('8');
    expect(screen.getByRole('heading', { name: '당신의 흔적을 찾았어요' })).toBeTruthy();
  });

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
    expect(document.activeElement?.textContent).toContain('알겠어요');
    await user.keyboard(' ');

    expect(screen.getByRole('group', { name: /Q1/ })).toBeTruthy();
    expect(screen.getAllByRole('radio')).toHaveLength(5);

    await user.tab();
    expect(document.activeElement?.getAttribute('type')).toBe('radio');
    await user.keyboard(' ');

    expect(screen.getByText('Q2')).toBeTruthy();
  });

  it('화면과 문항을 이동할 때 이전 스크롤 위치를 남기지 않는다', () => {
    render(<App />);

    document.documentElement.scrollTop = 320;
    document.body.scrollTop = 320;
    fireEvent.click(screen.getByRole('button', { name: '테스트 시작하기' }));
    expect(document.documentElement.scrollTop).toBe(0);
    expect(document.body.scrollTop).toBe(0);

    document.documentElement.scrollTop = 320;
    document.body.scrollTop = 320;
    fireEvent.click(screen.getByRole('button', { name: '알겠어요' }));
    expect(document.documentElement.scrollTop).toBe(0);
    expect(document.body.scrollTop).toBe(0);

    document.documentElement.scrollTop = 320;
    document.body.scrollTop = 320;
    answerWithOptionId(0, 'A');
    expect(screen.getByText('Q2')).toBeTruthy();
    expect(document.documentElement.scrollTop).toBe(0);
    expect(document.body.scrollTop).toBe(0);

    document.documentElement.scrollTop = 320;
    document.body.scrollTop = 320;
    fireEvent.click(screen.getByRole('button', { name: '이전' }));
    expect(screen.getByText('Q1')).toBeTruthy();
    expect(document.documentElement.scrollTop).toBe(0);
    expect(document.body.scrollTop).toBe(0);
  });

  it('문항별 선택을 독립적으로 복원하고 기존 답변을 하나의 새 선택으로 교체한다', () => {
    render(<App />);
    startQuestionFlow();

    answerWithOptionId(0, 'A');
    expect(screen.getByText('Q2')).toBeTruthy();
    expect(
      screen.getAllByRole('radio').every((radio) => !(radio as HTMLInputElement).checked),
    ).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: '이전' }));
    const originalAnswer = screen.getByRole('radio', {
      name: getOptionTextById(0, 'A'),
    }) as HTMLInputElement;
    expect(originalAnswer.checked).toBe(true);

    answerWithOptionId(0, 'E');
    expect(screen.getByText('Q2')).toBeTruthy();
    expect(
      screen.getAllByRole('radio').every((radio) => !(radio as HTMLInputElement).checked),
    ).toBe(true);

    answerWithOptionId(1, 'B');
    expect(screen.getByText('Q3')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '이전' }));
    expect((screen.getByRole('radio', {
      name: getOptionTextById(1, 'B'),
    }) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: '이전' }));

    const changedAnswer = screen.getByRole('radio', {
      name: getOptionTextById(0, 'E'),
    }) as HTMLInputElement;
    expect(changedAnswer.checked).toBe(true);
    expect((screen.getByRole('radio', {
      name: getOptionTextById(0, 'A'),
    }) as HTMLInputElement).checked).toBe(false);

    fireEvent.click(changedAnswer);
    expect(screen.getByText('Q2')).toBeTruthy();
    expect((screen.getByRole('radio', {
      name: getOptionTextById(1, 'B'),
    }) as HTMLInputElement).checked).toBe(true);

    answerWithOptionId(1, 'B');
    fireEvent.click(screen.getByRole('button', { name: '이전' }));
    fireEvent.click(screen.getByRole('button', { name: '이전' }));

    expect((screen.getByRole('radio', {
      name: getOptionTextById(0, 'E'),
    }) as HTMLInputElement).checked).toBe(true);
  });

  it('패스 상태와 사용량을 복원하고 세 개 사용 후 추가 패스를 차단한다', () => {
    render(<App />);
    startQuestionFlow();

    expect(screen.getByText('건너뛰기 0 / 3')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', {
      name: '딱 맞는 답이 없어요 · 건너뛰기',
    }));

    expect(screen.getByText('Q2')).toBeTruthy();
    expect(screen.getByText('건너뛰기 1 / 3')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '이전' }));
    const skippedButton = screen.getByRole('button', {
      name: '건너뛴 문항이에요 · 다음으로',
    });
    expect(skippedButton.getAttribute('aria-pressed')).toBe('true');
    expect(
      screen.getAllByRole('radio').every((radio) => !(radio as HTMLInputElement).checked),
    ).toBe(true);

    answerWithOptionId(0, 'A');
    expect(screen.getByText('건너뛰기 0 / 3')).toBeTruthy();

    for (const questionNumber of [3, 4, 5]) {
      fireEvent.click(screen.getByRole('button', {
        name: '딱 맞는 답이 없어요 · 건너뛰기',
      }));
      expect(screen.getByText(`Q${questionNumber}`)).toBeTruthy();
    }

    expect(screen.getByText('건너뛰기 3 / 3')).toBeTruthy();
    expect(screen.getByText(
      '정확한 결과를 위해 이번 문항은 가장 가까운 답을 선택해 주세요.',
    )).toBeTruthy();

    const blockedButton = screen.getByRole('button', {
      name: '딱 맞는 답이 없어요 · 건너뛰기',
    }) as HTMLButtonElement;
    expect(blockedButton.disabled).toBe(true);
    fireEvent.click(blockedButton);
    expect(screen.getByText('Q5')).toBeTruthy();
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

    expect(screen.getByRole('heading', { name: /가장 선명한 흔적을.*찾고 있어요/ })).toBeTruthy();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(RESULT_REVEAL_DELAY_MS);
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
      await vi.advanceTimersByTimeAsync(RESULT_REVEAL_DELAY_MS);
    });

    expect(screen.getByRole('heading', { name: RESULT_TYPES.bear.name })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '처음부터 다시 하기' }));

    expect(screen.getByRole('heading', { name: /흔적을 대하는 자세는/ })).toBeTruthy();
    expect(screen.queryByRole('radio')).toBeNull();
  });

  it('결과 이미지가 느려도 결과를 먼저 보여주고 준비 후 저장을 활성화한다', async () => {
    vi.useFakeTimers();

    let finishImageRequest: ((response: {
      ok: boolean;
      status: number;
      blob: () => Promise<Blob>;
    }) => void) | undefined;

    vi.stubGlobal('fetch', vi.fn(() => new Promise((resolve) => {
      finishImageRequest = resolve;
    })));

    render(<App />);
    startQuestionFlow();

    QUESTIONS.forEach((_, questionIndex) => {
      answerWithResultType(questionIndex, 'express');
    });

    expect(screen.getByRole('heading', { name: /가장 선명한 흔적을.*찾고 있어요/ })).toBeTruthy();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(RESULT_REVEAL_DELAY_MS);
    });

    expect(screen.getByRole('heading', { name: RESULT_TYPES.express.name })).toBeTruthy();
    const preparingButton = screen.getByRole('button', { name: '이미지 준비 중…' });
    expect((preparingButton as HTMLButtonElement).disabled).toBe(true);

    await act(async () => {
      finishImageRequest?.({
        ok: true,
        status: 200,
        blob: async () => new Blob(['slow-result-image'], { type: 'image/png' }),
      });
      await Promise.resolve();
    });

    const readyButton = screen.getByRole('button', { name: '결과 이미지 저장하기' });
    expect((readyButton as HTMLButtonElement).disabled).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
