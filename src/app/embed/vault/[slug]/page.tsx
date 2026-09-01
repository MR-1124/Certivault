import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ShieldCheck, ExternalLink, Award } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmbedVaultPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const theme = typeof sp.theme === "string" && sp.theme === "light" ? "light" : "dark";

  const portfolio = await prisma.portfolioSetting.findUnique({
    where: {
      customSlug: slug,
      isPublic: true,
    },
    include: {
      user: {
        select: {
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
    return (
      <div className={`p-6 text-center text-xs font-mono ${theme === "light" ? "bg-white text-slate-700" : "bg-slate-950 text-slate-300"}`}>
        Vault not found or set to private.
      </div>
    );
  }

  const certs = portfolio.user.certificates;
  const isDark = theme === "dark";

  return (
    <div className={`p-4 font-sans antialiased text-xs min-h-screen ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
            CV
          </div>
          <span className="font-bold text-xs tracking-tight">
            {portfolio.user.name || slug}&apos;s Credentials
          </span>
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified
          </span>
        </div>

        <a
          href={`/vault/${slug}`}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-blue-500 hover:underline font-medium"
        >
          View Full Vault ↗
        </a>
      </div>

      {/* Credentials List */}
      {certs.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          No public credentials listed.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {certs.map((cert) => {
            const isExpired = cert.expirationDate && new Date(cert.expirationDate) < new Date();

            return (
              <div
                key={cert.id}
                className={`p-3 rounded-xl border transition-all ${
                  isDark
                    ? "bg-slate-900/90 border-slate-800 hover:border-slate-700"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-bold text-xs line-clamp-1">
                      {cert.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">{cert.issuer}</p>
                  </div>
                  {cert.verified && (
                    <span className="text-emerald-500 shrink-0" title="Verified">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Issued {new Date(cert.issueDate).getFullYear()}</span>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline flex items-center gap-0.5"
                    >
                      Verify <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Widget Brand Footer */}
      <div className="pt-3 mt-3 text-center text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1">
        <span>Verified with</span>
        <a href="/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white underline font-semibold">
          CertVault
        </a>
      </div>

    </div>
  );
}
