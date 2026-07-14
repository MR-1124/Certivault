import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative p-6 sm:p-12 md:p-24 max-w-4xl mx-auto space-y-12 animate-fade-in-up">
      <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </Link>

      <div className="border-b-4 border-foreground pb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">LEGAL COMPLIANCE</p>
        <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground font-semibold uppercase mt-2">Last Updated: July 14, 2026</p>
      </div>

      <div className="space-y-8 text-xs font-semibold text-muted-foreground leading-relaxed uppercase tracking-wider">
        <section className="space-y-3">
          <h2 className="text-lg font-black text-foreground">1. Data Collection</h2>
          <p>
            CertVault collects email addresses, secure credential records, and uploaded document attachments (PDFs and images) solely to perform the credential storage, verification, and API showcase services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-foreground">2. API and Public Feeds</h2>
          <p>
            When you activate the Public Feed toggle on your integration dashboard, any certificates flagged as "public" become queryable by anonymous network clients. Your private API credentials and hashed keys are strictly guarded and never exposed.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-foreground">3. Document Storage</h2>
          <p>
            Uploaded certificate files are saved to secure directory blocks on Vercel storage or local volumes. Access tokens protect authenticated document links.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-foreground">4. Cookies and Security</h2>
          <p>
            We deploy secure cookies to persist user sessions via NextAuth. Rate limiting middleware active on API nodes resolves request rates by tracking incoming client IPs anonymously.
          </p>
        </section>
      </div>
    </div>
  );
}
