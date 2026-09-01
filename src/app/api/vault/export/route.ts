import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      certificates: {
        orderBy: { issueDate: "desc" },
      },
      portfolio: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const exportPayload = {
    version: "certvault-v3",
    exportedAt: new Date().toISOString(),
    owner: {
      name: user.name,
      email: user.email,
      slug: user.portfolio?.customSlug,
      headline: user.portfolio?.headline,
      bio: user.portfolio?.bio,
    },
    certificates: user.certificates.map((c) => ({
      title: c.title,
      issuer: c.issuer,
      issueDate: c.issueDate.toISOString().split("T")[0],
      expirationDate: c.expirationDate ? c.expirationDate.toISOString().split("T")[0] : null,
      credentialId: c.credentialId,
      credentialUrl: c.credentialUrl,
      verified: c.verified,
      isPublic: c.isPublic,
      fileUrl: c.fileUrl,
    })),
    schemaOrgJsonLd: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: user.name,
      hasCredential: user.certificates.map((c) => ({
        "@type": "EducationalOccupationalCredential",
        name: c.title,
        recognizedBy: { "@type": "Organization", name: c.issuer },
        validFrom: c.issueDate.toISOString().split("T")[0],
        validUntil: c.expirationDate ? c.expirationDate.toISOString().split("T")[0] : undefined,
        url: c.credentialUrl || undefined,
      })),
    },
  };

  const filename = `certvault-backup-${(user.name || "vault").toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.json`;

  return new NextResponse(JSON.stringify(exportPayload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
