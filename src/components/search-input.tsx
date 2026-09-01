"use client";

import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect, useRef } from "react";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        if (query.trim()) {
          router.push(`/certificates?q=${encodeURIComponent(query.trim())}`);
        } else {
          router.push(`/certificates`);
        }
      });
    }, 250);
    return () => clearTimeout(timer);
  }, [query, router]);

  return (
    <div className="relative max-w-sm w-full group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
        <Search className="h-4 w-4" />
      </div>
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search title, issuer..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9 pr-14 h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg text-xs focus-visible:ring-2 focus-visible:ring-blue-500 shadow-2xs placeholder:text-slate-400"
      />
      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 text-blue-500 animate-spin" />
        ) : (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
            ⌘K
          </kbd>
        )}
      </div>
    </div>
  );
}
