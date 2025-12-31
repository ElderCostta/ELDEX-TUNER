
import React from 'react';
import { STANDARD_TUNING } from '../constants';

interface GuitarStringsProps {
  currentNote: string | null;
}

export const GuitarStrings: React.FC<GuitarStringsProps> = ({ currentNote }) => {
  return (
    <div className="grid grid-cols-6 gap-3 w-full max-w-md mt-10">
      {STANDARD_TUNING.map((note, idx) => {
        const isActive = currentNote === note.name;
        return (
          <div 
            key={idx}
            className={`flex flex-col items-center p-3 rounded-lg border transition-all duration-300 ${
              isActive 
              ? 'bg-slate-800 border-green-500 scale-105 shadow-lg shadow-green-500/10' 
              : 'bg-slate-900 border-slate-700 opacity-60'
            }`}
          >
            <span className={`text-xl font-bold font-orbitron ${isActive ? 'text-green-400' : 'text-slate-400'}`}>
              {note.name}
            </span>
            <span className="text-[10px] text-slate-500 mt-1">Corda {6 - idx}</span>
          </div>
        );
      }).reverse()}
    </div>
  );
};
