"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, UploadCloud, FileText, X } from "lucide-react";
import Link from "next/link";

export default function NewCertificatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById("file") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // Ensure the file is correctly bound if selected
    if (selectedFile) {
      formData.set("file", selectedFile);
    } else {
      formData.delete("file");
    }

    const res = await fetch("/api/certificates", {
      method: "POST",
      body: formData,
    });
    
    if (res.ok) {
      router.push("/dashboard");
    } else {
      setLoading(false);
      alert("Failed to add certificate");
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <Link href="/certificates" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Certificates
      </Link>
      
      <Card className="premium-card border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(242,239,233,1)]">
        <CardHeader className="border-b-2 border-border pb-6">
          <CardTitle className="text-3xl font-black uppercase tracking-tight">Add Certificate</CardTitle>
          <CardDescription className="text-xs font-semibold text-muted-foreground mt-1 uppercase">Enter credentials to append to your dev API.</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider">Certificate Title <span className="text-accent">*</span></Label>
                <Input id="title" name="title" required placeholder="e.g. AWS Solutions Architect" className="h-10 border-2 border-border" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="issuer" className="text-xs font-bold uppercase tracking-wider">Issuing Organization <span className="text-accent">*</span></Label>
                <Input id="issuer" name="issuer" required placeholder="e.g. Amazon Web Services" className="h-10 border-2 border-border" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="issueDate" className="text-xs font-bold uppercase tracking-wider">Issue Date <span className="text-accent">*</span></Label>
                <input id="issueDate" name="issueDate" type="date" required className="w-full h-10 border-2 border-border px-3 bg-background font-semibold text-xs uppercase" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expirationDate" className="text-xs font-bold uppercase tracking-wider">Expiration Date</Label>
                <input id="expirationDate" name="expirationDate" type="date" className="w-full h-10 border-2 border-border px-3 bg-background font-semibold text-xs uppercase" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credentialUrl" className="text-xs font-bold uppercase tracking-wider">Credential Verification URL</Label>
              <Input id="credentialUrl" name="credentialUrl" type="url" placeholder="https://..." className="h-10 border-2 border-border" />
            </div>
            
            {/* File upload panel */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider">Certificate File (PDF or Image)</Label>
              
              {!selectedFile ? (
                <div className="mt-1 flex justify-center border-2 border-dashed border-border bg-card px-6 py-8 hover:bg-secondary/40 transition-colors">
                  <div className="text-center space-y-3">
                    <UploadCloud className="h-8 w-8 text-muted-foreground mx-auto" />
                    <div className="flex text-xs text-muted-foreground justify-center font-bold">
                      <label htmlFor="file" className="relative cursor-pointer text-accent hover:underline uppercase">
                        <span>Select file</span>
                        <input id="file" name="file" type="file" onChange={handleFileChange} className="sr-only" accept=".pdf,image/*" />
                      </label>
                      <p className="pl-1 uppercase">to upload</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground/85 uppercase font-bold">PDF, PNG, JPG up to 5MB</p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-border bg-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 border border-border bg-background flex items-center justify-center text-foreground">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="max-w-[320px] sm:max-w-md">
                      <p className="font-bold text-xs truncate uppercase tracking-tight">{selectedFile.name}</p>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button type="button" onClick={handleRemoveFile} className="p-1 border-2 border-border hover:border-destructive hover:bg-destructive/10 text-destructive transition-all cursor-pointer bg-background">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 pt-4 border-t-2 border-border">
              <input id="isPublic" name="isPublic" type="checkbox" value="true" className="w-5 h-5 border-2 border-border text-foreground accent-accent cursor-pointer" />
              <Label htmlFor="isPublic" className="font-bold cursor-pointer uppercase text-[10px] tracking-wider">Allow this certificate to be queried via the Public JSON API</Label>
            </div>
            
            <div className="pt-4 flex justify-end gap-3">
              <Link href="/certificates">
                <button type="button" className="border-2 border-border hover:bg-secondary px-6 h-11 text-xs font-bold uppercase cursor-pointer bg-background">Cancel</button>
              </Link>
              <button type="submit" disabled={loading} className="brutalist-button text-xs h-11 px-8 cursor-pointer">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Add Certificate"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
