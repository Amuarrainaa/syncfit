import { z } from 'zod';

export const mifflinSchema = z.object({
  sex: z.enum(['male', 'female', 'other']).default('other'),
  weightKg: z.number().positive(),
  heightCm: z.number().positive(),
  age: z.number().positive(),
  activityFactor: z.number().min(1.1).max(1.9)
});

const sexFactor: Record<'male' | 'female' | 'other', number> = {
  male: 5,
  female: -161,
  other: -78
};

export function mifflinStJeor(input: z.infer<typeof mifflinSchema>) {
  const data = mifflinSchema.parse(input);
  const base = 10 * data.weightKg + 6.25 * data.heightCm - 5 * data.age + sexFactor[data.sex];
  return base * data.activityFactor;
}

export interface MacroRecommendation {
  calories: number;
  proteinGrams: number;
  fatGrams: number;
  carbsGrams: number;
}

export function macroSplit({
  calories,
  weightKg,
  proteinRange = [1.8, 2.0],
  fatRange = [0.7, 0.9]
}: {
  calories: number;
  weightKg: number;
  proteinRange?: [number, number];
  fatRange?: [number, number];
}): MacroRecommendation {
  const protein = Math.min(proteinRange[1], Math.max(proteinRange[0], 1.8)) * weightKg;
  const fat = Math.min(fatRange[1], Math.max(fatRange[0], 0.7)) * weightKg;
  const caloriesProtein = protein * 4;
  const caloriesFat = fat * 9;
  const carbs = Math.max(0, (calories - caloriesProtein - caloriesFat) / 4);
  return {
    calories,
    proteinGrams: Math.round(protein),
    fatGrams: Math.round(fat),
    carbsGrams: Math.round(carbs)
  };
}

export function calorieAdjustment({
  weightTrendDelta,
  targetDirection,
  adherence
}: {
  weightTrendDelta: number;
  targetDirection: 'cut' | 'recomp' | 'bulk' | 'maintain';
  adherence: number;
}) {
  const adjustDown = targetDirection === 'cut' || targetDirection === 'recomp';
  const threshold = 0.005;
  if (weightTrendDelta >= threshold && adjustDown) {
    return -0.07;
  }
  if (weightTrendDelta <= -threshold && !adjustDown) {
    return 0.07;
  }
  if (adherence < 0.6) {
    return 0;
  }
  return 0;
}
