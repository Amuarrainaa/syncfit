import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const mealSchema = z.object({
  name: z.string(),
  consumedAt: z.string(),
  items: z.array(
    z.object({
      foodId: z.string(),
      quantity: z.number().positive()
    })
  )
});

export async function GET() {
  const meals = await prisma.meal.findMany({
    include: {
      items: {
        include: { food: true }
      }
    }
  });
  return NextResponse.json({ meals });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const data = mealSchema.parse(payload);
  const meal = await prisma.meal.create({
    data: {
      name: data.name,
      consumedAt: new Date(data.consumedAt),
      items: {
        create: data.items.map((item) => ({
          quantity: item.quantity,
          food: { connect: { id: item.foodId } }
        }))
      }
    },
    include: { items: { include: { food: true } } }
  });
  return NextResponse.json({ meal }, { status: 201 });
}
