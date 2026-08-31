import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

import type { ActivityId } from './activityCatalog';

export type ActivityAppProps = {
  onBackHome: () => void;
};

export type ActivityDefinition = {
  id: ActivityId;
  Component: LazyExoticComponent<ComponentType<ActivityAppProps>>;
};

const HeartTraceApp = lazy(async () => {
  const module = await import('../features/heart-trace/HeartTraceApp');

  return { default: module.HeartTraceApp };
});

const ACTIVITY_REGISTRY: Partial<Record<ActivityId, ActivityDefinition>> = {
  'heart-trace': {
    id: 'heart-trace',
    Component: HeartTraceApp,
  },
};

export function getActivityDefinition(
  activityId: ActivityId,
): ActivityDefinition | null {
  return ACTIVITY_REGISTRY[activityId] ?? null;
}
