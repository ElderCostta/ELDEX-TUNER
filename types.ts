
export interface TuningNote {
  name: string;
  frequency: number;
  octave: number;
}

export interface TunerState {
  isActive: boolean;
  frequency: number | null;
  note: string | null;
  cents: number | null;
  octave: number | null;
  error: string | null;
}

export interface PitchResult {
  frequency: number;
  note: string;
  cents: number;
  octave: number;
}
