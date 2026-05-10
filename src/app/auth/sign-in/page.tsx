'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<null | 'google' | 'email'>(null);
  const [message, setMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/home';

  useEffect(() => {
    // Check if already logged in
    if (auth?.currentUser) {
      window.location.href = redirect;
    }
  }, [redirect]);

  const signInWithGoogle = async () => {
    if (!auth) {
      setMessage('Firebase not configured. Add env vars.');
      return;
    }
    setLoading('google');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      window.location.href = redirect;
    } catch (error: unknown) {
      const err = error as { message?: string };
      setMessage(err.message || 'Google sign-in failed');
    }
    setLoading(null);
  };

  const signInWithEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setMessage('Firebase not configured. Add env vars.');
      return;
    }
    setLoading('email');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = redirect;
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === 'auth/invalid-credential') {
        setMessage('Invalid email or password');
      } else {
        setMessage(err.code || 'Sign-in failed');
      }
    }
    setLoading(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-app)] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-[var(--text-1)]">Sign in to Grasp</CardTitle>
          <CardDescription>Your AI study companion awaits.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="primary"
            className="w-full"
            onClick={signInWithGoogle}
            disabled={loading !== null}
          >
            {loading === 'google' && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Continue with Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--bg-card)] px-2 text-[var(--text-3)]">Or continue with email</span>
            </div>
          </div>
          <form onSubmit={signInWithEmail} className="space-y-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11 w-full rounded-xl border border-[var(--text-3)]/20 bg-[var(--bg-card)] px-3 text-sm text-[var(--text-1)] outline-none focus:border-[var(--brand)]"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="h-11 w-full rounded-xl border border-[var(--text-3)]/20 bg-[var(--bg-card)] px-3 text-sm text-[var(--text-1)] outline-none focus:border-[var(--brand)]"
            />
            <Button type="submit" variant="secondary" className="w-full" disabled={loading !== null}>
              {loading === 'email' && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Sign In
            </Button>
          </form>
          {message && <p className="text-xs text-[var(--accent-red)]">{message}</p>}
          <p className="text-xs text-[var(--text-3)] text-center">
            Don't have an account? <Link href="/auth/sign-up" className="text-[var(--brand)] hover:underline">Sign up</Link>
          </p>
          <p className="text-xs text-[var(--text-3)] text-center">
            <Link href="/" className="hover:underline">Back to home</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}