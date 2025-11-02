import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const photoSchema = z.object({
  capturedAt: z.string(),
  note: z.string().optional(),
  storageUri: z.string().url().optional()
});

export async function GET() {
  const photos = await prisma.progressPhoto.findMany({ orderBy: { capturedAt: 'desc' } });
  return NextResponse.json({ photos });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const data = photoSchema.parse(payload);
  const photo = await prisma.progressPhoto.create({
    data: {
      capturedAt: new Date(data.capturedAt),
      note: data.note,
      storageUri: data.storageUri
    }
  });
  return NextResponse.json({ photo }, { status: 201 });
}
