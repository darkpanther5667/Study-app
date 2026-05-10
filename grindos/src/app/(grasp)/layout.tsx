'use client';

import { useEffect } from 'react';
import { BottomNav } from '@/components/ui/bottom-nav';
import { useUIStore } from '@/store/uiStore';

export default function GraspLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useUIStore();

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <main className="min-h-screen">
        {children}
      </main>
      <BottomNav />
    </>
  );
}