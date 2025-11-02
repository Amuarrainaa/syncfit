import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const [workouts, meals, metrics] = await Promise.all([
    prisma.workout.findMany({ include: { sets: true } }),
    prisma.meal.findMany({ include: { items: { include: { food: true } } } }),
    prisma.bodyMetric.findMany()
  ]);
  return NextResponse.json({ workouts, meals, metrics });
}
