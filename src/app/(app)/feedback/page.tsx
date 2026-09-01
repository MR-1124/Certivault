import { MessageSquare, AlertCircle } from "lucide-react";

export default function FeedbackPage() {
  const typeformUrl = process.env.NEXT_PUBLIC_TYPEFORM_URL || "https://form.typeform.com/to/placeholder";

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in-up">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Platform Feedback & Suggestions
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium pl-10">
            Share ideas, report issues, or request new integrations for the CertVault developer workspace.
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full h-[620px] bg-slate-50/50 dark:bg-slate-950/40 relative">
          {typeformUrl.includes("placeholder") ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Feedback Form Configuration
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  To load your custom survey, configure the <code className="bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-[11px]">NEXT_PUBLIC_TYPEFORM_URL</code> environment variable in your deployment environment.
                </p>
              </div>
            </div>
          ) : (
            <iframe
              src={typeformUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="camera; microphone; autoplay; encrypted-media;"
              title="CertVault Feedback Form"
              className="w-full h-full border-0"
            />
          )}
        </div>

      </div>
    </div>
  );
}
