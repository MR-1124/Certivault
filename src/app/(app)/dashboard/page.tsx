import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { DashboardAnimations } from "@/components/dashboard-animations";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const ninetyDaysFromNow = new Date(new Date().setDate(new Date().getDate() + 90));
  const today = new Date();

  const [totalCerts, verifiedCerts, publicCerts, expiringCount, expiringList, recentCerts, portfolio] = await Promise.all([
    prisma.certificate.count({ where: { userId: session.user.id } }),
    prisma.certificate.count({ where: { userId: session.user.id, verified: true } }),
    prisma.certificate.count({ where: { userId: session.user.id, isPublic: true } }),
    prisma.certificate.count({
      where: {
        userId: session.user.id,
        expirationDate: {
          lte: ninetyDaysFromNow,
          gte: today,
        },
      },
    }),
    prisma.certificate.findMany({
      where: {
        userId: session.user.id,
        expirationDate: {
          lte: ninetyDaysFromNow,
          gte: today,
        },
      },
      orderBy: { expirationDate: "asc" },
      take: 4,
    }),
    prisma.certificate.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.portfolioSetting.findUnique({
      where: { userId: session.user.id },
    }),
  ]);

  const stats = [
    {
      label: "Total Credentials",
      value: totalCerts,
      icon: "award",
      desc: "Stored in secure vault",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      label: "Verified Rate",
      value: totalCerts > 0 ? `${Math.round((verifiedCerts / totalCerts) * 100)}%` : "0%",
      numericValue: verifiedCerts,
      icon: "shield",
      desc: `${verifiedCerts} of ${totalCerts} verified`,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      label: "Expiring Soon",
      value: expiringCount,
      icon: "clock",
      desc: "Within next 90 days",
      color: expiringCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-slate-500",
      bg: expiringCount > 0 ? "bg-amber-50 dark:bg-amber-950/50" : "bg-slate-50 dark:bg-slate-800/50",
    },
    {
      label: "Public API Feed",
      value: publicCerts,
      icon: "code",
      desc: portfolio?.isPublic ? `/api/v1/vault/${portfolio.customSlug || "slug"}` : "Feed disabled",
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/50",
    },
  ];

  return (
    <DashboardAnimations
      stats={stats}
      expiringList={expiringList.map((c) => ({
        id: c.id,
        title: c.title,
        issuer: c.issuer,
        expirationDate: c.expirationDate ? c.expirationDate.toISOString() : null,
      }))}
      recentCerts={recentCerts.map((c) => ({
        id: c.id,
        title: c.title,
        issuer: c.issuer,
        verified: c.verified,
        isPublic: c.isPublic,
        credentialUrl: c.credentialUrl,
        fileUrl: c.fileUrl,
        createdAt: c.createdAt.toISOString(),
      }))}
      userName={session.user.name || "Engineer"}
      portfolioSlug={portfolio?.customSlug || null}
      isPortfolioPublic={portfolio?.isPublic || false}
    />
  );
}
