import type { WorldCupSession } from '../domain/types';
import { parseWorldCupSession } from '../domain/tournament';

const WORLD_CUP_SESSION_KEY = 'ongi.ideal-world-cup.session.v2';
const LEGACY_WORLD_CUP_SESSION_KEY = 'ongi.food-world-cup.session.v1';

export function loadWorldCupSession(
  validCandidateIds: ReadonlySet<string>,
  validCategoryIds: ReadonlySet<string>,
): WorldCupSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const serialized = window.localStorage.getItem(WORLD_CUP_SESSION_KEY);

  return serialized
    ? parseWorldCupSession(serialized, validCandidateIds, validCategoryIds)
    : null;
}

export function saveWorldCupSession(session: WorldCupSession): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(WORLD_CUP_SESSION_KEY, JSON.stringify(session));
  }
}

export function clearWorldCupSession(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(WORLD_CUP_SESSION_KEY);
    window.localStorage.removeItem(LEGACY_WORLD_CUP_SESSION_KEY);
  }
}
