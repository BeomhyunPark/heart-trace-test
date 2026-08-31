import { useEffect, useState } from 'react';

import { HomeScreen } from '../features/home/HomeScreen';
import type { ActivityId } from './activityCatalog';
import { SplashScreen } from './SplashScreen';
import { getActivityDefinition } from './activityRegistry';

export function App() {
  const [showSplash, setShowSplash] = useState(import.meta.env.MODE !== 'test');
  const [activeActivityId, setActiveActivityId] = useState<ActivityId | null>(null);

  useEffect(() => {
    if (!showSplash) {
      return;
    }

    const timer = window.setTimeout(() => setShowSplash(false), 1800);

    return () => window.clearTimeout(timer);
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (activeActivityId === null) {
    return <HomeScreen onSelectActivity={setActiveActivityId} />;
  }

  const activity = getActivityDefinition(activeActivityId);

  if (activity === null) {
    return <HomeScreen onSelectActivity={setActiveActivityId} />;
  }

  const ActivityApp = activity.Component;

  return <ActivityApp onBackHome={() => setActiveActivityId(null)} />;
}
