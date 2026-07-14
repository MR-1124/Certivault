"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 bg-background border-b-2 border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <Link href="/" className="font-black text-xl tracking-[-0.05em] flex items-center gap-3 group uppercase">
          <div className="w-8 h-8 border-2 border-border bg-foreground flex items-center justify-center text-background font-black text-sm transition-transform group-hover:-rotate-6">
            C
          </div>
          <span className="text-foreground">
            CertVault
          </span>
        </Link>

        <div className="flex gap-2 items-center">
          {session ? (
            <>
              {[
                { href: "/dashboard", label: "DASHBOARD" },
                { href: "/certificates", label: "CERTIFICATES" },
                { href: "/portfolio", label: "DEVELOPER API" },
                { href: "/feedback", label: "FEEDBACK" },
              ].map(({ href, label }) => (
                <Link key={href} href={href}>
                  <button className="text-xs font-bold tracking-widest px-4 py-2 border-2 border-transparent hover:border-border transition-colors uppercase cursor-pointer">
                    {label}
                  </button>
                </Link>
              ))}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs font-bold tracking-widest px-4 py-2 border-2 border-transparent hover:border-accent hover:text-accent transition-colors uppercase cursor-pointer"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="text-xs font-bold tracking-widest px-4 py-2 border-2 border-transparent hover:border-border transition-colors uppercase cursor-pointer">
                  LOGIN
                </button>
              </Link>
              <Link href="/signup">
                <button className="brutalist-button text-[10px] py-2 px-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(242,239,233,1)] cursor-pointer">
                  SIGN UP
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
