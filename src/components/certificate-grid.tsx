"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2, ShieldCheck, FileText } from "lucide-react";
import Link from "next/link";

interface Cert {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate: string | null;
  isPublic: boolean;
  verified: boolean;
  credentialUrl: string | null;
  fileUrl: string | null;
}

interface Props {
  certs: Cert[];
  q: string;
  deleteCert: (formData: FormData) => Promise<void>;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
};

export function CertificateGrid({ certs, q, deleteCert }: Props) {
  if (certs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="text-center py-24 bg-card border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(242,239,233,1)]"
      >
        <div className="w-16 h-16 border-2 border-border bg-muted flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8" />
        </div>
        {q ? (
          <>
            <h2 className="text-xl font-black tracking-tight uppercase mb-2">No matching records</h2>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto text-xs font-semibold">Nothing matches your query "{q}". Modify search parameters.</p>
            <Link href="/certificates">
              <button className="border-2 border-border bg-background hover:bg-secondary px-4 py-2 font-bold text-xs uppercase cursor-pointer">
                Clear Search
              </button>
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-xl font-black tracking-tight uppercase mb-2">The vault is clean</h2>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto text-xs font-semibold">No credentials stored yet. Add your first certificate.</p>
            <Link href="/certificates/new">
              <button className="brutalist-button text-xs py-3 px-6 cursor-pointer">
                Add First Certificate
              </button>
            </Link>
          </>
        )}
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {certs.map((cert, index) => {
          // Asymmetric visual weight: Make every 3rd card rotate slightly different
          const rotateClass = index % 3 === 0 ? "hover:rotate-1" : index % 3 === 1 ? "hover:-rotate-1" : "hover:scale-[1.01]";
          
          return (
            <motion.div
              key={cert.id}
              variants={cardVariant}
              className={`bg-card border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(242,239,233,1)] flex flex-col h-full transition-transform ${rotateClass}`}
              layout
            >
              {/* Header */}
              <div className="p-6 border-b-2 border-border space-y-2 flex-1">
                <div className="flex justify-between items-start gap-2">
                  <Link href={`/certificates/${cert.id}`}>
                    <h3 className="text-lg font-black tracking-tight uppercase hover:text-accent transition-colors cursor-pointer line-clamp-2">
                      {cert.title}
                    </h3>
                  </Link>
                </div>
                <p className="text-xs font-bold text-accent uppercase tracking-wider">{cert.issuer}</p>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 bg-background/50 border-b-2 border-border text-xs font-semibold">
                <div className="space-y-1.5 text-muted-foreground">
                  <p className="flex justify-between">
                    <span>ISSUED</span>
                    <span className="text-foreground font-bold">{new Date(cert.issueDate).toLocaleDateString()}</span>
                  </p>
                  {cert.expirationDate && (
                    <p className="flex justify-between">
                      <span>EXPIRES</span>
                      <span className="text-foreground font-bold">{new Date(cert.expirationDate).toLocaleDateString()}</span>
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cert.isPublic && (
                    <span className="px-2.5 py-1 bg-secondary text-foreground text-[9px] font-bold tracking-wider uppercase border border-border">
                      PUBLIC API
                    </span>
                  )}
                  {cert.verified && (
                    <span className="px-2.5 py-1 bg-accent text-background text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 border border-accent">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED
                    </span>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 flex items-center justify-between bg-card">
                <div className="flex gap-2">
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noreferrer">
                      <button className="border-2 border-border px-3 py-1.5 text-[10px] font-bold uppercase hover:bg-secondary transition-colors cursor-pointer flex items-center gap-1.5 bg-background">
                        <ExternalLink className="w-3.5 h-3.5" /> Verify
                      </button>
                    </a>
                  )}
                  {cert.fileUrl && (
                    <a href={cert.fileUrl} target="_blank" rel="noreferrer">
                      <button className="border-2 border-border px-3 py-1.5 text-[10px] font-bold uppercase hover:bg-secondary transition-colors cursor-pointer bg-background">
                        File
                      </button>
                    </a>
                  )}
                </div>
                <form action={deleteCert}>
                  <input type="hidden" name="id" value={cert.id} />
                  <button type="submit" className="border-2 border-border hover:border-destructive hover:bg-destructive/10 text-destructive p-1.5 transition-colors cursor-pointer bg-background">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}
