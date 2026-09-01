"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Key,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Terminal,
  Check,
  Globe,
  BarChart3,
  BellRing,
  Download,
  Upload,
  Code2,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Layers,
  Send,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function DeveloperHubPage() {
  const [activeMainTab, setActiveMainTab] = useState<"api" | "showcase" | "badges" | "embed" | "analytics" | "webhooks" | "backup">("api");

  // Portfolio settings
  const [slug, setSlug] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // API Key
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [keyLoading, setKeyLoading] = useState(false);

  // Code snippets tab
  const [codeTab, setCodeTab] = useState<"curl" | "javascript" | "python" | "public">("curl");

  // Webhooks
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [webhookEnabled, setWebhookEnabled] = useState(true);
  const [webhookSaving, setWebhookSaving] = useState(false);
  const [webhookTesting, setWebhookTesting] = useState(false);
  const [webhookNotice, setWebhookNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Analytics
  const [analytics, setAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Embed & Badges
  const [embedTheme, setEmbedTheme] = useState<"dark" | "light">("dark");
  const [badgeType, setBadgeType] = useState<"verified" | "count" | "status">("verified");

  // Copy feedbacks
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Import
  const [importing, setImporting] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  useEffect(() => {
    // Fetch settings
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => {
        setSlug(data.customSlug || "");
        setIsPublic(data.isPublic || false);
        setHeadline(data.headline || "");
        setBio(data.bio || "");
        if (data.socialLinks) {
          try {
            const parsed = JSON.parse(data.socialLinks);
            setGithub(parsed.github || "");
            setLinkedin(parsed.linkedin || "");
            setWebsite(parsed.website || "");
          } catch {}
        }
      });

    // Fetch API Key
    fetch("/api/developer/key")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setApiKey(data.apiKey);
        }
      });

    // Fetch Webhook Config
    fetch("/api/developer/webhook")
      .then((res) => res.json())
      .then((data) => {
        setWebhookUrl(data.url || "");
        setWebhookSecret(data.secret || "");
        setWebhookEnabled(data.enabled ?? true);
      });
  }, []);

  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch("/api/developer/analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch {}
    setAnalyticsLoading(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsMessage(null);

    const socialLinks = JSON.stringify({
      github: github.trim(),
      linkedin: linkedin.trim(),
      website: website.trim(),
    });

    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customSlug: slug.trim(),
          isPublic,
          headline: headline.trim(),
          bio: bio.trim(),
          socialLinks,
        }),
      });

      if (res.ok) {
        setSettingsMessage({ type: "success", text: "Portfolio settings updated successfully." });
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

  const handleSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setWebhookSaving(true);
    setWebhookNotice(null);

    try {
      const res = await fetch("/api/developer/webhook", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: webhookUrl,
          secret: webhookSecret,
          enabled: webhookEnabled,
        }),
      });
      if (res.ok) {
        setWebhookNotice({ type: "success", text: "Webhook configuration saved." });
      } else {
        const data = await res.json();
        setWebhookNotice({ type: "error", text: data.error || "Failed to save webhook." });
      }
    } catch {
      setWebhookNotice({ type: "error", text: "Network error." });
    }
    setWebhookSaving(false);
  };

  const handleTestWebhook = async () => {
    setWebhookTesting(true);
    setWebhookNotice(null);
    try {
      const res = await fetch("/api/developer/webhook", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setWebhookNotice({ type: "success", text: `Ping sent! Webhook endpoint returned HTTP ${data.statusCode}.` });
      } else {
        setWebhookNotice({ type: "error", text: data.error || "Webhook test delivery failed." });
      }
    } catch {
      setWebhookNotice({ type: "error", text: "Network error triggering webhook." });
    }
    setWebhookTesting(false);
  };

  const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImporting(true);
      setImportNotice(null);

      try {
        const text = await file.text();
        const json = JSON.parse(text);
        const res = await fetch("/api/vault/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(json),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setImportNotice(`Successfully imported ${data.importedCount} certificate(s) into your vault!`);
        } else {
          setImportNotice(`Import failed: ${data.error || "Invalid file format."}`);
        }
      } catch {
        setImportNotice("Invalid JSON file. Please provide a valid CertVault export file.");
      }
      setImporting(false);
    }
  };

  const copyToClipboard = (text: string, callback: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    callback(true);
    setTimeout(() => callback(false), 2000);
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "https://certivault-puce.vercel.app";
  const publicEndpointUrl = `${origin}/api/v1/vault/${slug || "your-slug"}`;
  const publicShowcaseUrl = `${origin}/vault/${slug || "your-slug"}`;
  const authEndpointUrl = `${origin}/api/v1/certificates`;
  const badgeSvgUrl = `${origin}/api/v1/badge/${slug || "your-slug"}?type=${badgeType}`;
  const embedUrl = `${origin}/embed/vault/${slug || "your-slug"}?theme=${embedTheme}`;

  const docSnippets = {
    curl: `curl -X GET "${authEndpointUrl}" \\\n     -H "X-CertVault-API-Key: ${apiKey || "cv_YOUR_API_TOKEN"}"`,
    javascript: `// Fetch private credentials using JavaScript Fetch API\nconst response = await fetch("${authEndpointUrl}", {\n  headers: {\n    "X-CertVault-API-Key": "${apiKey || "cv_YOUR_API_TOKEN"}"\n  }\n});\n\nconst data = await response.json();\nconsole.log(data.certificates);`,
    python: `# Fetch credentials using Python requests\nimport requests\n\nurl = "${authEndpointUrl}"\nheaders = {\n    "X-CertVault-API-Key": "${apiKey || "cv_YOUR_API_TOKEN"}"\n}\n\nresponse = requests.get(url, headers=headers)\ncertificates = response.json().get("certificates", [])\nfor cert in certificates:\n    print(f"{cert['title']} - {cert['issuer']}")`,
    public: `// Query public certificates directly (Zero authentication header required)\nconst response = await fetch("${publicEndpointUrl}");\nconst data = await response.json();\nconsole.log(data.certificates);`,
  };

  const markdownBadgeSnippet = `[![CertVault Verified](${badgeSvgUrl})](${publicShowcaseUrl})`;
  const iframeEmbedSnippet = `<iframe\n  src="${embedUrl}"\n  width="100%"\n  height="360"\n  frameborder="0"\n  style="border-radius: 12px; overflow: hidden;"\n></iframe>`;

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Developer Studio & Ecosystem Hub
            </h1>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              REST v1 & Badges
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Programmatic feeds, dynamic GitHub badges, public showcase, and telemetry logs
          </p>
        </div>

        {isPublic && slug && (
          <a
            href={`/vault/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Globe className="w-3.5 h-3.5" /> View Public Profile <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="flex overflow-x-auto bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs font-medium gap-1">
        {[
          { id: "api", label: "API & Keys", icon: Key },
          { id: "showcase", label: "Public Profile", icon: Globe },
          { id: "badges", label: "GitHub Badges", icon: ShieldCheck },
          { id: "embed", label: "Embed Widget", icon: Layers },
          { id: "analytics", label: "Telemetry & Logs", icon: BarChart3 },
          { id: "webhooks", label: "Renewal Webhooks", icon: BellRing },
          { id: "backup", label: "Backup & Export", icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveMainTab(tab.id as any);
                if (tab.id === "analytics") loadAnalytics();
              }}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeMainTab === tab.id
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: API & KEY MANAGEMENT + CODE PLAYGROUND */}
      {activeMainTab === "api" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">Private Access Token</h2>
                  <p className="text-[11px] text-slate-500">SHA-256 encrypted authentication</p>
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
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(apiKey, setCopiedKey)}
                      className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {copiedKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" size="xs" onClick={handleGenerateKey} disabled={keyLoading} className="flex-1 gap-1.5 text-xs">
                      <RefreshCw className="w-3 h-3" /> Re-generate
                    </Button>
                    <Button variant="destructive" size="xs" onClick={handleRevokeKey} disabled={keyLoading} className="flex-1 text-xs">
                      Revoke Token
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={handleGenerateKey} disabled={keyLoading} size="sm" className="w-full font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs">
                  {keyLoading ? "Generating Token..." : "Generate Developer API Token"}
                </Button>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden flex flex-col h-full">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">Code Snippets</h3>
                </div>
                <div className="flex bg-slate-200/80 dark:bg-slate-950 p-0.5 rounded-lg text-xs font-medium">
                  {["curl", "javascript", "python", "public"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setCodeTab(tab as any)}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${codeTab === tab ? "bg-white dark:bg-slate-800 font-semibold shadow-2xs" : "text-slate-500"}`}
                    >
                      {tab.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 bg-slate-950 p-5 text-slate-200 font-mono text-xs flex flex-col justify-between overflow-x-auto min-h-[300px]">
                <pre className="leading-relaxed whitespace-pre text-[12px] text-slate-300">
                  {docSnippets[codeTab]}
                </pre>
                <div className="pt-4 border-t border-slate-800 mt-4 flex justify-between items-center text-[11px] text-slate-400">
                  <span>Method: GET · Response: JSON</span>
                  <button
                    onClick={() => copyToClipboard(docSnippets[codeTab], setCopiedSnippet)}
                    className="flex items-center gap-1 text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-800 cursor-pointer"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedSnippet ? "Copied" : "Copy Snippet"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PUBLIC PROFILE SHOWCASE SETTINGS */}
      {activeMainTab === "showcase" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 max-w-3xl">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Public Profile & Showcase Settings
            </h2>
            <p className="text-xs text-slate-500">
              Configure your shareable public profile page rendered at <code className="font-mono text-blue-500">/vault/{slug || "[slug]"}</code>
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            {settingsMessage && (
              <div className={`p-3 text-xs rounded-xl font-medium border ${settingsMessage.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                {settingsMessage.text}
              </div>
            )}

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <input
                type="checkbox"
                id="isPublicToggle"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
              />
              <div>
                <Label htmlFor="isPublicToggle" className="font-semibold text-xs text-slate-900 dark:text-slate-100 cursor-pointer">
                  Enable Public Showcase & JSON Feed
                </Label>
                <p className="text-[11px] text-slate-500">Makes certificates with "Public" visibility accessible on your public URL.</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="customSlug" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Custom URL Slug
              </Label>
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800/60">
                <span className="px-3 py-2 text-xs text-slate-500 border-r border-slate-200 dark:border-slate-700 font-mono bg-slate-100 dark:bg-slate-800 select-none">
                  certivault.app/vault/
                </span>
                <Input
                  id="customSlug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="your-name"
                  className="border-0 shadow-none focus-visible:ring-0 rounded-none h-9 text-xs font-mono"
                  required={isPublic}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="headline" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Professional Headline
              </Label>
              <Input
                id="headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Senior Cloud Architect & Kubernetes Specialist"
                className="h-10 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Short Bio / Description
              </Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Brief introduction displayed on your public showcase..."
                className="w-full border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="space-y-1">
                <Label className="text-[11px] text-slate-500 font-medium">GitHub URL</Label>
                <Input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-slate-500 font-medium">LinkedIn URL</Label>
                <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-slate-500 font-medium">Website</Label>
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourwebsite.dev" className="h-9 text-xs" />
              </div>
            </div>

            <div className="pt-3">
              <Button type="submit" disabled={settingsLoading} size="sm" className="font-semibold bg-blue-600 hover:bg-blue-700 text-white">
                {settingsLoading ? "Saving..." : "Save Showcase Profile"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: DYNAMIC GITHUB SVG BADGES */}
      {activeMainTab === "badges" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-5">
              <div className="space-y-1">
                <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  Dynamic GitHub SVG Badges
                </h2>
                <p className="text-xs text-slate-500">
                  Embed live vector badges in your GitHub profile README. Updates automatically as you earn new credentials.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Badge Type</Label>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1 text-xs">
                  {[
                    { id: "verified", label: "Verified Count" },
                    { id: "count", label: "Total Stored" },
                    { id: "status", label: "Validity Status" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setBadgeType(t.id as any)}
                      className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${badgeType === t.id ? "bg-white dark:bg-slate-900 font-semibold shadow-2xs" : "text-slate-500"}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Badge Preview */}
              <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-3">
                <span className="text-[10px] text-slate-400 font-mono block">LIVE SVG PREVIEW</span>
                <div className="inline-block">
                  <img src={badgeSvgUrl} alt="CertVault Badge" className="h-6 mx-auto" />
                </div>
              </div>

              {/* Copy Markdown Snippet */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">GitHub Markdown Snippet</Label>
                <div className="relative">
                  <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
                    {markdownBadgeSnippet}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(markdownBadgeSnippet, setCopiedBadge)}
                    className="absolute top-2 right-2 text-xs flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-white cursor-pointer"
                  >
                    {copiedBadge ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedBadge ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4 text-xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Badge Direct URLs</h3>
              <p className="text-slate-500">You can also paste raw SVG URLs directly into custom shields or website footers:</p>
              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg truncate select-all">
                  {origin}/api/v1/badge/{slug || "your-slug"}?type=verified
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg truncate select-all">
                  {origin}/api/v1/badge/{slug || "your-slug"}?type=count
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg truncate select-all">
                  {origin}/api/v1/badge/{slug || "your-slug"}?type=status
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EMBEDDABLE WIDGET */}
      {activeMainTab === "embed" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-5">
              <div className="space-y-1">
                <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">Embeddable Widget Builder</h2>
                <p className="text-xs text-slate-500">
                  Drop a live responsive credentials carousel into Webflow, Notion, Framer, WordPress, or custom React apps.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Widget Theme</Label>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1 text-xs">
                  <button
                    onClick={() => setEmbedTheme("dark")}
                    className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${embedTheme === "dark" ? "bg-white dark:bg-slate-900 font-semibold shadow-2xs" : "text-slate-500"}`}
                  >
                    Dark Theme
                  </button>
                  <button
                    onClick={() => setEmbedTheme("light")}
                    className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${embedTheme === "light" ? "bg-white dark:bg-slate-900 font-semibold shadow-2xs" : "text-slate-500"}`}
                  >
                    Light Theme
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">HTML iframe Embed Code</Label>
                <div className="relative">
                  <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
                    {iframeEmbedSnippet}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(iframeEmbedSnippet, setCopiedEmbed)}
                    className="absolute top-2 right-2 text-xs flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-white cursor-pointer"
                  >
                    {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedEmbed ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Live Iframe Viewport</span>
              <iframe src={embedUrl} className="w-full h-[320px] rounded-xl border border-slate-200 dark:border-slate-800" title="Embed Preview" />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TELEMETRY & LOGS */}
      {activeMainTab === "analytics" && (
        <div className="space-y-6">
          {analyticsLoading ? (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
              <p className="text-xs text-slate-500 mt-2">Loading API telemetry...</p>
            </div>
          ) : analytics ? (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">7-Day API Requests</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono mt-1">{analytics.totalCalls}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">Successful Requests (2xx)</p>
                  <p className="text-2xl font-bold text-emerald-500 font-mono mt-1">{analytics.totalSuccess}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">Rate Limits & Errors</p>
                  <p className="text-2xl font-bold text-amber-500 font-mono mt-1">{analytics.totalErrors}</p>
                </div>
              </div>

              {/* Top Referrers */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Top Inbound Referrers</h3>
                {analytics.topReferrers.length === 0 ? (
                  <p className="text-xs text-slate-500">No external referrers recorded in the last 7 days.</p>
                ) : (
                  <div className="space-y-2">
                    {analytics.topReferrers.map((ref: any) => (
                      <div key={ref.domain} className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                        <span className="font-mono font-medium">{ref.domain}</span>
                        <span className="font-semibold text-blue-500">{ref.count} calls</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Logs Table */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Recent API Invocations</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                      <tr>
                        <th className="py-2.5 px-4">Endpoint</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Referrer</th>
                        <th className="py-2.5 px-4">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono">
                      {analytics.recentLogs.map((log: any) => (
                        <tr key={log.id}>
                          <td className="py-2.5 px-4 text-blue-500 font-semibold">{log.endpoint}</td>
                          <td className="py-2.5 px-4">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${log.statusCode === 200 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                              {log.statusCode}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-500 truncate max-w-[200px]">{log.referrer || "Direct"}</td>
                          <td className="py-2.5 px-4 text-slate-400">{new Date(log.createdAt).toLocaleTimeString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Click to fetch telemetry records.</p>
          )}
        </div>
      )}

      {/* TAB 6: RENEWAL WEBHOOKS */}
      {activeMainTab === "webhooks" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 max-w-3xl">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Automated Renewal Webhooks
            </h2>
            <p className="text-xs text-slate-500">
              Receive automatic JSON payloads at your Discord, Slack, Zapier, or custom backend URL when credentials are due for renewal in 60d, 30d, or 7d.
            </p>
          </div>

          <form onSubmit={handleSaveWebhook} className="space-y-4">
            {webhookNotice && (
              <div className={`p-3 text-xs rounded-xl font-medium border ${webhookNotice.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                {webhookNotice.text}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="webhookUrl" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Destination Webhook URL
              </Label>
              <Input
                id="webhookUrl"
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://discord.com/api/webhooks/... or https://your-server.com/webhook"
                className="h-10 text-xs font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="webhookSecret" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Signing Secret (Optional)
              </Label>
              <Input
                id="webhookSecret"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                placeholder="whsec_..."
                className="h-10 text-xs font-mono"
              />
              <p className="text-[10px] text-slate-400">Included in the <code className="font-mono">X-CertVault-Webhook-Secret</code> HTTP header for verification.</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="webhookActive"
                checked={webhookEnabled}
                onChange={(e) => setWebhookEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
              />
              <Label htmlFor="webhookActive" className="text-xs font-semibold cursor-pointer">
                Enable Renewal Alert Webhook Dispatches
              </Label>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <Button type="submit" disabled={webhookSaving} size="sm" className="font-semibold bg-blue-600 hover:bg-blue-700 text-white">
                {webhookSaving ? "Saving..." : "Save Webhook"}
              </Button>
              {webhookUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTestWebhook}
                  disabled={webhookTesting}
                  className="gap-1.5 text-xs"
                >
                  {webhookTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-blue-500" />}
                  Send Test Ping
                </Button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* TAB 7: BACKUP & DATA PORTABILITY */}
      {activeMainTab === "backup" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Export Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center border border-blue-200 dark:border-blue-800">
              <Download className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Export Complete Vault</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Download a full JSON archive containing all credential metadata, verification hashes, and Schema.org JSON-LD tags.
              </p>
            </div>
            <a href="/api/vault/export" download className="inline-block pt-2">
              <Button size="sm" className="gap-1.5 font-semibold bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="w-4 h-4" /> Download Vault JSON
              </Button>
            </a>
          </div>

          {/* Import Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <Upload className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Bulk Import Credentials</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Restore or batch-upload certificates from a previously exported CertVault JSON backup.
              </p>
            </div>

            {importNotice && (
              <div className="p-2.5 text-xs rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium">
                {importNotice}
              </div>
            )}

            <label className="inline-block pt-2 cursor-pointer">
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-emerald-500" />}
                {importing ? "Importing..." : "Choose Backup File (.json)"}
              </span>
              <input type="file" accept=".json" onChange={handleImportJson} className="sr-only" disabled={importing} />
            </label>
          </div>
        </div>
      )}

    </div>
  );
}
