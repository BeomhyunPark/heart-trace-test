type ShareActivityId =
  | 'heart-trace'
  | 'balance-game'
  | 'ideal-world-cup'
  | 'group-picker'
  | 'anonymous-sharing';

type SharePickerMode =
  | 'prayer'
  | 'sharing'
  | 'lottery'
  | 'ladder'
  | 'groups'
  | 'pairs'
  | 'supporter';

export type ShareActivityTarget = {
  id: ShareActivityId;
  initialGroupPickerMode?: SharePickerMode;
};

export type ShareTarget = {
  slug: string;
  target: ShareActivityTarget;
  label: string;
  title: string;
  description: string;
  eyebrow: string;
  symbol: string;
  accent: string;
  secondary: string;
};

const PLAY_SHARE_TARGETS: readonly ShareTarget[] = [
  {
    slug: 'heart-trace',
    target: { id: 'heart-trace' },
    label: '마음속 흔적 찾기',
    title: '마음속 흔적 찾기 | 온기',
    description: '내 마음과 가장 닮은 흔적이는 누구일까요?',
    eyebrow: '온기 · 성격검사',
    symbol: '✦',
    accent: '#f48faa',
    secondary: '#ffc98f',
  },
  {
    slug: 'balance-game',
    target: { id: 'balance-game' },
    label: '극과 극 밸런스 게임',
    title: '극과 극 밸런스 게임 | 온기',
    description: '정답보다 서로의 이유가 더 재미있는 시간이에요.',
    eyebrow: '온기 · VS 놀이',
    symbol: 'VS',
    accent: '#ff8c68',
    secondary: '#55ddf2',
  },
  {
    slug: 'ideal-world-cup',
    target: { id: 'ideal-world-cup' },
    label: '최애 월드컵',
    title: '최애 월드컵 | 온기',
    description: '하나만 남을 때까지 이어지는 취향 토너먼트.',
    eyebrow: '온기 · 토너먼트',
    symbol: '★',
    accent: '#ffd36e',
    secondary: '#86d9f2',
  },
];

const TOOL_SHARE_TARGETS: readonly ShareTarget[] = [
  {
    slug: 'tool-ladder',
    target: { id: 'group-picker', initialGroupPickerMode: 'ladder' },
    label: '사다리 타기',
    title: '사다리 타기 | 온기',
    description: '이름과 결과를 넣고 함께 사다리를 타보세요.',
    eyebrow: '온기 · 모임 도구',
    symbol: '↘',
    accent: '#78e2c6',
    secondary: '#85a8ed',
  },
  {
    slug: 'tool-lottery',
    target: { id: 'group-picker', initialGroupPickerMode: 'lottery' },
    label: '제비뽑기',
    title: '제비뽑기 | 온기',
    description: '공평하고 간단하게 오늘의 주인공을 뽑아보세요.',
    eyebrow: '온기 · 모임 도구',
    symbol: '✓',
    accent: '#80e0c2',
    secondary: '#f7d687',
  },
  {
    slug: 'tool-prayer',
    target: { id: 'group-picker', initialGroupPickerMode: 'prayer' },
    label: '기도할 사람 정하기',
    title: '기도할 사람 정하기 | 온기',
    description: '함께 기도할 한 사람을 따뜻하게 정해보세요.',
    eyebrow: '온기 · 모임 도구',
    symbol: '✦',
    accent: '#baf5e6',
    secondary: '#b4a0ff',
  },
  {
    slug: 'tool-sharing',
    target: { id: 'group-picker', initialGroupPickerMode: 'sharing' },
    label: '나눔 순서 정하기',
    title: '나눔 순서 정하기 | 온기',
    description: '누가 먼저 시작할지 부담 없이 순서를 정해보세요.',
    eyebrow: '온기 · 모임 도구',
    symbol: '1',
    accent: '#78e2c6',
    secondary: '#f48faa',
  },
  {
    slug: 'tool-groups',
    target: { id: 'group-picker', initialGroupPickerMode: 'groups' },
    label: '나눔 조 편성하기',
    title: '나눔 조 편성하기 | 온기',
    description: '함께할 사람들을 고르게 섞어 나눔 조를 만들어요.',
    eyebrow: '온기 · 모임 도구',
    symbol: '#',
    accent: '#85a8ed',
    secondary: '#78e2c6',
  },
  {
    slug: 'tool-pairs',
    target: { id: 'group-picker', initialGroupPickerMode: 'pairs' },
    label: '원투원 짝 정하기',
    title: '원투원 짝 정하기 | 온기',
    description: '서로 함께할 원투원 짝을 공평하게 정해보세요.',
    eyebrow: '온기 · 모임 도구',
    symbol: '1:1',
    accent: '#c8adff',
    secondary: '#78e2c6',
  },
  {
    slug: 'tool-supporter',
    target: { id: 'group-picker', initialGroupPickerMode: 'supporter' },
    label: '기도 후원자 정하기',
    title: '기도 후원자 정하기 | 온기',
    description: '이번 주 서로를 위해 기도할 후원자를 연결해요.',
    eyebrow: '온기 · 모임 도구',
    symbol: '♡',
    accent: '#f48faa',
    secondary: '#78e2c6',
  },
];

export const SHARE_TARGETS: readonly ShareTarget[] = [
  ...PLAY_SHARE_TARGETS,
  ...TOOL_SHARE_TARGETS,
];

function matchesTarget(
  candidate: ShareActivityTarget,
  target: ShareActivityTarget,
): boolean {
  return candidate.id === target.id
    && candidate.initialGroupPickerMode === target.initialGroupPickerMode;
}

export function getShareTarget(target: ShareActivityTarget): ShareTarget | null {
  return SHARE_TARGETS.find((candidate) => matchesTarget(candidate.target, target)) ?? null;
}

export function getActivityDestination(target: ShareActivityTarget): string {
  if (target.id === 'group-picker' && target.initialGroupPickerMode) {
    return `?tool=${target.initialGroupPickerMode}`;
  }

  return `?activity=${target.id}`;
}
