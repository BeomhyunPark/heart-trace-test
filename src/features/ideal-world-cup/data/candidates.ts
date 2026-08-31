import type { WorldCupCandidate } from '../domain/types';
import { FREE_PASS_CANDIDATES, LIFE_CHEAT_CANDIDATES } from './concepts';
import { FOOD_CANDIDATES } from './foods';
import { TRAVEL_CANDIDATES } from './travel';

export const WORLD_CUP_CANDIDATES: readonly WorldCupCandidate[] = [
  ...FOOD_CANDIDATES,
  ...TRAVEL_CANDIDATES,
  ...FREE_PASS_CANDIDATES,
  ...LIFE_CHEAT_CANDIDATES,
];

export const WORLD_CUP_CANDIDATE_BY_ID = new Map(
  WORLD_CUP_CANDIDATES.map((candidate) => [candidate.id, candidate]),
);
