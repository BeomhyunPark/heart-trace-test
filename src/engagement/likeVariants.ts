import type { ActivityTarget } from '../app/activityNavigation';

export type EngagementLikeVariantCode =
  | 'default'
  | 'light'
  | 'deep'
  | 'meal'
  | 'dessert'
  | 'late-night'
  | 'travel'
  | 'free-pass'
  | 'life-cheat'
  | 'prayer'
  | 'sharing'
  | 'lottery'
  | 'ladder'
  | 'groups'
  | 'pairs'
  | 'supporter';

export function getEngagementLikeVariant(
  target: ActivityTarget,
): EngagementLikeVariantCode {
  if (target.id === 'balance-game') {
    return target.initialBalanceGameWeight ?? 'light';
  }
  if (target.id === 'ideal-world-cup') {
    return target.initialWorldCupCategory ?? 'meal';
  }
  if (target.id === 'group-picker') {
    return target.initialGroupPickerMode ?? 'prayer';
  }
  return 'default';
}
