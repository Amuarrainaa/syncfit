'use client';

import { useState } from 'react';
import { RPESelector } from './rpe-selector';
import { Button } from '@/components/ui/button';

export interface WorkoutSet {
  id: string;
  exercise: string;
  reps: number;
  weight: number;
  rpe: number;
  rest: number;
  tempo: string;
  tags: string[];
}

interface Props {
  set: WorkoutSet;
  onChange: (set: WorkoutSet) => void;
}

export function WorkoutSetRow({ set, onChange }: Props) {
  const [resting, setResting] = useState(false);

  const update = (partial: Partial<WorkoutSet>) => {
    onChange({ ...set, ...partial });
  };

  return (
    <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
      <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <input value={set.exercise} onChange={(event) => update({ exercise: event.target.value })} className="input" />
        <input type="number" value={set.reps} onChange={(event) => update({ reps: Number(event.target.value) })} className="input" />
        <input type="number" value={set.weight} onChange={(event) => update({ weight: Number(event.target.value) })} className="input" />
        <input value={set.tempo} onChange={(event) => update({ tempo: event.target.value })} className="input" />
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <RPESelector value={set.rpe} onChange={(rpe) => update({ rpe })} />
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Descanso</span>
          <input type="number" value={set.rest} onChange={(event) => update({ rest: Number(event.target.value) })} className="input w-24" />
          <span className="text-slate-500">seg</span>
        </div>
        <div className="flex gap-2">
          {set.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              #{tag}
            </span>
          ))}
        </div>
        <Button size="sm" onClick={() => setResting((value) => !value)}>
          {resting ? 'Reanudar' : 'Iniciar descanso'}
        </Button>
      </div>
      {resting && <span className="text-xs text-slate-500">Temporizador activo en la tarjeta de descanso.</span>}
    </div>
  );
}
