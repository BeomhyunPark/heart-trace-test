// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { GureumiResult, GureumiResultType, TraitLevel } from '../src/features/gureumi/domain/types';
import { GureumiResultScreen } from '../src/features/gureumi/screens/GureumiResultScreen';

type ResultCase = {
  resultType: GureumiResultType;
  characterKey: string;
  displayName: string;
  levels: [TraitLevel, TraitLevel, TraitLevel];
};

const RESULT_CASES: ResultCase[] = [
  { resultType: 'ARONG', characterKey: 'arong', displayName: '아롱이', levels: ['HIGH', 'LOW', 'HIGH'] },
  { resultType: 'DALMONG', characterKey: 'dalmong', displayName: '달몽이', levels: ['LOW', 'LOW', 'LOW'] },
  { resultType: 'HOOWOO', characterKey: 'hoowoo', displayName: '후우', levels: ['LOW', 'HIGH', 'LOW'] },
  { resultType: 'SUNNY', characterKey: 'sunny', displayName: '쨍이', levels: ['HIGH', 'LOW', 'LOW'] },
  { resultType: 'CHOKCHOK', characterKey: 'chokchok', displayName: '촉촉이', levels: ['HIGH', 'HIGH', 'HIGH'] },
  { resultType: 'MONGSIL', characterKey: 'mongsil', displayName: '몽실이', levels: ['LOW', 'LOW', 'HIGH'] },
  { resultType: 'ELECTRIC', characterKey: 'electric', displayName: '찌릿이', levels: ['HIGH', 'HIGH', 'LOW'] },
  { resultType: 'POGEUN', characterKey: 'pogeun', displayName: '포근이', levels: ['LOW', 'HIGH', 'HIGH'] },
];

const AXES = [
  { key: 'NOVELTY', label: '새로움' },
  { key: 'WORRY', label: '걱정' },
  { key: 'RELATION', label: '관계' },
] as const;

afterEach(cleanup);

describe('구르미 결과 축 게이지', () => {
  it.each(RESULT_CASES)('$displayName의 세 축 HIGH/LOW를 문구와 게이지 길이에 반영한다', (resultCase) => {
    const result: GureumiResult = {
      attemptId: '30000000-0000-4000-8000-000000000001',
      version: 'GUREUMI_BETA_V01',
      resultType: resultCase.resultType,
      characterKey: resultCase.characterKey,
      displayName: resultCase.displayName,
      axes: AXES.map((axis, index) => ({ ...axis, level: resultCase.levels[index] })),
    };

    const { container } = render(
      <GureumiResultScreen
        result={result}
        restarting={false}
        restartError=""
        onFeedback={vi.fn(async () => undefined)}
        onRestart={vi.fn()}
        onBackHome={vi.fn()}
      />,
    );

    for (const [index, axis] of AXES.entries()) {
      const row = screen.getByText(axis.label).closest('div');
      const expectedLevel = resultCase.levels[index];

      expect(row).not.toBeNull();
      expect(within(row!).getByText(expectedLevel === 'HIGH' ? '높음' : '낮음')).toBeTruthy();
      expect(row?.querySelector<HTMLElement>('i > b')?.style.width)
        .toBe(expectedLevel === 'HIGH' ? '88%' : '34%');
    }

    expect(container.querySelectorAll('.gureumi-result__axes > div')).toHaveLength(3);
  });
});
