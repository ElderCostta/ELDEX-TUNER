
import { PitchResult } from '../types';
import { NOTES } from '../constants';

export const autoCorrelate = (buffer: Float32Array, sampleRate: number): number => {
  const SIZE = buffer.length;
  let rms = 0;

  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  
  if (rms < 0.01) return -1;

  let r1 = 0, r2 = SIZE - 1, threshold = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) { r1 = i; break; }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < threshold) { r2 = SIZE - i; break; }
  }

  const buf = buffer.slice(r1, r2);
  const size = buf.length;

  const c = new Array(size).fill(0);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - i; j++) {
      c[i] = c[i] + buf[j] * buf[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < size; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;

  const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a !== 0) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
};

export const getPitchInfo = (frequency: number): PitchResult | null => {
  if (frequency <= 0) return null;

  const A4 = 440;
  const C0 = A4 * Math.pow(2, -4.75);
  const halfStepsFromC0 = Math.round(12 * Math.log2(frequency / C0));
  
  const octave = Math.floor(halfStepsFromC0 / 12);
  const noteIndex = ((halfStepsFromC0 % 12) + 12) % 12;
  const note = NOTES[noteIndex];
  
  const expectedFreq = C0 * Math.pow(2, halfStepsFromC0 / 12);
  const cents = Math.floor(1200 * Math.log2(frequency / expectedFreq));

  return {
    frequency,
    note,
    cents,
    octave
  };
};
