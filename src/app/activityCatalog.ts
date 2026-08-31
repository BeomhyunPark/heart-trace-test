export type ActivityId = 'heart-trace' | 'balance-game' | 'ideal-world-cup';

export type ActivityKind = '성격검사' | 'VS 놀이' | '토너먼트';

export type Activity = {
  id: ActivityId;
  kind: ActivityKind;
  title: string;
  description: string;
  meta: string;
  badge?: string;
  available: boolean;
  featured?: boolean;
};

export const ACTIVITIES: readonly Activity[] = [
  {
    id: 'heart-trace',
    kind: '성격검사',
    title: '마음속 흔적 찾기',
    description: '내 마음과 가장 닮은 흔적이는 누구일까요?',
    meta: '약 4분 · 20문항 · 5가지 결과',
    available: true,
  },
  {
    id: 'balance-game',
    kind: 'VS 놀이',
    title: '극과 극 밸런스 게임',
    description: '어려운 선택일수록 더 재미있는 우리 이야기',
    meta: '가볍게 · 직접 선택 · 8문항',
    badge: 'NEW',
    available: true,
    featured: true,
  },
  {
    id: 'ideal-world-cup',
    kind: '토너먼트',
    title: '우리끼리 최애 월드컵',
    description: '하나만 남을 때까지 이어지는 취향 토너먼트',
    meta: '주제를 골라 대결해요',
    badge: 'SOON',
    available: false,
  },
] as const;
