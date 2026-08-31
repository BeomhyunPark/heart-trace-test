export type RandomSource = () => number;

export type LadderRung = {
  row: number;
  leftColumn: number;
};

export type Ladder = {
  columnCount: number;
  rowCount: number;
  rungs: LadderRung[];
};

export type PrayerSupportAssignment<T> = {
  supporter: T;
  recipient: T;
};

export type LadderTrace = {
  destination: number;
  columnsByRow: number[];
};

function secureRandom(): number {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const value = new Uint32Array(1);
    crypto.getRandomValues(value);
    return value[0] / 0x1_0000_0000;
  }

  return Math.random();
}

export function shuffle<T>(items: readonly T[], random: RandomSource = secureRandom): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[targetIndex]] = [shuffled[targetIndex], shuffled[index]];
  }

  return shuffled;
}

export function splitIntoGroups<T>(
  items: readonly T[],
  groupCount: number,
  random: RandomSource = secureRandom,
): T[][] {
  if (groupCount < 2 || groupCount > items.length) {
    throw new Error('조 개수는 2개 이상, 참여자 수 이하여야 합니다.');
  }

  const groups = Array.from({ length: groupCount }, () => [] as T[]);
  shuffle(items, random).forEach((item, index) => {
    groups[index % groupCount].push(item);
  });

  return groups;
}

export function splitIntoPairs<T>(
  items: readonly T[],
  random: RandomSource = secureRandom,
): T[][] {
  if (items.length < 2) {
    throw new Error('원투원은 두 명 이상이어야 합니다.');
  }

  const remaining = shuffle(items, random);
  const pairs: T[][] = [];

  while (remaining.length > 0) {
    const size = remaining.length === 3 ? 3 : 2;
    pairs.push(remaining.splice(0, size));
  }

  return pairs;
}

export function createPrayerSupportAssignments<T>(
  items: readonly T[],
  random: RandomSource = secureRandom,
): PrayerSupportAssignment<T>[] {
  if (items.length < 2) {
    throw new Error('기도 후원은 두 명 이상이어야 합니다.');
  }

  // Sattolo 순환은 자기 자신에게 배정되는 경우가 없는 하나의 순열을 만든다.
  const recipients = [...items];
  for (let index = recipients.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(random() * index);
    [recipients[index], recipients[targetIndex]] = [recipients[targetIndex], recipients[index]];
  }

  return items.map((supporter, index) => ({ supporter, recipient: recipients[index] }));
}

export function createLadder(
  columnCount: number,
  random: RandomSource = secureRandom,
): Ladder {
  if (columnCount < 2) {
    throw new Error('사다리는 두 명 이상이어야 합니다.');
  }

  const rowCount = Math.max(9, Math.min(18, columnCount + 6));
  const rungs: LadderRung[] = [];

  for (let row = 0; row < rowCount; row += 1) {
    const firstColumn = row % 2;

    for (let leftColumn = firstColumn; leftColumn < columnCount - 1; leftColumn += 2) {
      if (random() < 0.58) {
        rungs.push({ row, leftColumn });
      }
    }
  }

  // 모든 세로선 사이를 적어도 한 번은 잇는다. 같은 행의 가로선은
  // 하나의 세로선을 공유하지 않도록 열의 짝/홀에 맞는 행을 고른다.
  for (let leftColumn = 0; leftColumn < columnCount - 1; leftColumn += 1) {
    if (!rungs.some((rung) => rung.leftColumn === leftColumn)) {
      const middleRow = Math.floor(rowCount / 2);
      const matchingRow = middleRow % 2 === leftColumn % 2
        ? middleRow
        : Math.min(rowCount - 1, middleRow + 1);
      rungs.push({ row: matchingRow, leftColumn });
    }
  }

  rungs.sort((left, right) => left.row - right.row || left.leftColumn - right.leftColumn);

  return { columnCount, rowCount, rungs };
}

export function traceLadder(ladder: Ladder, startColumn: number): LadderTrace {
  if (startColumn < 0 || startColumn >= ladder.columnCount) {
    throw new Error('사다리 출발점이 올바르지 않습니다.');
  }

  const rungsByRow = new Map<number, Set<number>>();

  for (const rung of ladder.rungs) {
    const rowRungs = rungsByRow.get(rung.row) ?? new Set<number>();
    rowRungs.add(rung.leftColumn);
    rungsByRow.set(rung.row, rowRungs);
  }

  let column = startColumn;
  const columnsByRow: number[] = [];

  for (let row = 0; row < ladder.rowCount; row += 1) {
    const rowRungs = rungsByRow.get(row);

    if (rowRungs?.has(column)) {
      column += 1;
    } else if (rowRungs?.has(column - 1)) {
      column -= 1;
    }

    columnsByRow.push(column);
  }

  return { destination: column, columnsByRow };
}

export function resolveLadder(ladder: Ladder): number[] {
  return Array.from(
    { length: ladder.columnCount },
    (_, startColumn) => traceLadder(ladder, startColumn).destination,
  );
}
