"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AuthControls() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [loading, setLoading] = useState(Boolean(supabase));
  const router = useRouter();

  useEffect(() => {
    if (!supabase) return;
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      setLoading(false);
    };
    void load();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  if (loading) {
    return <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-700/30" />;
  }

  if (!user) {
    return (
      <Button asChild size="sm" variant="secondary">
        <Link href="/auth/sign-in">Sign in</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="secondary">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
      <Button size="sm" variant="ghost" onClick={signOut}>
        Logout
      </Button>
    </div>
  );
}
