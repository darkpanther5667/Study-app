'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Plus, ThumbsUp, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { pageAnim, staggerContainer } from '@/lib/animations';
import { SUBJECT_COLORS, type Subject } from '@/types/grasp';

const mockThreads = [
  { id: '1', title: 'Quadratic Equations Made Easy', content: 'The factoring method works best when...', subject: 'Maths' as Subject, author: 'Amit', upvotes: 45, comments: 12, createdAt: '2h ago' },
  { id: '2', title: "Newton's Laws Visualized", content: 'Think of it like pushing a cart...', subject: 'Physics' as Subject, author: 'Priya', upvotes: 67, comments: 8, createdAt: '5h ago' },
  { id: '3', title: 'Organic Chemistry Mechanisms', content: 'The key is electron movement...', subject: 'Chemistry' as Subject, author: 'Raj', upvotes: 34, comments: 15, createdAt: '1d ago' },
];
const TRENDING = ['Derivatives', 'Chemical Bonds', 'Cell Biology', 'Integration'];
const SUBJECTS = ['All', 'Physics', 'Chemistry', 'Maths', 'Biology'];

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('All');
  const [showModal, setShowModal] = useState(false);

  const filtered = mockThreads.filter(t => (t.title.toLowerCase().includes(search.toLowerCase()) || t.content.toLowerCase().includes(search.toLowerCase())) && (selected === 'All' || t.subject === selected));

  return (
    <motion.div variants={pageAnim} initial="initial" animate="animate" className="min-h-screen bg-[var(--bg-app)] pb-20">
      <div className="bg-[var(--bg-dark)] px-6 py-5"><h1 className="text-xl font-bold text-white">Explore</h1><p className="text-white/60 text-sm mt-1">Discover concepts from the community</p></div>
      <div className="px-6 py-4">
        <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-3)]" /><Input placeholder="Search topics..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" /></div>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">{SUBJECTS.map(s => (<button key={s} onClick={() => setSelected(s)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selected === s ? 'bg-[var(--brand)] text-white' : 'bg-[var(--bg-card)] text-[var(--text-2)]'}`}>{s}</button>))}</div>
        <div className="mb-6"><div className="flex items-center gap-2 mb-3"><TrendingUp className="h-4 w-4 text-[var(--accent-orange)]" /><span className="font-semibold text-[var(--text-1)]">Trending</span></div><div className="flex gap-2 flex-wrap">{TRENDING.map(t => (<button key={t} onClick={() => setSearch(t)} className="px-3 py-1.5 rounded-lg bg-[var(--brand-light)] text-[var(--brand)] text-sm font-medium">#{t}</button>))}</div></div>
        <Button variant="primary" className="w-full mb-6" onClick={() => setShowModal(true)}><Plus className="h-4 w-4" />Create Thread</Button>
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
          {filtered.map(thread => {
            const color = SUBJECT_COLORS[thread.subject] || 'var(--brand)';
            return (
              <Card key={thread.id} variant="grasp" className="p-5">
                <div className="flex items-start justify-between mb-3"><div><h3 className="font-semibold text-[var(--text-1)] mb-1">{thread.title}</h3><div className="flex items-center gap-2 text-xs text-[var(--text-3)]"><span>by {thread.author}</span><span>•</span><span>{thread.createdAt}</span></div></div><Badge variant={thread.subject === 'Physics' ? 'purple' : thread.subject === 'Chemistry' ? 'green' : 'orange'}>{thread.subject}</Badge></div>
                <p className="text-[var(--text-2)] text-sm mb-4 line-clamp-2">{thread.content}</p>
                <div className="flex items-center gap-4"><button className="flex items-center gap-1.5 text-[var(--text-3)]"><ThumbsUp className="h-4 w-4" /><span className="text-sm">{thread.upvotes}</span></button><button className="flex items-center gap-1.5 text-[var(--text-3)]"><MessageCircle className="h-4 w-4" /><span className="text-sm">{thread.comments}</span></button></div>
              </Card>
            );
          })}
        </motion.div>
        {filtered.length === 0 && <div className="text-center py-12"><p className="text-[var(--text-2)]">No threads found</p></div>}
      </div>
      {showModal && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[var(--bg-card)] rounded-[var(--radius-xl)] p-6 w-full max-w-md"><h2 className="text-xl font-bold text-[var(--text-1)] mb-4">Create Thread</h2><div className="space-y-4"><div><label className="block text-sm font-medium text-[var(--text-2)] mb-1">Title</label><Input placeholder="What concept?" /></div><div><label className="block text-sm font-medium text-[var(--text-2)] mb-1">Content</label><textarea placeholder="Explain..." className="w-full px-3 py-2 rounded-lg border border-[var(--text-3)]/20 bg-[var(--bg-app)] text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:border-[var(--brand)] resize-none h-32" /></div></div><div className="flex gap-3 mt-6"><Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" className="flex-1">Publish</Button></div></motion.div></motion.div>)}
    </motion.div>
  );
}