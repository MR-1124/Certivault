import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { revalidatePath } from "next/cache";
import { CertificateGrid } from "@/components/certificate-grid";
import { Plus, Award } from "lucide-react";

export default async function CertificatesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";

  const certs = await prisma.certificate.findMany({
    where: {
      userId: session.user.id,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { issuer: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { issueDate: "desc" },
  });

  async function deleteCert(formData: FormData) {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return;
    const id = formData.get("id") as string;
    await prisma.certificate.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    });
    revalidatePath("/certificates");
    revalidatePath("/dashboard");
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Credential Vault
            </h1>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              {certs.length} {certs.length === 1 ? "record" : "records"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            {q ? `Showing results matching "${q}"` : "Manage, inspect, and export your verified credentials"}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SearchInput />
          <Link href="/certificates/new" className="shrink-0">
            <Button size="sm" className="gap-1.5 font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs">
              <Plus className="w-4 h-4" /> Add Credential
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Certificates Grid / List */}
      <CertificateGrid
        certs={certs.map((c) => ({
          id: c.id,
          title: c.title,
          issuer: c.issuer,
          issueDate: c.issueDate.toISOString(),
          expirationDate: c.expirationDate?.toISOString() ?? null,
          isPublic: c.isPublic,
          verified: c.verified,
          credentialUrl: c.credentialUrl,
          fileUrl: c.fileUrl,
        }))}
        q={q}
        deleteCert={deleteCert}
      />
    </div>
  );
}
