"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      router.push("/login?registered=true");
    } else {
      let errorMessage = "Registration failed";
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        errorMessage = data.message || data.error || errorMessage;
      } else {
        const text = await res.text();
        errorMessage = text || errorMessage;
      }
      setError(errorMessage);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      
      <div className="absolute top-8 left-8 z-10">
        <Link href="/" className="font-extrabold text-xl tracking-tighter flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            C
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            CertVault
          </span>
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto px-4 z-10 animate-fade-in-up">
        <Card className="premium-card glass border-white/40 dark:border-white/10 p-2 shadow-2xl shadow-primary/5">
          <CardHeader className="space-y-2 text-center pb-8 pt-6">
            <CardTitle className="text-3xl font-extrabold tracking-tight">Create an account</CardTitle>
            <CardDescription className="text-base text-muted-foreground font-medium">Start organizing your professional credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-5">
              {error && (
                <div className="p-3 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-center font-medium">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name" className="font-semibold text-foreground/80">Full Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  className="h-12 bg-white/50 dark:bg-gray-900/50 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold text-foreground/80">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className="h-12 bg-white/50 dark:bg-gray-900/50 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-semibold text-foreground/80">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="h-12 bg-white/50 dark:bg-gray-900/50 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary transition-all"
                />
              </div>
              <Button type="submit" className="w-full h-12 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all mt-4" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</> : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-border/40 pt-6 pb-4">
            <p className="text-sm text-muted-foreground">
              Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
