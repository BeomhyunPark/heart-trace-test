import type { WorldCupSession } from '../domain/types';
import { parseWorldCupSession } from '../domain/tournament';

const WORLD_CUP_SESSION_KEY = 'ongi.food-world-cup.session.v1';

export function loadWorldCupSession(validCandidateIds: ReadonlySet<string>): WorldCupSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const serialized = window.localStorage.getItem(WORLD_CUP_SESSION_KEY);

  return serialized ? parseWorldCupSession(serialized, validCandidateIds) : null;
}

export function saveWorldCupSession(session: WorldCupSession): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(WORLD_CUP_SESSION_KEY, JSON.stringify(session));
  }
}

export function clearWorldCupSession(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(WORLD_CUP_SESSION_KEY);
  }
}
