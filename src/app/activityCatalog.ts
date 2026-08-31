export type ActivityId = 'heart-trace' | 'balance-game' | 'ideal-world-cup' | 'group-picker';

export type ActivityKind = '성격검사' | 'VS 놀이' | '토너먼트' | '모임 도구';

export type Activity = {
  id: ActivityId;
  kind: ActivityKind;
  title: string;
  description: string;
  meta: string;
  badge?: string;
  available: boolean;
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
  },
  {
    id: 'ideal-world-cup',
    kind: '토너먼트',
    title: '최애 월드컵',
    description: '하나만 남을 때까지 이어지는 취향 토너먼트',
    meta: '한 끼 · 디저트 · 야식 · 32강',
    badge: 'NEW',
    available: true,
  },
  {
    id: 'group-picker',
    kind: '모임 도구',
    title: '오늘은 누구?',
    description: '사다리부터 기도와 나눔 순서까지 한 번에',
    meta: '사다리 · 제비 · 기도 · 나눔 · 조 편성 · 원투원 · 기도 후원',
    badge: 'NEW',
    available: true,
  },
] as const;
