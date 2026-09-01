"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, UploadCloud, FileText, X, ShieldCheck, Globe, Calendar, Link as LinkIcon, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewCertificatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 4.5 * 1024 * 1024) {
        setError("File size exceeds 4.5MB limit. Please choose a smaller file.");
        return;
      }
      setError("");
      setSelectedFile(file);
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
    setError("");

    const formData = new FormData(e.currentTarget);
    
    if (selectedFile) {
      formData.set("file", selectedFile);
    } else {
      formData.delete("file");
    }

    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        body: formData,
      });
      
      if (res.ok) {
        router.push("/certificates");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to add certificate. Please check required fields.");
        setLoading(false);
      }
    } catch (err) {
      setError("Network error occurred while saving credential.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      {/* Back Link */}
      <Link href="/certificates" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors gap-1.5">
        <ArrowLeft className="w-4 h-4" /> Back to Vault
      </Link>
      
      {/* Form Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5 space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              Add New Credential
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              Vault Record
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Enter certification details to append to your secure archive and developer API feed.
          </p>
        </div>

        {error && (
          <div className="p-3.5 text-xs bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60 rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          
          {/* 1. Basic Details */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Credential Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Certificate Title <span className="text-blue-600">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="e.g. AWS Solutions Architect"
                  className="h-10 text-xs"
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="issuer" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Issuing Organization <span className="text-blue-600">*</span>
                </Label>
                <Input
                  id="issuer"
                  name="issuer"
                  required
                  placeholder="e.g. Amazon Web Services"
                  className="h-10 text-xs"
                />
              </div>
            </div>
          </div>
          
          {/* 2. Dates & Expiration */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2. Validity Timeline
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="issueDate" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Issue Date <span className="text-blue-600">*</span>
                </Label>
                <input
                  id="issueDate"
                  name="issueDate"
                  type="date"
                  required
                  className="w-full h-10 border border-slate-200 dark:border-slate-800 rounded-lg px-3 bg-transparent text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <Label htmlFor="expirationDate" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Expiration Date
                  </Label>
                  <span className="text-[11px] text-slate-400">Leave blank if lifetime</span>
                </div>
                <input
                  id="expirationDate"
                  name="expirationDate"
                  type="date"
                  className="w-full h-10 border border-slate-200 dark:border-slate-800 rounded-lg px-3 bg-transparent text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
          
          {/* 3. Verification Link & ID */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              3. Verification & Credential ID
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="credentialId" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Credential ID
                </Label>
                <Input
                  id="credentialId"
                  name="credentialId"
                  placeholder="e.g. AWS-PSA-99410"
                  className="h-10 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="credentialUrl" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Verification URL
                </Label>
                <Input
                  id="credentialUrl"
                  name="credentialUrl"
                  type="url"
                  placeholder="https://aws.amazon.com/verify/..."
                  className="h-10 text-xs font-mono"
                />
              </div>
            </div>
          </div>
          
          {/* 4. Document File Upload */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                4. Certificate File
              </h2>
              <span className="text-[11px] text-slate-400">PDF, PNG, JPG up to 4.5MB</span>
            </div>
            
            {!selectedFile ? (
              <label
                htmlFor="file"
                className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors rounded-xl p-6 cursor-pointer space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition-colors shadow-2xs border border-slate-200 dark:border-slate-700">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    Click to select document
                  </span>
                  <span className="text-xs text-slate-500 pl-1">or drag and drop</span>
                </div>
                <input
                  id="file"
                  name="file"
                  type="file"
                  onChange={handleFileChange}
                  className="sr-only"
                  accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                />
              </label>
            ) : (
              <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="max-w-[320px] sm:max-w-md">
                    <p className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Ready to upload
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          {/* 5. Public API Visibility Toggle */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl flex items-start gap-3">
            <input
              id="isPublic"
              name="isPublic"
              type="checkbox"
              value="true"
              className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
            />
            <div className="space-y-0.5">
              <Label htmlFor="isPublic" className="font-semibold text-xs text-slate-900 dark:text-slate-100 cursor-pointer">
                Expose in Public JSON API Feed
              </Label>
              <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                When enabled, external portfolio websites can query this certificate via <code className="font-mono text-[10px] bg-slate-200/80 dark:bg-slate-700 px-1 py-0.5 rounded">/api/v1/vault/[slug]</code>.
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Link href="/certificates">
              <Button type="button" variant="outline" size="sm">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Saving...
                </>
              ) : (
                "Add to Vault"
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
