'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';

export function AuthControls() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    if (!auth) return;
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
    setUser(null);
    router.push('/');
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
        <Link href="/home">Home</Link>
      </Button>
      <Button size="sm" variant="ghost" onClick={signOut}>
        Logout
      </Button>
    </div>
  );
}