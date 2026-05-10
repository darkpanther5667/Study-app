'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Music, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { pageAnim, scaleIn } from '@/lib/animations';

const SUBJECTS = ['Physics', 'Chemistry', 'Maths', 'Biology', 'History', 'English'];
const SOUNDS = [{ id: 'off', label: 'Off' }, { id: 'rain', label: 'Rain' }, { id: 'cafe', label: 'Cafe' }, { id: 'white', label: 'White Noise' }];

export default function FocusPage() {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalTime] = useState(25 * 60);
  const [selectedSubject, setSelectedSubject] = useState('Maths');
  const [ambientSound, setAmbientSound] = useState('off');
  const [showEndModal, setShowEndModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [sessions] = useState([{ subject: 'Physics', duration: 25, timestamp: '10:00 AM' }]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) interval = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    else if (timeLeft === 0 && isActive) { setIsActive(false); setShowEndModal(true); }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div variants={pageAnim} initial="initial" animate="animate" className="min-h-screen bg-[var(--bg-app)] pb-20">
      <div className="bg-[var(--bg-dark)] px-6 py-5"><h1 className="text-xl font-bold text-white">Focus Room</h1><p className="text-white/60 text-sm mt-1">Pomodoro study sessions</p></div>
      <div className="px-6 py-6">
        <div className="flex flex-wrap gap-2 mb-8">{SUBJECTS.map((s) => (<button key={s} onClick={() => setSelectedSubject(s)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSubject === s ? 'bg-[var(--brand)] text-white' : 'bg-[var(--bg-card)] text-[var(--text-2)] border border-[var(--text-3)]/20'}`}>{s}</button>))}</div>
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-64 h-64">
            <svg className="w-full h-full transform -rotate-90"><circle cx="128" cy="128" r="120" stroke="var(--bg-card)" strokeWidth="8" fill="none" /><motion.circle cx="128" cy="128" r="120" stroke="var(--brand)" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }} transition={{ duration: 0.5 }} /></svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-5xl font-bold text-[var(--text-1)]">{formatTime(timeLeft)}</span><span className="text-[var(--text-3)] text-sm mt-2">{isActive ? 'Focus time' : 'Ready to focus'}</span></div>
          </div>
        </div>
        <div className="flex justify-center gap-4 mb-8">
          <Button variant={isActive ? 'danger' : 'primary'} size="lg" className="w-32" onClick={() => setIsActive(!isActive)}>{isActive ? <><Pause className="h-5 w-5" />Pause</> : <><Play className="h-5 w-5" />Start</>}</Button>
          <Button variant="secondary" size="lg" onClick={() => { setIsActive(false); setTimeLeft(25 * 60); }}><RotateCcw className="h-5 w-5" /></Button>
        </div>
        <Card variant="grasp" className="p-4 mb-6">
          <div className="flex items-center gap-2 mb-3"><Music className="h-4 w-4 text-[var(--text-3)]" /><span className="font-medium text-[var(--text-1)]">Ambient Sound</span></div>
          <div className="flex gap-2">{SOUNDS.map((s) => (<button key={s.id} onClick={() => setAmbientSound(s.id)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${ambientSound === s.id ? 'bg-[var(--brand-light)] text-[var(--brand)]' : 'bg-[var(--bg-app)] text-[var(--text-2)]'}`}>{s.label}</button>))}</div>
        </Card>
        <Card variant="grasp" className="p-4">
          <h3 className="font-semibold text-[var(--text-1)] mb-4">Today's Sessions</h3>
          <div className="space-y-3">{sessions.map((s, i) => (<div key={i} className="flex items-center justify-between py-2 border-b border-[var(--text-3)]/10 last:border-0"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[var(--brand-light)] flex items-center justify-center"><CheckCircle className="h-4 w-4 text-[var(--brand)]" /></div><div><p className="font-medium text-[var(--text-1)]">{s.subject}</p><p className="text-xs text-[var(--text-3)]">{s.timestamp}</p></div></div><Badge variant="green">{s.duration} min</Badge></div>))}</div>
        </Card>
      </div>
      {showEndModal && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"><motion.div variants={scaleIn} initial="initial" animate="animate" className="bg-[var(--bg-card)] rounded-[var(--radius-xl)] p-6 w-full max-w-sm"><h2 className="text-xl font-bold text-[var(--text-1)] mb-2">Session Complete!</h2><p className="text-[var(--text-2)] mb-4">Great focus session in {selectedSubject}.</p><div className="mb-4"><label className="block text-sm font-medium text-[var(--text-1)] mb-2">What did you cover?</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes..." className="w-full px-3 py-2 rounded-lg border border-[var(--text-3)]/20 bg-[var(--bg-app)] text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:border-[var(--brand)] resize-none h-20" /></div><Button variant="primary" className="w-full" onClick={() => { setShowEndModal(false); setNotes(''); setTimeLeft(25 * 60); }}>Save Session</Button></motion.div></motion.div>)}
    </motion.div>
  );
}