"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        if (query) {
          router.push(`/certificates?q=${encodeURIComponent(query)}`);
        } else {
          router.push(`/certificates`);
        }
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, router]);

  return (
    <div className="relative max-w-sm w-full group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
        <Search className="h-4 w-4" />
      </div>
      <Input
        type="text"
        placeholder="Search by title or issuer..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 h-10 bg-white/50 dark:bg-gray-900/50 focus-visible:ring-primary shadow-sm"
      />
      {isPending && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  );
}
