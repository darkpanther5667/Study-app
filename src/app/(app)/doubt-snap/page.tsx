'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Loader2, Sparkles, Save, MessageCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { pageAnim } from '@/lib/animations';
import { explainDoubt, type DoubtExplanation } from '@/lib/gemini';

type Step = 'capture' | 'preview' | 'result';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DoubtSnapPage() {
  const [step, setStep] = useState<Step>('capture');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<DoubtExplanation | null>(null);
  const [followUp, setFollowUp] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { setImageUrl(reader.result as string); setStep('preview'); setError(null); };
      reader.readAsDataURL(file);
    }
  };

  const handleExplain = async () => {
    if (!imageUrl) return;
    setLoading(true);
    setError(null);
    try {
      const base64 = imageUrl.split(',')[1];
      const mimeType = imageUrl.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
      const result = await explainDoubt(base64, mimeType);
      setExplanation(result);
      setStep('result');
    } catch (e) {
      setError('Could not explain this doubt. Please check your Gemini API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFlashcard = () => {
    // TODO: Save to Firebase Firestore
    alert('Flashcard saved! (Firestore coming soon)');
  };

  const handleRetry = () => {
    setError(null);
    setStep('capture');
    setImageUrl(null);
    setExplanation(null);
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
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-8">
                  <div className="w-12 h-12 rounded-full bg-[var(--brand-light)] flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[var(--brand)]" />
                  </div>
                  <p className="text-[var(--text-2)]">Analyzing your question...</p>
                  <p className="text-[var(--text-3)] text-sm">This may take a few seconds</p>
                </div>
              ) : (
                <Button variant="primary" className="w-full" onClick={handleExplain}><Sparkles className="h-4 w-4" />Get Explanation</Button>
              )}
              <Button variant="ghost" className="w-full" onClick={handleRetry}>Cancel</Button>
            </motion.div>
          )}
          {step === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              {explanation?.question && (
                <Card variant="grasp" className="p-5">
                  <Badge variant="purple" className="mb-3">Question</Badge>
                  <p className="font-semibold text-[var(--text-1)]">{explanation.question}</p>
                </Card>
              )}
              {explanation?.steps && (
                <Card variant="grasp" className="p-5">
                  <Badge variant="green" className="mb-3">Solution</Badge>
                  <ol className="space-y-2">
                    {explanation.steps.map((s, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--brand-light)] text-[var(--brand)] text-sm font-bold flex items-center justify-center">{i + 1}</span>
                        <span className="text-[var(--text-2)]">{s}</span>
                      </li>
                    ))}
                  </ol>
                </Card>
              )}
              {explanation?.keyConcept && (
                <Card variant="grasp" className="p-4 bg-[var(--brand-light)]/20">
                  <p className="text-sm font-medium text-[var(--brand)] mb-1">Key Concept</p>
                  <p className="text-[var(--text-2)]">{explanation.keyConcept}</p>
                </Card>
              )}
              {explanation?.tip && (
                <Card variant="grasp" className="p-4 bg-[var(--accent-orange)]/10">
                  <p className="text-sm font-medium text-[var(--accent-orange)] mb-1">Memory Tip</p>
                  <p className="text-[var(--text-2)]">{explanation.tip}</p>
                </Card>
              )}
              <div className="flex gap-3">
                <Button variant="success" className="flex-1" onClick={handleSaveFlashcard}><Save className="h-4 w-4" />Save as Flashcard</Button>
              </div>
              <Card variant="grasp" className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-4 w-4 text-[var(--text-3)]" />
                  <span className="text-sm font-medium text-[var(--text-1)]">Ask a follow-up</span>
                </div>
                <input
                  type="text"
                  placeholder="Type your follow-up..."
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--text-3)]/20 bg-transparent text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:border-[var(--brand)]"
                />
              </Card>
              <Button variant="ghost" className="w-full" onClick={handleRetry}>Snap Another</Button>
            </motion.div>
          )}
        </AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 rounded-lg bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-[var(--accent-red)] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-[var(--accent-red)]">{error}</p>
              <Button variant="ghost" size="sm" className="mt-2 text-[var(--brand)]" onClick={handleRetry}>Try again</Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}