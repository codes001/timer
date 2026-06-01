import { useState, useEffect } from 'react';
import { TimerItem } from '../store/userTimerStore';

export const useTimerEngine = (timer: TimerItem | undefined) => {
  const [timeLeft, setTimeLeft] = useState(timer?.duration || 0);

  useEffect(() => {
    if (!timer || timer.status !== 'RUNNING' || !timer.endTime) {
      setTimeLeft(timer?.duration || 0);
      return;
    }

    const interval = setInterval(() => {
      // Calculate delta between "now" and the broadcasted "end time"
      const remaining = Math.max(0, Math.floor((timer.endTime! - Date.now()) / 1000));
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 100); // 100ms for smooth UI updates

    return () => clearInterval(interval);
  }, [timer]);

  return timeLeft;
};
