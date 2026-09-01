"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Shield, Award, Code2, MessageSquare, LogOut, Plus, Sparkles, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/certificates", label: "Vault", icon: Award },
    { href: "/portfolio", label: "Developer API", icon: Code2 },
    { href: "/feedback", label: "Feedback", icon: MessageSquare },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 shadow-xs transition-transform group-hover:scale-105">
            <Shield className="w-4 h-4 text-blue-400 dark:text-blue-600" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold tracking-tight text-base text-slate-900 dark:text-slate-100">
              CertVault
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
              v2.1
            </span>
          </div>
        </Link>

        {/* Center / Right Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {session ? (
            <>
              <div className="hidden md:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 p-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60 mr-2">
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
                  return (
                    <Link key={href} href={href}>
                      <button
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                          isActive
                            ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} />
                        <span>{label}</span>
                      </button>
                    </Link>
                  );
                })}
              </div>

              {/* Add New Certificate CTA */}
              <Link href="/certificates/new" className="hidden sm:block">
                <Button size="sm" className="gap-1.5 font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-xs">
                  <Plus className="w-3.5 h-3.5" /> Add Credential
                </Button>
              </Link>

              {/* User Dropdown / Sign out */}
              <div className="flex items-center gap-2 pl-2 sm:border-l border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700">
                  {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  title="Sign out"
                  className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-medium text-slate-700 dark:text-slate-300">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="gap-1.5 font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 text-white shadow-xs">
                  Get Started <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
