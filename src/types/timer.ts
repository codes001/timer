export type TimerStatus = 'STOPPED' | 'RUNNING' | 'FINISHED';

export interface Timer {
  id: string;
  title: string;
  duration: number; // In seconds
  status: TimerStatus;
  startTime: number | null; // Server timestamp when started
  endTime: number | null;   // Server timestamp when finish expected
  appearance: {
    yellowAt: number; // Seconds remaining to turn yellow
    redAt: number;    // Seconds remaining to turn red
  }
}

export interface RoomState {
  activeTimerId: string | null;
  timers: Timer[];
  isBlackout: boolean;
  message: string | null;
}
