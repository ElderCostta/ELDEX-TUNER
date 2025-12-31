
import React from 'react';
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';
import { NeedleGauge, NoteHistory } from './components/Visuals';
import { GuitarStrings } from './components/GuitarStrings';

const Logo: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className="relative flex items-center justify-center mb-2">
    <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" 
      className={`transition-all duration-500 ${isActive ? 'drop-shadow-[0_0_15px_rgba(34,197,94,0.6)] scale-110' : 'drop-shadow-none'}`}>
      <path d="M20 20H80V35H35V45H70V55H35V65H80V80H20V20Z" fill="#22c55e" />
      <rect x="10" y="10" width="80" height="5" fill="#ffffff" fillOpacity="0.2" />
      <rect x="10" y="85" width="80" height="5" fill="#ffffff" fillOpacity="0.2" />
      <path d="M10 10V90" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" />
      <path d="M90 10V90" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" />
      {isActive && (
        <circle cx="50" cy="50" r="45" stroke="#22c55e" strokeWidth="1" className="animate-ping opacity-20" />
      )}
    </svg>
  </div>
);

const App: React.FC = () => {
  const { state, startTuning, stopTuning } = useAudioAnalyzer();

  const handleToggleTuner = () => {
    if (state.isActive) {
      stopTuning();
    } else {
      startTuning();
    }
  };

  const getStatusColor = () => {
    if (state.error) return 'text-red-500';
    if (!state.isActive || state.cents === null) return 'text-slate-400';
    if (Math.abs(state.cents) < 5) return 'text-green-500';
    return state.cents > 0 ? 'text-red-500' : 'text-blue-500';
  };

  const getStatusText = () => {
    if (state.error) return state.error.toUpperCase();
    if (!state.isActive) return 'PRONTO PARA AFINAR';
    if (state.cents === null) return 'OUVINDO...';
    if (Math.abs(state.cents) < 5) return 'AFINADO';
    return state.cents > 0 ? 'MUITO AGUDO' : 'MUITO GRAVE';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center justify-between p-6 overflow-hidden">
      <header className="flex flex-col items-center mt-2 group">
        <Logo isActive={state.isActive} />
        <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold tracking-[0.2em] font-orbitron italic flex items-center">
                <span className="text-white">ELDEX</span>
                <span className="text-green-500 ml-2">TUNER</span>
            </h1>
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-green-500 to-transparent mt-1 opacity-50"></div>
        </div>
        <p className="text-slate-500 text-[10px] tracking-[0.4em] uppercase mt-2 font-semibold">Motor de Alta Precisão</p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-lg space-y-8">
        <div className="relative flex flex-col items-center">
          <NeedleGauge cents={state.cents} isActive={state.isActive} />
          
          <div className="text-center relative">
            <div className={`text-9xl font-bold font-orbitron transition-all duration-200 ${getStatusColor()} drop-shadow-[0_0_25px_rgba(34,197,94,0.15)]`}>
              {state.isActive && state.note ? state.note : '--'}
              {state.isActive && state.octave && <sub className="text-3xl ml-1 font-sans italic">{state.octave}</sub>}
            </div>
            
            <div className={`mt-6 font-bold text-sm tracking-[0.3em] uppercase ${getStatusColor()} ${state.isActive || state.error ? 'animate-pulse' : ''}`}>
              {getStatusText()}
            </div>
          </div>
        </div>

        <NoteHistory frequency={state.frequency} />

        <button
          onClick={handleToggleTuner}
          className={`group relative px-14 py-5 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-4 active:scale-95 overflow-hidden ${
            state.isActive 
            ? 'bg-transparent border-2 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
            : 'bg-green-600 border-2 border-green-600 text-white shadow-[0_0_30px_rgba(34,197,94,0.3)]'
          }`}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <i className={`fa-solid ${state.isActive ? 'fa-stop-circle' : 'fa-microphone-lines'} text-xl`}></i>
          <span className="tracking-widest">{state.isActive ? 'PARAR' : 'INICIAR AFINADOR'}</span>
        </button>

        <GuitarStrings currentNote={state.note} />
      </main>

      <footer className="w-full flex flex-col items-center gap-2 text-slate-600 text-[9px] px-4 py-6 border-t border-white/5">
        <div className="flex gap-8 tracking-widest font-semibold uppercase">
          <span>Precisão: 0.1Hz</span>
          <span>Eldex Labs</span>
          <span>V1.0.4</span>
        </div>
        <div className="opacity-50">ELDEX MUSICAL INSTRUMENTS &copy; 2024</div>
      </footer>
    </div>
  );
};

export default App;
