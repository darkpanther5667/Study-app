'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Loader2, Sparkles, Save, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { pageAnim } from '@/lib/animations';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

type Step = 'capture' | 'preview' | 'result';

export default function DoubtSnapPage() {
  const [step, setStep] = useState<Step>('capture');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { setImageUrl(reader.result as string); setStep('preview'); };
      reader.readAsDataURL(file);
    }
  };

  const handleExplain = async () => {
    if (!imageUrl) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setStep('result');
  };

  const handleSaveFlashcard = async () => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('flashcards').insert({ user_id: user.id, subject: 'Maths', question: 'Sample', answer: 'Answer', ease_factor: 2.5, interval: 1, next_review_date: new Date().toISOString(), source: 'doubt_snap' });
    alert('Flashcard saved!');
  };

  return (
    <motion.div variants={pageAnim} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-[var(--bg-app)] pb-20">
      <div className="bg-[var(--bg-dark)] px-6 py-5">
        <h1 className="text-xl font-bold text-white">Doubt Snap</h1>
        <p className="text-white/60 text-sm mt-1">Photo any question, get instant help</p>
      </div>
      <div className="px-6 py-6">
        <AnimatePresence mode="wait">
          {step === 'capture' && (
            <motion.div key="capture" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div onClick={() => fileInputRef.current?.click()} className="aspect-[4/3] rounded-[var(--radius-xl)] border-2 border-dashed border-[var(--text-3)]/30 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--brand)] hover:bg-[var(--brand-light)]/20 transition-all">
                <Camera className="h-12 w-12 text-[var(--text-3)] mb-3" />
                <p className="text-[var(--text-2)] font-medium">Tap to capture or upload</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <div className="flex gap-3">
                <Button variant="primary" className="flex-1" onClick={() => fileInputRef.current?.click()}><Camera className="h-4 w-4" />Capture</Button>
                <Button variant="secondary" className="flex-1" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" />Upload</Button>
              </div>
            </motion.div>
          )}
          {step === 'preview' && (
            <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              {imageUrl && <div className="rounded-[var(--radius-xl)] overflow-hidden border border-[var(--text-3)]/20"><img src={imageUrl} alt="Captured" className="w-full aspect-[4/3] object-cover" /></div>}
              {loading ? <div className="flex items-center justify-center gap-2 py-4"><Loader2 className="h-5 w-5 animate-spin text-[var(--brand)]" /><span className="text-[var(--text-2)]">Analyzing...</span></div> : <Button variant="primary" className="w-full" onClick={handleExplain}><Sparkles className="h-4 w-4" />Get Explanation</Button>}
              <Button variant="ghost" className="w-full" onClick={() => { setStep('capture'); setImageUrl(null); }}>Cancel</Button>
            </motion.div>
          )}
          {step === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <Card variant="grasp" className="p-5"><Badge variant="purple" className="mb-3">Question</Badge><p className="font-semibold text-[var(--text-1)]">What is the derivative of x² + 2x + 1?</p></Card>
              <Card variant="grasp" className="p-5"><Badge variant="green" className="mb-3">Solution</Badge><ol className="space-y-2">{['Apply power rule', 'Derivative of x² is 2x', 'Derivative of 2x is 2', 'Constant is 0', 'Result: 2x + 2'].map((s, i) => <li key={i} className="flex gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--brand-light)] text-[var(--brand)] text-sm font-bold flex items-center justify-center">{i + 1}</span><span className="text-[var(--text-2)]">{s}</span></li>)}</ol></Card>
              <div className="flex gap-3"><Button variant="success" className="flex-1" onClick={handleSaveFlashcard}><Save className="h-4 w-4" />Save as Flashcard</Button></div>
              <Card variant="grasp" className="p-4"><div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-[var(--text-3)]" /><span className="text-sm font-medium text-[var(--text-1)]">Ask a follow-up</span></div><input type="text" placeholder="Type your follow-up..." value={followUp} onChange={(e) => setFollowUp(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[var(--text-3)]/20 bg-transparent text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:border-[var(--brand)]" /></Card>
              <Button variant="ghost" className="w-full" onClick={() => { setStep('capture'); setImageUrl(null); }}>Snap Another</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}