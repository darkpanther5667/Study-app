'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakBadgeProps {
  days: number;
  className?: string;
}

export function StreakBadge({ days, className }: StreakBadgeProps) {
  const isGlowing = days > 7;

  return (
    <motion.div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium',
        isGlowing
          ? 'bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] shadow-[0_0_20px_rgba(245,158,11,0.3)]'
          : 'bg-[var(--bg-card)] text-[var(--text-2)]',
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Flame
        className={cn('h-4 w-4', isGlowing && 'animate-pulse')}
        style={{ color: isGlowing ? 'var(--accent-orange)' : 'var(--text-3)' }}
      />
      <span>{days} day streak</span>
    </motion.div>
  );
}