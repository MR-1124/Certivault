import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const portfolio = await prisma.portfolioSetting.findUnique({
      where: { customSlug: slug },
      include: {
        user: {
          select: {
            name: true,
            certificates: {
              where: { isPublic: true },
              orderBy: { issueDate: "desc" },
              select: {
                id: true,
                title: true,
                issuer: true,
                issueDate: true,
                expirationDate: true,
                credentialId: true,
                credentialUrl: true,
                verified: true,
                fileUrl: true,
              },
            },
          },
        },
      },
    });

    if (!portfolio || !portfolio.isPublic) {
      return NextResponse.json(
        { success: false, error: "Vault not found or public API access is disabled." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      owner: portfolio.user.name,
      certificates: portfolio.user.certificates,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
