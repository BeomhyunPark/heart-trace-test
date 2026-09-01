// @vitest-environment jsdom

import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useRoomEvents } from '../src/features/anonymous-sharing/hooks/useRoomEvents';

class FakeEventSource {
  static instances: FakeEventSource[] = [];

  onerror: ((event: Event) => void) | null = null;
  close = vi.fn();

  constructor() {
    FakeEventSource.instances.push(this);
  }

  addEventListener() {}
  removeEventListener() {}
}

const handleRoomEvent = vi.fn();

function RoomEventsHarness({ roomId }: { roomId: string | null }) {
  const reconnecting = useRoomEvents(roomId, handleRoomEvent);

  return <p>{reconnecting ? '재연결 중' : '연결 안내 없음'}</p>;
}

describe('Room SSE 연결 상태', () => {
  afterEach(() => {
    cleanup();
    FakeEventSource.instances = [];
    handleRoomEvent.mockReset();
    vi.unstubAllGlobals();
  });

  it('Room이 완료되어 SSE 구독을 닫으면 재연결 안내도 즉시 없앤다', () => {
    vi.stubGlobal('EventSource', FakeEventSource as unknown as typeof EventSource);
    const { rerender } = render(<RoomEventsHarness roomId="room-one" />);

    act(() => {
      FakeEventSource.instances[0].onerror?.(new Event('error'));
    });
    expect(screen.getByText('재연결 중')).toBeTruthy();

    rerender(<RoomEventsHarness roomId={null} />);

    expect(screen.getByText('연결 안내 없음')).toBeTruthy();
    expect(FakeEventSource.instances[0].close).toHaveBeenCalledOnce();
  });
});
