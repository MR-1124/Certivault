import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PublicVaultView } from "@/components/public-vault-view";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await prisma.portfolioSetting.findUnique({
    where: { customSlug: slug, isPublic: true },
    include: {
      user: { select: { name: true } },
    },
  });

  if (!portfolio) {
    return {
      title: "Vault Not Found | CertVault",
      description: "This credential vault is private or does not exist.",
    };
  }

  const name = portfolio.user.name || slug;
  return {
    title: `${name}'s Verified Credential Vault | CertVault`,
    description: portfolio.headline || `Explore verified certifications, achievements, and credentials earned by ${name}.`,
    openGraph: {
      title: `${name}'s Verified Credentials | CertVault`,
      description: portfolio.headline || `Verified credentials and professional certifications for ${name}.`,
      type: "profile",
    },
  };
}

export default async function PublicVaultPage({ params }: Props) {
  const { slug } = await params;

  const portfolio = await prisma.portfolioSetting.findUnique({
    where: {
      customSlug: slug,
      isPublic: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          certificates: {
            where: { isPublic: true },
            orderBy: { issueDate: "desc" },
          },
        },
      },
    },
  });

  if (!portfolio) {
    notFound();
  }

  const certificates = portfolio.user.certificates.map((c) => ({
    id: c.id,
    title: c.title,
    issuer: c.issuer,
    issueDate: c.issueDate.toISOString(),
    expirationDate: c.expirationDate?.toISOString() ?? null,
    credentialId: c.credentialId,
    credentialUrl: c.credentialUrl,
    verified: c.verified,
    fileUrl: c.fileUrl,
  }));

  // Schema.org EducationalOccupationalCredential JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: portfolio.user.name || slug,
    description: portfolio.headline || undefined,
    hasCredential: certificates.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.title,
      recognizedBy: {
        "@type": "Organization",
        name: c.issuer,
      },
      validFrom: c.issueDate,
      validUntil: c.expirationDate || undefined,
      url: c.credentialUrl || undefined,
      credentialCategory: "Certification",
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicVaultView
        slug={slug}
        ownerName={portfolio.user.name || slug}
        headline={portfolio.headline}
        bio={portfolio.bio}
        socialLinks={portfolio.socialLinks}
        certificates={certificates}
      />
    </>
  );
}
