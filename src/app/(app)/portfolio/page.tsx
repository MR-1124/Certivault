"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Eye, EyeOff, Copy, RefreshCw, Code2, Check, ShieldCheck, Globe, Terminal, Sparkles, AlertCircle } from "lucide-react";

export default function DeveloperHubPage() {
  const [slug, setSlug] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [keyLoading, setKeyLoading] = useState(false);
  
  const [settingsMessage, setSettingsMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [activeTab, setActiveTab] = useState<"curl" | "javascript" | "python" | "public">("curl");

  useEffect(() => {
    // Fetch settings
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => {
        setSlug(data.customSlug || "");
        setIsPublic(data.isPublic || false);
      });

    // Fetch API Key
    fetch("/api/developer/key")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setApiKey(data.apiKey);
        }
      });
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsMessage(null);

    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customSlug: slug.trim(), isPublic }),
      });

      if (res.ok) {
        setSettingsMessage({ type: "success", text: "Portfolio feed settings saved successfully." });
      } else {
        const data = await res.json().catch(() => ({}));
        setSettingsMessage({ type: "error", text: data.error || "Failed to update settings." });
      }
    } catch {
      setSettingsMessage({ type: "error", text: "Network error occurred." });
    }
    setSettingsLoading(false);
  };

  const handleGenerateKey = async () => {
    setKeyLoading(true);
    const res = await fetch("/api/developer/key", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      setApiKey(data.apiKey);
      setShowKey(true);
    }
    setKeyLoading(false);
  };

  const handleRevokeKey = async () => {
    if (!confirm("Revoking your API key will immediately invalidate all external apps using it. Continue?")) return;
    setKeyLoading(true);
    const res = await fetch("/api/developer/key", { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setApiKey(null);
      setShowKey(false);
    }
    setKeyLoading(false);
  };

  const copyToClipboard = (text: string, callback: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    callback(true);
    setTimeout(() => callback(false), 2000);
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "https://certivault-puce.vercel.app";
  const publicEndpointUrl = `${origin}/api/v1/vault/${slug || "your-slug"}`;
  const authEndpointUrl = `${origin}/api/v1/certificates`;

  const docSnippets = {
    curl: `curl -X GET "${authEndpointUrl}" \\\n     -H "X-CertVault-API-Key: ${apiKey || "cv_YOUR_API_TOKEN"}"`,
    javascript: `// Fetch private credentials using JavaScript Fetch API\nconst response = await fetch("${authEndpointUrl}", {\n  headers: {\n    "X-CertVault-API-Key": "${apiKey || "cv_YOUR_API_TOKEN"}"\n  }\n});\n\nconst data = await response.json();\nconsole.log(data.certificates);`,
    python: `# Fetch credentials using Python requests\nimport requests\n\nurl = "${authEndpointUrl}"\nheaders = {\n    "X-CertVault-API-Key": "${apiKey || "cv_YOUR_API_TOKEN"}"\n}\n\nresponse = requests.get(url, headers=headers)\ncertificates = response.json().get("certificates", [])\nfor cert in certificates:\n    print(f"{cert['title']} - {cert['issuer']}")`,
    public: `// Query public certificates directly (Zero authentication header required)\nconst response = await fetch("${publicEndpointUrl}");\nconst data = await response.json();\nconsole.log(data.certificates);`,
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Developer API & Feed
            </h1>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              REST v1
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Programmatic access to your credential library for custom portfolios, resumes, and client apps
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Edge Rate Limiter: 100 req/min</span>
        </div>
      </div>

      {/* Grid: Credentials & Slug Settings (5 cols) vs Code Playground (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: API Configuration (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* API Key Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Private API Token
                  </h2>
                  <p className="text-[11px] text-slate-500">SHA-256 encrypted authentication</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Private access token for requesting your complete credential archive via backend server code.
            </p>

            {apiKey ? (
              <div className="space-y-3">
                <div className="flex items-center bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl gap-2 font-mono text-xs">
                  <span className="select-all truncate flex-1 font-semibold text-slate-800 dark:text-slate-200">
                    {showKey ? apiKey : "cv_••••••••••••••••••••••••••••••••••••"}
                  </span>
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    title={showKey ? "Hide key" : "Show key"}
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(apiKey, setCopiedKey)}
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Copy key"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={handleGenerateKey}
                    disabled={keyLoading}
                    className="flex-1 gap-1.5 text-xs font-medium"
                  >
                    <RefreshCw className="w-3 h-3" /> Re-generate
                  </Button>
                  <Button
                    variant="destructive"
                    size="xs"
                    onClick={handleRevokeKey}
                    disabled={keyLoading}
                    className="flex-1 text-xs font-medium"
                  >
                    Revoke Token
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleGenerateKey}
                disabled={keyLoading}
                size="sm"
                className="w-full font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              >
                {keyLoading ? "Generating Token..." : "Generate Developer API Token"}
              </Button>
            )}
          </div>

          {/* Public Portfolio Feed Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Public JSON Portfolio Feed
                </h2>
                <p className="text-[11px] text-slate-500">CORS-enabled frontend endpoint</p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              {settingsMessage && (
                <div
                  className={`p-3 text-xs rounded-xl font-medium border ${
                    settingsMessage.type === "success"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60"
                      : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900/60"
                  }`}
                >
                  {settingsMessage.text}
                </div>
              )}

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                />
                <Label htmlFor="isPublic" className="font-semibold text-xs text-slate-900 dark:text-slate-100 cursor-pointer">
                  Enable Public Portfolio Feed
                </Label>
              </div>

              {isPublic && (
                <div className="space-y-2 animate-fade-in-up">
                  <Label htmlFor="slug" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Custom Slug Identifier
                  </Label>
                  <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800/60 focus-within:ring-2 focus-within:ring-blue-500">
                    <span className="px-3 py-2 text-xs text-slate-500 border-r border-slate-200 dark:border-slate-700 font-mono bg-slate-100/80 dark:bg-slate-800 select-none">
                      /api/v1/vault/
                    </span>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="your-name"
                      className="border-0 shadow-none focus-visible:ring-0 rounded-none h-9 text-xs font-mono"
                      required={isPublic}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="truncate max-w-[260px] font-mono">{publicEndpointUrl}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(publicEndpointUrl, setCopiedUrl)}
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer shrink-0 ml-2"
                    >
                      {copiedUrl ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copiedUrl ? "Copied" : "Copy URL"}
                    </button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={settingsLoading}
                size="sm"
                className="w-full font-medium"
              >
                {settingsLoading ? "Saving..." : "Save Feed Settings"}
              </Button>
            </form>
          </div>

        </div>

        {/* Right Column: Code Documentation & Playground (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden flex flex-col h-full">
            
            {/* Header with Tabs */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Integration Code Snippets
                </h3>
              </div>

              {/* Language Switcher */}
              <div className="flex bg-slate-200/80 dark:bg-slate-950 p-0.5 rounded-lg text-xs font-medium">
                {[
                  { id: "curl", label: "cURL" },
                  { id: "javascript", label: "JavaScript" },
                  { id: "python", label: "Python" },
                  { id: "public", label: "Public Feed" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Block Content */}
            <div className="flex-1 bg-slate-950 p-5 text-slate-200 font-mono text-xs relative flex flex-col justify-between overflow-x-auto min-h-[340px]">
              <pre className="leading-relaxed whitespace-pre text-[12px] text-slate-300">
                {docSnippets[activeTab]}
              </pre>

              <div className="pt-4 border-t border-slate-800/80 mt-6 flex justify-between items-center text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Method: GET · Format: JSON
                </span>
                <button
                  onClick={() => copyToClipboard(docSnippets[activeTab], setCopiedSnippet)}
                  className="flex items-center gap-1 text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSnippet ? "Copied" : "Copy Snippet"}
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Full-Width Reference Card */}
        <div className="lg:col-span-12 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              API Reference & Endpoint Specification
            </h2>
            <p className="text-xs text-slate-500">
              Technical rules and headers for requesting your credential vault
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-blue-600" /> Private Authenticated Endpoint
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Send a <code className="font-mono bg-slate-200/80 dark:bg-slate-700 px-1 py-0.5 rounded">GET</code> request to <code className="font-mono bg-slate-200/80 dark:bg-slate-700 px-1 py-0.5 rounded">/api/v1/certificates</code> with the header <code className="font-mono bg-slate-200/80 dark:bg-slate-700 px-1 py-0.5 rounded">X-CertVault-API-Key</code>. Returns your complete vault. Keep your private key on server-side nodes only.
              </p>
            </div>

            <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600" /> Public Portfolio Endpoint
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Send a <code className="font-mono bg-slate-200/80 dark:bg-slate-700 px-1 py-0.5 rounded">GET</code> request to <code className="font-mono bg-slate-200/80 dark:bg-slate-700 px-1 py-0.5 rounded">/api/v1/vault/[slug]</code>. Returns only credentials marked as public. Safe for direct client-side (frontend) portfolio code.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
