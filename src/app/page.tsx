import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { ShieldCheck, Share2, Search, ArrowRight, Zap, Award, Clock } from "lucide-react";
import { LandingAnimations } from "@/components/landing-animations";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 z-10 pt-28 pb-16 border-b-2 border-border">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 border-2 border-border bg-card px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-10 cursor-default">
            <Zap className="w-3.5 h-3.5 text-accent" />
            CertVault v2.0.0
          </div>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[8.5rem] font-black tracking-[-0.05em] text-foreground mb-8 animate-fade-in-up delay-100 leading-[0.85] uppercase max-w-full px-4">
          THE VAULT FOR<br />
          <span className="font-serif italic font-normal text-accent normal-case tracking-tight pr-4">verified</span>
          ACHIEVERS.
        </h1>
        
        <p className="mt-4 text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-14 animate-fade-in-up delay-200 font-medium leading-relaxed">
          A secure, high-contrast, editorial showcase for certifications earned across your career. Designed for builders who document their progress.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-300 w-full max-w-md mx-auto">
          {session ? (
            <Link href="/dashboard" className="w-full">
              <button className="w-full brutalist-button text-sm h-14 cursor-pointer">
                ENTER DASHBOARD <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </Link>
          ) : (
            <Link href="/signup" className="w-full">
              <button className="w-full brutalist-button text-sm h-14 cursor-pointer">
                SIGN UP NOW <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </Link>
          )}
          
          <Link href="/changelog" className="w-full">
            <button className="w-full border-2 border-border bg-card hover:bg-secondary transition-colors text-xs font-bold tracking-widest px-6 h-14 uppercase cursor-pointer">
              READ CHANGELOG
            </button>
          </Link>
        </div>
      </main>

      {/* Infinite Scrolling Ticker (Editorial Element) */}
      <section className="bg-foreground text-background py-5 border-b-2 border-border overflow-hidden">
        <div className="marquee-container text-xs font-bold uppercase tracking-[0.25em]">
          <div className="marquee-content flex gap-12 whitespace-nowrap">
            {[1, 2, 3, 4].map((group) => (
              <span key={group} className="flex gap-12">
                <span>AWS CERTIFIED</span>
                <span className="text-accent">✦</span>
                <span>GOOGLE CLOUD PROFESSIONAL</span>
                <span className="text-accent">✦</span>
                <span>MICROSOFT AZURE</span>
                <span className="text-accent">✦</span>
                <span>COURSERA SPECIALIST</span>
                <span className="text-accent">✦</span>
                <span>UDEMY GRADUATE</span>
                <span className="text-accent">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <LandingAnimations />
      
      {/* Editorial Quote Block (Magazine styling) */}
      <section className="py-24 bg-card border-t-2 border-border text-center px-4">
        <div className="max-w-4xl mx-auto">
          <p className="font-serif italic text-4xl md:text-5xl text-foreground leading-snug">
            "Your credentials are the currency of your competence. Do not scatter them across forgotten logins. Collect, verify, and show them off in a single, brutalist showcase."
          </p>
          <div className="mt-8 text-xs font-bold tracking-widest uppercase text-muted-foreground">
            — THE CERTVAULT MANIFESTO
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-16 bg-background border-t-2 border-border z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-none border-2 border-border bg-foreground flex items-center justify-center text-background font-black text-sm">
              C
            </div>
            <span className="font-black tracking-tighter text-lg uppercase">CertVault</span>
          </div>
          <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            &copy; {new Date().getFullYear()} CertVault. Designed for builders.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-xs font-bold tracking-wider uppercase hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs font-bold tracking-wider uppercase hover:text-accent transition-colors">Terms of Service</Link>
            <Link href="/changelog" className="text-xs font-bold tracking-wider uppercase hover:text-accent transition-colors">Changelog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
