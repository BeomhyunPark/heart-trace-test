export const TOURNAMENT_SIZES = [16, 32, 64] as const;

export type TournamentSize = (typeof TOURNAMENT_SIZES)[number];
export type TournamentPhase = 'match' | 'round-complete' | 'champion';
export const WORLD_CUP_CATEGORY_IDS = [
  'meal',
  'dessert',
  'late-night',
  'travel',
  'free-pass',
  'life-cheat',
] as const;

export type WorldCupCategoryId = (typeof WORLD_CUP_CATEGORY_IDS)[number];

export function isWorldCupCategoryId(value: unknown): value is WorldCupCategoryId {
  return typeof value === 'string'
    && WORLD_CUP_CATEGORY_IDS.includes(value as WorldCupCategoryId);
}

export type CandidateVisualTone = 'gold' | 'coral' | 'mint' | 'sky' | 'violet';

type WorldCupCandidateBase = {
  id: string;
  name: string;
};

export type WorldCupCandidate = WorldCupCandidateBase & (
  | { image: string; symbol?: never; visualTone?: never }
  | { image?: never; symbol: string; visualTone: CandidateVisualTone }
);

export type WorldCupCategory = {
  id: WorldCupCategoryId;
  title: string;
  image: string;
  candidateIds: readonly string[];
  closingMessage: string;
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
  version: 2;
  categoryId: WorldCupCategoryId;
  current: TournamentState;
  previous: TournamentState | null;
};
