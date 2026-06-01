
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTimerStore } from '../store/userTimerStore';
import { useStagetimer } from '../hooks/useStageTimer';
// import { useSyncEngine } from '../hooks/userSyncEngine';

export const Viewer = () => {
  const { roomId } = useParams<{ roomId: string }>();
//   const { broadcast } = useSyncEngine(roomId || 'default');
  
  // 1. Get state from global store
  const { timers, activeId, isBlackout, flashActive, isBlinking, message  } = useTimerStore();
  
  // 2. Sync with Controller in real-time
  const { timeLeft } = useStagetimer(roomId || 'default-room');

  const activeTimer = timers.find(t => t.id === activeId);

  // --- Visual States ---

  // Blackout Mode: Show absolutely nothing
  if (isBlackout) return <div className="h-screen w-screen bg-black" />;

  const getBg = () => {
    if (flashActive) return 'bg-white'; // Flash signal
    // if (isBlinking) return `animate-blink' : ''`;
    
    if (activeTimer?.status === 'RUNNING') {
      if (timeLeft === 0) return 'bg-red-600 animate-pulse'; // Time's up
      if (timeLeft < 60) return 'bg-red-600';               // Last minute
      if (timeLeft < 120) return 'bg-yellow-500 text-black'; // Warning (2m)
    }
    return 'bg-black';
  };

  const format = (s: number) => {
    const m = Math.floor(s / 60);
    const secs = s % 60;
    return `${m}:${secs.toString().padStart(2, '0')}`;
  };

  if (isBlackout) {
    return <div className="h-screen w-screen bg-black transition-colors duration-300" />;
  }

  // 2. Flash and Background logic
//   const getBg = () => {
//     if (flashActive) return 'bg-white'; // The "Flash" signal
    
//     // Normal timer warning colors
//     if (timeLeft === 0) return 'bg-red-600 animate-pulse';
//     if (timeLeft < 30) return 'bg-red-600';
//     if (timeLeft < 60) return 'bg-yellow-500 text-black';
    
//     return 'bg-black';
//   };

  return (
    <div className={`h-screen w-screen flex flex-col items-center justify-center transition-colors duration-500 ${getBg()}`}>
      {/* 1. The Clock (Massive) */}
      {/* <div className="text-[40vw] font-digital leading-none tracking-tighter tabular-nums select-none"> */}
      <div className={`text-[35vw] tracking-normal font-timer font-bold leading-none tabular-nums select-none ${isBlinking ? 'animate-blink' : ''}`}>
        {format(timeLeft)}
      </div>

      {/* 2. Message Overlay (Only shows if Admin sends a message) */}
      {/* {message && (
        <div className="absolute bottom-12 px-12 py-6 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl max-w-[90%]">
          <p className="text-6xl font-bold uppercase italic text-center leading-tight">
            {message}
          </p>
        </div>
      )} */}
      {message && (
      <div className="absolute inset-x-0 bottom-10 flex justify-center z-50 px-10">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 px-12 py-6 rounded-3xl shadow-2xl">
          <p className="text-6xl font-timer font-bold uppercase italic text-white text-center">
            {message}
          </p>
        </div>
      </div>
    )}
    </div>
  );
};

