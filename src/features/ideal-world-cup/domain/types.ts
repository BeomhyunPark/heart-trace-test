export const TOURNAMENT_SIZES = [16, 32, 64] as const;

export type TournamentSize = (typeof TOURNAMENT_SIZES)[number];
export type TournamentPhase = 'match' | 'round-complete' | 'champion';

export type FoodCandidate = {
  id: string;
  name: string;
  image: string;
};

export type MatchRecord = {
  roundSize: number;
  matchIndex: number;
  leftId: string;
  rightId: string;
  winnerId: string;
};

export type TournamentState = {
  tournamentSize: TournamentSize;
  phase: TournamentPhase;
  roundCandidateIds: readonly string[];
  matchIndex: number;
  winners: readonly string[];
  history: readonly MatchRecord[];
  championId: string | null;
};

export type WorldCupSession = {
  version: 1;
  current: TournamentState;
  previous: TournamentState | null;
};
