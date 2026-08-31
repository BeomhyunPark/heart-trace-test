import type { BalanceGameQuestion } from '../domain/types';

export const BALANCE_GAME_QUESTIONS = [
  { id: 'daily-01', weight: 'light', category: 'daily', prompt: '내 생활 방식에 더 가까운 쪽은?', left: '맥시멀리스트', right: '미니멀리스트' },
  { id: 'daily-04', weight: 'light', category: 'daily', prompt: '메시지를 받았을 때 나는?', left: '칼답', right: '느긋답' },
  { id: 'daily-07', weight: 'light', category: 'daily', prompt: '내 방과 마음의 평화는?', left: '조금 어질러져도 행복', right: '정리돼야 마음 안정' },
  { id: 'daily-08', weight: 'light', category: 'daily', prompt: '새로운 일을 시작한다면?', left: '완벽하게 준비하기', right: '일단 시작하기' },
  { id: 'faith-11', weight: 'light', category: 'faith', prompt: '조금 더 집중되는 예배는?', left: '찬양이 긴 예배', right: '말씀이 긴 예배' },
  { id: 'faith-12', weight: 'light', category: 'faith', prompt: '기도 응답을 경험한다면?', left: '빨리 체감하기', right: '시간이 지나고 깨닫기' },
  { id: 'faith-14', weight: 'light', category: 'faith', prompt: '둘 중 하나만 가능하다면?', left: '예배 2시간 전 도착', right: '예배 20분 늦기' },
  { id: 'faith-19', weight: 'light', category: 'faith', prompt: '성경 통독을 시작한다면?', left: '창세기부터 순서대로', right: '읽고 싶은 곳부터' },
] as const satisfies readonly BalanceGameQuestion[];

export const CURATED_LIGHT_QUESTION_IDS = [
  'daily-04',
  'daily-01',
  'daily-07',
  'faith-11',
  'faith-12',
] as const;
