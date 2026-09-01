import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
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
            <FileText className="w-4 h-4" />
            <span>User Terms & Agreement</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Last Updated: July 2026
          </p>
        </div>

        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              1. Platform Usage
            </h2>
            <p>
              By accessing CertVault, you agree to comply with our fair-use policies and security limits. Automated rate flooding, credential spoofing, or attempts to bypass rate limits will result in automated IP throttles.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              2. Developer API License
            </h2>
            <p>
              CertVault grants you a non-exclusive license to query your credential data via our REST API endpoints for personal websites, portfolios, and applications. You remain responsible for safeguarding your private API key.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              3. Document & Storage Limits
            </h2>
            <p>
              Document uploads are constrained to 4.5MB per file to maintain optimal serverless throughput. We reserve the right to delete fraudulent or malicious file uploads.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
