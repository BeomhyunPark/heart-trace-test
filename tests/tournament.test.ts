import { describe, expect, it } from 'vitest';

import {
  chooseWinner,
  createTournament,
  getCurrentMatch,
  parseWorldCupSession,
  startNextRound,
} from '../src/features/ideal-world-cup/domain/tournament';
import type { TournamentState } from '../src/features/ideal-world-cup/domain/types';

const CANDIDATE_IDS = Array.from({ length: 64 }, (_, index) => `food-${index + 1}`);

describe('최애 월드컵 토너먼트', () => {
  it.each([16, 32, 64] as const)('%d강에 필요한 수만큼 중복 없이 후보를 만든다', (size) => {
    const state = createTournament(CANDIDATE_IDS, size, () => 0.25);

    expect(state.roundCandidateIds).toHaveLength(size);
    expect(new Set(state.roundCandidateIds).size).toBe(size);
    expect(state.phase).toBe('match');
  });

  it('16강에서 15번 선택하면 한 명의 우승자를 남긴다', () => {
    let state: TournamentState = createTournament(CANDIDATE_IDS, 16, () => 0);

    while (state.phase !== 'champion') {
      if (state.phase === 'round-complete') {
        state = startNextRound(state);
        continue;
      }

      const [leftId] = getCurrentMatch(state);
      state = chooseWinner(state, leftId);
    }

    expect(state.history).toHaveLength(15);
    expect(state.championId).toBeTruthy();
    expect(state.history.at(-1)?.winnerId).toBe(state.championId);
  });

  it('현재 대결에 없는 후보는 고를 수 없다', () => {
    const state = createTournament(CANDIDATE_IDS, 16, () => 0);

    expect(() => chooseWinner(state, 'not-in-this-match')).toThrow(
      '현재 대결에 포함된 후보만 선택할 수 있습니다.',
    );
  });

  it('저장된 진행 상태가 유효할 때만 복원한다', () => {
    const current = createTournament(CANDIDATE_IDS, 16, () => 0);
    const serialized = JSON.stringify({
      version: 2,
      categoryId: 'meal',
      current,
      previous: null,
    });

    expect(parseWorldCupSession(serialized, new Set(CANDIDATE_IDS), new Set(['meal']))?.current)
      .toEqual(current);
    expect(parseWorldCupSession(serialized, new Set(['unknown']), new Set(['meal']))).toBeNull();
    expect(parseWorldCupSession('{broken', new Set(CANDIDATE_IDS), new Set(['meal']))).toBeNull();
  });
});
