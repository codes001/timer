import { useState } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTimerStore } from '../store/userTimerStore';
import { useSyncEngine } from '../hooks/userSyncEngine';
import { useTimerEngine } from '../hooks/userTimerEngine';
import { TimerRow } from '../components/TmeRow';
import { 
  Play, Pause, RotateCcw, Plus, Zap, EyeOff, 
  Settings, MessageSquare, Clock 
} from 'lucide-react';

export const Controller = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { broadcast } = useSyncEngine(roomId || 'local-room');
//   const { broadcast } = useSyncEngine(roomId || 'default');
  
  // 1. Store State & Actions
  const { 
    timers, activeId, isBlackout, flashActive, isBlinking, message,
    updateTimer, setGlobal, addTimer, deleteTimer 
  } = useTimerStore();

  // 2. Real-time Sync Engine
//   const { broadcast } = useSyncEngine(roomId || 'default-room');

  // 3. Current Active Timer Logic
  const activeTimer = timers.find(t => t.id === activeId);
  const timeLeft = useTimerEngine(activeTimer);

  const progressPercent = activeTimer?.duration 
  ? (timeLeft / activeTimer.duration) * 100 
  : 0;

  // Determine color based on time remaining (Matches Stagetimer.io)
  const getProgressColor = () => {
    if (timeLeft === 0) return 'bg-red-600';
    if (timeLeft < 60) return 'bg-yellow-500'; // Warning at 1 minute
    return 'bg-green-500';
  };


const copyViewerLink = () => {
    const url = `${window.location.origin}/viewer/${roomId}`;
    navigator.clipboard.writeText(url);
    alert("Viewer link copied to clipboard!");
};

const adjustTime = (minutes: number) => {
  if (!activeTimer) return;

  const adjustment = minutes * 60; // Convert to seconds
  let changes;

  if (activeTimer.status === 'RUNNING' && activeTimer.endTime) {
    // If running, shift the end time by the adjustment
    const newEndTime = activeTimer.endTime + (adjustment * 1000);
    changes = {
      timers: timers.map(t => t.id === activeId ? { ...t, endTime: newEndTime } : t)
    };
  } else {
    // If stopped/paused, adjust the base duration
    const newDuration = Math.max(0, activeTimer.duration + adjustment);
    changes = {
      timers: timers.map(t => t.id === activeId ? { ...t, duration: newDuration } : t)
    };
  }

  // Update local state and sync to Viewer
  setGlobal(changes);
  broadcast(changes);
};

const toggleTimer = (id: string) => {
    // 1. Find the specific timer from the rundown
    const targetTimer = timers.find(t => t.id === id);
    if (!targetTimer) return;
  
    const isRunning = targetTimer.status === 'RUNNING';
    let changes;
  
    if (!isRunning) {
      // STARTING: Use the duration from THIS specific timer (which you edited)
      const endTime = Date.now() + (targetTimer.duration * 1000);
      changes = {
        activeId: id, // Switch the "Big Monitor" to this timer
        timers: timers.map(t => t.id === id ? { 
          ...t, 
          status: 'RUNNING' as const, 
          endTime 
        } : t)
      };
    } else {
      // PAUSING: Capture current timeLeft and save it back
      changes = {
        timers: timers.map(t => t.id === id ? { 
          ...t, 
          status: 'STOPPED' as const, 
          duration: timeLeft, // Saves the time where you paused it
          endTime: null 
        } : t)
      };
    }
  
    // Update store and broadcast to Viewer
    setGlobal(changes);
    broadcast(changes);
  };
  

  const handleReset = (id: string) => {
    const changes = {
      timers: timers.map(t => t.id === id ? { ...t, status: 'STOPPED' as const, endTime: null, duration: 0 } : t)
    };
    setGlobal(changes);
    broadcast(changes);
  };

  const handleAddTimer = () => {
    addTimer();
    const latest = useTimerStore.getState().timers;
    broadcast({ timers: latest });
  };

  const handleDelete = (id: string) => {
    deleteTimer(id);
    const latest = useTimerStore.getState().timers;
    broadcast({ timers: latest });
  };

  const toggleBlackout = () => {
    const nextValue = !isBlackout;
    const changes = { isBlackout: nextValue };
    
    // 1. Update local state
    setGlobal(changes);
    // 2. Sync to Viewer tab
    broadcast(changes);
  };

//   const triggerFlash = () => {
//     const flashOn = { flashActive: true };
//     const flashOff = { flashActive: false };
  
//     // 1. Send Flash Start
//     setGlobal(flashOn);
//     broadcast(flashOn);
  
//     // 2. Auto-reset after 800ms
//     setTimeout(() => {
//       setGlobal(flashOff);
//       broadcast(flashOff);
//     }, 800);
//   };

    const triggerFlash = (active: boolean) => {
        const data = { flashActive: active };
        setGlobal(data);
        broadcast(data);
    };

    const triggerBlink = (val: boolean) => {
        const data = { isBlinking: val };
        setGlobal(data);
        broadcast(data);
    };



    const [localMsg, setLocalMsg] = useState("");

    const handleSendMessage = () => {
      if (!localMsg.trim()) return;
      const payload = { message: localMsg };
      setGlobal(payload);
      broadcast(payload);
    };
    
    const handleClearMessage = () => {
      setLocalMsg(""); // Clears the input field
      const payload = { message: null };
      setGlobal(payload);
      broadcast(payload);
    };

  const format = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="h-screen flex flex-col bg-[#121212] text-gray-300 font-sans overflow-hidden">
      {/* Top Navbar */}
      <header className="flex justify-between items-center px-4 py-2 border-b border-white/5 bg-[#1a1a1a]">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-white/50">Dashboard</span>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="text-xs text-white/40">Room: {roomId}</span>
        </div>
        <button 
            onClick={copyViewerLink}
            className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded text-xs font-bold hover:bg-blue-600/30"
            >
            Copy Viewer Link
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              const val = !isBlackout;
              setGlobal({ isBlackout: val });
              broadcast({ isBlackout: val });
            }}
            className={`px-3 py-1 rounded text-xs border flex items-center gap-2 transition-colors ${
              isBlackout ? 'bg-red-900 border-red-500 text-white' : 'bg-[#2a2a2a] border-white/10'
            }`}
          >
            <EyeOff size={12}/> Blackout
          </button>
          {/* <button 
            onClick={triggerFlash}
            className="bg-[#2a2a2a] px-3 py-1 rounded text-xs border border-white/10 hover:bg-white/5 flex items-center gap-2"
          >
            <Zap size={12}/> Flash
          </button> */}
          <button 
            // onClick={triggerFlash}
            // className="bg-[#2a2a2a] border border-white/10 px-4 py-2 rounded text-xs font-bold hover:bg-white hover:text-black transition-all"
            // >
            onMouseDown={() => triggerFlash(true)} // Turns white on press
            onMouseUp={() => triggerFlash(false)}   // Returns to timer on release
            onMouseLeave={() => triggerFlash(false)} // Safety: reset if mouse moves away
            className="bg-[#2a2a2a] border border-white/10 px-4 py-2 rounded text-xs font-bold active:bg-white active:text-black transition-all">
            <Zap size={14} className="inline mr-2" />
            FLASH
          </button>
          <button 
            onMouseDown={() => triggerBlink(true)}
            onMouseUp={() => triggerBlink(false)}
            onMouseLeave={() => triggerBlink(false)}
            className={`bg-[#2a2a2a] border border-white/10 px-4 py-2 rounded text-xs font-bold transition-all ${
                isBlinking ? 'bg-blue-600 text-white border-blue-400' : 'hover:bg-white/5'
            }`}
            >
            <Zap size={14} className="inline mr-2" />
            BLINK
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 overflow-hidden">
        
        {/* Left Column: Active Monitor */}
        <section className="w-1/3 p-6 border-r border-white/5 flex flex-col bg-[#161616]">
          <div className="bg-[#0a0a0a] rounded-xl p-8 border border-white/5 flex flex-col items-center justify-center shadow-2xl">
            <h2 className="text-[28px] uppercase tracking-[0.2em] text-white/30 mb-4">
              {activeTimer?.name || "No Active Timer"}
            </h2>
            <div className="text-[7rem] tracking-wide font-timer font-bold text-white leading-none tabular-nums">
              {format(timeLeft)}
            </div>

            {/* DYNAMIC PROGRESS BAR */}
            <div className="w-full h-1.5 bg-white/5 rounded-full mt-10 relative z-10 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ease-linear ${getProgressColor()}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Optional: Background Glow Effect */}
            {/* <div className={`absolute inset-0 opacity-5 transition-colors duration-1000 ${getProgressColor()}`} /> */}
            {/* <div className="w-full h-1 bg-white/5 rounded-full mt-8 overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: '70%' }} />
            </div> */}
          </div>

          {/* Transport Controls */}
          <div className="grid grid-cols-4 gap-2 mt-6">
            <button onClick={() => adjustTime(-1)}  className="cursor-pointer bg-[#2a2a2a] hover:bg-white/10 p-3 rounded-lg text-xs font-bold">-1m</button>
            <button onClick={() => handleReset(activeId)} className="cursor-pointer bg-[#2a2a2a] p-3 rounded-lg flex justify-center">
              <RotateCcw size={18} />
            </button>
            <button 
              onClick={() => toggleTimer}
            //   onClick={toggleTimer} 
              className={`col-span-1 p-3 rounded-lg flex justify-center transition-colors ${
                activeTimer?.status === 'RUNNING' ? 'bg-yellow-600' : 'bg-green-600'
              }`}
            >
              {activeTimer?.status === 'RUNNING' ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor"/>}
            </button>
            {/* <button className="bg-[#2a2a2a] p-3 rounded-lg flex justify-center"><Settings size={18}/></button> */}
            <button onClick={() => adjustTime(1)}  className="cursor-pointer bg-[#2a2a2a] hover:bg-white/10 p-3 rounded-lg text-xs font-bold">+1m</button>
          </div>
        </section>

        {/* Center Column: Rundown List */}
        <section className="flex-1 flex flex-col bg-[#0d0d0d] overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-white/30">Timers</span>
            <button className="text-[10px] text-blue-500 font-bold hover:underline">SELECT ALL</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {timers.map((t) => (
              <TimerRow 
              key={t.id} 
              timer={t} 
              isActive={activeId === t.id}
              onToggle={toggleTimer}
              onReset={handleReset}
              onDelete={handleDelete}
              onUpdate={(id, data) => {
                updateTimer(id, data);
                broadcast({ timers: useTimerStore.getState().timers });
              }}
            />
            ))}
            
            <button 
              onClick={handleAddTimer}
              className="cursor-pointer w-full border-2 border-dashed border-white/5 py-4 mt-4 rounded-xl text-xs font-bold hover:bg-white/5 hover:border-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={14} /> ADD TIMER
            </button>
          </div>
        </section>

        {/* Right Column: Message/Global Center */}
        <section className="w-1/4 p-6 border-l border-white/5 bg-[#121212]">
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase mb-4 text-white/30 flex items-center gap-2">
              <MessageSquare size={14}/> Presenter Message
            </h3>
            {/* LIVE INDICATOR: Shows when a message is actually on the stage screen */}
            {message && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600/20 border border-red-500/50 text-[10px] font-bold text-red-500 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                ON AIR
              </span>
            )}
            <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4">
              {/* <textarea 
                className="w-full bg-transparent outline-none text-sm h-24 resize-none"
                placeholder="Type a message to talent..."
                onChange={(e) => setGlobal({ message: e.target.value })}
                value={message || ''}
              /> */}
              <textarea 
                className="w-full bg-transparent outline-none text-sm h-24 resize-none text-white"
                placeholder="Type message for presenter..."
                value={localMsg}
                onChange={(e) => setLocalMsg(e.target.value)}
            />
              <div className="flex gap-2">
                  {message && (
                    <button 
                      onClick={handleClearMessage}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-all"
                    >
                      CLEAR STAGE
                    </button>
                  )}
                  <button 
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-500"
                  >
                    {message ? 'UPDATE' : 'SHOW'}
                  </button>
              </div>
            </div>
          </div>

          <div>
             <h3 className="text-xs font-bold uppercase mb-4 text-white/30 flex items-center gap-2">
              <Clock size={14}/> Event Info
            </h3>
            <div className="space-y-2 text-xs opacity-50">
              <div className="flex justify-between"><span>Start Time</span><span>00:00:00</span></div>
              <div className="flex justify-between"><span>End Time</span><span>00:00:00</span></div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Info */}
      <footer className="px-4 py-1 bg-[#0a0a0a] border-t border-white/5 text-[10px] text-white/20 flex justify-between">
        <div>COC NYANYA STAGE TIMER V1.0 • @2026</div>
        <div className="font-mono">{new Date().toLocaleTimeString()}</div>
      </footer>
    </div>
  );
};
