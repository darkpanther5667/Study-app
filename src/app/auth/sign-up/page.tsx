'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<null | 'google' | 'email'>(null);
  const [message, setMessage] = useState<string | null>(null);

  const signUpWithGoogle = async () => {
    if (!auth) {
      setMessage('Firebase not configured. Add env vars.');
      return;
    }
    setLoading('google');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      window.location.href = '/home';
    } catch (error: unknown) {
      const err = error as { message?: string };
      setMessage(err.message || 'Google sign-up failed');
    }
    setLoading(null);
  };

  const signUpWithEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setMessage('Firebase not configured. Add env vars.');
      return;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }
    setLoading('email');
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      window.location.href = '/home';
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === 'auth/email-already-in-use') {
        setMessage('Email already registered');
      } else if (err.code === 'auth/invalid-email') {
        setMessage('Invalid email address');
      } else {
        setMessage(err.code || 'Sign-up failed');
      }
    }
    setLoading(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-app)] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-[var(--text-1)]">Create your account</CardTitle>
          <CardDescription>Start your learning journey with Grasp.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="primary"
            className="w-full"
            onClick={signUpWithGoogle}
            disabled={loading !== null}
          >
            {loading === 'google' && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Sign up with Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--bg-card)] px-2 text-[var(--text-3)]">Or continue with email</span>
            </div>
          </div>
          <form onSubmit={signUpWithEmail} className="space-y-2">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="h-11 w-full rounded-xl border border-[var(--text-3)]/20 bg-[var(--bg-card)] px-3 text-sm text-[var(--text-1)] outline-none focus:border-[var(--brand)]"
            />
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              className="h-11 w-full rounded-xl border border-[var(--text-3)]/20 bg-[var(--bg-card)] px-3 text-sm text-[var(--text-1)] outline-none focus:border-[var(--brand)]"
            />
            <Button type="submit" variant="secondary" className="w-full" disabled={loading !== null}>
              {loading === 'email' && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Create Account
            </Button>
          </form>
          {message && <p className="text-xs text-[var(--accent-red)]">{message}</p>}
          <p className="text-xs text-[var(--text-3)] text-center">
            Already have an account? <Link href="/auth/sign-in" className="text-[var(--brand)] hover:underline">Sign in</Link>
          </p>
          <p className="text-xs text-[var(--text-3)] text-center">
            <Link href="/" className="hover:underline">Back to home</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}