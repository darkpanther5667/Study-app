'use client';

import { BottomNav } from '@/components/ui/bottom-nav';
import { useUIStore } from '@/store/uiStore';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme } = useUIStore();

  // Hide BottomNav on auth pages
  const hideNav = pathname?.startsWith('/auth');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      {children}
      {!hideNav && <BottomNav />}
    </>
  );
}