
import { useState, useRef, useCallback } from 'react';
import { TunerState } from '../types';
import { autoCorrelate, getPitchInfo } from '../utils/pitchProcessor';

export const useAudioAnalyzer = () => {
  const [state, setState] = useState<TunerState>({
    isActive: false,
    frequency: null,
    note: null,
    cents: null,
    octave: null,
    error: null,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startTuning = useCallback(async () => {
    setState(prev => ({ ...prev, error: null }));
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        } 
      });
      
      streamRef.current = stream;
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      
      const source = audioCtx.createMediaStreamSource(stream);
      const analyzer = audioCtx.createAnalyser();
      analyzer.fftSize = 2048;
      source.connect(analyzer);
      analyzerRef.current = analyzer;

      setState(prev => ({ ...prev, isActive: true, error: null }));

      const buffer = new Float32Array(analyzer.fftSize);
      
      const updatePitch = () => {
        if (!analyzerRef.current) return;
        
        analyzer.getFloatTimeDomainData(buffer);
        const freq = autoCorrelate(buffer, audioCtx.sampleRate);
        
        if (freq !== -1) {
          const info = getPitchInfo(freq);
          if (info) {
            setState(prev => ({
              ...prev,
              frequency: info.frequency,
              note: info.note,
              cents: info.cents,
              octave: info.octave
            }));
          }
        }
        
        animationFrameRef.current = requestAnimationFrame(updatePitch);
      };

      updatePitch();
    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      let errorMessage = 'Erro no microfone.';
      
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError' || err.message.includes('not found')) {
        errorMessage = 'Nenhum microfone detectado. Conecte um dispositivo.';
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Acesso negado. Permita o microfone nas configurações.';
      } else {
        errorMessage = 'Certifique-se de estar usando HTTPS ou localhost.';
      }
      
      setState(prev => ({ ...prev, error: errorMessage, isActive: false }));
    }
  }, []);

  const stopTuning = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    
    setState({
      isActive: false,
      frequency: null,
      note: null,
      cents: null,
      octave: null,
      error: null,
    });
  }, []);

  return { state, startTuning, stopTuning };
};
