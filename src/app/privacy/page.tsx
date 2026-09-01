import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <Link
        href="/"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xs space-y-8">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-6 space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <Shield className="w-4 h-4" />
            <span>Legal & Privacy Compliance</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Last Updated: July 2026
          </p>
        </div>

        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              1. Information We Collect
            </h2>
            <p>
              CertVault collects your name, email address, password hashes, certificate metadata (issuers, dates, credential identifiers, verification links), and uploaded document files solely to deliver credential vault, renewal monitoring, and developer API services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              2. Developer API & Public Feeds
            </h2>
            <p>
              When you enable the Public Portfolio Feed on your settings dashboard, any certifications marked as public are queryable by anonymous network clients. Your private API access tokens and database credentials are cryptographic SHA-256 hashes and are never exposed publicly.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              3. Document & Media Storage
            </h2>
            <p>
              Uploaded certificates are stored as Base64 data within encrypted database records. Uploaded files are restricted to standard image formats and PDF documents under 4.5MB.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              4. Cookies & Security
            </h2>
            <p>
              We deploy HTTP-only cookies to persist user sessions via NextAuth. Edge proxy nodes enforce IP-based rate limiting (maximum 100 requests per minute) to defend endpoints against abuse.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
