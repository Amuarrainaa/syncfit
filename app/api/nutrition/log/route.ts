import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const logSchema = z.object({
  mealId: z.string(),
  consumedAt: z.string().optional()
});

export async function POST(request: Request) {
  const payload = await request.json();
  const data = logSchema.parse(payload);
  const meal = await prisma.meal.update({
    where: { id: data.mealId },
    data: { consumedAt: data.consumedAt ? new Date(data.consumedAt) : new Date() },
    include: { items: { include: { food: true } } }
  });
  return NextResponse.json({ meal }, { status: 200 });
}
