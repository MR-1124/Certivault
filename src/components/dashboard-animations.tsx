"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Award, ShieldCheck, Clock, Code2, Plus, ArrowRight, ExternalLink, AlertTriangle, Check, Copy, FileText, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Stat {
  label: string;
  value: string | number;
  icon: string;
  desc: string;
  color: string;
  bg: string;
}

interface ExpiringCert {
  id: string;
  title: string;
  issuer: string;
  expirationDate: string | null;
}

interface RecentCert {
  id: string;
  title: string;
  issuer: string;
  verified: boolean;
  isPublic: boolean;
  credentialUrl: string | null;
  fileUrl: string | null;
  createdAt: string;
}

interface Props {
  stats: Stat[];
  expiringList: ExpiringCert[];
  recentCerts: RecentCert[];
  userName: string;
  portfolioSlug: string | null;
  isPortfolioPublic: boolean;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  award: Award,
  shield: ShieldCheck,
  clock: Clock,
  code: Code2,
};

export function DashboardAnimations({
  stats,
  expiringList,
  recentCerts,
  userName,
  portfolioSlug,
  isPortfolioPublic,
}: Props) {
  const [copiedSlug, setCopiedSlug] = useState(false);

  const copyPublicUrl = () => {
    if (!portfolioSlug) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    navigator.clipboard.writeText(`${origin}/api/v1/vault/${portfolioSlug}`);
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  const getDaysRemaining = (expDate: string | null) => {
    if (!expDate) return null;
    const diffTime = new Date(expDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header Overview Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Welcome back, {userName.split(" ")[0]}
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Vault Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Monitor verified credentials, track expiration audits, and manage your portfolio API.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link href="/certificates/new" className="w-full sm:w-auto">
            <Button size="sm" className="w-full sm:w-auto gap-1.5 font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs">
              <Plus className="w-4 h-4" /> Add Credential
            </Button>
          </Link>
          <Link href="/portfolio" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto font-medium gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> API Keys
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Metric Bento Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((s) => {
          const IconComponent = iconMap[s.icon] || Award;
          return (
            <div
              key={s.label}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {s.label}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.bg}`}>
                  <IconComponent className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                  {s.value}
                </div>
                <p className="text-[11px] text-slate-400 font-medium truncate">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Renewal Radar + Recent Credentials vs Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Renewal Radar (If expiring certs exist) */}
          {expiringList.length > 0 && (
            <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Renewal Radar · Action Required</span>
                </div>
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  {expiringList.length} certification{expiringList.length > 1 ? "s" : ""} expiring soon
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {expiringList.map((c) => {
                  const days = getDaysRemaining(c.expirationDate);
                  return (
                    <Link key={c.id} href={`/certificates/${c.id}`}>
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/40 hover:border-amber-400 transition-all space-y-2 group">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                            {c.title}
                          </p>
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                            {days}d left
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {c.issuer} · Expires {new Date(c.expirationDate!).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Additions Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Recent Vault Additions
                </h2>
                <p className="text-xs text-slate-500">
                  Latest professional credentials synchronized with your developer API
                </p>
              </div>
              <Link href="/certificates">
                <Button variant="ghost" size="xs" className="text-xs font-semibold gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700">
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>

            {recentCerts.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Your vault is ready for credentials
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Add your AWS, GCP, Azure, or university certificates to start generating developer API feeds.
                </p>
                <div className="pt-2">
                  <Link href="/certificates/new">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                      + Add First Certificate
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {recentCerts.map((cert) => (
                  <Link key={cert.id} href={`/certificates/${cert.id}`}>
                    <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-black text-xs shrink-0 border border-slate-200 dark:border-slate-700">
                          {cert.issuer.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {cert.title}
                            </p>
                            {cert.verified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            )}
                            {cert.isPublic && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                PUBLIC
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            {cert.issuer}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                        <span className="hidden sm:inline">
                          Added {new Date(cert.createdAt).toLocaleDateString()}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Developer API Widget & Status */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Public Feed Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Public Portfolio Feed
                </h3>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                isPortfolioPublic
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
              }`}>
                {isPortfolioPublic ? "Live & Queryable" : "Disabled"}
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Integrate your public credentials into external portfolio apps without authentication headers.
            </p>

            {portfolioSlug && (
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>Endpoint URL</span>
                  <button
                    onClick={copyPublicUrl}
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                  >
                    {copiedSlug ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {copiedSlug ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="text-xs font-mono text-slate-800 dark:text-slate-200 truncate select-all">
                  /api/v1/vault/{portfolioSlug}
                </p>
              </div>
            )}

            <Link href="/portfolio" className="block pt-1">
              <Button variant="outline" size="sm" className="w-full text-xs font-medium gap-1.5">
                Configure API & Feed <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* Quick Integration Guide */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 text-white rounded-2xl p-5 space-y-3.5 shadow-md">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Developer Quick Tip</span>
            </div>
            <h4 className="font-bold text-sm leading-snug">
              Programmatic JSON Queries
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              You can query your entire credential library in Python or Node.js by generating a cryptographic private token in the Developer API hub.
            </p>
            <div className="pt-1">
              <Link href="/portfolio">
                <button className="text-xs font-semibold text-white hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer">
                  Generate API Token →
                </button>
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
