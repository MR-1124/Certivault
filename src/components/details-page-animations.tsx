"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Building, Globe, ShieldCheck, Download, FileText, Image as ImageIcon, ExternalLink } from "lucide-react";

interface CertDetails {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  isPublic: boolean;
  verified: boolean;
  fileUrl: string | null;
  isPdf: boolean;
  isImage: boolean;
}

interface Props {
  cert: CertDetails;
}

export function DetailsPageAnimations({ cert }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
      
      {/* Left Column: Metadata */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(242,239,233,1)] space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {cert.isPublic && (
                <span className="px-2.5 py-1 bg-secondary text-foreground text-[9px] font-bold tracking-wider uppercase border border-border">
                  PUBLIC API FEED
                </span>
              )}
              {cert.verified && (
                <span className="px-2.5 py-1 bg-accent text-background text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 border border-accent">
                  <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-black tracking-[-0.03em] leading-tight uppercase">{cert.title}</h1>
            <p className="text-sm font-bold text-accent uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4" /> {cert.issuer}
            </p>
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-2 gap-4 border-y-2 border-border py-6 text-xs font-semibold">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Issue Date</span>
              <p className="text-foreground font-black flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-accent" /> {cert.issueDate}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Expires</span>
              <p className="text-foreground font-black flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-accent" /> {cert.expirationDate || "NEVER EXPIRES"}
              </p>
            </div>
          </div>

          {/* Credential ID */}
          {cert.credentialId && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Credential ID</span>
              <p className="font-mono text-xs break-all bg-muted border-2 border-border p-3 select-all font-bold">
                {cert.credentialId}
              </p>
            </div>
          )}

          {/* Verification / Action buttons */}
          <div className="space-y-3 pt-2">
            {cert.credentialUrl && (
              <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="block">
                <button className="w-full brutalist-button text-[10px] py-3 cursor-pointer">
                  VERIFY ON ISSUER SITE <ExternalLink className="w-3.5 h-3.5 ml-2" />
                </button>
              </a>
            )}

            {cert.fileUrl && (
              <a href={cert.fileUrl} download className="block">
                <button className="w-full border-2 border-border bg-background hover:bg-secondary transition-colors text-[10px] font-bold tracking-widest py-3 uppercase cursor-pointer flex items-center justify-center gap-2">
                  DOWNLOAD FILE <Download className="w-3.5 h-3.5" />
                </button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Live Preview */}
      <div className="lg:col-span-7">
        <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(242,239,233,1)] flex flex-col h-full overflow-hidden">
          <div className="border-b-2 border-border bg-muted/30 p-5 flex items-center justify-between">
            <h3 className="text-sm font-black tracking-tight uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" /> Document Preview
            </h3>
          </div>
          
          <div className="flex-1 p-0 flex items-center justify-center min-h-[500px] bg-background relative">
            {cert.fileUrl ? (
              cert.isPdf ? (
                <iframe
                  src={cert.fileUrl}
                  className="w-full h-[600px] border-0"
                  title="PDF Certificate Preview"
                />
              ) : cert.isImage ? (
                <div className="p-6 flex items-center justify-center h-full max-h-[600px] overflow-hidden bg-background">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45 }}
                    src={cert.fileUrl}
                    alt={cert.title}
                    className="max-w-full max-h-[500px] object-contain border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
                  />
                </div>
              ) : (
                <div className="p-12 text-center max-w-sm space-y-4 bg-muted">
                  <div className="w-14 h-14 border-2 border-border bg-foreground flex items-center justify-center mx-auto text-background">
                    <FileText className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-tight">Format Unsupported</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed font-semibold">
                    We cannot render a live preview for this file type. Please download to view.
                  </p>
                  <a href={cert.fileUrl} download className="inline-block pt-2">
                    <button className="brutalist-button text-[10px] py-2 px-4 cursor-pointer">
                      DOWNLOAD FILE
                    </button>
                  </a>
                </div>
              )
            ) : (
              <div className="p-12 text-center max-w-sm space-y-4">
                <div className="w-14 h-14 border-2 border-dashed border-border bg-muted flex items-center justify-center mx-auto text-muted-foreground/60">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black uppercase tracking-tight">No Document Uploaded</h3>
                <p className="text-muted-foreground text-xs leading-relaxed font-semibold">
                  You haven't uploaded an image or PDF copy of this credential yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
