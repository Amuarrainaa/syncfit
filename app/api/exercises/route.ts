import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const exerciseSchema = z.object({
  name: z.string(),
  category: z.string(),
  equipment: z.string().optional()
});

export async function GET() {
  const exercises = await prisma.exercise.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json({ exercises });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const data = exerciseSchema.parse(payload);
  const exercise = await prisma.exercise.create({
    data: {
      name: data.name,
      category: data.category,
      equipment: data.equipment
    }
  });
  return NextResponse.json({ exercise }, { status: 201 });
}
