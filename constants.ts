
import { TuningNote } from './types';

export const STANDARD_TUNING: TuningNote[] = [
  { name: 'E', frequency: 82.41, octave: 2 },  // 6ª Corda
  { name: 'A', frequency: 110.00, octave: 2 }, // 5ª Corda
  { name: 'D', frequency: 146.83, octave: 3 }, // 4ª Corda
  { name: 'G', frequency: 196.00, octave: 3 }, // 3ª Corda
  { name: 'B', frequency: 246.94, octave: 3 }, // 2ª Corda
  { name: 'E', frequency: 329.63, octave: 4 }, // 1ª Corda
];

export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const TUNER_COLORS = {
  inTune: '#22c55e',
  sharp: '#ef4444',
  flat: '#3b82f6',
  idle: '#94a3b8'
};
