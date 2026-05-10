'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Moon, Bell, LogOut, Trophy, Layers, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { pageAnim } from '@/lib/animations';
import { useUIStore } from '@/store/uiStore';
import { useAuth } from '@/context/AuthContext';

const achievements = [
  { id: '1', title: 'First Blood', icon: '⚔️', unlocked: true },
  { id: '2', title: 'Week Warrior', icon: '🔥', unlocked: true },
  { id: '3', title: 'Card Master', icon: '🧠', unlocked: true },
  { id: '4', title: 'Quiz Pro', icon: '🏆', unlocked: false },
  { id: '5', title: 'Focus Expert', icon: '⏰', unlocked: false },
];

const stats = { totalXp: 2450, battlesWon: 23, flashcardsMastered: 45, studyHours: 67 };

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useUIStore();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const initials = user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U';
  const name = user?.displayName || user?.email?.split('@')[0] || 'Student';

  return (
    <motion.div variants={pageAnim} initial="initial" animate="animate" className="min-h-screen bg-[var(--bg-app)] pb-20">
      <div className="bg-[var(--bg-dark)] px-6 py-5"><h1 className="text-xl font-bold text-white">Profile</h1></div>
      <div className="px-6 py-6 space-y-6">
        <Card variant="grasp" className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[var(--brand)] flex items-center justify-center text-white text-2xl font-bold">{initials}</div>
            <div><h2 className="text-xl font-bold text-[var(--text-1)]">{name}</h2><p className="text-[var(--text-3)] text-sm">{user?.email || 'student@example.com'}</p></div>
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <Card variant="grasp" className="p-4 text-center"><Star className="h-5 w-5 text-[var(--accent-orange)] mx-auto mb-2" /><p className="text-2xl font-bold text-[var(--text-1)]">{stats.totalXp}</p><p className="text-xs text-[var(--text-3)]">Total XP</p></Card>
          <Card variant="grasp" className="p-4 text-center"><Trophy className="h-5 w-5 text-[var(--brand)] mx-auto mb-2" /><p className="text-2xl font-bold text-[var(--text-1)]">{stats.battlesWon}</p><p className="text-xs text-[var(--text-3)]">Battles Won</p></Card>
          <Card variant="grasp" className="p-4 text-center"><Layers className="h-5 w-5 text-[var(--accent-green)] mx-auto mb-2" /><p className="text-2xl font-bold text-[var(--text-1)]">{stats.flashcardsMastered}</p><p className="text-xs text-[var(--text-3)]">Cards Mastered</p></Card>
          <Card variant="grasp" className="p-4 text-center"><Clock className="h-5 w-5 text-[var(--accent-orange)] mx-auto mb-2" /><p className="text-2xl font-bold text-[var(--text-1)]">{stats.studyHours}h</p><p className="text-xs text-[var(--text-3)]">Study Hours</p></Card>
        </div>
        <Card variant="grasp" className="p-5">
          <h3 className="font-semibold text-[var(--text-1)] mb-4">Achievements</h3>
          <div className="grid grid-cols-3 gap-3">{achievements.map(a => (<div key={a.id} className={`p-3 rounded-lg text-center ${a.unlocked ? 'bg-[var(--brand-light)]' : 'bg-[var(--bg-app)] opacity-50'}`}><div className="text-2xl mb-1">{a.icon}</div><p className="text-xs font-medium text-[var(--text-1)]">{a.title}</p></div>))}</div>
        </Card>
        <Card variant="grasp" className="p-5">
          <h3 className="font-semibold text-[var(--text-1)] mb-4">Settings</h3>
          <div className="space-y-3">
            <button onClick={toggleTheme} className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-[var(--bg-app)] transition-colors">
              <div className="flex items-center gap-3"><Moon className="h-5 w-5 text-[var(--text-2)]" /><span className="text-[var(--text-1)]">Dark Mode</span></div>
              <div className={`w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-[var(--brand)]' : 'bg-[var(--text-3)]/30'}`}><div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`} /></div>
            </button>
            <button className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-[var(--bg-app)] transition-colors">
              <div className="flex items-center gap-3"><Bell className="h-5 w-5 text-[var(--text-2)]" /><span className="text-[var(--text-1)]">Notifications</span></div><Badge variant="green">On</Badge>
            </button>
          </div>
        </Card>
        <Card variant="grasp" className="p-5 border border-red-200"><Button variant="danger" className="w-full" onClick={handleLogout}><LogOut className="h-4 w-4" />Logout</Button></Card>
      </div>
    </motion.div>
  );
}