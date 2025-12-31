
import React from 'react';

interface NeedleProps {
  cents: number | null;
  isActive: boolean;
}

export const NeedleGauge: React.FC<NeedleProps> = ({ cents, isActive }) => {
  const rotation = isActive && cents !== null ? (cents / 50) * 45 : 0;
  const isCorrect = cents !== null && Math.abs(cents) < 5;
  
  return (
    <div className="relative w-64 h-32 overflow-hidden flex items-end justify-center mb-4">
      <div className="absolute top-0 w-64 h-64 border-8 border-slate-800 rounded-full border-b-transparent"></div>
      
      <div className="absolute w-full h-full">
        {[...Array(11)].map((_, i) => {
          const angle = -45 + i * 9;
          return (
            <div 
              key={i} 
              className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-slate-600 origin-bottom"
              style={{ transform: `translateX(-50%) rotate(${angle}deg) translateY(-118px)` }}
            />
          );
        })}
      </div>

      <div className="absolute bottom-0 left-1/2 w-1 h-5 bg-green-500 origin-bottom -translate-x-1/2 -translate-y-[115px]" />

      <div 
        className={`absolute bottom-0 left-1/2 w-1.5 h-28 origin-bottom transition-transform duration-100 ease-out z-10 ${
          isCorrect ? 'bg-green-400' : 'bg-red-500'
        }`}
        style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
      >
        <div className="w-full h-1/4 bg-white opacity-40" />
      </div>

      <div className="absolute bottom-[-10px] w-5 h-5 bg-slate-400 rounded-full border-4 border-slate-900 z-20" />
    </div>
  );
};

export const NoteHistory: React.FC<{ frequency: number | null }> = ({ frequency }) => {
  return (
    <div className="flex flex-col items-center mt-4">
      <span className="text-slate-500 text-xs uppercase tracking-widest mb-1">Frequência</span>
      <span className="font-orbitron text-xl text-slate-300">
        {frequency ? frequency.toFixed(2) : '--.--'} <span className="text-sm opacity-50">Hz</span>
      </span>
    </div>
  );
};
