import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const workoutSchema = z.object({
  date: z.string(),
  notes: z.string().optional(),
  sets: z.array(
    z.object({
      exerciseId: z.string(),
      reps: z.number().int().positive(),
      weight: z.number().nonnegative(),
      rpe: z.number().min(5).max(10),
      tempo: z.string().optional(),
      rest: z.number().int().nonnegative(),
      tags: z.array(z.string()).default([])
    })
  )
});

export async function GET() {
  const workouts = await prisma.workout.findMany({
    include: { sets: { include: { exercise: true } } }
  });
  return NextResponse.json({ workouts });
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = workoutSchema.parse(body);
  const workout = await prisma.workout.create({
    data: {
      date: new Date(data.date),
      notes: data.notes,
      sets: {
        create: data.sets.map((set) => ({
          reps: set.reps,
          weight: set.weight,
          rpe: set.rpe,
          tempo: set.tempo,
          rest: set.rest,
          tags: set.tags,
          exercise: { connect: { id: set.exerciseId } }
        }))
      }
    },
    include: { sets: { include: { exercise: true } } }
  });
  return NextResponse.json({ workout }, { status: 201 });
}
