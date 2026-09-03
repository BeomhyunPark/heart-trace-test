import type { GureumiAttemptReference } from '../domain/types';

export const GUREUMI_ATTEMPT_STORAGE_KEY = 'ongi_gureumi_attempt_v01';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{40,80}$/;

export function loadGureumiAttempt(): GureumiAttemptReference | null {
  try {
    const raw = window.localStorage.getItem(GUREUMI_ATTEMPT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GureumiAttemptReference>;
    if (!UUID_PATTERN.test(parsed.attemptId ?? '') || !TOKEN_PATTERN.test(parsed.resumeToken ?? '')) {
      return null;
    }
    return { attemptId: parsed.attemptId!, resumeToken: parsed.resumeToken! };
  } catch {
    return null;
  }
}

export function saveGureumiAttempt(reference: GureumiAttemptReference): void {
  try {
    window.localStorage.setItem(GUREUMI_ATTEMPT_STORAGE_KEY, JSON.stringify(reference));
  } catch {
    // 저장소가 막힌 환경에서는 현재 탭에서만 테스트를 계속할 수 있다.
  }
}

export function clearGureumiAttempt(): void {
  try {
    window.localStorage.removeItem(GUREUMI_ATTEMPT_STORAGE_KEY);
  } catch {
    // 삭제 실패는 새 attempt 생성 요청을 막지 않는다.
  }
}
