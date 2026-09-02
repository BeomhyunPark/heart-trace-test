import type { ActivityTarget } from '../app/activityNavigation';
import type { EngagementContentCode } from './types';

const CONTENT_CODE_BY_ACTIVITY: Partial<Record<ActivityTarget['id'], EngagementContentCode>> = {
  'heart-trace': 'heart-trace',
  'balance-game': 'balance-game',
  'ideal-world-cup': 'ideal-world-cup',
  'group-picker': 'group-picker',
  'anonymous-sharing': 'anonymous-sharing',
};

export function getEngagementContentCode(
  target: Pick<ActivityTarget, 'id'>,
): EngagementContentCode | null {
  return CONTENT_CODE_BY_ACTIVITY[target.id] ?? null;
}
