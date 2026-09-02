import { ACTIVITIES, type ActivityId } from './activityCatalog';
import { isPickerMode } from '../features/group-picker/domain/modeCatalog';
import type { PickerMode } from '../features/group-picker/domain/types';
import {
  isWorldCupCategoryId,
  type WorldCupCategoryId,
} from '../features/ideal-world-cup/domain/types';

export type ActivityTarget = {
  id: ActivityId;
  initialGroupPickerMode?: PickerMode;
  initialWorldCupCategory?: WorldCupCategoryId;
};

export type AppPage = 'updates';

const AVAILABLE_ACTIVITY_IDS = new Set<ActivityId>(
  ACTIVITIES.filter(({ available }) => available).map(({ id }) => id),
);

function isAvailableActivityId(value: unknown): value is ActivityId {
  return typeof value === 'string' && AVAILABLE_ACTIVITY_IDS.has(value as ActivityId);
}

export function parseActivitySearch(search: string): ActivityTarget | null {
  const searchParams = new URLSearchParams(search);
  const tool = searchParams.get('tool');

  if (isPickerMode(tool)) {
    return { id: 'group-picker', initialGroupPickerMode: tool };
  }

  const activity = searchParams.get('activity');

  if (activity === 'ideal-world-cup') {
    const category = searchParams.get('category');
    return {
      id: 'ideal-world-cup',
      initialWorldCupCategory: isWorldCupCategoryId(category) ? category : 'meal',
    };
  }

  return isAvailableActivityId(activity) ? { id: activity } : null;
}

export function parsePageSearch(search: string): AppPage | null {
  return new URLSearchParams(search).get('page') === 'updates' ? 'updates' : null;
}

export function buildActivityUrl(
  currentUrl: string,
  target: ActivityTarget | null,
): string {
  const url = new URL(currentUrl);

  url.searchParams.delete('activity');
  url.searchParams.delete('tool');
  url.searchParams.delete('category');
  url.searchParams.delete('page');

  if (target?.id === 'group-picker' && target.initialGroupPickerMode) {
    url.searchParams.set('tool', target.initialGroupPickerMode);
  } else if (target?.id === 'ideal-world-cup') {
    url.searchParams.set('activity', target.id);
    url.searchParams.set('category', target.initialWorldCupCategory ?? 'meal');
  } else if (target) {
    url.searchParams.set('activity', target.id);
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

export function buildPageUrl(currentUrl: string, page: AppPage | null): string {
  const url = new URL(currentUrl);

  url.searchParams.delete('activity');
  url.searchParams.delete('tool');
  url.searchParams.delete('category');
  url.searchParams.delete('page');

  if (page) {
    url.searchParams.set('page', page);
  }

  return `${url.pathname}${url.search}${url.hash}`;
}
