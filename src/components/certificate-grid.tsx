"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Trash2, ShieldCheck, FileText, LayoutGrid, List, Check, Copy, AlertTriangle, Globe, Calendar, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Cert {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate: string | null;
  isPublic: boolean;
  verified: boolean;
  credentialUrl: string | null;
  fileUrl: string | null;
}

interface Props {
  certs: Cert[];
  q: string;
  deleteCert: (formData: FormData) => Promise<void>;
}

export function CertificateGrid({ certs, q, deleteCert }: Props) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [filter, setFilter] = useState<"all" | "verified" | "expiring" | "public">("all");
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

  const copyCertJson = (cert: Cert) => {
    const json = JSON.stringify(cert, null, 2);
    navigator.clipboard.writeText(json);
    setCopiedId(cert.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCerts = certs.filter((c) => {
    if (filter === "verified") return c.verified;
    if (filter === "public") return c.isPublic;
    if (filter === "expiring") {
      const days = getDaysRemaining(c.expirationDate);
      return days !== null && days <= 90 && days >= 0;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Control Bar: Filters & View Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
          {[
            { id: "all", label: `All (${certs.length})` },
            { id: "verified", label: `Verified (${certs.filter(c => c.verified).length})` },
            { id: "expiring", label: `Expiring Soon (${certs.filter(c => { const d = getDaysRemaining(c.expirationDate); return d !== null && d <= 90 && d >= 0; }).length})` },
            { id: "public", label: `Public API (${certs.filter(c => c.isPublic).length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === tab.id
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 self-end sm:self-auto">
          <button
            onClick={() => setViewMode("grid")}
            title="Grid View"
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            title="Table View"
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === "table"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Empty State */}
      {filteredCerts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 shadow-2xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {q ? "No matching records" : filter !== "all" ? "No credentials match this filter" : "Your vault is empty"}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-medium">
              {q
                ? `No credentials found matching "${q}". Try modifying your search query.`
                : filter !== "all"
                ? "Switch back to 'All' to view all credentials in your library."
                : "Add your professional certifications to start creating verified public portfolios."}
            </p>
          </div>
          <div>
            {q || filter !== "all" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilter("all");
                  window.location.href = "/certificates";
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Link href="/certificates/new">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                  + Add First Certificate
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCerts.map((cert) => {
            const daysLeft = getDaysRemaining(cert.expirationDate);
            const progress = getValidityProgress(cert.issueDate, cert.expirationDate);
            const isExpiring = daysLeft !== null && daysLeft <= 90 && daysLeft >= 0;
            const isExpired = daysLeft !== null && daysLeft < 0;

            return (
              <div
                key={cert.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all duration-200 flex flex-col justify-between space-y-5 group"
              >
                {/* Header: Issuer Icon, Title, Verification */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold text-xs shrink-0 border border-slate-200/80 dark:border-slate-700">
                        {cert.issuer.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <Link href={`/certificates/${cert.id}`}>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 cursor-pointer">
                            {cert.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-slate-500 font-medium">
                          {cert.issuer}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {cert.verified && (
                        <span className="p-1 text-emerald-600 dark:text-emerald-400" title="Verified by Issuer">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                      )}
                      {cert.isPublic && (
                        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800" title="Public JSON API">
                          API
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Validity Lifecycle Progress Bar */}
                  <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    <div className="flex justify-between text-[11px] font-medium">
                      <span className="text-slate-500">Validity</span>
                      <span className={
                        isExpired
                          ? "text-red-600 dark:text-red-400 font-semibold"
                          : isExpiring
                          ? "text-amber-600 dark:text-amber-400 font-semibold"
                          : "text-slate-700 dark:text-slate-300 font-semibold"
                      }>
                        {cert.expirationDate ? (
                          isExpired ? "Expired" : `${daysLeft}d left`
                        ) : "Never expires"}
                      </span>
                    </div>
                    
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isExpired
                            ? "bg-red-500"
                            : isExpiring
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                      <span>Issued {new Date(cert.issueDate).toLocaleDateString()}</span>
                      {cert.expirationDate && <span>Exp {new Date(cert.expirationDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                </div>

                {/* Footer Action Strip */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="xs" className="gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                          <ExternalLink className="w-3 h-3" /> Verify
                        </Button>
                      </a>
                    )}
                    {cert.fileUrl && (
                      <a href={cert.fileUrl} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="xs" className="gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                          <FileText className="w-3 h-3" /> File
                        </Button>
                      </a>
                    )}
                    <button
                      onClick={() => copyCertJson(cert)}
                      title="Copy API JSON Snippet"
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                    >
                      {copiedId === cert.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <form action={deleteCert}>
                    <input type="hidden" name="id" value={cert.id} />
                    <button
                      type="submit"
                      title="Delete Certificate"
                      onClick={(e) => {
                        if (!confirm("Are you sure you want to delete this certificate?")) e.preventDefault();
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE / DENSE LIST VIEW */
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Credential</th>
                  <th className="py-3 px-4">Issuer</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Expiration</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredCerts.map((cert) => {
                  const daysLeft = getDaysRemaining(cert.expirationDate);
                  const isExpiring = daysLeft !== null && daysLeft <= 90 && daysLeft >= 0;
                  const isExpired = daysLeft !== null && daysLeft < 0;

                  return (
                    <tr key={cert.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                      <td className="py-3.5 px-4">
                        <Link href={`/certificates/${cert.id}`} className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors">
                          {cert.title}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium">
                        {cert.issuer}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {new Date(cert.issueDate).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {cert.expirationDate ? (
                          <span className={
                            isExpired
                              ? "text-red-600 font-semibold"
                              : isExpiring
                              ? "text-amber-600 font-semibold"
                              : "text-slate-600 dark:text-slate-400"
                          }>
                            {new Date(cert.expirationDate).toLocaleDateString()} ({daysLeft}d)
                          </span>
                        ) : (
                          <span className="text-slate-400">Never</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {cert.verified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60">
                              Verified
                            </span>
                          )}
                          {cert.isPublic && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 border border-blue-200">
                              API
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {cert.credentialUrl && (
                            <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="p-1 text-slate-400 hover:text-slate-700">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => copyCertJson(cert)}
                            title="Copy JSON"
                            className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            {copiedId === cert.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <form action={deleteCert} className="inline">
                            <input type="hidden" name="id" value={cert.id} />
                            <button
                              type="submit"
                              onClick={(e) => {
                                if (!confirm("Are you sure you want to delete this certificate?")) e.preventDefault();
                              }}
                              className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
