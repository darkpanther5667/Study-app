'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { pageAnim } from '@/lib/animations';
import { sm2 } from '@/lib/sm2';
import type { Flashcard } from '@/types/grasp';

const mockCards: Flashcard[] = [
  { id: '1', user_id: '1', subject: 'Physics', question: "Newton's First Law?", answer: 'A body remains at rest unless acted upon by external force.', ease_factor: 2.5, interval: 1, next_review_date: new Date().toISOString(), created_at: new Date().toISOString(), source: 'manual' },
  { id: '2', user_id: '1', subject: 'Chemistry', question: 'Atomic number of Carbon?', answer: '6', ease_factor: 2.5, interval: 1, next_review_date: new Date().toISOString(), created_at: new Date().toISOString(), source: 'manual' },
  { id: '3', user_id: '1', subject: 'Maths', question: 'Pythagorean theorem?', answer: 'a² + b² = c²', ease_factor: 2.5, interval: 1, next_review_date: new Date().toISOString(), created_at: new Date().toISOString(), source: 'doubt_snap' },
];

export default function VaultPage() {
  const [cards, setCards] = useState<Flashcard[]>(mockCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const currentCard = cards[currentIndex];
  const isComplete = currentIndex >= cards.length;

  const handleRate = (quality: number) => {
    if (!currentCard) return;
    const { newEF, newInterval, nextReviewDate } = sm2(currentCard.ease_factor, currentCard.interval, quality);
    const updated = [...cards];
    updated[currentIndex] = { ...currentCard, ease_factor: newEF, interval: newInterval, next_review_date: nextReviewDate.toISOString() };
    setCards(updated);
    setIsFlipping(true);
    setTimeout(() => { setCurrentIndex(currentIndex + 1); setShowAnswer(false); setIsFlipping(false); }, 300);
  };

  if (isComplete) return (
    <motion.div variants={pageAnim} initial="initial" animate="animate" className="min-h-screen bg-[var(--bg-app)] pb-20">
      <div className="bg-[var(--bg-dark)] px-6 py-5"><h1 className="text-xl font-bold text-white">Memory Vault</h1></div>
      <div className="flex flex-col items-center justify-center p-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-8xl mb-6">🎉</motion.div>
        <h2 className="text-2xl font-bold text-[var(--text-1)] mb-2">All caught up!</h2>
        <p className="text-[var(--text-2)] mb-6">Come back tomorrow.</p>
        <Button variant="primary" onClick={() => setCurrentIndex(0)}>Review Again</Button>
      </div>
    </motion.div>
  );

  return (
    <motion.div variants={pageAnim} initial="initial" animate="animate" className="min-h-screen bg-[var(--bg-app)] pb-20">
      <div className="bg-[var(--bg-dark)] px-6 py-5"><h1 className="text-xl font-bold text-white">Memory Vault</h1></div>
      <div className="px-6 py-4 grid grid-cols-3 gap-4">
        <Card variant="grasp" className="p-4 text-center"><Clock className="h-5 w-5 text-[var(--accent-orange)] mx-auto mb-2" /><p className="text-2xl font-bold text-[var(--text-1)]">{cards.length}</p><p className="text-xs text-[var(--text-3)]">Due Today</p></Card>
        <Card variant="grasp" className="p-4 text-center"><Zap className="h-5 w-5 text-[var(--accent-green)] mx-auto mb-2" /><p className="text-2xl font-bold text-[var(--text-1)]">23</p><p className="text-xs text-[var(--text-3)]">Mastered</p></Card>
        <Card variant="grasp" className="p-4 text-center"><Layers className="h-5 w-5 text-[var(--brand)] mx-auto mb-2" /><p className="text-2xl font-bold text-[var(--text-1)]">12</p><p className="text-xs text-[var(--text-3)]">Learning</p></Card>
      </div>
      <div className="px-6 mb-4"><div className="flex justify-between text-sm mb-2"><span className="text-[var(--text-2)]">Progress</span><span className="text-[var(--text-1)] font-medium">{currentIndex} / {cards.length}</span></div><div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden"><motion.div className="h-full bg-[var(--brand)] rounded-full" initial={{ width: 0 }} animate={{ width: `${(currentIndex / cards.length) * 100}%` }} /></div></div>
      <div className="px-6 py-4">
        <motion.div key={currentCard.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card variant="grasp" className="p-6 min-h-[300px] cursor-pointer" onClick={() => setShowAnswer(!showAnswer)}>
            <div className="flex justify-between items-center mb-4"><Badge variant={currentCard.subject === 'Physics' ? 'purple' : 'orange'}>{currentCard.subject}</Badge>{currentCard.source === 'doubt_snap' && <Badge variant="gray">From Doubt</Badge>}</div>
            <div className="flex-1 flex items-center justify-center min-h-[150px]"><p className="text-lg font-medium text-[var(--text-1)] text-center">{showAnswer ? currentCard.answer : currentCard.question}</p></div>
            <p className="text-center text-[var(--text-3)] text-sm mt-4">{showAnswer ? 'Tap to see question' : 'Tap to reveal answer'}</p>
          </Card>
        </motion.div>
        {showAnswer && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 mt-6"><Button variant="danger" className="flex-1" onClick={() => handleRate(1)}>Hard</Button><Button variant="secondary" className="flex-1" onClick={() => handleRate(3)}>Okay</Button><Button variant="success" className="flex-1" onClick={() => handleRate(5)}>Got it</Button></motion.div>)}
      </div>
    </motion.div>
  );
}