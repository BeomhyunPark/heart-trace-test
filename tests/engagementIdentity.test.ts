// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getEngagementIdentity,
  resetEngagementIdentityForTests,
  VISITOR_STORAGE_KEY,
  VISIT_STORAGE_KEY,
} from '../src/engagement/identity';

const VISITOR_KEY = '10000000-0000-4000-8000-000000000001';
const VISIT_KEY = '20000000-0000-4000-8000-000000000002';

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  resetEngagementIdentityForTests();
  vi.spyOn(crypto, 'randomUUID')
    .mockReturnValueOnce(VISITOR_KEY)
    .mockReturnValueOnce(VISIT_KEY);
});

afterEach(() => {
  vi.restoreAllMocks();
  resetEngagementIdentityForTests();
});

describe('익명 engagement 식별자', () => {
  it('visitor는 localStorage에, visit은 sessionStorage에 저장하고 재사용한다', () => {
    const first = getEngagementIdentity();
    const second = getEngagementIdentity();

    expect(first).toEqual({ visitorKey: VISITOR_KEY, visitKey: VISIT_KEY });
    expect(second).toEqual(first);
    expect(window.localStorage.getItem(VISITOR_STORAGE_KEY)).toBe(VISITOR_KEY);
    expect(window.sessionStorage.getItem(VISIT_STORAGE_KEY)).toBe(VISIT_KEY);
  });

  it('브라우저 저장소가 차단되어도 현재 탭의 메모리 키를 유지한다', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    const first = getEngagementIdentity();
    const second = getEngagementIdentity();

    expect(first).toEqual({ visitorKey: VISITOR_KEY, visitKey: VISIT_KEY });
    expect(second).toEqual(first);
  });
});
