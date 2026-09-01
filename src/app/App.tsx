import { Suspense, startTransition, useEffect, useState } from 'react';

import { HomeScreen } from '../features/home/HomeScreen';
import type { PickerMode } from '../features/group-picker/domain/types';
import type { ActivityId } from './activityCatalog';
import { SplashScreen } from './SplashScreen';
import { getActivityDefinition, preloadActivity } from './activityRegistry';

type ActiveActivity = {
  id: ActivityId;
  initialGroupPickerMode?: PickerMode;
};

export function App() {
  const [showSplash, setShowSplash] = useState(import.meta.env.MODE !== 'test');
  const [activeActivity, setActiveActivity] = useState<ActiveActivity | null>(null);

  useEffect(() => {
    void preloadActivity('heart-trace');
  }, []);

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

  const selectActivity = (id: ActivityId, initialGroupPickerMode?: PickerMode) => {
    startTransition(() => {
      setActiveActivity({ id, initialGroupPickerMode });
    });
  };

  const activity = activeActivity === null
    ? null
    : getActivityDefinition(activeActivity.id);
  const ActivityApp = activity?.Component;

  return (
    <Suspense fallback={<SplashScreen />}>
      {ActivityApp && activeActivity ? (
        <ActivityApp
          initialGroupPickerMode={activeActivity.initialGroupPickerMode}
          onBackHome={() => setActiveActivity(null)}
        />
      ) : (
        <HomeScreen onSelectActivity={selectActivity} />
      )}
    </Suspense>
  );
}
