"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Code2, Clock, Globe, Lock, FileCheck, Check, Copy, ExternalLink, Sparkles, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingAnimations() {
  const [activeTab, setActiveTab] = useState<"card" | "json">("card");
  const [copied, setCopied] = useState(false);

  const sampleJson = `{
  "success": true,
  "owner": "Alex Rivera",
  "total": 6,
  "certificates": [
    {
      "id": "cert_aws_sa_pro",
      "title": "AWS Solutions Architect - Professional",
      "issuer": "Amazon Web Services",
      "issueDate": "2026-06-15T00:00:00.000Z",
      "expirationDate": "2029-06-15T00:00:00.000Z",
      "credentialId": "AWS-PSA-99410",
      "credentialUrl": "https://aws.amazon.com/verification/AWS-PSA-99410",
      "verified": true,
      "isPublic": true
    }
  ]
}`;

  const copySample = () => {
    navigator.clipboard.writeText(sampleJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bentoFeatures = [
    {
      icon: Code2,
      tag: "API FIRST",
      title: "Headless Developer API",
      desc: "Fetch your verified credentials into custom Next.js portfolios, static sites, or mobile apps via private keys or public slug feeds.",
      colSpan: "md:col-span-2",
      badge: "REST · JSON · CORS",
      accent: "from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5",
    },
    {
      icon: ShieldCheck,
      tag: "VERIFICATION",
      title: "Authentic Verification Links",
      desc: "Direct cryptographic links to AWS, GCP, Microsoft Learn, and Credly so recruiters can verify credentials in one click.",
      colSpan: "md:col-span-1",
      badge: "1-Click Audit",
      accent: "from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5",
    },
    {
      icon: Clock,
      tag: "EXPIRATION RADAR",
      title: "Renewal Lifecycle Tracking",
      desc: "Visual progress bars and smart 90-day alerts ensure your cloud and cybersecurity certifications never lapse unnoticed.",
      colSpan: "md:col-span-1",
      badge: "Zero Lapses",
      accent: "from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/5",
    },
    {
      icon: FileCheck,
      tag: "INSPECTOR",
      title: "Embedded Document Viewer",
      desc: "Upload PDF copies and certificate badges with instant split-pane previewing, built-in zoom, and base64 resilience.",
      colSpan: "md:col-span-2",
      badge: "PDF & WebP",
      accent: "from-slate-500/10 to-slate-600/10 dark:from-slate-700/5 dark:to-slate-800/5",
    },
  ];

  return (
    <div className="space-y-24">
      {/* Interactive Hero Showcase */}
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
          
          {/* Card Header Toolbar */}
          <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 pl-2">
                api.certvault.dev/v1/vault/demo
              </span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-200/70 dark:bg-slate-950 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setActiveTab("card")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === "card"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Visual Card
              </button>
              <button
                onClick={() => setActiveTab("json")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === "json"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Live JSON API
              </button>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8 min-h-[320px] flex items-center justify-center bg-slate-50/40 dark:bg-slate-900/40">
            {activeTab === "card" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-5"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 font-black text-sm">
                      AWS
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                        AWS Solutions Architect - Professional
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Amazon Web Services · Issued Jun 2026
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </div>
                </div>

                {/* Validity Lifecycle Progress Bar */}
                <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500 dark:text-slate-400">Validity Status</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">1,018 Days Remaining (Valid)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: "93%" }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-0.5">
                    <span>Jun 15, 2026</span>
                    <span>Jun 15, 2029</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-mono text-slate-500">ID: AWS-PSA-99410</span>
                  <div className="flex gap-2">
                    <button className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Verify Link
                    </button>
                    <button className="text-xs font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-800 transition-colors">
                      View PDF
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="w-full bg-slate-950 rounded-xl p-5 font-mono text-xs text-slate-200 relative overflow-x-auto border border-slate-800"
              >
                <div className="flex justify-between items-center pb-3 mb-3 border-b border-slate-800 text-[11px] text-slate-400">
                  <span>GET /api/v1/vault/demo</span>
                  <button
                    onClick={copySample}
                    className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied" : "Copy JSON"}
                  </button>
                </div>
                <pre className="text-slate-300 leading-relaxed overflow-x-auto">{sampleJson}</pre>
              </motion.div>
            )}
          </div>

        </div>
      </div>

      {/* Feature Bento Grid */}
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            System Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Built for developers who take credentials seriously.
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Everything you need to safeguard, verify, and expose your achievements without messy screenshots or third-party vendor lock-in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {bentoFeatures.map((f) => (
            <div
              key={f.title}
              className={`${f.colSpan} bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-6 relative overflow-hidden group`}
            >
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${f.accent} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
                    <f.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {f.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-1.5 font-normal">
                    {f.desc}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono relative z-10">
                <span>{f.badge}</span>
                <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">✦</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
