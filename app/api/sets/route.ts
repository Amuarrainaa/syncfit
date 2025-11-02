import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const setSchema = z.object({
  workoutId: z.string(),
  exerciseId: z.string(),
  reps: z.number().int().positive(),
  weight: z.number().nonnegative(),
  rpe: z.number().min(5).max(10),
  tempo: z.string().optional(),
  rest: z.number().int().nonnegative(),
  tags: z.array(z.string()).default([])
});

export async function POST(request: Request) {
  const payload = await request.json();
  const data = setSchema.parse(payload);
  const set = await prisma.workoutSet.create({
    data: {
      reps: data.reps,
      weight: data.weight,
      rpe: data.rpe,
      tempo: data.tempo,
      rest: data.rest,
      tags: data.tags,
      workout: { connect: { id: data.workoutId } },
      exercise: { connect: { id: data.exerciseId } }
    }
  });
  return NextResponse.json({ set }, { status: 201 });
}
