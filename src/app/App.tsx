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
import type { PickerMode } from '../features/group-picker/domain/types';
import { ACTIVITIES, type ActivityId } from './activityCatalog';
import {
  buildActivityUrl,
  buildPageUrl,
  parseActivitySearch,
  parsePageSearch,
  type AppPage,
  type ActivityTarget,
} from './activityNavigation';
import { SplashScreen } from './SplashScreen';
import { getActivityDefinition, preloadActivity } from './activityRegistry';
import { ActivityShareButton } from '../components/ActivityShareButton';
import { UpdatesScreen } from '../features/updates/UpdatesScreen';

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

function updatePageUrl(page: AppPage | null, action: 'push' | 'replace'): void {
  const nextUrl = buildPageUrl(window.location.href, page);
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
  const [activePage, setActivePage] = useState<AppPage | null>(() => (
    parsePageSearch(window.location.search)
  ));
  const [featuredActivityId] = useState<ActivityId | null>(() => (
    pickFeaturedActivity(ACTIVITIES, null)?.id ?? null
  ));
  const activeActivityRef = useRef(activeActivity);
  const homeScrollTop = useRef(0);

  useEffect(() => {
    void preloadActivity('heart-trace');
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const nextActivity = parseActivitySearch(window.location.search);
      const nextPage = parsePageSearch(window.location.search);
      activeActivityRef.current = nextActivity;
      startTransition(() => {
        setActiveActivity(nextActivity);
        setActivePage(nextPage);
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
    if (activeActivity !== null || activePage !== null) {
      return;
    }

    document.documentElement.scrollTop = homeScrollTop.current;
    document.body.scrollTop = homeScrollTop.current;
  }, [activeActivity, activePage]);

  useLayoutEffect(() => {
    if (activePage === null) {
      return;
    }

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activePage]);

  const handleGroupPickerModeChange = useCallback((mode: PickerMode) => {
    if (activeActivityRef.current?.id !== 'group-picker') {
      return;
    }

    const nextActivity = { id: 'group-picker' as const, initialGroupPickerMode: mode };

    updateActivityUrl(nextActivity, 'replace');
    activeActivityRef.current = nextActivity;
    setActiveActivity((current) => (
      current?.id !== 'group-picker' || current.initialGroupPickerMode === mode
        ? current
        : nextActivity
    ));
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  const selectActivity = (id: ActivityId, initialGroupPickerMode?: PickerMode) => {
    const target = { id, initialGroupPickerMode };

    homeScrollTop.current = getDocumentScrollTop();
    updateActivityUrl(target, 'push');
    activeActivityRef.current = target;
    startTransition(() => {
      setActivePage(null);
      setActiveActivity(target);
    });
  };

  const openUpdates = () => {
    homeScrollTop.current = getDocumentScrollTop();
    updatePageUrl('updates', 'push');
    activeActivityRef.current = null;
    startTransition(() => {
      setActiveActivity(null);
      setActivePage('updates');
    });
  };

  const returnHome = () => {
    activeActivityRef.current = null;
    updatePageUrl(null, 'replace');
    setActiveActivity(null);
    setActivePage(null);
  };

  const activity = activeActivity === null
    ? null
    : getActivityDefinition(activeActivity.id);
  const ActivityApp = activity?.Component;

  return (
    <Suspense fallback={<SplashScreen />}>
      {activePage === 'updates' ? (
        <UpdatesScreen onBackHome={returnHome} />
      ) : ActivityApp && activeActivity ? (
        <div className="activity-shell">
          <ActivityApp
            initialGroupPickerMode={activeActivity.initialGroupPickerMode}
            onBackHome={returnHome}
            onSelectActivity={selectActivity}
            onGroupPickerModeChange={handleGroupPickerModeChange}
          />
          <ActivityShareButton
            target={activeActivity}
            key={`${activeActivity.id}:${activeActivity.initialGroupPickerMode ?? ''}`}
          />
        </div>
      ) : (
        <HomeScreen
          featuredActivityId={featuredActivityId}
          onOpenUpdates={openUpdates}
          onSelectActivity={selectActivity}
        />
      )}
    </Suspense>
  );
}
