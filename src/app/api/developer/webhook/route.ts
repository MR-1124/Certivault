import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await prisma.webhookConfig.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json({
    url: config?.url || "",
    secret: config?.secret || "",
    enabled: config?.enabled ?? true,
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url, secret, enabled } = await req.json();

  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    return NextResponse.json({ error: "Please enter a valid HTTP/HTTPS webhook URL." }, { status: 400 });
  }

  const config = await prisma.webhookConfig.upsert({
    where: { userId: session.user.id },
    update: {
      url: url.trim(),
      secret: secret ? secret.trim() : null,
      enabled: Boolean(enabled),
    },
    create: {
      userId: session.user.id,
      url: url.trim(),
      secret: secret ? secret.trim() : null,
      enabled: Boolean(enabled),
    },
  });

  return NextResponse.json({ success: true, config });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await prisma.webhookConfig.findUnique({
    where: { userId: session.user.id },
  });

  if (!config?.url) {
    return NextResponse.json({ error: "No webhook URL configured." }, { status: 400 });
  }

  const payload = {
    event: "certvault.ping",
    timestamp: new Date().toISOString(),
    message: "Test webhook event triggered from CertVault Developer Hub.",
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    },
    sampleAlert: {
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      daysRemaining: 30,
      status: "EXPIRING_SOON",
    },
  };

  try {
    const res = await fetch(config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "CertVault-Webhook-Dispatcher/1.0",
        ...(config.secret ? { "X-CertVault-Webhook-Secret": config.secret } : {}),
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      success: true,
      statusCode: res.status,
      statusText: res.statusText,
      message: `Webhook received response code ${res.status}`,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to dispatch webhook payload.",
    }, { status: 502 });
  }
}
