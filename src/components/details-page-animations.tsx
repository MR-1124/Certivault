"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Building, Globe, ShieldCheck, Download, FileText, Image as ImageIcon, ExternalLink, Copy, Check, Code2, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CertDetails {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  isPublic: boolean;
  verified: boolean;
  fileUrl: string | null;
  isPdf: boolean;
  isImage: boolean;
}

interface Props {
  cert: CertDetails;
}

export function DetailsPageAnimations({ cert }: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "json">("overview");
  const [copiedId, setCopiedId] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const getDaysRemaining = (expDate: string | null) => {
    if (!expDate) return null;
    const diff = new Date(expDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysRemaining(cert.expirationDate);
  const isExpired = daysLeft !== null && daysLeft < 0;
  const isExpiring = daysLeft !== null && daysLeft <= 90 && daysLeft >= 0;

  const jsonPayload = JSON.stringify(
    {
      id: cert.id,
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      expirationDate: cert.expirationDate,
      credentialId: cert.credentialId,
      credentialUrl: cert.credentialUrl,
      verified: cert.verified,
      isPublic: cert.isPublic,
      hasDocument: Boolean(cert.fileUrl),
    },
    null,
    2
  );

  const copyCredentialId = () => {
    if (!cert.credentialId) return;
    navigator.clipboard.writeText(cert.credentialId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const copyJson = () => {
    navigator.clipboard.writeText(jsonPayload);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
      
      {/* Left Column: Metadata & API Inspector (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-6">
          
          {/* Header Area */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {cert.verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              )}
              {cert.isPublic && (
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  Public JSON API
                </span>
              )}
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {cert.title}
            </h1>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" /> {cert.issuer}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Overview & Details
            </button>
            <button
              onClick={() => setActiveTab("json")}
              className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "json"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-blue-500" /> Raw API JSON
            </button>
          </div>

          {activeTab === "overview" ? (
            <div className="space-y-5">
              {/* Validity Progress Block */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-slate-500">Validity Status</span>
                  <span className={
                    isExpired
                      ? "text-red-600 font-semibold"
                      : isExpiring
                      ? "text-amber-600 font-semibold"
                      : "text-emerald-600 font-semibold"
                  }>
                    {cert.expirationDate ? (
                      isExpired ? "Expired" : `${daysLeft} days remaining`
                    ) : "Never expires (Lifetime)"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">ISSUE DATE</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{cert.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">EXPIRATION</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {cert.expirationDate || "None"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Credential ID */}
              {cert.credentialId && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Credential ID
                  </span>
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg text-xs font-mono">
                    <span className="select-all font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {cert.credentialId}
                    </span>
                    <button
                      onClick={copyCredentialId}
                      className="text-slate-500 hover:text-blue-600 transition-colors p-1 cursor-pointer"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="block">
                    <Button size="sm" className="w-full gap-2 font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs">
                      <ExternalLink className="w-4 h-4" /> Verify on Issuer Site
                    </Button>
                  </a>
                )}

                {cert.fileUrl && (
                  <a href={cert.fileUrl} download={`${cert.title.replace(/\s+/g, '_')}`} className="block">
                    <Button variant="outline" size="sm" className="w-full gap-2 font-medium">
                      <Download className="w-4 h-4 text-slate-500" /> Download Certificate Document
                    </Button>
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* JSON View */
            <div className="space-y-3">
              <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-200 border border-slate-800 relative">
                <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400">
                  <span>/api/v1/certificates</span>
                  <button
                    onClick={copyJson}
                    className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 cursor-pointer"
                  >
                    {copiedJson ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedJson ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="text-slate-300 leading-relaxed overflow-x-auto text-[11px] max-h-[320px]">
                  {jsonPayload}
                </pre>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                This exact JSON object is returned to external clients requesting your developer API feed.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Right Column: High-Res Document Preview (7 cols) */}
      <div className="lg:col-span-7">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden flex flex-col h-full min-h-[540px]">
          
          {/* Viewer Toolbar */}
          <div className="bg-slate-50 dark:bg-slate-800/60 px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Document Preview {cert.isPdf ? "(PDF)" : cert.isImage ? "(Image)" : ""}
              </span>
            </div>
            {cert.fileUrl && (
              <a href={cert.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1">
                Open in new tab <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          
          {/* Document Content Viewport */}
          <div className="flex-1 p-4 sm:p-6 flex items-center justify-center bg-slate-50/50 dark:bg-slate-950/40">
            {cert.fileUrl ? (
              cert.isPdf ? (
                <iframe
                  src={cert.fileUrl}
                  className="w-full h-[580px] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs"
                  title="PDF Certificate Preview"
                />
              ) : cert.isImage ? (
                <div className="flex items-center justify-center p-2 max-h-[580px] overflow-hidden">
                  <img
                    src={cert.fileUrl}
                    alt={cert.title}
                    className="max-w-full max-h-[540px] object-contain rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
                  />
                </div>
              ) : (
                <div className="text-center p-8 space-y-3 max-w-xs">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">
                    This file format cannot be rendered inline. Please download the attachment.
                  </p>
                  <a href={cert.fileUrl} download>
                    <Button variant="outline" size="sm">
                      Download File
                    </Button>
                  </a>
                </div>
              )
            ) : (
              <div className="text-center p-12 space-y-3 max-w-sm">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No Document Attached
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You haven't uploaded an image or PDF copy of this certification yet.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
