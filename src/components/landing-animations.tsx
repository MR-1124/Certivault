"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, Search, Share2, Zap, Award, Clock } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Vault",
    desc: "Keep all your certificates secure. Upload PDFs, link to credential networks, and safeguard your growth history in one encrypted vault.",
    color: "text-foreground",
    border: "border-border",
  },
  {
    icon: Search,
    title: "Advanced Queries",
    desc: "Find any credential instantly. Type-ahead filtering across issuing authorities, credentials, category groups, or expiration statuses.",
    color: "text-foreground",
    border: "border-border",
  },
  {
    icon: Share2,
    title: "Editorial Showcase",
    desc: "Publish your credentials directly to a high-contrast public web profile. Let recruiters audit your verified credentials in one click.",
    color: "text-foreground",
    border: "border-border",
  },
  {
    icon: Award,
    title: "Verified Badging",
    desc: "Get digital verification tags on your public profile. Prove authenticity and credential compliance at first glance.",
    color: "text-foreground",
    border: "border-border",
  },
  {
    icon: Clock,
    title: "Lapse Alerts",
    desc: "Smart date audits keep you on track. Receive custom reminders before critical cloud/architect certifications are set to expire.",
    color: "text-foreground",
    border: "border-border",
  },
  {
    icon: Zap,
    title: "Direct API Nodes",
    desc: "Query your verified credential data via a lightweight JSON endpoint. Power personal portfolios or third-party integrations automatically.",
    color: "text-foreground",
    border: "border-border",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function LandingAnimations() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 relative z-10" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-border pb-8 mb-20 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent mb-3">SYSTEM CAPABILITIES</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.04em] leading-none uppercase">
              Engineered for<br />
              <span className="font-serif italic font-normal normal-case tracking-normal">professional</span> trust.
            </h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-sm font-medium leading-relaxed">
            CertVault offers the complete toolkit to manage, audit, and showcase your verified credentials without friction.
          </p>
        </motion.div>
        
        {/* Brutalist Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={itemVariants}
              className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(242,239,233,1)] p-8 flex flex-col gap-6 cursor-default transition-transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 border-2 border-border bg-foreground flex items-center justify-center text-background">
                <f.icon className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tight uppercase">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
