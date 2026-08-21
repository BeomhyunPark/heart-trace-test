export type ActivityId = 'heart-trace' | 'balance-game' | 'ideal-world-cup';

export type ActivityKind = '성격검사' | 'VS 놀이' | '토너먼트';

export type Activity = {
  id: ActivityId;
  kind: ActivityKind;
  title: string;
  description: string;
  meta: string;
  badge: string;
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
    badge: 'NEW',
    available: true,
    featured: true,
  },
  {
    id: 'balance-game',
    kind: 'VS 놀이',
    title: '극과 극 밸런스 게임',
    description: '고르기 어려울수록 더 재미있는 우리들의 선택',
    meta: '같이 하면 더 재밌어요',
    badge: 'SOON',
    available: false,
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
