'use client';

import { useMemo } from 'react';
import { calorieAdjustment } from '@/lib/tdee';
import { WeightTrendChart } from '@/components/progress/weight-trend-chart';
import { demoWeightTrend } from '@/data/demo';

export function AdjustmentInsights() {
  const trend = useMemo(() => {
    const change = demoWeightTrend[demoWeightTrend.length - 1]!.trend - demoWeightTrend[0]!.trend;
    return change / demoWeightTrend[0]!.trend;
  }, []);

  const recommendation = calorieAdjustment({ weightTrendDelta: trend / 2, targetDirection: 'recomp', adherence: 0.85 });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
      <h2 className="text-lg font-semibold">Auto-ajuste de calorías</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Calculamos la variación de peso y adherencia para sugerir ajustes semanalmente.
      </p>
      <div className="mt-4">
        <WeightTrendChart data={demoWeightTrend} />
      </div>
      <p className="mt-4 text-sm">
        Recomendación actual: <strong>{recommendation === 0 ? 'Mantener calorías actuales' : `${Math.round(recommendation * 100)}%`}</strong>
      </p>
    </section>
  );
}
