'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Compass, Swords, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/explore', icon: Compass, label: 'Explore' },
  { href: '/battle/lobby', icon: Swords, label: 'Battle' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[60px] bg-[var(--bg-card)] border-t border-[var(--text-3)]/10 flex items-center justify-around px-4 z-50">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'relative flex flex-col items-center justify-center w-16 h-full',
              'transition-colors duration-200',
              isActive ? 'text-[var(--brand)]' : 'text-[var(--text-3)]'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="nav-dot"
                className="absolute top-1.5 w-1.5 h-1.5 rounded-full bg-[var(--brand)]"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              <Icon
                className={cn('h-6 w-6', isActive && 'drop-shadow-[0_0_8px_var(--brand)]')}
              />
            </motion.div>
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}