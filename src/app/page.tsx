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
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              &copy; {new Date().getFullYear()} CertVault. Designed for builders.
            </p>
            <span className="hidden md:inline text-muted-foreground/30 font-bold">|</span>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-muted-foreground">
              <span>Made by Mayan Roy</span>
              <a href="https://github.com/MR-1124" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" aria-label="GitHub">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/mayan-roy/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" aria-label="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
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
