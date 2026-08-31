import type { ComponentType } from 'react';

import type { ActivityId } from './activityCatalog';
import { HeartTraceApp } from '../features/heart-trace/HeartTraceApp';

export type ActivityAppProps = {
  onBackHome: () => void;
};

export type ActivityDefinition = {
  id: ActivityId;
  Component: ComponentType<ActivityAppProps>;
};

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
