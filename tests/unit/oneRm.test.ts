import { describe, expect, it } from 'vitest';
import { estimateOneRm, detectPr } from '@/lib/oneRm';

describe('estimateOneRm', () => {
  it('usa fórmula de Epley por defecto', () => {
    const oneRm = estimateOneRm({ weight: 100, reps: 5 });
    expect(Math.round(oneRm)).toBe(117);
  });

  it('permite fórmula de Brzycki', () => {
    const oneRm = estimateOneRm({ weight: 100, reps: 5, formula: 'brzycki' });
    expect(Math.round(oneRm)).toBe(112);
  });
});

describe('detectPr', () => {
  it('detecta PR cuando no hay histórico', () => {
    expect(detectPr({ historicalBest: undefined, newValue: 120 })).toBe(true);
  });

  it('detecta PR cuando supera histórico', () => {
    expect(detectPr({ historicalBest: 110, newValue: 112 })).toBe(true);
  });

  it('no detecta PR cuando es menor o igual', () => {
    expect(detectPr({ historicalBest: 112, newValue: 111 })).toBe(false);
  });
});
