import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const goalSchema = z.object({
  type: z.enum(['cut', 'recomp', 'bulk', 'maintain']),
  targetCalories: z.number().positive(),
  protein: z.number().positive(),
  carbs: z.number().nonnegative(),
  fats: z.number().nonnegative()
});

export async function GET() {
  const goals = await prisma.goal.findMany({ include: { macroTargets: true } });
  return NextResponse.json({ goals });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const data = goalSchema.parse(payload);
  const goal = await prisma.goal.create({
    data: {
      type: data.type,
      macroTargets: {
        create: {
          calories: data.targetCalories,
          protein: data.protein,
          carbs: data.carbs,
          fats: data.fats
        }
      }
    },
    include: { macroTargets: true }
  });
  return NextResponse.json({ goal }, { status: 201 });
}
