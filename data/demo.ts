import { macroTargets } from '@/lib/macros';
import { mifflinStJeor } from '@/lib/tdee';
import { linearRegressionTrend } from '@/lib/trend';

const baseTdee = mifflinStJeor({
  sex: 'male',
  weightKg: 78,
  heightCm: 178,
  age: 30,
  activityFactor: 1.5
});

export const demoMacroTarget = macroTargets({
  tdee: baseTdee,
  goal: 'recomp',
  weightKg: 78
});

const weightEntries = Array.from({ length: 14 }).map((_, index) => ({
  date: new Date(Date.now() - (13 - index) * 24 * 60 * 60 * 1000),
  weight: 78 - index * 0.05 + Math.sin(index) * 0.1
}));

const { slope, intercept } = linearRegressionTrend(
  weightEntries.map((entry) => ({ date: entry.date, value: entry.weight }))
);

export const demoWeightTrend = weightEntries.map((entry, index) => ({
  date: entry.date.toISOString(),
  weight: Number(entry.weight.toFixed(1)),
  trend: Number((intercept + slope * (index + 1)).toFixed(2))
}));
