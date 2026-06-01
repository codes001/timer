import { create } from 'zustand';

export interface TimerItem {
  id: string;
  index: number;
  name: string;
  duration: number; 
  status: 'STOPPED' | 'RUNNING';
  endTime: number | null; 
  scheduledTime: string;
}

interface StagetimerStore {
  timers: TimerItem[];
  activeId: string;
  isBlackout: boolean;
  flashActive: boolean;
  isBlinking: boolean;
  message: string | null;
  // Actions
  addTimer: (customDuration?: number) => void;
  updateTimer: (id: string, data: Partial<TimerItem>) => void;
  deleteTimer: (id: string) => void;
  setGlobal: (data: Partial<any>) => void;
  syncFromRemote: (payload: any) => void;
  loadFromStorage: () => void; // <--- 1. ADD THIS TO INTERFACE
}

export const useTimerStore = create<StagetimerStore>((set) => ({
  timers: [
    { 
      id: '1', 
      index: 1,
      name: 'Timer 1', 
      duration: 0, // 300, 
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

  // 2. ADD THE LOGIC HERE
  loadFromStorage: () => {
    const saved = localStorage.getItem('stagetimer_local_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        set(parsed);
      } catch (e) {
        console.error("Failed to load local state", e);
      }
    }
  },

  addTimer: (customDuration) => set((state) => {
    const newIndex = state.timers.length + 1;
    const newState = {
      timers: [...state.timers, {
        id: Math.random().toString(36).substr(2, 9),
        index: newIndex,
        name: `Timer ${newIndex}`,
        duration: customDuration || 0, //300
        status: 'STOPPED' as const,
        endTime: null,
        scheduledTime: new Date().toLocaleTimeString([], { hour12: false })
      }]
    };
    localStorage.setItem('stagetimer_local_state', JSON.stringify({ ...state, ...newState }));
    return newState;
  }),

  updateTimer: (id, data) => set((state) => {
    const newState = {
      timers: state.timers.map(t => t.id === id ? { ...t, ...data } : t)
    };
    localStorage.setItem('stagetimer_local_state', JSON.stringify({ ...state, ...newState }));
    return newState;
  }),

  deleteTimer: (id) => set((state) => {
    const filtered = state.timers.filter(t => t.id !== id);
    const reIndexed = filtered.map((t, i) => ({ ...t, index: i + 1 }));
    const newState = { timers: reIndexed };
    localStorage.setItem('stagetimer_local_state', JSON.stringify({ ...state, ...newState }));
    return newState;
  }),

  setGlobal: (data) => set((state) => {
    const newState = { ...state, ...data };
    localStorage.setItem('stagetimer_local_state', JSON.stringify(newState));
    return newState;
  }),
  
  syncFromRemote: (payload) => set((state) => {
    const newState = { ...state, ...payload };
    localStorage.setItem('stagetimer_local_state', JSON.stringify(newState));
    return newState;
  }),
}));