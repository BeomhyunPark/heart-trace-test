import { isPickerMode } from '../../group-picker/domain/modeCatalog';
import type { PickerMode } from '../../group-picker/domain/types';

export const COMMUNITY_TOOL_PREFERENCES_KEY = 'ongi.home.community-tools.v1';
export const MAX_FAVORITE_COMMUNITY_TOOLS = 3;

export type CommunityToolPreferences = {
  recentMode: PickerMode | null;
  favoriteModes: PickerMode[];
};

export const EMPTY_COMMUNITY_TOOL_PREFERENCES: CommunityToolPreferences = {
  recentMode: null,
  favoriteModes: [],
};

export function parseCommunityToolPreferences(value: unknown): CommunityToolPreferences {
  if (typeof value !== 'object' || value === null) {
    return { ...EMPTY_COMMUNITY_TOOL_PREFERENCES };
  }

  const candidate = value as {
    recentMode?: unknown;
    favoriteModes?: unknown;
  };
  const favoriteModes = Array.isArray(candidate.favoriteModes)
    ? candidate.favoriteModes
      .filter(isPickerMode)
      .filter((mode, index, modes) => modes.indexOf(mode) === index)
      .slice(0, MAX_FAVORITE_COMMUNITY_TOOLS)
    : [];

  return {
    recentMode: isPickerMode(candidate.recentMode) ? candidate.recentMode : null,
    favoriteModes,
  };
}

export function loadCommunityToolPreferences(): CommunityToolPreferences {
  try {
    const serialized = window.localStorage.getItem(COMMUNITY_TOOL_PREFERENCES_KEY);

    return serialized === null
      ? { ...EMPTY_COMMUNITY_TOOL_PREFERENCES }
      : parseCommunityToolPreferences(JSON.parse(serialized));
  } catch {
    return { ...EMPTY_COMMUNITY_TOOL_PREFERENCES };
  }
}

export function saveCommunityToolPreferences(preferences: CommunityToolPreferences): void {
  try {
    window.localStorage.setItem(
      COMMUNITY_TOOL_PREFERENCES_KEY,
      JSON.stringify(preferences),
    );
  } catch {
    // 저장소가 차단되어도 현재 화면에서는 계속 사용할 수 있다.
  }
}

export function withRecentCommunityTool(
  preferences: CommunityToolPreferences,
  mode: PickerMode,
): CommunityToolPreferences {
  return preferences.recentMode === mode
    ? preferences
    : { ...preferences, recentMode: mode };
}

export function withToggledFavoriteCommunityTool(
  preferences: CommunityToolPreferences,
  mode: PickerMode,
): CommunityToolPreferences {
  if (preferences.favoriteModes.includes(mode)) {
    return {
      ...preferences,
      favoriteModes: preferences.favoriteModes.filter((favoriteMode) => favoriteMode !== mode),
    };
  }

  if (preferences.favoriteModes.length >= MAX_FAVORITE_COMMUNITY_TOOLS) {
    return preferences;
  }

  return {
    ...preferences,
    favoriteModes: [...preferences.favoriteModes, mode],
  };
}
