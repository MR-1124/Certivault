import { prisma } from "@/lib/prisma";
import { Sparkles, Calendar, Tag } from "lucide-react";

export default async function ChangelogPage() {
  const changelogs = await prisma.changelog.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-6 space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Platform Changelog
          </h1>
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            Release Feed
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          New features, security updates, and performance improvements across CertVault.
        </p>
      </div>

      {changelogs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 shadow-2xs space-y-2">
          <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No updates recorded yet
          </p>
          <p className="text-xs text-slate-500">
            Platform releases will appear here as they are deployed.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {changelogs.map((log) => (
            <div
              key={log.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-base text-slate-900 dark:text-slate-100">
                    {log.version}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    {log.category}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(log.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {log.summary}
                </h3>
                {log.notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap font-normal">
                    {log.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
