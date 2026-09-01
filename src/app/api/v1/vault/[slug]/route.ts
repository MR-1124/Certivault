import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const referrer = request.headers.get("referer") || request.headers.get("origin") || "Direct";
    const userAgent = request.headers.get("user-agent") || "Unknown";

    const portfolio = await prisma.portfolioSetting.findUnique({
      where: { customSlug: slug },
      include: {
        user: {
          select: {
            id: true,
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
      // Log 404 asynchronously
      prisma.apiLog.create({
        data: {
          endpoint: `/api/v1/vault/${slug}`,
          slug,
          referrer,
          userAgent,
          statusCode: 404,
        },
      }).catch(() => {});

      return NextResponse.json(
        { success: false, error: "Vault not found or public API access is disabled." },
        { status: 404 }
      );
    }

    // Log 200 asynchronously
    prisma.apiLog.create({
      data: {
        userId: portfolio.user.id,
        endpoint: `/api/v1/vault/${slug}`,
        slug,
        referrer,
        userAgent,
        statusCode: 200,
      },
    }).catch(() => {});

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
