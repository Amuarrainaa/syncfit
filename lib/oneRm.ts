export type OneRmFormula = 'epley' | 'brzycki';

export function estimateOneRm({
  weight,
  reps,
  formula = 'epley'
}: {
  weight: number;
  reps: number;
  formula?: OneRmFormula;
}) {
  if (reps <= 1) return weight;
  if (formula === 'epley') {
    return weight * (1 + reps / 30);
  }
  return weight * (36 / (37 - reps));
}

export function detectPr({
  historicalBest,
  newValue
}: {
  historicalBest?: number;
  newValue: number;
}) {
  if (!historicalBest) return true;
  return newValue > historicalBest;
}
