import type { CandidateVisualTone, WorldCupCandidate } from '../domain/types';

const VISUAL_TONES: readonly CandidateVisualTone[] = ['gold', 'coral', 'mint', 'sky', 'violet'];

function concept(
  group: 'free-pass' | 'life-cheat',
  id: string,
  name: string,
  symbol: string,
  index: number,
): WorldCupCandidate {
  return {
    id: `${group}-${id}`,
    name,
    symbol,
    visualTone: VISUAL_TONES[index % VISUAL_TONES.length],
  };
}

const FREE_PASS_ITEMS = [
  ['flights', '항공권', '✈️'],
  ['hotels', '호텔 숙박', '🏨'],
  ['taxi', '택시', '🚕'],
  ['transit', '대중교통', '🚇'],
  ['fuel', '주유', '⛽'],
  ['tolls', '고속도로 통행료', '🛣️'],
  ['delivery', '배달비', '🛵'],
  ['dining', '외식', '🍽️'],
  ['cafe', '카페 음료', '☕'],
  ['convenience-store', '편의점', '🏪'],
  ['cinema', '영화관', '🎬'],
  ['concerts', '공연 티켓', '🎟️'],
  ['theme-parks', '놀이공원', '🎡'],
  ['gym', '헬스장', '🏋️'],
  ['hair-salon', '미용실', '💇'],
  ['laundry', '세탁', '🧺'],
  ['mobile-plan', '통신비', '📱'],
  ['internet', '인터넷', '🛜'],
  ['electricity', '전기요금', '💡'],
  ['water', '수도요금', '🚰'],
  ['rent', '월세', '🏠'],
  ['maintenance', '관리비', '🧾'],
  ['medical-care', '병원 진료', '🩺'],
  ['health-checkup', '건강검진', '💚'],
  ['online-shopping', '온라인 쇼핑', '📦'],
  ['clothes', '의류', '👕'],
  ['shoes', '신발', '👟'],
  ['electronics', '전자제품', '💻'],
  ['books', '도서', '📚'],
  ['music-streaming', '음악 스트리밍', '🎧'],
  ['video-streaming', '영상 스트리밍', '📺'],
  ['games', '게임', '🎮'],
] as const;

const LIFE_CHEAT_ITEMS = [
  ['thirty-hour-day', '하루가 30시간', '🕰️'],
  ['three-hour-sleep', '3시간만 자도 개운', '😴'],
  ['no-weight-gain', '먹어도 살 안 찌기', '🍕'],
  ['healthy-teeth', '평생 건강한 치아', '🦷'],
  ['all-languages', '모든 언어 유창하게', '🌐'],
  ['perfect-memory', '한 번 본 건 기억', '🧠'],
  ['instant-focus', '10분 만에 초집중', '🎯'],
  ['sleep-anywhere', '어디서나 바로 잠들기', '🛌'],
  ['dream-control', '원하는 꿈 꾸기', '🌙'],
  ['rewind-time', '과거 10분 되돌리기', '⏪'],
  ['see-future', '미래 10분 미리 보기', '🔮'],
  ['teleport', '하루 한 번 순간이동', '🌀'],
  ['invisibility', '투명인간 1시간', '👻'],
  ['flying', '하늘 날기 30분', '🪽'],
  ['read-minds', '마음 읽기 10초', '💭'],
  ['detect-lies', '거짓말 알아채기', '🤥'],
  ['perfect-first-impression', '첫인상 호감 100%', '✨'],
  ['easy-conversation', '누구와도 말 잘 통하기', '💬'],
  ['perfect-comeback', '완벽한 한마디 떠올리기', '💡'],
  ['remember-people', '이름과 얼굴 안 잊기', '🙋'],
  ['choose-weather', '원하는 날씨 고르기', '🌤️'],
  ['skip-lines', '평생 줄 서지 않기', '🚪'],
  ['green-lights', '신호등 항상 초록불', '🚦'],
  ['instant-parking', '주차 자리 바로 찾기', '🅿️'],
  ['find-lost-items', '잃어버린 물건 찾기', '🔎'],
  ['perfect-photos', '사진마다 인생샷', '📸'],
  ['perfect-cooking', '요리하면 무조건 성공', '👨‍🍳'],
  ['sing-one-song', '노래 한 곡 완벽하게', '🎤'],
  ['triple-workout', '운동 효과 3배', '💪'],
  ['triple-study', '공부 효율 3배', '✏️'],
  ['clone-day', '일주일에 하루 복제', '👯'],
  ['monthly-luck', '매달 행운 한 번', '🍀'],
] as const;

export const FREE_PASS_CANDIDATES = FREE_PASS_ITEMS.map(
  ([id, name, symbol], index) => concept('free-pass', id, name, symbol, index),
);

export const LIFE_CHEAT_CANDIDATES = LIFE_CHEAT_ITEMS.map(
  ([id, name, symbol], index) => concept('life-cheat', id, name, symbol, index),
);
