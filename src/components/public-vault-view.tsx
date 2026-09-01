"use client";

import { useState } from "react";
import { ShieldCheck, ExternalLink, FileText, Copy, Check, Calendar, Globe, Award, Sparkles, X, Code2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CertItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  verified: boolean;
  fileUrl: string | null;
}

interface PublicVaultProps {
  slug: string;
  ownerName: string;
  headline?: string | null;
  bio?: string | null;
  socialLinks?: string | null;
  certificates: CertItem[];
}

export function PublicVaultView({
  slug,
  ownerName,
  headline,
  bio,
  socialLinks,
  certificates,
}: PublicVaultProps) {
  const [filter, setFilter] = useState<"all" | "verified" | "active">("all");
  const [activeModalCert, setActiveModalCert] = useState<CertItem | null>(null);
  const [copiedFeed, setCopiedFeed] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getDaysRemaining = (expDate: string | null) => {
    if (!expDate) return null;
    const diff = new Date(expDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getValidityProgress = (issueDate: string, expDate: string | null) => {
    if (!expDate) return 100;
    const start = new Date(issueDate).getTime();
    const end = new Date(expDate).getTime();
    const now = new Date().getTime();
    if (now >= end) return 0;
    if (now <= start) return 100;
    const remaining = ((end - now) / (end - start)) * 100;
    return Math.max(2, Math.min(100, Math.round(remaining)));
  };

  const filteredCerts = certificates.filter((c) => {
    if (filter === "verified") return c.verified;
    if (filter === "active") {
      const days = getDaysRemaining(c.expirationDate);
      return days === null || days >= 0;
    }
    return true;
  });

  const verifiedCount = certificates.filter((c) => c.verified).length;
  const issuers = Array.from(new Set(certificates.map((c) => c.issuer)));

  let parsedSocials: Record<string, string> = {};
  if (socialLinks) {
    try {
      parsedSocials = JSON.parse(socialLinks);
    } catch {}
  }

  const copyFeedUrl = () => {
    const url = `${window.location.origin}/api/v1/vault/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedFeed(true);
    setTimeout(() => setCopiedFeed(false), 2000);
  };

  const copyCertId = (cert: CertItem) => {
    if (!cert.credentialId) return;
    navigator.clipboard.writeText(cert.credentialId);
    setCopiedId(cert.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white pb-20">
      
      {/* Top Banner & Verification Pill */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              CV
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-200">
              CertVault <span className="text-xs text-slate-500 font-normal">Showcase</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyFeedUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-medium text-slate-300 transition-colors cursor-pointer border border-slate-700"
            >
              {copiedFeed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code2 className="w-3.5 h-3.5 text-blue-400" />}
              <span>{copiedFeed ? "Copied Feed URL" : "JSON API Feed"}</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors hidden sm:inline-block"
            >
              Create your Vault →
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-10">
        
        {/* Profile Hero Card */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden space-y-6">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
            <div className="flex items-center gap-5">
              {/* Monogram Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-lg border border-white/10 shrink-0">
                {ownerName ? ownerName.charAt(0).toUpperCase() : slug.charAt(0).toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    {ownerName || slug}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Vault
                  </span>
                </div>

                <p className="text-xs font-mono text-slate-400">
                  certivault.app/vault/{slug}
                </p>

                {headline && (
                  <p className="text-sm font-medium text-slate-300 pt-1">
                    {headline}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 self-stretch sm:self-auto justify-around sm:justify-start">
              <div className="text-center px-3">
                <p className="text-xs text-slate-400 font-medium">Credentials</p>
                <p className="text-xl font-bold text-white font-mono">{certificates.length}</p>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="text-center px-3">
                <p className="text-xs text-slate-400 font-medium">Verified</p>
                <p className="text-xl font-bold text-emerald-400 font-mono">{verifiedCount}</p>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="text-center px-3">
                <p className="text-xs text-slate-400 font-medium">Issuers</p>
                <p className="text-xl font-bold text-blue-400 font-mono">{issuers.length}</p>
              </div>
            </div>
          </div>

          {bio && (
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl pt-2 border-t border-slate-800/80">
              {bio}
            </p>
          )}

          {/* Social Links if present */}
          {Object.keys(parsedSocials).length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {Object.entries(parsedSocials).map(([platform, url]) => (
                url ? (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700/60 hover:text-white transition-colors"
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)} ↗
                  </a>
                ) : null
              ))}
            </div>
          )}
        </section>

        {/* Filter Navigation Bar */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === "all" ? "bg-slate-800 text-white font-semibold shadow-xs" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All Credentials ({certificates.length})
            </button>
            <button
              onClick={() => setFilter("verified")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === "verified" ? "bg-slate-800 text-white font-semibold shadow-xs" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Verified ({verifiedCount})
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === "active" ? "bg-slate-800 text-white font-semibold shadow-xs" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Active & Lifetime
            </button>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Live cryptographic credential record
          </p>
        </section>

        {/* Credentials Grid */}
        {filteredCerts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 space-y-3">
            <Award className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No public credentials match this filter</h3>
            <p className="text-xs text-slate-500">Switch back to "All Credentials" to view the complete vault.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCerts.map((cert) => {
              const daysLeft = getDaysRemaining(cert.expirationDate);
              const progress = getValidityProgress(cert.issueDate, cert.expirationDate);
              const isExpired = daysLeft !== null && daysLeft < 0;
              const isExpiring = daysLeft !== null && daysLeft <= 90 && daysLeft >= 0;

              return (
                <div
                  key={cert.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-5 transition-all duration-200 group"
                >
                  <div className="space-y-4">
                    
                    {/* Card Header: Issuer Monogram & Title */}
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-200 font-bold text-xs border border-slate-700 shrink-0">
                          {cert.issuer.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-2">
                            {cert.title}
                          </h3>
                          <p className="text-xs text-slate-400 font-medium">{cert.issuer}</p>
                        </div>
                      </div>

                      {cert.verified && (
                        <span className="p-1 text-emerald-400 shrink-0" title="Verified by Issuer">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                      )}
                    </div>

                    {/* Validity Progress Block */}
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                      <div className="flex justify-between text-[11px] font-medium">
                        <span className="text-slate-400">Validity</span>
                        <span className={
                          isExpired
                            ? "text-red-400 font-semibold"
                            : isExpiring
                            ? "text-amber-400 font-semibold"
                            : "text-emerald-400 font-semibold"
                        }>
                          {cert.expirationDate ? (
                            isExpired ? "Expired" : `${daysLeft}d remaining`
                          ) : "Lifetime (No Expiry)"}
                        </span>
                      </div>

                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isExpired ? "bg-red-500" : isExpiring ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-0.5">
                        <span>Issued {new Date(cert.issueDate).toLocaleDateString()}</span>
                        {cert.expirationDate && <span>Exp {new Date(cert.expirationDate).toLocaleDateString()}</span>}
                      </div>
                    </div>

                    {/* Credential ID if present */}
                    {cert.credentialId && (
                      <div className="flex items-center justify-between bg-slate-950/40 border border-slate-800/80 px-2.5 py-1.5 rounded-lg text-xs font-mono">
                        <span className="text-slate-400 text-[11px] truncate max-w-[200px]">
                          ID: {cert.credentialId}
                        </span>
                        <button
                          onClick={() => copyCertId(cert)}
                          className="text-slate-400 hover:text-blue-400 transition-colors p-0.5 cursor-pointer"
                          title="Copy Credential ID"
                        >
                          {copiedId === cert.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions Strip */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    {cert.fileUrl ? (
                      <button
                        onClick={() => setActiveModalCert(cert)}
                        className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Document
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">Verified Record</span>
                    )}

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 font-medium"
                      >
                        <span>Verify</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Document View Modal */}
      {activeModalCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-white truncate max-w-lg">
                  {activeModalCert.title}
                </h3>
                <p className="text-xs text-slate-400">{activeModalCert.issuer}</p>
              </div>

              <div className="flex items-center gap-2">
                {activeModalCert.fileUrl && (
                  <a
                    href={activeModalCert.fileUrl}
                    download={activeModalCert.title.replace(/\s+/g, '_')}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="Download Document"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => setActiveModalCert(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Viewport */}
            <div className="flex-1 p-4 bg-slate-950 flex items-center justify-center min-h-[460px] overflow-auto">
              {activeModalCert.fileUrl?.startsWith("data:application/pdf") || activeModalCert.fileUrl?.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={activeModalCert.fileUrl}
                  className="w-full h-[580px] rounded-xl border border-slate-800"
                  title="Certificate PDF Preview"
                />
              ) : (
                <img
                  src={activeModalCert.fileUrl!}
                  alt={activeModalCert.title}
                  className="max-w-full max-h-[540px] object-contain rounded-xl border border-slate-800 shadow-md"
                />
              )}
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 text-center text-xs text-slate-600 font-medium space-y-2">
        <p>
          Powered by <a href="/" className="text-slate-400 hover:text-white underline">CertVault</a> · High-Integrity Developer Credential Ledger
        </p>
      </footer>

    </div>
  );
}
