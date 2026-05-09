"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Brain,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Flame,
  Goal,
  Keyboard,
  LineChart,
  Menu,
  MoonStar,
  PlayCircle,
  Siren,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { AuthControls } from "@/components/auth/auth-controls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const coreCapabilities = [
    {
      title: "Study Tracking",
      description: "Capture every deep-work block and stop relying on memory.",
      icon: Activity,
    },
    {
      title: "Focus Timer",
      description: "Timed sessions built for long prep cycles and low-energy days.",
      icon: Clock3,
    },
    {
      title: "Backlog Analytics",
      description: "See unfinished topics before backlog pressure gets heavy.",
      icon: Siren,
    },
    {
      title: "Smart Insights",
      description: "Understand patterns behind your best and worst study days.",
      icon: Sparkles,
    },
    {
      title: "Streak Engine",
      description: "Reward consistency so discipline compounds over motivation.",
      icon: Flame,
    },
    {
      title: "Goal System",
      description: "Set daily targets and keep execution visible and honest.",
      icon: Goal,
    },
  ];

  return (
    <div className="grid-bg min-h-screen overflow-x-hidden">
      <main className="mx-auto w-full max-w-7xl px-3 pb-20 pt-4 sm:px-6 sm:pb-24 sm:pt-8 lg:px-8">
        <header className="sticky top-3 z-50 mb-4 rounded-2xl border border-white/10 bg-slate-950/75 px-3 py-2 backdrop-blur md:px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm font-semibold tracking-wide text-white sm:text-base">
              GrindOS
            </Link>
            <nav className="hidden items-center gap-5 text-sm text-slate-300 md:flex">
              <a href="#features" className="hover:text-white">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-white">
                How it works
              </a>
              <a href="#testimonials" className="hover:text-white">
                Stories
              </a>
            </nav>
            <div className="hidden md:block">
              <AuthControls />
            </div>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-100 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
          {menuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 space-y-2 rounded-xl border border-white/15 bg-slate-900/80 p-2 text-sm md:hidden"
            >
              {[
                ["#features", "Features"],
                ["#how-it-works", "How it works"],
                ["#testimonials", "Stories"],
              ].map(([href, label]) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-white/10"
                >
                  {label}
                </a>
              ))}
              <Button asChild className="w-full" size="sm">
                <Link href="/auth/sign-in">Continue</Link>
              </Button>
            </motion.div>
          ) : null}
        </header>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 px-4 py-7 sm:px-7 sm:py-10 lg:px-10 lg:py-14">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-slate-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-slate-500/10 blur-3xl" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
            <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-3xl">
              <Badge className="mb-5 w-fit" variant="muted">
                A performance system for serious aspirants
              </Badge>
              <h1 className="text-glow text-[clamp(1.85rem,8vw,4rem)] font-semibold leading-[1.04] tracking-tight text-white">
                Consistency is harder than studying.
              </h1>
              <p className="mt-4 max-w-2xl text-[clamp(0.96rem,3.7vw,1.1rem)] leading-relaxed text-slate-200">
                Backlogs grow quietly. Burnout builds slowly. Distraction wins by default. GrindOS is built
                for students trying to stay locked in when motivation drops and exam pressure rises.
              </p>
              <div className="mt-7 flex flex-col gap-2.5 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center">
                <Button asChild size="lg" className="w-full min-[420px]:w-auto">
                  <Link href="/dashboard">
                    Start Focus Session <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" className="w-full min-[420px]:w-auto">
                  Explore Dashboard
                </Button>
              </div>
              <p className="mt-4 text-sm text-slate-300">
                Momentum matters more than motivation. One deep session at a time.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2.5 min-[520px]:gap-3 sm:grid-cols-4">
                {[
                  { label: "Persistent logs", value: "Synced" },
                  { label: "Session history", value: "Tracked" },
                  { label: "Streak engine", value: "Live" },
                  { label: "Analytics", value: "Real-time" },
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22 + idx * 0.05 }}
                    className="rounded-xl border border-white/15 bg-white/5 px-2.5 py-2.5 min-[420px]:px-3"
                  >
                    <p className="text-sm font-semibold text-white min-[420px]:text-base">{item.value}</p>
                    <p className="text-[0.68rem] leading-tight text-slate-300">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative mx-auto w-full max-w-xl lg:max-w-none"
            >
              <Card className="gradient-border relative overflow-hidden rounded-3xl p-3 min-[420px]:p-4 sm:p-5">
                <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-slate-300/10 blur-2xl" />
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Active Session</p>
                    <p className="text-xs text-slate-300">Chemistry - Organic revision sprint</p>
                  </div>
                  <Badge variant="success" className="gap-1">
                    <PlayCircle className="h-3 w-3" /> Live
                  </Badge>
                </div>
                <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 sm:gap-3">
                  <div className="rounded-2xl border border-white/15 bg-white/5 p-2.5 min-[420px]:p-3">
                    <p className="text-xs text-slate-300">Focus timer</p>
                    <p className="mt-1 text-2xl font-semibold text-white">42:18</p>
                    <p className="mt-1 text-[11px] text-slate-300">Break in 07:42</p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/5 p-2.5 min-[420px]:p-3">
                    <p className="text-xs text-slate-300">Streak momentum</p>
                    <p className="mt-1 flex items-center gap-1 text-2xl font-semibold text-white">
                      <Flame className="h-4 w-4 text-slate-300" /> 23
                    </p>
                    <p className="mt-1 text-[11px] text-slate-300">Days locked in</p>
                  </div>
                </div>
                <div className="mt-3 rounded-2xl border border-white/15 bg-white/5 p-2.5 min-[420px]:p-3">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-slate-300">Weekly consistency</span>
                    <span className="text-slate-200">86%</span>
                  </div>
                  <Progress value={86} />
                  <div className="mt-3 grid grid-cols-7 gap-1">
                    {[2, 1, 0, 3, 2, 4, 3].map((val, i) => (
                      <div
                        key={i}
                        className={`h-6 rounded-md min-[420px]:h-7 ${
                          ["bg-slate-800/80", "bg-slate-700/70", "bg-slate-600/70", "bg-slate-500/70", "bg-slate-400/80"][val]
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-1.5 min-[420px]:gap-2">
                  {[
                    { label: "Streak", value: "23 Days", icon: Trophy },
                    { label: "Focused", value: "1,640 min", icon: Clock3 },
                    { label: "Score", value: "87%", icon: LineChart },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-white/15 bg-white/5 p-2 transition hover:-translate-y-0.5 min-[420px]:p-2.5"
                    >
                      <item.icon className="h-4 w-4 text-slate-300" />
                      <p className="mt-1 text-[11px] text-slate-300">{item.label}</p>
                      <p className="text-xs font-semibold text-white min-[420px]:text-sm">{item.value}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-3 -top-4 hidden rounded-xl border border-white/15 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 backdrop-blur sm:block"
              >
                <span className="text-slate-300">Shift + T</span> to start timer
              </motion.div>
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 6.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-3 hidden rounded-xl border border-white/15 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 backdrop-blur sm:block"
              >
                +12% focus this week
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="mt-14 sm:mt-16">
          <Card>
            <CardContent className="grid gap-4 p-4 min-[420px]:p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
              {[
                {
                  icon: Brain,
                  title: "Why GrindOS exists",
                  body: "Most students know what to study. The real problem is staying consistent under pressure.",
                },
                {
                  icon: MoonStar,
                  title: "What it changes",
                  body: "Turns late-night anxiety into structured sessions, measurable streaks, and calmer execution.",
                },
                {
                  icon: Activity,
                  title: "How it feels daily",
                  body: "Less chaos. Fewer guilt loops. More focused blocks that compound into rank momentum.",
                },
                {
                  icon: ShieldCheck,
                  title: "How it is different",
                  body: "Not coaching. Not content. A performance OS for long exam journeys.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-white/15 bg-white/5 p-4">
                  <item.icon className="h-5 w-5 text-slate-300" />
                  <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">{item.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section id="features" className="mt-14 sm:mt-16">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">How GrindOS keeps you consistent</h2>
            <Badge variant="muted" className="hidden sm:inline-flex">
              Product, not motivation quotes
            </Badge>
          </div>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coreCapabilities.map((feature) => (
              <Card key={feature.title} className="transition hover:-translate-y-1 hover:border-slate-300/30">
                <CardHeader>
                  <feature.icon className="h-6 w-6 text-slate-300" />
                  <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mt-14 sm:mt-16">
          <h3 className="text-2xl font-semibold text-white sm:text-3xl">From chaotic prep to calm momentum</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {[
              {
                title: "Before GrindOS",
                body: "Backlog stress, random schedules, frequent burnout, and the constant guilt of falling behind.",
              },
              {
                title: "Inside GrindOS",
                body: "Track sessions, detect weak patterns, and convert intention into measurable daily execution.",
              },
              {
                title: "After 4-8 weeks",
                body: "Cleaner routine, stronger focus stamina, visible streak momentum, and calmer exam preparation.",
              },
            ].map((step, idx) => (
              <Card key={step.title}>
                <CardHeader>
                  <Badge className="w-fit" variant={idx === 0 ? "muted" : "success"}>
                    Phase {idx + 1}
                  </Badge>
                  <CardTitle className="text-white">{step.title}</CardTitle>
                  <CardDescription>{step.body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-14 sm:mt-16">
          <Card>
            <CardContent className="grid gap-4 p-4 min-[420px]:p-5 md:grid-cols-2 md:gap-6 md:p-6">
              <div>
                <h3 className="text-2xl font-semibold text-white">What serious aspirants see every day</h3>
                <p className="mt-3 text-slate-300">
                  GrindOS is product-first by design: active sessions, real progress, and honest analytics that
                  show where your prep is slipping before it becomes panic.
                </p>
                <div className="mt-5 space-y-2">
                  {[
                    "Live focus cycles with break rhythm",
                    "Backlog pressure and recovery signals",
                    "Daily targets, streak continuity, and accountability",
                  ].map((line) => (
                    <div key={line} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-slate-200">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 text-sm text-slate-200">
                {[
                  ["Today", "4 sessions completed", "text-slate-100"],
                  ["Focus retention", "84% this week", "text-slate-100"],
                  ["Backlog trend", "Down 18% in 21 days", "text-slate-100"],
                  ["Burnout risk", "Low: recovery on track", "text-slate-100"],
                ].map(([title, value, color]) => (
                  <div key={title} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
                    <p className="text-xs text-slate-300">{title}</p>
                  <p className={`mt-1 text-sm font-medium ${color}`}>{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="testimonials" className="mt-14 sm:mt-16">
          <div className="mb-6 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-3 sm:p-5">
            {[
              { stat: "Stored", label: "session logs" },
              { stat: "Computed", label: "weekly analytics" },
              { stat: "Updated", label: "daily streaks" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-slate-900/45 p-3 text-center">
                <p className="text-2xl font-semibold text-white">{item.stat}</p>
                <p className="text-xs text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>
          <h3 className="text-2xl font-semibold text-white sm:text-3xl">Built for daily execution</h3>
          <div className="mt-5 grid gap-3 sm:gap-4 md:grid-cols-3">
            {[
              "Session logs sync to your account in real-time.",
              "Streaks update from real completed sessions.",
              "Dashboard analytics are generated from stored data.",
            ].map((item) => (
              <Card key={item}>
                <CardContent className="p-6">
                  <p className="text-sm leading-6 text-slate-200">{item}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-slate-400/20 bg-gradient-to-r from-slate-800/60 via-slate-800/40 to-slate-700/45 p-4 text-center min-[420px]:p-6 sm:mt-16 sm:p-8">
          <p className="text-xl font-medium text-white sm:text-3xl">Stay locked in. Your rank is built daily.</p>
          <p className="mt-2 text-sm text-slate-200">
            Not hype. Not random motivation. Just calm, repeatable performance when it matters most.
          </p>
          <div className="mx-auto mt-4 max-w-md rounded-xl border border-white/15 bg-white/5 p-3 text-left">
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-300">
              <CalendarClock className="h-3.5 w-3.5 text-slate-300" />
              Loading tomorrow&apos;s deep-work blocks...
            </div>
            <Skeleton className="mb-2 h-2 w-full" />
            <Skeleton className="mb-2 h-2 w-11/12" />
            <Skeleton className="h-2 w-9/12" />
          </div>
          <div className="mt-6 flex flex-col justify-center gap-2.5 min-[420px]:flex-row">
            <Button asChild size="lg" className="w-full min-[420px]:w-auto">
              <Link href="/dashboard">
                Start Focus Session <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" className="w-full min-[420px]:w-auto">
              <Keyboard className="h-4 w-4" />
              Explore Dashboard
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-slate-300" /> Built for deep work
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-slate-300" /> Designed for long exam cycles
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
