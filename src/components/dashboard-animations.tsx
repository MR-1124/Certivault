"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, ShieldCheck, Clock, Share2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface Stat {
  label: string;
  value: number;
  icon: string;
  color: string;
  bg: string;
}

interface RecentCert {
  id: string;
  title: string;
  issuer: string;
  createdAt: string;
}

interface Props {
  stats: Stat[];
  recentCerts: RecentCert[];
  userName: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
};

const iconMap: Record<string, React.ComponentType<any>> = {
  award: Award,
  shield: ShieldCheck,
  clock: Clock,
  share: Share2,
};

export function DashboardAnimations({ stats, recentCerts, userName }: Props) {
  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-border pb-6 gap-4"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2">SYSTEM OVERVIEW</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-[-0.04em] uppercase">
            {userName ? `WELCOME BACK, ${userName.split(" ")[0]}` : "OVERVIEW"}
          </h1>
        </div>
        <Link href="/certificates/new">
          <button className="brutalist-button text-xs h-11 px-5 cursor-pointer">
            + ADD CERTIFICATE
          </button>
        </Link>
      </motion.div>

      {/* Brutalist Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => {
          const IconComponent = iconMap[stat.icon] || Award;
          return (
            <motion.div key={stat.label} variants={item}>
              <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(242,239,233,1)] flex flex-col justify-between h-40">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                  <div className="w-8 h-8 border-2 border-border bg-foreground flex items-center justify-center text-background">
                    <IconComponent className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-5xl font-black tracking-tight mt-auto">{stat.value}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Asymmetric Split Layout: Recent activity vs quick action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Activity (Left 8 Columns) */}
        <motion.div
          className="lg:col-span-8 space-y-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="border-b-2 border-border pb-3">
            <h2 className="text-2xl font-black tracking-tight uppercase">Recent Additions</h2>
          </div>

          {recentCerts.length === 0 ? (
            <div className="border-2 border-border bg-card p-12 text-center flex flex-col items-center justify-center min-h-[220px]">
              <div className="w-12 h-12 border-2 border-border bg-muted flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-muted-foreground font-bold tracking-tight uppercase text-xs">No certificates loaded.</p>
              <Link href="/certificates/new" className="mt-4 text-accent font-bold uppercase text-xs hover:underline">
                Add certificate →
              </Link>
            </div>
          ) : (
            <div className="border-2 border-border bg-card divide-y-2 divide-border">
              {recentCerts.map((cert) => (
                <Link key={cert.id} href={`/certificates/${cert.id}`}>
                  <div className="p-5 flex items-center justify-between hover:bg-secondary/40 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 border-2 border-border bg-foreground flex items-center justify-center shrink-0 text-background">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm tracking-tight uppercase group-hover:text-accent transition-colors">{cert.title}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">{cert.issuer}</p>
                      </div>
                    </div>
                    <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase hidden sm:block">
                      {new Date(cert.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Links / Guide (Right 4 Columns) */}
        <motion.div
          className="lg:col-span-4 space-y-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="border-b-2 border-border pb-3">
            <h2 className="text-2xl font-black tracking-tight uppercase">Quick Actions</h2>
          </div>

          <div className="border-2 border-border bg-card p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-accent">Vault Guide</h3>
            <p className="text-xs leading-relaxed text-muted-foreground font-medium">
              Every certificate in the vault can be toggled public to show on your live recruitment dashboard page. Always keep credential URLs verified.
            </p>
            <div className="pt-2">
              <Link href="/portfolio">
                <button className="brutalist-button w-full text-[10px] py-3 cursor-pointer">
                  MANAGE API SETTINGS
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
