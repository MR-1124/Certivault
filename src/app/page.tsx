import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { ShieldCheck, ArrowRight, Sparkles, Code2, Lock, CheckCircle2, Award } from "lucide-react";
import { LandingAnimations } from "@/components/landing-animations";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20 space-y-16">
        
        {/* Hero Top Headline Area */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>CertVault v3.1 · Precision Credential Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.1]">
            Your Verified Credentials.<br />
            <span className="text-blue-600 dark:text-blue-400">One Developer API.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Consolidate AWS, GCP, Azure, and university certifications in a single secure vault. Track renewal lifecycles and expose a real-time JSON feed to your personal portfolio.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-md mx-auto">
            {session ? (
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto font-semibold shadow-xs">
                  Enter Dashboard <ArrowRight className="ml-1.5 w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs">
                  Start Free Vault <ArrowRight className="ml-1.5 w-4 h-4" />
                </Button>
              </Link>
            )}

            <Link href="/portfolio" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto font-medium gap-2">
                <Code2 className="w-4 h-4 text-slate-500" /> Developer Hub
              </Button>
            </Link>
          </div>

          {/* Trust Value Points */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Free & Open Integrations
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> SHA-256 Hashed Tokens
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Zero Storage Limits
            </span>
          </div>
        </div>

        {/* Interactive Hero Component & Bento Grid */}
        <LandingAnimations />

      </main>

      {/* Modern Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 text-xs font-bold">
              C
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">CertVault</span>
            <span className="text-xs text-slate-400">© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Terms of Service</Link>
            <Link href="/changelog" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Changelog</Link>
            <Link href="/feedback" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Feedback</Link>
            <a href="https://github.com/MR-1124" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
