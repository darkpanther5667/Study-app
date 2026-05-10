'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, Swords, Layers, Clock, ChevronRight } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StreakBadge } from '@/components/ui/streak-badge';
import { SubjectBar } from '@/components/ui/subject-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { pageAnim, staggerContainer } from '@/lib/animations';
import { getGreeting } from '@/lib/sm2';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import type { Subject } from '@/types/grasp';

const featureCards = [
  { title: 'Doubt Snap', subtitle: 'Photo any question', icon: Camera, href: '/doubt-snap', color: 'var(--brand)' },
  { title: 'Battle Mode', subtitle: 'Challenge friends', icon: Swords, href: '/battle/lobby', color: 'var(--accent-orange)' },
  { title: 'Memory Vault', subtitle: 'Review flashcards', icon: Layers, href: '/vault', color: 'var(--accent-green)' },
  { title: 'Focus Room', subtitle: 'Start a session', icon: Clock, href: '/focus', color: 'var(--brand-dark)' },
];

const mockSubjectScores: { subject: Subject; percentage: number }[] = [
  { subject: 'Physics', percentage: 65 },
  { subject: 'Chemistry', percentage: 45 },
  { subject: 'Maths', percentage: 80 },
  { subject: 'Biology', percentage: 30 },
];

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [streak] = useState(5);
  const [level] = useState(8);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) { setLoading(false); return; }
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      setLoading(false);
    };
    void loadUser();
  }, []);

  const greeting = getGreeting();
  const firstName = user?.email?.split('@')[0] || 'Scholar';

  return (
    <motion.div variants={pageAnim} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-[var(--bg-app)] pb-20">
      <div className="bg-[var(--bg-dark)] px-6 pb-8 pt-6 rounded-b-[24px]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[var(--text-3)] text-sm">Good {greeting}</p>
            <h1 className="text-2xl font-bold text-white">{firstName}</h1>
          </div>
          <StreakBadge days={streak} />
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-[var(--brand)] text-white px-4 py-1.5 rounded-full text-sm font-medium">Level {level} Scholar</div>
          <div className="flex-1 h-2 bg-[var(--bg-dark-card)] rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-[var(--brand)] to-purple-400 rounded-full" initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 0.8 }} />
          </div>
          <span className="text-white/60 text-xs">650 / 1000 XP</span>
        </div>
      </div>

      <div className="px-6 -mt-4">
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 gap-4">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.href}>
                <Card variant="grasp" className="p-4 cursor-pointer">
                  <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${card.color}20` }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Icon className="h-5 w-5" style={{ color: card.color }} />
                  </motion.div>
                  <h3 className="font-semibold text-[var(--text-1)]">{card.title}</h3>
                  <p className="text-xs text-[var(--text-3)] mt-0.5">{card.subtitle}</p>
                </Card>
              </Link>
            );
          })}
        </motion.div>
      </div>

      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[var(--text-1)]">Your weak spots</h2>
          <Link href="/radar" className="text-sm text-[var(--brand)] flex items-center gap-1">See full report <ChevronRight className="h-4 w-4" /></Link>
        </div>
        <Card variant="grasp" className="p-5">
          {loading ? (
            <div className="space-y-3"><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-full" /></div>
          ) : (
            <div className="space-y-4">{mockSubjectScores.map((subject) => <SubjectBar key={subject.subject} subject={subject.subject} percentage={subject.percentage} />)}</div>
          )}
        </Card>
      </div>

      <div className="px-6 mt-8 mb-6">
        <h2 className="text-lg font-bold text-[var(--text-1)] mb-4">Quick Actions</h2>
        <div className="flex gap-3">
          <Button variant="primary" className="flex-1" asChild><Link href="/doubt-snap">Snap a Doubt</Link></Button>
          <Button variant="secondary" className="flex-1" asChild><Link href="/vault">Review Cards</Link></Button>
        </div>
      </div>
    </motion.div>
  );
}