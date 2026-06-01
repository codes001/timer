import { useEffect, useState, useRef, useCallback } from 'react';
import { useTimerStore } from '../store/userTimerStore';

export const useStagetimer = (roomId: string) => {
  const store = useTimerStore();
  const [timeLeft, setTimeLeft] = useState(0);
  const channelRef = useRef<BroadcastChannel | null>(null);

  // 1. LOCAL SYNC LOGIC (Replaces Supabase)
  useEffect(() => {
    // Load last known state from localStorage immediately
    store.loadFromStorage();

    const channelName = `stagetimer_local_${roomId}`;
    channelRef.current = new BroadcastChannel(channelName);

    channelRef.current.onmessage = (event) => {
    //   console.log("Local Sync Received:", event.data);
      store.syncFromRemote(event.data);
    };

    return () => {
      channelRef.current?.close();
    };
  }, [roomId]);

  // 2. CLOCK LOGIC (Calculates the countdown)
  useEffect(() => {
    const activeTimer = store.timers.find(t => t.id === store.activeId);
    
    if (!activeTimer || activeTimer.status !== 'RUNNING' || !activeTimer.endTime) {
      setTimeLeft(activeTimer?.duration || 0);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((activeTimer.endTime! - Date.now()) / 1000));
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [store.timers, store.activeId]);

  // 3. BROADCAST LOGIC (Sends to other tabs)
  const broadcast = useCallback((payload: any) => {
    if (channelRef.current) {
      channelRef.current.postMessage(payload);
      // Update local state immediately so Controller UI is snappy
      store.syncFromRemote(payload);
    }
  }, [store]);

  return { timeLeft, broadcast };
};
