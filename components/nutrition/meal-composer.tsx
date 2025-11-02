'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MacroRing } from './macro-ring';
import { macroTargets } from '@/lib/macros';
import { mifflinStJeor } from '@/lib/tdee';

interface MealItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
}

export function MealComposer() {
  const [items, setItems] = useState<MealItem[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem('syncfit-meals');
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('syncfit-meals', JSON.stringify(items));
  }, [items]);

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.calories += item.calories * item.quantity;
        acc.protein += item.protein * item.quantity;
        acc.carbs += item.carbs * item.quantity;
        acc.fat += item.fat * item.quantity;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [items]);

  const macroTarget = useMemo(() => {
    const tdee = mifflinStJeor({ sex: 'male', weightKg: 78, heightCm: 178, age: 30, activityFactor: 1.5 });
    return macroTargets({ tdee, goal: 'recomp', weightKg: 78 });
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
      <h2 className="text-lg font-semibold">Comidas de hoy</h2>
      <div className="mt-4 space-y-3 text-sm">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-800">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-slate-500">
                {item.calories * item.quantity} kcal • P {item.protein * item.quantity}g • C {item.carbs * item.quantity}g • G {item.fat * item.quantity}g
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="input w-20"
                value={item.quantity}
                min={0.5}
                step={0.5}
                onChange={(event) =>
                  setItems((current) =>
                    current.map((entry) =>
                      entry.id === item.id ? { ...entry, quantity: Number(event.target.value) } : entry
                    )
                  )
                }
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}
              >
                Quitar
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-slate-500">Añade alimentos desde el buscador para componer tu comida.</p>}
      </div>
      <div className="mt-6 grid gap-4">
        <div className="rounded-xl bg-slate-100 p-4 text-sm dark:bg-slate-900/60">
          <p>Calorías totales: <strong>{Math.round(totals.calories)}</strong></p>
          <p>Proteínas: {Math.round(totals.protein)} g</p>
          <p>Carbohidratos: {Math.round(totals.carbs)} g</p>
          <p>Grasas: {Math.round(totals.fat)} g</p>
        </div>
        <MacroRing
          values={macroTarget}
          consumed={{ protein: totals.protein, carbs: totals.carbs, fat: totals.fat }}
        />
      </div>
    </div>
  );
}
