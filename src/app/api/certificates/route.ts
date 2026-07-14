import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');

  const certificates = await prisma.certificate.findMany({
    where: {
      userId: session.user.id,
      ...(search && {
        OR: [
          { title: { contains: search } },
          { issuer: { contains: search } }
        ]
      })
    },
    orderBy: { issueDate: 'desc' },
    include: { tags: true }
  });

  return NextResponse.json(certificates);
}

import { CertificateSchema } from '@/lib/validations';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    
    // Parse form values into schema payload
    const payload = {
      title: formData.get('title') as string,
      issuer: formData.get('issuer') as string,
      issueDate: formData.get('issueDate') as string,
      expirationDate: formData.get('expirationDate') as string,
      credentialId: formData.get('credentialId') as string,
      credentialUrl: formData.get('credentialUrl') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      isPublic: formData.get('isPublic') === 'true',
    };

    const parsed = CertificateSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const {
      title,
      issuer,
      issueDate: parsedIssueDate,
      expirationDate: parsedExpirationDate,
      credentialId,
      credentialUrl,
      category,
      description,
      isPublic,
    } = parsed.data;

    const issueDate = new Date(parsedIssueDate);
    const expirationDate = parsedExpirationDate ? new Date(parsedExpirationDate) : null;

    let fileUrl = null;
    const file = formData.get('file') as File;
    
    if (file && file.size > 0) {
      // 1. Validate file size (max 4.5MB to stay within Vercel serverless request limits)
      const maxBytes = 4.5 * 1024 * 1024;
      if (file.size > maxBytes) {
        return NextResponse.json({ error: "File size exceeds 4.5MB limit." }, { status: 400 });
      }

      // 2. Validate MIME type
      const allowedMimes = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!allowedMimes.includes(file.type)) {
        return NextResponse.json({ error: "Unsupported file type. Only PDF and images are allowed." }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      fileUrl = `data:${file.type};base64,${base64}`;
    }

    const certificate = await prisma.certificate.create({
      data: {
        title,
        issuer,
        issueDate,
        expirationDate,
        credentialId,
        credentialUrl,
        category,
        description,
        isPublic,
        fileUrl,
        userId: session.user.id,
      }
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 });
  }
}
