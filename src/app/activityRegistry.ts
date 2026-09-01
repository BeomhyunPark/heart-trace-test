import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

import type { PickerMode } from '../features/group-picker/domain/types';
import type { ActivityId } from './activityCatalog';

export type ActivityAppProps = {
  onBackHome: () => void;
  initialGroupPickerMode?: PickerMode;
  onGroupPickerModeChange?: (mode: PickerMode) => void;
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
const loadIdealWorldCupApp = async () => {
  const module = await import('../features/ideal-world-cup/IdealWorldCupApp');

  return { default: module.IdealWorldCupApp };
};
const IdealWorldCupApp = lazy(loadIdealWorldCupApp);
const loadGroupPickerApp = async () => {
  const module = await import('../features/group-picker/GroupPickerApp');

  return { default: module.GroupPickerApp };
};
const GroupPickerApp = lazy(loadGroupPickerApp);
const loadKnowMeQuizApp = async () => {
  const module = await import('../features/know-me-quiz/KnowMeQuizApp');

  return { default: module.KnowMeQuizApp };
};
const KnowMeQuizApp = lazy(loadKnowMeQuizApp);

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
  'ideal-world-cup': {
    id: 'ideal-world-cup',
    Component: IdealWorldCupApp,
    preload: loadIdealWorldCupApp,
  },
  'group-picker': {
    id: 'group-picker',
    Component: GroupPickerApp,
    preload: loadGroupPickerApp,
  },
  'know-me-quiz': {
    id: 'know-me-quiz',
    Component: KnowMeQuizApp,
    preload: loadKnowMeQuizApp,
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
