import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const portfolio = await prisma.portfolioSetting.findUnique({
    where: { customSlug: slug },
    include: {
      user: {
        select: {
          name: true,
          certificates: {
            where: { isPublic: true },
            orderBy: { issueDate: 'desc' }
          }
        }
      }
    }
  });

  if (!portfolio || !portfolio.isPublic) {
    return NextResponse.json({ error: 'Not found or not public' }, { status: 404 });
  }

  return NextResponse.json(portfolio);
}
