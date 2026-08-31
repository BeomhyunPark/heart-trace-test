import type { KnowMeQuestion } from '../domain/types';

export const KNOW_ME_QUESTIONS: readonly KnowMeQuestion[] = [
  {
    id: 'free-day',
    prompt: '갑자기 하루가 비었다면?',
    options: ['집에서 푹 쉬기', '누군가 만나러 나가기', '그날 기분 따라 정하기'],
  },
  {
    id: 'hard-time',
    prompt: '마음이 힘들 때 가장 먼저 하는 건?',
    options: ['혼자 생각 정리하기', '믿는 사람에게 말하기', '일단 다른 일에 몰두하기'],
  },
  {
    id: 'travel-plan',
    prompt: '여행을 준비하는 방식은?',
    options: ['시간표까지 꼼꼼하게', '큰 일정만 정해두기', '도착해서 마음 가는 대로'],
  },
  {
    id: 'reply-style',
    prompt: '메시지 답장을 보내는 스타일은?',
    options: ['보자마자 바로 답장', '생각한 뒤 천천히 답장', '용건에 따라 완전히 다름'],
  },
  {
    id: 'compliment',
    prompt: '가장 듣고 싶은 칭찬은?',
    options: ['너 진짜 웃기다', '너는 참 다정하다', '너라면 믿을 수 있다'],
  },
  {
    id: 'menu',
    prompt: '메뉴를 고를 때 더 끌리는 건?',
    options: ['늘 먹던 확실한 메뉴', '처음 보는 새로운 메뉴', '누군가의 강력 추천'],
  },
  {
    id: 'gift',
    prompt: '선물로 가장 받고 싶은 건?',
    options: ['당장 쓸 수 있는 실용템', '내 취향을 저격한 물건', '마음이 담긴 편지'],
  },
  {
    id: 'appointment',
    prompt: '약속 장소에는 보통 언제 도착할까?',
    options: ['10분 이상 일찍', '거의 정각에', '아슬아슬하게'],
  },
  {
    id: 'group-role',
    prompt: '모임에서 자연스럽게 맡는 역할은?',
    options: ['분위기를 띄우는 사람', '이야기를 잘 들어주는 사람', '흐름을 정리하는 사람'],
  },
  {
    id: 'recharge',
    prompt: '에너지를 회복하는 데 가장 필요한 건?',
    options: ['충분한 잠', '맛있는 음식', '좋아하는 사람과의 시간'],
  },
  {
    id: 'worry',
    prompt: '고민이 생기면 언제 이야기할까?',
    options: ['생기자마자 바로', '어느 정도 정리한 다음', '해결될 때까지 거의 안 함'],
  },
  {
    id: 'faith-rest',
    prompt: '마음이 지쳤을 때 가장 힘이 되는 시간은?',
    options: ['찬양을 오래 듣는 시간', '말씀을 천천히 읽는 시간', '조용히 기도하는 시간'],
  },
] as const;
