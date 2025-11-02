import { describe, expect, it } from 'vitest';
import { macroTargets } from '@/lib/macros';
import { mifflinStJeor } from '@/lib/tdee';

describe('mifflinStJeor', () => {
  it('calcula TDEE para perfil masculino', () => {
    const tdee = mifflinStJeor({ sex: 'male', weightKg: 80, heightCm: 180, age: 30, activityFactor: 1.55 });
    expect(Math.round(tdee)).toBe(2966);
  });
});

describe('macroTargets', () => {
  it('genera macros coherentes con recomposición', () => {
    const tdee = mifflinStJeor({ sex: 'male', weightKg: 78, heightCm: 178, age: 30, activityFactor: 1.5 });
    const macros = macroTargets({ tdee, goal: 'recomp', weightKg: 78 });
    expect(macros.calories).toBeGreaterThan(0);
    expect(macros.proteinGrams).toBeGreaterThan(macros.fatGrams);
  });
});
