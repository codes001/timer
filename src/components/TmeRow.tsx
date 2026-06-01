import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Trash2, Settings, MoreHorizontal } from 'lucide-react';
import { TimerItem } from '../store/userTimerStore';

interface Props {
  timer: TimerItem;
  isActive: boolean;
  onToggle: (id: string) => void;
  onReset: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<TimerItem>) => void; // Added for dynamic editing
}

export const TimerRow: React.FC<Props> = ({ timer, isActive, onToggle, onReset, onDelete, onUpdate }) => {
  const [isEditingName, setIsEditingName] = useState(false);

  // Handles updating duration (Input is in minutes, stored in seconds)
  const handleDurationChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const mins = parseInt(e.target.value) || 0;
    onUpdate(timer.id, { duration: mins * 60 });
  };

  // Handles updating the name
  const handleNameChange = (e: React.FocusEvent<HTMLInputElement>) => {
    onUpdate(timer.id, { name: e.target.value });
    setIsEditingName(false);
  };

  return (
    <div className={`flex items-center w-full px-4 py-6 mb-1 rounded-sm transition-all group border-l-4 ${
      isActive ? 'bg-[#1d4ed8] text-white border-blue-400 shadow-lg' : 'bg-[#1a1a1a] text-gray-400 border-transparent hover:bg-[#222]'
    }`}>
      
      {/* 1. Index & Scheduled Start (Mock) */}
      <div className="w-8 text-[10px] opacity-40 font-mono font-bold">{timer.index}</div>
      <div className="w-20 text-[11px] font-mono opacity-60 cursor-not-allowed">
        {timer.scheduledTime}
      </div>

      {/* 2. DYNAMIC DURATION (Editable) */}
      <div className="w-20 ml-4 border-b border-dashed border-white/20 hover:border-white/50 transition-colors">
        <input 
          type="number"
          defaultValue={Math.floor(timer.duration / 60)}
          onBlur={handleDurationChange}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          className="w-full bg-transparent font-bold text-lg outline-none text-white appearance-none cursor-text"
          title="Click to edit minutes"
        />
      </div>

      {/* 3. TIMER NAME (Editable) */}
      <div className="flex-1 ml-6 overflow-hidden">
        {isEditingName ? (
          <input 
            autoFocus
            defaultValue={timer.name}
            onBlur={handleNameChange}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className="w-full bg-[#0a0a0a] border border-blue-500 px-2 py-0.5 rounded outline-none text-white"
          />
        ) : (
          <span 
            onClick={() => setIsEditingName(true)}
            className="font-medium truncate cursor-text hover:text-white transition-colors block"
          >
            {timer.name}
          </span>
        )}
      </div>

      {/* 4. ACTIONS (Visible on Hover) */}
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
        
        {/* Only show delete for non-primary timers */}
        {timer.index > 1 && (
          <button 
            onClick={() => onDelete(timer.id)}
            className="p-1.5 cursor-pointer hover:bg-red-600 hover:text-white rounded bg-[#0a0a0a]/40 border border-white/5"
            title="Remove Timer"
          >
            <Trash2 size={14} />
          </button>
        )}

        <button 
          onClick={() => onReset(timer.id)}
          className="p-1.5 cursor-pointer hover:bg-black/40 rounded bg-[#0a0a0a]/40 border border-white/5"
          title="Reset to default"
        >
          <RotateCcw size={14} />
        </button>

        {/* <button className="p-1.5 cursor-pointer hover:bg-black/40 rounded bg-[#0a0a0a]/40 border border-white/5">
          <Settings size={14} />
        </button> */}
        
        {/* PLAY/PAUSE BUTTON */}
        <button 
          onClick={() => onToggle(timer.id)}
          className={`p-1.5 cursor-pointer rounded w-10 flex justify-center transition-all ${
            timer.status === 'RUNNING' 
              ? 'bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.4)]' 
              : 'bg-[#0a0a0a] border border-white/10 hover:border-green-500'
          }`}
        >
          {timer.status === 'RUNNING' ? (
            <Pause size={14} fill="currentColor" />
          ) : (
            <Play size={14} fill="currentColor" className="text-green-500" />
          )}
        </button>

        <button className="p-1.5 opacity-40 hover:opacity-100">
          <MoreHorizontal size={14} />
        </button>
      </div>
    </div>
  );
};
