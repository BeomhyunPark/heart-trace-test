import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

import type { ActivityId } from './activityCatalog';

export type ActivityAppProps = {
  onBackHome: () => void;
};

export type ActivityDefinition = {
  id: ActivityId;
  Component: LazyExoticComponent<ComponentType<ActivityAppProps>>;
  preload: () => Promise<unknown>;
};

const loadHeartTraceApp = async () => {
  const module = await import('../features/heart-trace/HeartTraceApp');

  return { default: module.HeartTraceApp };
};
const HeartTraceApp = lazy(loadHeartTraceApp);
const loadBalanceGameApp = async () => {
  const module = await import('../features/balance-game/BalanceGameApp');

  return { default: module.BalanceGameApp };
};
const BalanceGameApp = lazy(loadBalanceGameApp);

const ACTIVITY_REGISTRY: Partial<Record<ActivityId, ActivityDefinition>> = {
  'heart-trace': {
    id: 'heart-trace',
    Component: HeartTraceApp,
    preload: loadHeartTraceApp,
  },
  'balance-game': {
    id: 'balance-game',
    Component: BalanceGameApp,
    preload: loadBalanceGameApp,
  },
};

export function getActivityDefinition(
  activityId: ActivityId,
): ActivityDefinition | null {
  return ACTIVITY_REGISTRY[activityId] ?? null;
}

export function preloadActivity(activityId: ActivityId): Promise<void> {
  const activity = getActivityDefinition(activityId);

  if (activity === null) {
    return Promise.resolve();
  }

  return activity.preload().then(() => undefined);
}
