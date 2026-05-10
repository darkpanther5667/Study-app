'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Camera, Swords, Layers, Target, ArrowRight, Sparkles } from 'lucide-react';

const features = [
  { icon: Camera, title: 'Doubt Snap', desc: 'Photograph any question. Get a step-by-step AI explanation in seconds.' },
  { icon: Swords, title: 'Battle Mode', desc: 'Challenge friends to live quiz battles. Win XP. Climb the leaderboard.' },
  { icon: Layers, title: 'Memory Vault', desc: 'Flashcards that know what you\'re forgetting. Powered by spaced repetition.' },
  { icon: Target, title: 'Weak Spot Radar', desc: 'See exactly which topics are costing you marks — before the exam does.' },
];

const stats = [
  { value: '2,400+', label: 'Students' },
  { value: '18,000+', label: 'Doubts Solved' },
  { value: '94%', label: 'Retention Rate' },
  { value: '4.9★', label: 'Rating' },
];

const steps = [
  { num: '1', title: 'Snap your doubt', desc: 'Take a photo of any question you\'re stuck on' },
  { num: '2', title: 'AI explains it', desc: 'Get instant, step-by-step explanations from our AI tutor' },
  { num: '3', title: 'Never forget it', desc: 'Turn it into a flashcard and master it with spaced repetition' },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0D0C1A] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md bg-[#0D0C1A]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl" style={{ fontFamily: 'var(--font-bricolage)' }}>
            <Zap className="h-6 w-6 text-[#7C5CFC]" />
            <span>Grasp</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/sign-in" className="text-sm text-gray-400 hover:text-white transition-colors">Login</Link>
            <Link href="/auth/sign-up" className="px-4 py-2 text-sm font-medium rounded-full border border-[#7C5CFC] text-white hover:bg-[#7C5CFC] transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 -left-32 w-96 h-96 bg-[#7C5CFC] rounded-full opacity-20 blur-[120px]"
          />
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#00E5A0] rounded-full opacity-15 blur-[120px]"
          />
        </div>

        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="initial" animate="animate" transition={{ delay: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 text-[#7C5CFC] text-sm mb-8">
              <Sparkles className="h-4 w-4" />
              Built for serious students
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.15 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-bricolage)' }}
          >
            Stop re-reading.<br />
            <span className="relative inline-block">
              Start remembering.
              <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M2 8 Q50 2 100 8 Q150 14 198 8" stroke="#00E5A0" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Grasp uses AI to turn your doubts into understanding, your notes into flashcards, and your friends into rivals.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/auth/sign-up"
              className="px-8 py-4 bg-[#7C5CFC] text-white font-semibold rounded-full hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              Get started free <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 text-gray-400 font-medium rounded-full border border-white/10 hover:border-white/20 transition-all"
            >
              See how it works ↓
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.6 }}
            className="mt-16 flex items-center justify-center gap-4"
          >
            <div className="flex -space-x-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C5CFC] to-[#00E5A0] border-2 border-[#0D0C1A]" />
              ))}
            </div>
            <span className="text-gray-400 text-sm">Join 2,400+ students already using Grasp</span>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-[#13121F]">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            style={{ fontFamily: 'var(--font-bricolage)' }}
          >
            Everything you need to actually learn
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-[#0D0C1A] border border-white/7 hover:border-[#7C5CFC]/40 hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#00E5A0]/20 flex items-center justify-center mb-4 group-hover:bg-[#00E5A0]/30 transition-colors">
                  <f.icon className="h-6 w-6 text-[#00E5A0]" />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-bricolage)' }}>{f.title}</h3>
                <p className="text-gray-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            style={{ fontFamily: 'var(--font-bricolage)' }}
          >
            Three steps. Real results.
          </h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 border-t border-dashed border-white/15" />

            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-[#7C5CFC] text-[#7C5CFC] flex items-center justify-center text-xl font-bold bg-[#0D0C1A]">
                  {s.num}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-bricolage)' }}>{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-[#13121F] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-bricolage)' }}>{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-[#7C5CFC] rounded-full opacity-10 blur-[120px]" />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-bricolage)' }}>
            Ready to actually understand what you study?
          </h2>
          <p className="text-gray-400 mb-8">Join free. No credit card. No lectures.</p>
          <Link
            href="/auth/sign-up"
            className="inline-block px-8 py-4 bg-[#7C5CFC] text-white font-semibold rounded-full hover:brightness-110 transition-all"
          >
            Start learning for free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#7C5CFC]" />
            <span className="font-semibold">Grasp</span>
            <span className="text-gray-500 text-sm ml-2">Study smarter, not longer</span>
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
          <div className="text-gray-500 text-sm">© 2025 Grasp. Made for students, by students.</div>
        </div>
      </footer>
    </div>
  );
}