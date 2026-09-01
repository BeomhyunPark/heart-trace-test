import { useEffect, useState } from 'react';

import { roomEventsUrl } from '../api/sharingApi';

const ROOM_EVENTS = [
  'PARTICIPANT_JOINED',
  'PARTICIPANT_PROGRESS_CHANGED',
  'ROOM_ACCESS_CHANGED',
  'SHARING_STARTED',
  'ROUND_CHANGED',
  'PROFILE_REVEALED',
  'ROOM_CANCELLED',
  'ROOM_COMPLETED',
] as const;

export function useRoomEvents(roomId: string | null, onRoomEvent: () => void) {
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    if (!roomId || typeof EventSource === 'undefined') {
      return undefined;
    }

    const eventSource = new EventSource(roomEventsUrl(roomId), { withCredentials: true });
    const handleEvent = () => onRoomEvent();
    const handleOpen = () => setReconnecting(false);
    const handleError = () => setReconnecting(true);

    eventSource.addEventListener('CONNECTED', handleOpen);
    ROOM_EVENTS.forEach((eventName) => eventSource.addEventListener(eventName, handleEvent));
    eventSource.onerror = handleError;

    return () => {
      ROOM_EVENTS.forEach((eventName) => eventSource.removeEventListener(eventName, handleEvent));
      eventSource.removeEventListener('CONNECTED', handleOpen);
      eventSource.close();
    };
  }, [onRoomEvent, roomId]);

  return reconnecting;
}
