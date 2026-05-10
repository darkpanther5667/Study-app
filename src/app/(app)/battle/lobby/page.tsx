'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Users, Trophy, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { pageAnim } from '@/lib/animations';
import { generateRoomCode } from '@/lib/sm2';
import { generateQuiz, type QuizQuestion } from '@/lib/gemini';

const mockFriends = [{ id: '1', name: 'Amit', online: true }, { id: '2', name: 'Priya', online: true }, { id: '3', name: 'Raj', online: false }];
const mockRecent = [{ id: '1', opponent: 'Amit', result: 'W' as const, date: '2h ago', xp: 50 }, { id: '2', opponent: 'Priya', result: 'L' as const, date: '1d ago', xp: 0 }];

const subjects = ['Physics', 'Chemistry', 'Maths', 'Biology'];
const topics: Record<string, string[]> = {
  Physics: ['Mechanics', 'Electromagnetism', 'Optics', 'Thermodynamics'],
  Chemistry: ['Organic', 'Inorganic', 'Physical', 'Biomolecules'],
  Maths: ['Calculus', 'Algebra', 'Trigonometry', 'Coordinate Geometry'],
  Biology: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology'],
};

export default function BattleLobbyPage() {
  const [joinCode, setJoinCode] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateBattle = async () => {
    if (!selectedSubject || !selectedTopic) {
      setError('Please select a subject and topic');
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const code = generateRoomCode();
      const questions = await generateQuiz(selectedSubject, selectedTopic, 10);
      // TODO: Save to Firebase Firestore with questions
      // For now, store in sessionStorage as workaround
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`battle_${code}`, JSON.stringify(questions));
      }
      router.push(`/battle/room/${code}`);
    } catch (e) {
      setError('Failed to generate quiz. Check your Gemini API key.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <motion.div variants={pageAnim} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-[var(--bg-app)] pb-20">
      <div className="bg-[var(--bg-dark)] px-6 py-5">
        <h1 className="text-xl font-bold text-white">Battle Mode</h1>
        <p className="text-white/60 text-sm mt-1">Challenge your friends in real-time quizzes</p>
      </div>
      <div className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Button variant="primary" className="h-16 flex flex-col items-center justify-center gap-1" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-5 w-5" />
            <span className="text-sm font-semibold">Create Battle</span>
          </Button>
          <Button variant="secondary" className="h-16 flex flex-col items-center justify-center gap-1" onClick={() => document.getElementById('join-input')?.focus()}>
            <Users className="h-5 w-5" />
            <span className="text-sm font-semibold">Join Battle</span>
          </Button>
        </div>
        <Card variant="grasp" className="p-5">
          <h3 className="font-semibold text-[var(--text-1)] mb-3">Enter room code</h3>
          <div className="flex gap-2">
            <input
              id="join-input"
              type="text"
              maxLength={6}
              placeholder="ABC123"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="flex-1 px-4 py-3 rounded-lg border border-[var(--text-3)]/20 bg-transparent text-center text-xl font-bold tracking-widest text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:border-[var(--brand)]"
            />
            <Button variant="primary" onClick={() => joinCode.length === 6 && router.push(`/battle/room/${joinCode}`)} disabled={joinCode.length !== 6}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
        <Card variant="grasp" className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--text-1)]">Friends Online</h3>
            <Users className="h-4 w-4 text-[var(--text-3)]" />
          </div>
          <div className="space-y-3">
            {mockFriends.map((f) => (
              <div key={f.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[var(--brand-light)] flex items-center justify-center">
                      <span className="text-[var(--brand)] font-semibold">{f.name.charAt(0)}</span>
                    </div>
                    {f.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                  </div>
                  <span className="font-medium text-[var(--text-1)]">{f.name}</span>
                </div>
                {f.online && <Button variant="ghost" size="sm">Challenge</Button>}
              </div>
            ))}
          </div>
        </Card>
        <Card variant="grasp" className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--text-1)]">Recent Battles</h3>
            <Trophy className="h-4 w-4 text-[var(--text-3)]" />
          </div>
          <div className="space-y-3">
            {mockRecent.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${b.result === 'W' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{b.result}</div>
                  <div>
                    <p className="font-medium text-[var(--text-1)]">vs {b.opponent}</p>
                    <p className="text-xs text-[var(--text-3)]">{b.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${b.xp > 0 ? 'text-[var(--brand)]' : 'text-[var(--text-3)]'}`}>{b.xp > 0 ? `+${b.xp} XP` : '-'}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Create Battle Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[var(--bg-card)] rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[var(--text-1)] mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[var(--brand)]" />
              Create New Battle
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[var(--text-2)] mb-2 block">Select Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => { setSelectedSubject(e.target.value); setSelectedTopic(''); }}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--text-3)]/20 bg-[var(--bg-app)] text-[var(--text-1)] focus:outline-none focus:border-[var(--brand)]"
                >
                  <option value="">Choose a subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {selectedSubject && (
                <div>
                  <label className="text-sm text-[var(--text-2)] mb-2 block">Select Topic</label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--text-3)]/20 bg-[var(--bg-app)] text-[var(--text-1)] focus:outline-none focus:border-[var(--brand)]"
                  >
                    <option value="">Choose a topic</option>
                    {topics[selectedSubject]?.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              )}
              {error && <p className="text-sm text-[var(--accent-red)]">{error}</p>}
              <div className="flex gap-3 pt-2">
                <Button variant="ghost" className="flex-1" onClick={() => { setShowCreateModal(false); setError(null); }} disabled={creating}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleCreateBattle} disabled={creating || !selectedSubject || !selectedTopic}>
                  {creating ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Generating...</> : 'Create Battle'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}