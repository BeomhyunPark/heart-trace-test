import {
  TOURNAMENT_SIZES,
  type TournamentSize,
  type TournamentState,
  type WorldCupSession,
} from './types';

export function shuffleCandidateIds(
  candidateIds: readonly string[],
  random: () => number = Math.random,
): string[] {
  const shuffled = [...candidateIds];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.min(index, Math.floor(random() * (index + 1)));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

export function createTournament(
  candidateIds: readonly string[],
  tournamentSize: TournamentSize,
  random: () => number = Math.random,
): TournamentState {
  if (candidateIds.length < tournamentSize) {
    throw new Error(`${tournamentSize}강을 시작하려면 후보가 ${tournamentSize}개 필요합니다.`);
  }

  return {
    tournamentSize,
    phase: 'match',
    roundCandidateIds: shuffleCandidateIds(candidateIds, random).slice(0, tournamentSize),
    matchIndex: 0,
    winners: [],
    history: [],
    championId: null,
  };
}

export function getCurrentMatch(state: TournamentState): readonly [string, string] {
  if (state.phase !== 'match') {
    throw new Error('대결 중일 때만 현재 후보를 확인할 수 있습니다.');
  }

  const leftId = state.roundCandidateIds[state.matchIndex * 2];
  const rightId = state.roundCandidateIds[state.matchIndex * 2 + 1];

  if (!leftId || !rightId) {
    throw new Error('현재 대결 후보를 찾을 수 없습니다.');
  }

  return [leftId, rightId];
}

export function chooseWinner(state: TournamentState, winnerId: string): TournamentState {
  const [leftId, rightId] = getCurrentMatch(state);

  if (winnerId !== leftId && winnerId !== rightId) {
    throw new Error('현재 대결에 포함된 후보만 선택할 수 있습니다.');
  }

  const winners = [...state.winners, winnerId];
  const history = [
    ...state.history,
    {
      roundSize: state.roundCandidateIds.length,
      matchIndex: state.matchIndex,
      leftId,
      rightId,
      winnerId,
    },
  ];
  const isRoundFinished = winners.length === state.roundCandidateIds.length / 2;

  if (!isRoundFinished) {
    return {
      ...state,
      matchIndex: state.matchIndex + 1,
      winners,
      history,
    };
  }

  if (winners.length === 1) {
    return {
      ...state,
      phase: 'champion',
      winners,
      history,
      championId: winnerId,
    };
  }

  return {
    ...state,
    phase: 'round-complete',
    winners,
    history,
  };
}

export function startNextRound(state: TournamentState): TournamentState {
  if (state.phase !== 'round-complete' || state.winners.length < 2) {
    throw new Error('완료된 라운드가 있어야 다음 라운드를 시작할 수 있습니다.');
  }

  return {
    ...state,
    phase: 'match',
    roundCandidateIds: state.winners,
    matchIndex: 0,
    winners: [],
  };
}

export function getRoundLabel(roundSize: number): string {
  return roundSize === 2 ? '결승' : `${roundSize}강`;
}

export function getTotalMatchCount(tournamentSize: TournamentSize): number {
  return tournamentSize - 1;
}

function isTournamentSize(value: unknown): value is TournamentSize {
  return TOURNAMENT_SIZES.some((size) => size === value);
}

function isTournamentState(value: unknown, validCandidateIds: ReadonlySet<string>): value is TournamentState {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<TournamentState>;
  const validPhases = ['match', 'round-complete', 'champion'];
  const validIds = (ids: unknown): ids is readonly string[] => Array.isArray(ids)
    && ids.every((id) => typeof id === 'string' && validCandidateIds.has(id));

  return isTournamentSize(candidate.tournamentSize)
    && typeof candidate.phase === 'string'
    && validPhases.includes(candidate.phase)
    && validIds(candidate.roundCandidateIds)
    && typeof candidate.matchIndex === 'number'
    && Number.isInteger(candidate.matchIndex)
    && candidate.matchIndex >= 0
    && validIds(candidate.winners)
    && Array.isArray(candidate.history)
    && candidate.history.every((record) => {
      if (!record || typeof record !== 'object') {
        return false;
      }

      const match = record as Record<string, unknown>;
      return typeof match.roundSize === 'number'
        && typeof match.matchIndex === 'number'
        && typeof match.leftId === 'string'
        && validCandidateIds.has(match.leftId)
        && typeof match.rightId === 'string'
        && validCandidateIds.has(match.rightId)
        && typeof match.winnerId === 'string'
        && validCandidateIds.has(match.winnerId);
    })
    && (candidate.championId === null
      || (typeof candidate.championId === 'string' && validCandidateIds.has(candidate.championId)));
}

export function parseWorldCupSession(
  serialized: string,
  validCandidateIds: ReadonlySet<string>,
): WorldCupSession | null {
  try {
    const parsed = JSON.parse(serialized) as Partial<WorldCupSession>;

    if (parsed.version !== 1 || !isTournamentState(parsed.current, validCandidateIds)) {
      return null;
    }

    if (parsed.previous !== null
      && !isTournamentState(parsed.previous, validCandidateIds)) {
      return null;
    }

    return {
      version: 1,
      current: parsed.current,
      previous: parsed.previous ?? null,
    };
  } catch {
    return null;
  }
}
