import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get("X-CertVault-API-Key");
    const referrer = request.headers.get("referer") || request.headers.get("origin") || "Direct Server Request";
    const userAgent = request.headers.get("user-agent") || "API Client";

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Missing 'X-CertVault-API-Key' header." },
        { status: 401 }
      );
    }

    const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex");

    const user = await prisma.user.findUnique({
      where: { apiKey: keyHash },
      select: {
        id: true,
        name: true,
        certificates: {
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
            isPublic: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Invalid API Key." },
        { status: 401 }
      );
    }

    // Log request asynchronously
    prisma.apiLog.create({
      data: {
        userId: user.id,
        endpoint: "/api/v1/certificates",
        referrer,
        userAgent,
        statusCode: 200,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      owner: user.name,
      certificates: user.certificates,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
