import {
  Suspense,
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { HomeScreen, pickFeaturedActivity } from '../features/home/HomeScreen';
import {
  loadCommunityToolPreferences,
  saveCommunityToolPreferences,
  withRecentCommunityTool,
  withToggledFavoriteCommunityTool,
} from '../features/home/services/communityToolPreferences';
import type { PickerMode } from '../features/group-picker/domain/types';
import { ACTIVITIES, type ActivityId } from './activityCatalog';
import {
  buildActivityUrl,
  parseActivitySearch,
  type ActivityTarget,
} from './activityNavigation';
import { SplashScreen } from './SplashScreen';
import { getActivityDefinition, preloadActivity } from './activityRegistry';
import { ActivityShareButton } from '../components/ActivityShareButton';

function getDocumentScrollTop(): number {
  return Math.max(
    window.scrollY,
    document.documentElement.scrollTop,
    document.body.scrollTop,
  );
}

function updateActivityUrl(target: ActivityTarget | null, action: 'push' | 'replace'): void {
  const nextUrl = buildActivityUrl(window.location.href, target);
  const updateHistory = action === 'push'
    ? window.history.pushState.bind(window.history)
    : window.history.replaceState.bind(window.history);

  updateHistory(window.history.state, '', nextUrl);
}

export function App() {
  const [showSplash, setShowSplash] = useState(import.meta.env.MODE !== 'test');
  const [activeActivity, setActiveActivity] = useState<ActivityTarget | null>(() => (
    parseActivitySearch(window.location.search)
  ));
  const [featuredActivityId] = useState<ActivityId | null>(() => (
    pickFeaturedActivity(ACTIVITIES, null)?.id ?? null
  ));
  const [communityToolPreferences, setCommunityToolPreferences] = useState(
    loadCommunityToolPreferences,
  );
  const activeActivityRef = useRef(activeActivity);
  const homeScrollTop = useRef(0);

  useEffect(() => {
    void preloadActivity('heart-trace');
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const nextActivity = parseActivitySearch(window.location.search);
      activeActivityRef.current = nextActivity;
      startTransition(() => {
        setActiveActivity(nextActivity);
      });
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!showSplash) {
      return;
    }

    const timer = window.setTimeout(() => setShowSplash(false), 1800);

    return () => window.clearTimeout(timer);
  }, [showSplash]);

  useLayoutEffect(() => {
    if (activeActivity !== null) {
      return;
    }

    document.documentElement.scrollTop = homeScrollTop.current;
    document.body.scrollTop = homeScrollTop.current;
  }, [activeActivity]);

  const recordRecentCommunityTool = useCallback((mode: PickerMode) => {
    setCommunityToolPreferences((current) => {
      const next = withRecentCommunityTool(current, mode);

      if (next !== current) {
        saveCommunityToolPreferences(next);
      }

      return next;
    });
  }, []);

  const toggleFavoriteCommunityTool = useCallback((mode: PickerMode) => {
    setCommunityToolPreferences((current) => {
      const next = withToggledFavoriteCommunityTool(current, mode);

      if (next !== current) {
        saveCommunityToolPreferences(next);
      }

      return next;
    });
  }, []);

  const handleGroupPickerModeChange = useCallback((mode: PickerMode) => {
    if (activeActivityRef.current?.id !== 'group-picker') {
      return;
    }

    const nextActivity = { id: 'group-picker' as const, initialGroupPickerMode: mode };

    recordRecentCommunityTool(mode);
    updateActivityUrl(nextActivity, 'replace');
    activeActivityRef.current = nextActivity;
    setActiveActivity((current) => (
      current?.id !== 'group-picker' || current.initialGroupPickerMode === mode
        ? current
        : nextActivity
    ));
  }, [recordRecentCommunityTool]);

  if (showSplash) {
    return <SplashScreen />;
  }

  const selectActivity = (id: ActivityId, initialGroupPickerMode?: PickerMode) => {
    const target = { id, initialGroupPickerMode };

    if (id === 'group-picker' && initialGroupPickerMode) {
      recordRecentCommunityTool(initialGroupPickerMode);
    }

    homeScrollTop.current = getDocumentScrollTop();
    updateActivityUrl(target, 'push');
    activeActivityRef.current = target;
    startTransition(() => {
      setActiveActivity(target);
    });
  };

  const returnHome = () => {
    activeActivityRef.current = null;
    updateActivityUrl(null, 'replace');
    setActiveActivity(null);
  };

  const activity = activeActivity === null
    ? null
    : getActivityDefinition(activeActivity.id);
  const ActivityApp = activity?.Component;

  return (
    <Suspense fallback={<SplashScreen />}>
      {ActivityApp && activeActivity ? (
        <div className="activity-shell">
          <ActivityApp
            initialGroupPickerMode={activeActivity.initialGroupPickerMode}
            onBackHome={returnHome}
            onGroupPickerModeChange={handleGroupPickerModeChange}
          />
          <ActivityShareButton
            target={activeActivity}
            key={`${activeActivity.id}:${activeActivity.initialGroupPickerMode ?? ''}`}
          />
        </div>
      ) : (
        <HomeScreen
          communityToolPreferences={communityToolPreferences}
          featuredActivityId={featuredActivityId}
          onSelectActivity={selectActivity}
          onToggleFavoriteCommunityTool={toggleFavoriteCommunityTool}
        />
      )}
    </Suspense>
  );
}
