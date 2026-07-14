import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { revalidatePath } from "next/cache";
import { CertificateGrid } from "@/components/certificate-grid";

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
      ...(q ? { OR: [{ title: { contains: q } }, { issuer: { contains: q } }] } : {}),
    },
    orderBy: { issueDate: "desc" },
  });

  async function deleteCert(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.certificate.delete({ where: { id } });
    revalidatePath("/certificates");
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">My Vault</p>
          <h1 className="text-4xl font-black tracking-[-0.03em]">Certificates</h1>
          <p className="text-muted-foreground mt-1.5 text-sm font-medium">
            {certs.length} certificate{certs.length !== 1 ? "s" : ""} {q ? `matching "${q}"` : "in your vault"}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SearchInput />
          <Link href="/certificates/new">
            <Button className="rounded-xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/35 h-10 px-5 whitespace-nowrap transition-shadow">
              + Add New
            </Button>
          </Link>
        </div>
      </div>

      <CertificateGrid certs={certs.map(c => ({
        id: c.id,
        title: c.title,
        issuer: c.issuer,
        issueDate: c.issueDate.toISOString(),
        expirationDate: c.expirationDate?.toISOString() ?? null,
        isPublic: c.isPublic,
        verified: c.verified,
        credentialUrl: c.credentialUrl,
        fileUrl: c.fileUrl,
      }))} q={q} deleteCert={deleteCert} />
    </div>
  );
}
