"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<null | "google" | "email">(null);
  const [message, setMessage] = useState<string | null>(null);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const signInWithGoogle = async () => {
    if (!supabase) {
      setMessage("Supabase env vars are missing. Add them to .env.local first.");
      return;
    }
    setLoading("google");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setMessage(error.message);
    setLoading(null);
  };

  const signInWithEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setMessage("Supabase env vars are missing. Add them to .env.local first.");
      return;
    }
    setLoading("email");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Magic link sent. Check your inbox to continue.");
      setEmail("");
    }
    setLoading(null);
  };

  return (
    <div className="grid-bg flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-white">Sign in to GrindOS</CardTitle>
          <CardDescription>Pick up your focus streak from where you left off.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" onClick={signInWithGoogle} disabled={loading !== null}>
            {loading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Continue with Google
          </Button>
          <form onSubmit={signInWithEmail} className="space-y-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11 w-full rounded-xl border border-slate-400/25 bg-slate-800/40 px-3 text-sm text-slate-100 outline-none focus:border-slate-300/40"
            />
            <Button type="submit" variant="secondary" className="w-full" disabled={loading !== null}>
              {loading === "email" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Continue with Email
            </Button>
          </form>
          {message ? <p className="text-xs text-slate-300">{message}</p> : null}
          <p className="text-xs text-slate-400">
            By continuing you agree to keep showing up daily.{" "}
            <Link href="/" className="text-slate-200 hover:underline">
              Back to home
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
