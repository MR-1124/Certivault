import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DetailsPageAnimations } from "@/components/details-page-animations";

export default async function CertificateDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const { id } = await params;

  const cert = await prisma.certificate.findUnique({
    where: { id },
  });

  // Verify ownership & existence
  if (!cert || cert.userId !== session.user.id) {
    notFound();
  }

  // Detect file type
  let isPdf = false;
  let isImage = false;
  if (cert.fileUrl) {
    const lowerUrl = cert.fileUrl.toLowerCase();
    isPdf = lowerUrl.endsWith(".pdf");
    isImage = lowerUrl.endsWith(".png") || lowerUrl.endsWith(".jpg") || lowerUrl.endsWith(".jpeg") || lowerUrl.endsWith(".webp") || lowerUrl.endsWith(".gif");
  }

  const details = {
    id: cert.id,
    title: cert.title,
    issuer: cert.issuer,
    issueDate: cert.issueDate.toLocaleDateString(),
    expirationDate: cert.expirationDate ? cert.expirationDate.toLocaleDateString() : null,
    credentialId: cert.credentialId,
    credentialUrl: cert.credentialUrl,
    isPublic: cert.isPublic,
    verified: cert.verified,
    fileUrl: cert.fileUrl,
    isPdf,
    isImage,
  };

  return (
    <div className="space-y-6">
      <Link href="/certificates" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Certificates
      </Link>

      <DetailsPageAnimations cert={details} />
    </div>
  );
}
