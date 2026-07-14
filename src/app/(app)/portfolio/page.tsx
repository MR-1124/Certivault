"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Eye, EyeOff, Copy, RefreshCw, FileCode, Check } from "lucide-react";

export default function DeveloperHubPage() {
  const [slug, setSlug] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [keyLoading, setKeyLoading] = useState(false);
  
  const [settingsMessage, setSettingsMessage] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState("curl");

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
    setSettingsMessage("");

    const res = await fetch("/api/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customSlug: slug, isPublic }),
    });

    if (res.ok) {
      setSettingsMessage("Public endpoint settings updated.");
    } else {
      const data = await res.json();
      setSettingsMessage(data.error || "Failed to update settings.");
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
    if (!confirm("Revoking the key will instantly break integrations using it. Continue?")) return;
    setKeyLoading(true);
    const res = await fetch("/api/developer/key", { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setApiKey(null);
      setShowKey(false);
    }
    setKeyLoading(false);
  };

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "https://certivault-puce.vercel.app";
  const publicEndpointUrl = `${origin}/api/v1/vault/${slug || "your-slug"}`;
  const authEndpointUrl = `${origin}/api/v1/certificates`;

  const docSnippets = {
    curl: `curl -H "X-CertVault-API-Key: ${apiKey || "YOUR_API_KEY"}" \\\n     -X GET \\\n     "${authEndpointUrl}"`,
    javascript: `fetch("${authEndpointUrl}", {\n  headers: {\n    "X-CertVault-API-Key": "${apiKey || "YOUR_API_KEY"}"\n  }\n})\n.then(res => res.json())\n.then(data => console.log(data.certificates));`,
    python: `import requests\n\nurl = "${authEndpointUrl}"\nheaders = {\n    "X-CertVault-API-Key": "${apiKey || "YOUR_API_KEY"}"\n}\n\nresponse = requests.get(url, headers=headers)\ncertificates = response.json().get("certificates")\nprint(certificates)`,
    public: `// Query public certificates directly (No authentication header required)\nfetch("${publicEndpointUrl}")\n.then(res => res.json())\n.then(data => console.log(data.certificates));`,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
      
      {/* Settings Column */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* API Key Panel */}
        <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(242,239,233,1)]">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">SECURITY Node</p>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-foreground" /> API Credentials
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed font-semibold mb-6">
            Generate a private access token to securely request your vault details. Keep this key safe.
          </p>

          <div className="space-y-4">
            {apiKey ? (
              <div className="space-y-3">
                <div className="flex items-center border-2 border-border bg-background p-3 rounded-none gap-2">
                  <span className="font-mono text-xs select-all truncate flex-1 font-bold">
                    {showKey ? apiKey : "••••••••••••••••••••••••••••••••••••"}
                  </span>
                  <button onClick={() => setShowKey(!showKey)} className="p-1 hover:text-accent transition-colors">
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => copyToClipboard(apiKey, setCopiedKey)} className="p-1 hover:text-accent transition-colors">
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleGenerateKey} disabled={keyLoading} className="w-1/2 border-2 border-border py-2 text-[10px] font-bold uppercase hover:bg-secondary cursor-pointer bg-background flex items-center justify-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5" /> RE-GENERATE
                  </button>
                  <button onClick={handleRevokeKey} disabled={keyLoading} className="w-1/2 border-2 border-border hover:border-destructive hover:bg-destructive/10 text-destructive py-2 text-[10px] font-bold uppercase cursor-pointer bg-background">
                    REVOKE KEY
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={handleGenerateKey} disabled={keyLoading} className="w-full brutalist-button text-[10px] py-3 cursor-pointer">
                {keyLoading ? "Generating..." : "GENERATE DEVELOPER API KEY"}
              </button>
            )}
          </div>
        </div>

        {/* Public Endpoint Panel */}
        <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(242,239,233,1)]">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">PUBLIC ENDPOINT</p>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4">JSON Integration</h2>
          
          <form onSubmit={handleSaveSettings} className="space-y-5">
            {settingsMessage && (
              <div className="text-xs font-bold uppercase text-accent bg-accent/5 p-3 border-2 border-accent/20 rounded-none">
                {settingsMessage}
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
              />
              <Label htmlFor="isPublic" className="font-bold cursor-pointer uppercase text-xs tracking-wider">Enable Public Portfolio Endpoint</Label>
            </div>

            {isPublic && (
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                <Label htmlFor="slug" className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Custom Endpoint Slug</Label>
                <div className="flex items-center border-2 border-border overflow-hidden bg-background">
                  <span className="bg-muted px-3 py-2 text-[10px] text-muted-foreground border-r border-border font-bold uppercase">
                    /api/v1/vault/
                  </span>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="border-0 focus-visible:ring-0 rounded-none shadow-none h-9 px-3 text-xs"
                    required={isPublic}
                  />
                </div>
                <div className="pt-2 flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                  <span className="truncate max-w-[280px]">Endpoint: {publicEndpointUrl}</span>
                  <button type="button" onClick={() => copyToClipboard(publicEndpointUrl, setCopiedUrl)} className="text-accent font-bold hover:underline ml-2 inline-flex items-center gap-1 shrink-0">
                    {copiedUrl ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />} COPY URL
                  </button>
                </div>
              </div>
            )}

            <button type="submit" disabled={settingsLoading} className="brutalist-button text-[10px] py-3 px-6 cursor-pointer">
              {settingsLoading ? "Saving..." : "SAVE INTEGRATION SETTINGS"}
            </button>
          </form>
        </div>

      </div>

      {/* Right Column: Code Documentation */}
      <div className="lg:col-span-7">
        <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(242,239,233,1)] flex flex-col h-full overflow-hidden">
          
          <div className="border-b-2 border-border bg-muted/30 p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h3 className="text-sm font-black tracking-tight uppercase flex items-center gap-2">
              <FileCode className="w-4 h-4 text-accent" /> API INTEGRATION DOCS
            </h3>
            
            {/* Tabs */}
            <div className="flex border-2 border-border rounded-none overflow-hidden bg-background max-w-fit text-[10px] font-bold">
              {[
                { id: "curl", label: "cURL" },
                { id: "javascript", label: "JS" },
                { id: "python", label: "Python" },
                { id: "public", label: "Public Feed" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 uppercase transition-colors cursor-pointer border-r border-border last:border-0 ${
                    activeTab === tab.id ? "bg-foreground text-background" : "hover:bg-secondary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-[#18181c] p-6 text-[#f5f5f7] font-mono text-xs relative select-all flex flex-col justify-between overflow-x-auto min-h-[400px]">
            <pre className="whitespace-pre">{docSnippets[activeTab as keyof typeof docSnippets]}</pre>
            <div className="pt-6 border-t border-white/10 mt-6 flex justify-between items-center text-[10px] text-white/50 select-none">
              <span>Endpoint method: GET</span>
              <button
                onClick={() => copyToClipboard(docSnippets[activeTab as keyof typeof docSnippets], () => {})}
                className="text-white hover:text-white/80 transition-colors uppercase font-bold tracking-wider cursor-pointer"
              >
                Copy Snippet
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Full Width Documentation Section */}
      <div className="lg:col-span-12 bg-card border-2 border-border p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(242,239,233,1)] space-y-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">DEVELOPER MANUAL</p>
          <h2 className="text-3xl font-black uppercase tracking-tight">API Integration Reference</h2>
          <p className="text-xs text-muted-foreground leading-relaxed font-semibold mt-1">
            Read the specifications to integrate your CertVault credentials onto custom external sites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t-2 border-border">
          {/* Section 1: Authentication */}
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-none border border-border bg-foreground text-background flex items-center justify-center text-[10px] font-bold">1</span>
              Private Authenticated Requests
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              To fetch your entire credential vault, perform a <code className="bg-muted px-1.5 py-0.5 border border-border select-all font-bold">GET</code> request to the certificates endpoint. Secure your request by including your private token as an HTTP header:
            </p>
            <div className="bg-[#18181c] p-3 text-[#f5f5f7] rounded-none font-mono text-[10px] select-all border border-border">
              X-CertVault-API-Key: cv_YOUR_PRIVATE_TOKEN
            </div>
            <p className="text-xs text-muted-foreground font-semibold">
              Warning: Do not expose this key inside client-side (frontend) code. Request this endpoint only from backend server-side nodes (e.g. API routers, server actions, or secure clouds).
            </p>
          </div>

          {/* Section 2: Public API Feed */}
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-none border border-border bg-foreground text-background flex items-center justify-center text-[10px] font-bold">2</span>
              Public Portfolio Feed
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              If you wish to fetch your credentials directly from a frontend application (e.g. Next.js static props, React app, or Jekyll portfolio), enable the <span className="font-bold text-foreground">Public Feed</span> and configure a custom slug.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              This endpoint requires no authentication headers and queries only credentials flagged as <span className="font-bold text-foreground">public</span> in your vault. Secure for CORS-enabled direct queries.
            </p>
          </div>
        </div>

        {/* Section 3: Response Schema */}
        <div className="pt-6 border-t-2 border-border space-y-3">
          <h3 className="text-sm font-black uppercase text-foreground">Response Schema</h3>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Both endpoints return a structured JSON payload containing metadata and public document storage access endpoints:
          </p>
          <div className="bg-[#18181c] p-4 text-[#f5f5f7] rounded-none font-mono text-[10px] overflow-x-auto border border-border">
{`{
  "success": true,
  "owner": "Jane Doe",
  "certificates": [
    {
      "id": "clxyz123...",
      "title": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "issueDate": "2026-07-14T00:00:00.000Z",
      "expirationDate": "2029-07-14T00:00:00.000Z",
      "credentialId": "AWS-ASA-994",
      "credentialUrl": "https://aws.amazon.com/verify/...",
      "verified": true,
      "fileUrl": "/uploads/1720970000-cert.pdf",
      "isPublic": true
    }
  ]
}`}
          </div>
        </div>
      </div>

    </div>
  );
}
