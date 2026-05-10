'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SUBJECT_COLORS, type Subject } from '@/types/grasp';

interface SubjectBarProps {
  subject: Subject;
  percentage: number;
  className?: string;
}

export function SubjectBar({ subject, percentage, className }: SubjectBarProps) {
  const color = SUBJECT_COLORS[subject] || SUBJECT_COLORS.Other;

  let statusColor = 'var(--accent-red)';
  if (percentage >= 75) statusColor = 'var(--accent-green)';
  else if (percentage >= 40) statusColor = 'var(--accent-orange)';

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="w-20 text-sm font-medium text-[var(--text-2)]">{subject}</span>
      <div className="flex-1 h-2 bg-[var(--bg-app)] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <span
        className="text-sm font-semibold w-12 text-right"
        style={{ color: statusColor }}
      >
        {percentage}%
      </span>
    </div>
  );
}