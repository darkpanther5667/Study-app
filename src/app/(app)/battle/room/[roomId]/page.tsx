'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { pageAnim, xpPopAnim } from '@/lib/animations';
import { useGameStore } from '@/store/gameStore';

const mockQuestions = [
  { id: '1', room_id: '1', question: 'What is √144?', options: ['10', '11', '12', '14'], correctIndex: 2, order: 1 },
  { id: '2', room_id: '1', question: 'Which planet is Red?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctIndex: 1, order: 2 },
  { id: '3', room_id: '1', question: 'Symbol for Gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correctIndex: 2, order: 3 },
];

export default function BattleRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  const { currentQuestionIndex, questions, players, timeRemaining, isInBattle, startBattle, nextQuestion, updateScore, setTimeRemaining, endBattle } = useGameStore();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showXpPopup, setShowXpPopup] = useState(false);
  const [battleOver, setBattleOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => { startBattle(roomId, mockQuestions, [{ id: '1', name: 'You', score: 0 }, { id: '2', name: 'Amit', score: 0 }]); return () => endBattle(); }, [roomId]);

  useEffect(() => {
    if (!isInBattle || showResult || battleOver) return;
    const timer = setInterval(() => setTimeRemaining(timeRemaining - 1), 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, isInBattle, showResult, battleOver, setTimeRemaining]);

  useEffect(() => { if (timeRemaining === 0 && !showResult && !battleOver) { handleAnswer(-1); } }, [timeRemaining]);

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;
    const currentQ = questions[currentQuestionIndex];
    const correct = answerIndex === currentQ?.correctIndex;
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    if (correct) { updateScore('1', 10); setShowXpPopup(true); setTimeout(() => setShowXpPopup(false), 1000); }
    setTimeout(() => { if (currentQuestionIndex < questions.length - 1) { nextQuestion(); setSelectedAnswer(null); setShowResult(false); } else { setBattleOver(true); setWinner('You'); } }, 1500);
  };

  const currentQ = questions[currentQuestionIndex];

  if (battleOver) {
    return (
      <motion.div variants={pageAnim} initial="initial" animate="animate" className="min-h-screen bg-[var(--bg-dark)] flex items-center justify-center p-6">
        <div className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-6xl mb-4">🎉</motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">{winner === 'You' ? 'Victory!' : 'Defeat'}</h1>
          <Card variant="grasp" className="p-6 mb-6">
            <div className="flex items-center justify-around">
              <div className="text-center"><p className="text-2xl font-bold text-[var(--brand)]">{players[0]?.score || 0}</p><p className="text-white/60 text-sm">Your Score</p></div>
              <div className="text-white/40 text-2xl">VS</div>
              <div className="text-center"><p className="text-2xl font-bold text-[var(--accent-orange)]">{players[1]?.score || 0}</p><p className="text-white/60 text-sm">Amit's Score</p></div>
            </div>
          </Card>
          <div className="flex gap-4"><Button variant="primary" className="flex-1" onClick={() => window.location.reload()}>Rematch</Button><Button variant="secondary" className="flex-1" onClick={() => router.push('/battle/lobby')}>Exit</Button></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={pageAnim} initial="initial" animate="animate" className="min-h-screen bg-[var(--bg-app)]">
      <div className="bg-[var(--bg-dark)] px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-white"><p className="font-semibold">{players[0]?.name || 'You'}</p><p className="text-2xl font-bold text-[var(--brand)]">{players[0]?.score || 0}</p></div>
          <div className="text-center"><p className="text-white/40 text-xs">Question</p><p className="text-white font-bold text-xl">{currentQuestionIndex + 1}/{questions.length}</p></div>
          <div className="text-white text-right"><p className="font-semibold">{players[1]?.name || 'Amit'}</p><p className="text-2xl font-bold text-[var(--accent-orange)]">{players[1]?.score || 0}</p></div>
        </div>
        <div className="mt-4 h-2 bg-[var(--bg-dark-card)] rounded-full overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent-orange)] rounded-full" initial={{ width: '100%' }} animate={{ width: `${(timeRemaining / 10) * 100}%` }} /></div>
        <div className="flex items-center justify-center gap-2 mt-2"><Timer className="h-4 w-4 text-white/60" /><span className="text-white/60 text-sm">{timeRemaining}s</span></div>
      </div>
      <div className="p-6">
        {currentQ && (
          <motion.div key={currentQ.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <Card variant="grasp" className="p-6 mb-6"><p className="text-lg font-semibold text-[var(--text-1)] text-center">{currentQ.question}</p></Card>
            <div className="grid grid-cols-2 gap-4">{currentQ.options.map((opt, i) => { let bg = 'bg-[var(--bg-card)]', border = 'border-[var(--text-3)]/20'; if (showResult) { if (i === currentQ.correctIndex) { bg = 'bg-green-100'; border = 'border-green-500'; } else if (i === selectedAnswer) { bg = 'bg-red-100'; border = 'border-red-500'; } } return (<motion.button key={i} onClick={() => handleAnswer(i)} disabled={showResult} className={`p-4 rounded-[var(--radius-lg)] border-2 text-left font-medium transition-all ${bg} ${border} ${!showResult ? 'hover:border-[var(--brand)] hover:bg-[var(--brand-light)]/20' : ''}`} whileTap={{ scale: 0.98 }}><span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--bg-app)] text-[var(--text-2)] text-sm mr-2">{String.fromCharCode(65 + i)}</span>{opt}</motion.button>); })}</div>
          </motion.div>
        )}
        <AnimatePresence>{showXpPopup && <motion.div variants={xpPopAnim} initial="initial" animate="animate" className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--brand)] font-bold text-2xl">+10 XP</motion.div>}</AnimatePresence>
      </div>
      <div className="fixed top-4 right-4"><Button variant="ghost" size="sm" onClick={() => router.push('/battle/lobby')}><X className="h-4 w-4" /></Button></div>
    </motion.div>
  );
}