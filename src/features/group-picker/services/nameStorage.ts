const STORAGE_KEY = 'ongi.group-picker.names.v1';

export function loadGroupNames(): string[] {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((name): name is string => typeof name === 'string').slice(0, 32);
  } catch {
    return [];
  }
}

export function saveGroupNames(names: readonly string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
  } catch {
    // 저장 공간을 쓸 수 없어도 뽑기는 계속 진행한다.
  }
}
