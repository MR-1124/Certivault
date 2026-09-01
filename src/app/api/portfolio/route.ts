import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const portfolio = await prisma.portfolioSetting.findUnique({
    where: { userId: session.user.id }
  });

  if (!portfolio) {
    const newPortfolio = await prisma.portfolioSetting.create({
      data: { userId: session.user.id, customSlug: session.user.id }
    });
    return NextResponse.json(newPortfolio);
  }

  return NextResponse.json(portfolio);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { isPublic, customSlug, headline, bio, socialLinks } = await req.json();

  if (customSlug) {
    const slugRegex = /^[a-zA-Z0-9-_]+$/;
    if (!slugRegex.test(customSlug)) {
      return NextResponse.json(
        { error: "Slug contains invalid characters. Use alphanumeric, dashes, and underscores only." },
        { status: 400 }
      );
    }
  }

  try {
    // Check if slug is taken
    if (customSlug) {
      const existing = await prisma.portfolioSetting.findUnique({ where: { customSlug } });
      if (existing && existing.userId !== session.user.id) {
        return NextResponse.json({ error: 'Slug is already taken by another account.' }, { status: 409 });
      }
    }

    const portfolio = await prisma.portfolioSetting.upsert({
      where: { userId: session.user.id },
      update: {
        isPublic: Boolean(isPublic),
        customSlug: customSlug ? customSlug.trim() : null,
        headline: typeof headline === 'string' ? headline.trim() : undefined,
        bio: typeof bio === 'string' ? bio.trim() : undefined,
        socialLinks: typeof socialLinks === 'string' ? socialLinks : typeof socialLinks === 'object' ? JSON.stringify(socialLinks) : undefined,
      },
      create: {
        userId: session.user.id,
        isPublic: Boolean(isPublic),
        customSlug: customSlug ? customSlug.trim() : null,
        headline: typeof headline === 'string' ? headline.trim() : null,
        bio: typeof bio === 'string' ? bio.trim() : null,
        socialLinks: typeof socialLinks === 'string' ? socialLinks : typeof socialLinks === 'object' ? JSON.stringify(socialLinks) : null,
      }
    });

    return NextResponse.json(portfolio);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update portfolio settings.' }, { status: 500 });
  }
}
