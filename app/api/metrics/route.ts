import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const metricSchema = z.object({
  date: z.string(),
  weight: z.number().positive(),
  bodyFat: z.number().min(0).max(60).optional(),
  waist: z.number().positive().optional()
});

export async function GET() {
  const metrics = await prisma.bodyMetric.findMany({ orderBy: { date: 'desc' } });
  return NextResponse.json({ metrics });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const data = metricSchema.parse(payload);
  const metric = await prisma.bodyMetric.create({
    data: {
      date: new Date(data.date),
      weight: data.weight,
      bodyFat: data.bodyFat,
      waist: data.waist
    }
  });
  return NextResponse.json({ metric }, { status: 201 });
}
