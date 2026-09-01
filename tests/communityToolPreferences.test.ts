// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  COMMUNITY_TOOL_PREFERENCES_KEY,
  EMPTY_COMMUNITY_TOOL_PREFERENCES,
  loadCommunityToolPreferences,
  parseCommunityToolPreferences,
  saveCommunityToolPreferences,
  withRecentCommunityTool,
  withToggledFavoriteCommunityTool,
} from '../src/features/home/services/communityToolPreferences';

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('공동체 도구 개인화 저장소', () => {
  it('깨진 값과 알 수 없는 도구를 제거하고 즐겨찾기를 3개로 제한한다', () => {
    expect(parseCommunityToolPreferences({
      recentMode: 'unknown',
      favoriteModes: ['sharing', 'sharing', 'groups', 'unknown', 'ladder', 'pairs'],
    })).toEqual({
      recentMode: null,
      favoriteModes: ['sharing', 'groups', 'ladder'],
    });
    expect(parseCommunityToolPreferences(null)).toEqual(EMPTY_COMMUNITY_TOOL_PREFERENCES);
  });

  it('최근 사용과 즐겨찾기 추가·해제를 계산한다', () => {
    const recent = withRecentCommunityTool(EMPTY_COMMUNITY_TOOL_PREFERENCES, 'sharing');
    const favorited = withToggledFavoriteCommunityTool(recent, 'groups');

    expect(recent.recentMode).toBe('sharing');
    expect(favorited.favoriteModes).toEqual(['groups']);
    expect(withToggledFavoriteCommunityTool(favorited, 'groups').favoriteModes).toEqual([]);
  });

  it('저장소가 차단되어도 기본값으로 계속 동작한다', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(loadCommunityToolPreferences()).toEqual(EMPTY_COMMUNITY_TOOL_PREFERENCES);
    expect(() => saveCommunityToolPreferences({
      recentMode: 'sharing',
      favoriteModes: ['groups'],
    })).not.toThrow();
  });

  it('유효한 설정을 현재 기기에 저장하고 다시 읽는다', () => {
    saveCommunityToolPreferences({
      recentMode: 'sharing',
      favoriteModes: ['groups', 'pairs'],
    });

    expect(JSON.parse(window.localStorage.getItem(COMMUNITY_TOOL_PREFERENCES_KEY) ?? '{}')).toEqual({
      recentMode: 'sharing',
      favoriteModes: ['groups', 'pairs'],
    });
    expect(loadCommunityToolPreferences()).toEqual({
      recentMode: 'sharing',
      favoriteModes: ['groups', 'pairs'],
    });
  });
});
