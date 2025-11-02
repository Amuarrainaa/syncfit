'use client';

import { cn } from '@/lib/utils';
import { calorieAdjustment } from '@/lib/tdee';

interface Props {
  target: number;
  consumed: number;
  trendDelta: number;
}

export function CalorieProgressBar({ target, consumed, trendDelta }: Props) {
  const percentage = Math.min(100, Math.round((consumed / target) * 100));
  const adjustment = calorieAdjustment({
    weightTrendDelta: trendDelta,
    targetDirection: trendDelta > 0 ? 'cut' : 'recomp',
    adherence: 0.85
  });

  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium">Calorías {consumed}/{target}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{percentage}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className={cn('h-full rounded-full bg-brand transition-all')} style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-300">
        Recomendación automática: {adjustment === 0 ? 'mantener calorías actuales' : `${Math.round(adjustment * 100)}%`}
      </p>
    </div>
  );
}
