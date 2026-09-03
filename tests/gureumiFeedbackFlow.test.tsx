// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { GureumiQuestion, GureumiResult } from '../src/features/gureumi/domain/types';
import { GureumiFeedbackFlow } from '../src/features/gureumi/screens/GureumiFeedbackFlow';

const questions: GureumiQuestion[] = Array.from({ length: 27 }, (_, index) => ({
  questionId: `question-${index + 1}`,
  order: index + 1,
  prompt: index === 0 ? '모처럼 시간이 비었다면' : `${index + 1}번 상황 문구`,
  optionA: 'A 선택',
  optionB: 'B 선택',
}));

const result: GureumiResult = {
  attemptId: 'attempt-1',
  version: 'GUREUMI_BETA_V01',
  resultType: 'ARONG',
  characterKey: 'arong',
  displayName: '아롱이',
  axes: [
    { key: 'NOVELTY', label: '새로움', level: 'HIGH' },
    { key: 'WORRY', label: '걱정', level: 'LOW' },
    { key: 'RELATION', label: '관계', level: 'HIGH' },
  ],
};

afterEach(cleanup);

describe('구르미 Beta 피드백 흐름', () => {
  it('Figma 흐름대로 빠른 피드백, 비교 선택, 후속 설문을 제출한다', async () => {
    const user = userEvent.setup();
    const onSaveQuick = vi.fn().mockResolvedValue(undefined);
    const onSaveFollowUp = vi.fn().mockResolvedValue(undefined);

    render(
      <GureumiFeedbackFlow
        result={result}
        questions={questions}
        onSaveQuick={onSaveQuick}
        onSaveFollowUp={onSaveFollowUp}
        onBackResult={vi.fn()}
        onRetest={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('radio', { name: /^매우$/ }).closest('label')!);
    await user.click(screen.getByRole('button', { name: '문항 내용 보며 선택하기' }));
    await user.click(screen.getByText('모처럼 시간이 비었다면').closest('label')!);
    await user.click(screen.getByRole('button', { name: '선택 완료 · 1개' }));
    await user.click(screen.getByRole('button', { name: '8개 결과 특징 비교하고 선택하기' }));
    await user.click(screen.getByText('달몽이').closest('button')!);
    await user.click(screen.getByRole('button', { name: '이 구르미 선택하고 돌아가기 · 달몽이' }));
    await user.click(screen.getByRole('button', { name: '피드백 보내기' }));

    expect(onSaveQuick).toHaveBeenCalledWith({
      rating: 4,
      confusingQuestionOrders: [1],
      selfSelectedResultType: 'DALMONG',
    });
    expect(await screen.findByText('피드백 고마워요!')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: '자세한 설문 참여하기' }));
    await user.click(screen.getAllByRole('radio', { name: /^4$/ })[0]);
    await user.click(screen.getByText('강점').closest('label')!);
    await user.click(screen.getByText('없었음').closest('label')!);
    await user.type(screen.getByRole('textbox'), '화면이 편했어요.');
    await user.click(screen.getByRole('button', { name: '후속 설문 제출하기' }));

    expect(onSaveFollowUp).toHaveBeenCalledWith(expect.objectContaining({
      flowRating: 4,
      helpfulSections: ['강점'],
      errorAreas: ['없었음'],
      comment: '화면이 편했어요.',
    }));
    expect(await screen.findByText('자세한 이야기 고마워요!')).toBeTruthy();
  });
});
