import { useEffect, useRef, useCallback } from 'react';
import { useTimerStore } from '../store/userTimerStore';

export const useSyncEngine = (roomId: string) => {
  const syncFromRemote = useTimerStore.getState().syncFromRemote;
  const loadFromStorage = useTimerStore.getState().loadFromStorage;
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    // 1. Load the last saved state from the computer's memory immediately
    loadFromStorage();

    // 2. Open a local "pipe" between tabs
    const channelName = `stagetimer_local_${roomId}`;
    channelRef.current = new BroadcastChannel(channelName);

    channelRef.current.onmessage = (event) => {
      console.log("Local Data Received:", event.data);
      syncFromRemote({ ...event.data });
    };

    return () => {
      channelRef.current?.close();
    };
  }, [roomId, syncFromRemote, loadFromStorage]);

  const broadcast = useCallback((payload: any) => {
    if (channelRef.current) {
      // 3. Send update to all other tabs on this PC
      channelRef.current.postMessage(payload);
      // 4. Update the local tab state instantly
      syncFromRemote({ ...payload });
    }
  }, [syncFromRemote]);

  return { broadcast };
};
