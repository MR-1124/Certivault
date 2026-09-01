import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Get user's custom slug if configured
  const portfolio = await prisma.portfolioSetting.findUnique({
    where: { userId: session.user.id },
    select: { customSlug: true },
  });

  const logs = await prisma.apiLog.findMany({
    where: {
      OR: [
        { userId: session.user.id },
        portfolio?.customSlug ? { slug: portfolio.customSlug } : { userId: session.user.id },
      ],
      createdAt: { gte: sevenDaysAgo },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // Calculate daily volumes for the last 7 days
  const dailyCounts: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    dailyCounts[key] = 0;
  }

  const referrerCounts: Record<string, number> = {};
  let totalSuccess = 0;
  let totalErrors = 0;

  logs.forEach((log) => {
    const day = log.createdAt.toISOString().split("T")[0];
    if (dailyCounts[day] !== undefined) {
      dailyCounts[day]++;
    }

    if (log.statusCode >= 200 && log.statusCode < 300) {
      totalSuccess++;
    } else {
      totalErrors++;
    }

    let ref = log.referrer || "Direct";
    if (ref.startsWith("http")) {
      try {
        ref = new URL(ref).hostname;
      } catch {}
    }
    referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
  });

  const topReferrers = Object.entries(referrerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([domain, count]) => ({ domain, count }));

  const chartData = Object.entries(dailyCounts).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString(undefined, { weekday: "short", month: "numeric", day: "numeric" }),
    count,
  }));

  return NextResponse.json({
    totalCalls: logs.length,
    totalSuccess,
    totalErrors,
    chartData,
    topReferrers,
    recentLogs: logs.slice(0, 15).map((l) => ({
      id: l.id,
      endpoint: l.endpoint,
      referrer: l.referrer,
      statusCode: l.statusCode,
      createdAt: l.createdAt.toISOString(),
    })),
  });
}
