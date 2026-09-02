import type { EngagementIdentity } from './types';

export const VISITOR_STORAGE_KEY = 'ongi_visitor_id';
export const VISIT_STORAGE_KEY = 'ongi_visit_id';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

let memoryVisitorKey: string | null = null;
let memoryVisitKey: string | null = null;

function createKey(): string {
  return crypto.randomUUID();
}

function readOrCreate(
  storage: Storage,
  storageKey: string,
  memoryValue: string | null,
  setMemoryValue: (value: string) => void,
): string {
  try {
    const stored = storage.getItem(storageKey);

    if (stored && UUID_PATTERN.test(stored)) {
      setMemoryValue(stored);
      return stored;
    }

    const created = createKey();
    storage.setItem(storageKey, created);
    setMemoryValue(created);
    return created;
  } catch {
    if (memoryValue && UUID_PATTERN.test(memoryValue)) {
      return memoryValue;
    }

    const created = createKey();
    setMemoryValue(created);
    return created;
  }
}

export function getEngagementIdentity(): EngagementIdentity {
  const visitorKey = readOrCreate(
    window.localStorage,
    VISITOR_STORAGE_KEY,
    memoryVisitorKey,
    (value) => { memoryVisitorKey = value; },
  );
  const visitKey = readOrCreate(
    window.sessionStorage,
    VISIT_STORAGE_KEY,
    memoryVisitKey,
    (value) => { memoryVisitKey = value; },
  );

  return { visitorKey, visitKey };
}

export function resetEngagementIdentityForTests(): void {
  memoryVisitorKey = null;
  memoryVisitKey = null;
}
