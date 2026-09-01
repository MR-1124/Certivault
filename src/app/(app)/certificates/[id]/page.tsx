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
    if (cert.fileUrl.startsWith("data:")) {
      isPdf = cert.fileUrl.startsWith("data:application/pdf");
      isImage = cert.fileUrl.startsWith("data:image/");
    } else {
      const lowerUrl = cert.fileUrl.toLowerCase();
      isPdf = lowerUrl.endsWith(".pdf");
      isImage =
        lowerUrl.endsWith(".png") ||
        lowerUrl.endsWith(".jpg") ||
        lowerUrl.endsWith(".jpeg") ||
        lowerUrl.endsWith(".webp") ||
        lowerUrl.endsWith(".gif");
    }
  }

  const details = {
    id: cert.id,
    title: cert.title,
    issuer: cert.issuer,
    issueDate: cert.issueDate.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }),
    expirationDate: cert.expirationDate ? cert.expirationDate.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : null,
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
      <Link
        href="/certificates"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Vault
      </Link>

      <DetailsPageAnimations cert={details} />
    </div>
  );
}
