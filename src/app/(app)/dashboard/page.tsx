import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardAnimations } from "@/components/dashboard-animations";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const [totalCerts, verifiedCerts, publicCerts, expiringCerts, recentCerts] = await Promise.all([
    prisma.certificate.count({ where: { userId: session.user.id } }),
    prisma.certificate.count({ where: { userId: session.user.id, verified: true } }),
    prisma.certificate.count({ where: { userId: session.user.id, isPublic: true } }),
    prisma.certificate.count({
      where: {
        userId: session.user.id,
        expirationDate: {
          lte: new Date(new Date().setMonth(new Date().getMonth() + 3)),
          gte: new Date()
        }
      }
    }),
    prisma.certificate.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Total Certificates", value: totalCerts, icon: "award", color: "text-primary", bg: "bg-primary/10" },
    { label: "Verified", value: verifiedCerts, icon: "shield", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Expiring Soon", value: expiringCerts, icon: "clock", color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Public API Feed", value: publicCerts, icon: "share", color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  return (
    <DashboardAnimations
      stats={stats}
      recentCerts={recentCerts.map(c => ({
        id: c.id,
        title: c.title,
        issuer: c.issuer,
        createdAt: c.createdAt.toISOString(),
      }))}
      userName={session.user.name || ""}
    />
  );
}
