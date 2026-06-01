

import { create } from 'zustand';

// 1. Define the Item structure
export interface TimerItem {
  id: string;
  index: number;
  name: string;
  duration: number; 
  status: 'STOPPED' | 'RUNNING';
  endTime: number | null; 
  scheduledTime: string;
}

// 2. Define the Store interface (This fixes ts(2304))
interface StagetimerStore {
  timers: TimerItem[];
  activeId: string;
  isBlackout: boolean;
  flashActive: boolean;
  isBlinking: boolean;
  message: string | null;
  // Actions
  loadFromStorage: () => void;
  updateTimer: (id: string, data: Partial<TimerItem>) => void;
  setGlobal: (data: Partial<any>) => void;
  syncFromRemote: (payload: any) => void;
  addTimer: (customDuration?: number) => void;
  deleteTimer: (id: string) => void;
}

// 3. Create the store using the interface
export const useTimerStore = create<StagetimerStore>((set) => ({
  timers: [
    { 
      id: '1', 
      index: 1,
      name: 'Timer 1', 
      duration: 0, //300
      status: 'STOPPED', 
      endTime: null,
      scheduledTime: new Date().toLocaleTimeString([], { hour12: false })
    }
  ],
  activeId: '1',
  isBlackout: false,
  flashActive: false,
  isBlinking: false,
  message: null,

  loadFromStorage: () => {
    const saved = localStorage.getItem('stagetimer_backup');
    if (saved) {
      try {
        set(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse backup", e);
      }
    }
  },

  updateTimer: (id, data) => set((state) => ({
    timers: state.timers.map(t => t.id === id ? { ...t, ...data } : t)
  })),

  setGlobal: (data) => set((state) => ({ ...state, ...data })),
  
  syncFromRemote: (payload) => set((state) => ({ ...state, ...payload })),

  addTimer: (customDuration) => set((state) => ({
    timers: [...state.timers, {
      id: Math.random().toString(36).substr(2, 9),
      index: state.timers.length + 1,
      name: `Timer ${state.timers.length + 1}`,
      duration: customDuration || 300,
      status: 'STOPPED' as const,
      endTime: null,
      scheduledTime: new Date().toLocaleTimeString([], { hour12: false })
    }]
  })),

  deleteTimer: (id) => set((state) => ({
    timers: state.timers.filter(t => t.id !== id).map((t, i) => ({ ...t, index: i + 1 }))
  })),
}));

// 4. Persistence Middleware (Saves to disk on every change)
useTimerStore.subscribe((state) => {
  localStorage.setItem('stagetimer_backup', JSON.stringify(state));
});


