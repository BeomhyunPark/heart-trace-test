import { describe, expect, it } from 'vitest';

import {
  createLadder,
  createPrayerSupportAssignments,
  resolveLadder,
  shuffle,
  splitIntoGroups,
  splitIntoPairs,
  traceLadder,
} from '../src/features/group-picker/domain/draw';

describe('모임 뽑기', () => {
  it('원본을 바꾸지 않고 참여자를 섞는다', () => {
    const names = ['민지', '현우', '수빈'];
    const shuffled = shuffle(names, () => 0);

    expect(names).toEqual(['민지', '현우', '수빈']);
    expect(shuffled).toEqual(['현우', '수빈', '민지']);
  });

  it('사다리의 모든 출발점은 서로 다른 도착점에 연결된다', () => {
    let step = 0;
    const values = [0.2, 0.8, 0.3, 0.9, 0.1, 0.7];
    const ladder = createLadder(6, () => values[step++ % values.length]);
    const destinations = resolveLadder(ladder);

    expect(destinations).toHaveLength(6);
    expect(new Set(destinations).size).toBe(6);
    expect(destinations.every((destination) => destination >= 0 && destination < 6)).toBe(true);
  });

  it('모든 세로선 사이에 가로선이 있고 경로가 매 행 이어진다', () => {
    const ladder = createLadder(32, () => 0.99);

    for (let leftColumn = 0; leftColumn < 31; leftColumn += 1) {
      expect(ladder.rungs.some((rung) => rung.leftColumn === leftColumn)).toBe(true);
    }

    for (let startColumn = 0; startColumn < 32; startColumn += 1) {
      const trace = traceLadder(ladder, startColumn);
      expect(trace.columnsByRow).toHaveLength(ladder.rowCount);
      expect(trace.destination).toBeGreaterThanOrEqual(0);
      expect(trace.destination).toBeLessThan(32);
    }
  });

  it('같은 행의 가로선은 서로 맞닿지 않는다', () => {
    const ladder = createLadder(18, () => 0);

    for (let row = 0; row < ladder.rowCount; row += 1) {
      const columns = ladder.rungs
        .filter((rung) => rung.row === row)
        .map((rung) => rung.leftColumn)
        .sort((left, right) => left - right);

      for (let index = 1; index < columns.length; index += 1) {
        expect(columns[index] - columns[index - 1]).toBeGreaterThan(1);
      }
    }
  });

  it('한 명으로는 사다리를 만들지 않는다', () => {
    expect(() => createLadder(1)).toThrow('두 명 이상');
  });

  it('조별 인원 차이가 한 명을 넘지 않게 모든 사람을 배정한다', () => {
    const names = Array.from({ length: 23 }, (_, index) => `사람${index + 1}`);
    const groups = splitIntoGroups(names, 6, () => 0.37);
    const sizes = groups.map((group) => group.length);

    expect(groups).toHaveLength(6);
    expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThanOrEqual(1);
    expect(new Set(groups.flat())).toEqual(new Set(names));
  });

  it('원투원은 혼자 남는 사람 없이 두 명씩, 홀수면 한 팀만 세 명으로 묶는다', () => {
    const names = ['민지', '현우', '수빈', '하늘', '은성', '유민', '지수'];
    const pairs = splitIntoPairs(names, () => 0.42);

    expect(pairs.map((pair) => pair.length).sort()).toEqual([2, 2, 3]);
    expect(new Set(pairs.flat())).toEqual(new Set(names));
  });

  it('기도 후원은 모두가 한 명만 후원하고 한 명에게만 후원받는다', () => {
    const names = Array.from({ length: 32 }, (_, index) => `사람${index + 1}`);
    const assignments = createPrayerSupportAssignments(names, () => 0.34);

    expect(assignments).toHaveLength(32);
    expect(new Set(assignments.map(({ supporter }) => supporter))).toEqual(new Set(names));
    expect(new Set(assignments.map(({ recipient }) => recipient))).toEqual(new Set(names));
    expect(assignments.every(({ supporter, recipient }) => supporter !== recipient)).toBe(true);
  });
});
