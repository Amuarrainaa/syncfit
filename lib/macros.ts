import { macroSplit, type MacroRecommendation } from './tdee';

export type GoalType = 'cut' | 'recomp' | 'bulk' | 'maintain';

export interface MacroTargetInput {
  tdee: number;
  goal: GoalType;
  weightKg: number;
}

const goalAdjustment: Record<GoalType, number> = {
  cut: -0.15,
  recomp: -0.05,
  maintain: 0,
  bulk: 0.12
};

export function macroTargets(input: MacroTargetInput): MacroRecommendation {
  const adjustedCalories = input.tdee * (1 + goalAdjustment[input.goal]);
  return macroSplit({
    calories: Math.round(adjustedCalories),
    weightKg: input.weightKg
  });
}
