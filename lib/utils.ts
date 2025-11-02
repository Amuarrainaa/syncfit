import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function kgToLbs(kg: number) {
  return kg * 2.20462;
}

export function formatKg(value: number) {
  return `${value.toFixed(1)} kg`;
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value as string}`);
}
