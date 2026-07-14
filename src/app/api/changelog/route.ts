import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const changelogs = await prisma.changelog.findMany({
    orderBy: { date: 'desc' }
  });
  return NextResponse.json(changelogs);
}
