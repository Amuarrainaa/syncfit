'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import demoFoods from '@/data/demo-foods.json';

type Food = (typeof demoFoods)[number];

export function FoodSearch() {
  const [query, setQuery] = useState('');
  const filtered = demoFoods.filter((food) => food.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
      <h2 className="text-lg font-semibold">Buscador de alimentos</h2>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Ej. pechuga de pollo"
        className="input mt-4"
      />
      <ul className="mt-4 max-h-80 space-y-3 overflow-y-auto text-sm">
        {filtered.slice(0, 10).map((food) => (
          <li key={food.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-800">
            <div>
              <p className="font-medium">{food.name}</p>
              <p className="text-xs text-slate-500">
                {food.calories} kcal • P {food.protein}g • C {food.carbs}g • G {food.fat}g
              </p>
            </div>
            <Button size="sm" onClick={() => addFood(food)}>
              Añadir
            </Button>
          </li>
        ))}
        {filtered.length === 0 && <li className="text-xs text-slate-500">No se encontraron alimentos.</li>}
      </ul>
    </div>
  );
}

function addFood(food: Food) {
  const meals = JSON.parse(window.localStorage.getItem('syncfit-meals') ?? '[]');
  meals.push({ ...food, quantity: 1 });
  window.localStorage.setItem('syncfit-meals', JSON.stringify(meals));
}
