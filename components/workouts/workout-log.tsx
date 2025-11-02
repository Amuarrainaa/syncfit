'use client';

import { useState } from 'react';
import { WorkoutSetRow } from './workout-set-row';
import { Button } from '@/components/ui/button';
import { pushToast } from '@/components/ui/toaster';
import type { WorkoutSet } from './workout-set-row';

const defaultSets: WorkoutSet[] = [
  {
    id: 'set-1',
    exercise: 'Sentadilla trasera',
    reps: 5,
    weight: 100,
    rpe: 8,
    rest: 120,
    tempo: '3010',
    tags: ['compuesto']
  }
];

export function WorkoutLog() {
  const [sets, setSets] = useState<WorkoutSet[]>(defaultSets);

  const addSet = () => {
    setSets((current) => [
      ...current,
      {
        id: (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)),
        exercise: 'Press banca',
        reps: 5,
        weight: 80,
        rpe: 8,
        rest: 150,
        tempo: '20X1',
        tags: ['superserie-a']
      }
    ]);
  };

  const updateSet = (nextSet: WorkoutSet) => {
    setSets((current) => current.map((set) => (set.id === nextSet.id ? nextSet : set)));
  };

  const submit = () => {
    window.localStorage.setItem('syncfit-workout', JSON.stringify(sets));
    pushToast('Entrenamiento guardado offline. Se sincronizará al volver online.');
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {sets.map((set) => (
          <WorkoutSetRow key={set.id} set={set} onChange={updateSet} />
        ))}
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={addSet}>
          Añadir set
        </Button>
        <Button type="button" onClick={submit}>
          Guardar sesión
        </Button>
      </div>
    </div>
  );
}
