import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative p-6 sm:p-12 md:p-24 max-w-4xl mx-auto space-y-12 animate-fade-in-up">
      <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </Link>

      <div className="border-b-4 border-foreground pb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">TERMS OF USE</p>
        <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tight">Terms of Service</h1>
        <p className="text-xs text-muted-foreground font-semibold uppercase mt-2">Last Updated: July 14, 2026</p>
      </div>

      <div className="space-y-8 text-xs font-semibold text-muted-foreground leading-relaxed uppercase tracking-wider">
        <section className="space-y-3">
          <h2 className="text-lg font-black text-foreground">1. User Agreement</h2>
          <p>
            By accessing CertVault, you agree to comply with our security limits. Automated scraping, request spoofing, or attempts to bypass IP/Token bucket rate limits will result in instant IP blocks.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-foreground">2. Developer API License</h2>
          <p>
            We grant you a non-transferable license to query your account data via our private API endpoints for personal portfolios. You remain responsible for securing your API Key. Leakage of credentials due to client-side JS exposure is the user's sole liability.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-foreground">3. Storage Policies</h2>
          <p>
            CertVault reserves the right to delete account records or stored files exceeding size quotas (5MB per file maximum) or representing fraudulent certifications.
          </p>
        </section>
      </div>
    </div>
  );
}
