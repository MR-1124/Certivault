import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  // Optional security check for Vercel Cron Secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const in90Days = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

  // Find certificates expiring within 90 days
  const expiringCerts = await prisma.certificate.findMany({
    where: {
      expirationDate: {
        gte: now,
        lte: in90Days,
      },
    },
    include: {
      user: {
        include: {
          webhookConfig: true,
        },
      },
    },
  });

  const dispatches: Array<{ user: string; cert: string; status: string }> = [];

  for (const cert of expiringCerts) {
    const config = cert.user.webhookConfig;
    if (config?.enabled && config.url) {
      const daysRemaining = Math.ceil(
        (new Date(cert.expirationDate!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      const payload = {
        event: "certificate.expiring_soon",
        timestamp: new Date().toISOString(),
        certificate: {
          id: cert.id,
          title: cert.title,
          issuer: cert.issuer,
          expirationDate: cert.expirationDate?.toISOString(),
          daysRemaining,
          credentialId: cert.credentialId,
          credentialUrl: cert.credentialUrl,
        },
      };

      try {
        await fetch(config.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "CertVault-Cron/1.0",
            ...(config.secret ? { "X-CertVault-Webhook-Secret": config.secret } : {}),
          },
          body: JSON.stringify(payload),
        });
        dispatches.push({ user: cert.user.email, cert: cert.title, status: "DISPATCHED" });
      } catch (e: any) {
        dispatches.push({ user: cert.user.email, cert: cert.title, status: `ERROR: ${e.message}` });
      }
    }
  }

  return NextResponse.json({
    success: true,
    scannedAt: now.toISOString(),
    expiringFound: expiringCerts.length,
    dispatches,
  });
}
