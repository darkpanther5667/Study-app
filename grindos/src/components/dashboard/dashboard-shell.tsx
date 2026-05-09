"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  Flame,
  Goal,
  Hourglass,
  Medal,
  Menu,
  PlayCircle,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DashboardData } from "@/lib/types";

const heatColor = ["bg-slate-800/80", "bg-slate-700/70", "bg-slate-600/75", "bg-slate-500/75", "bg-slate-400/80"];
const WeeklyFocusChart = dynamic(
  () => import("./weekly-focus-chart").then((mod) => mod.WeeklyFocusChart),
  {
    ssr: false,
    loading: () => <div className="h-full animate-pulse rounded-xl bg-slate-700/30" />,
  },
);

const sidebarItems = [
  { label: "Overview", active: true },
  { label: "Planner", active: false },
  { label: "Sessions", active: false },
  { label: "Streaks", active: false },
];

export function DashboardShell({ data }: { data: DashboardData }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subject, setSubject] = useState("Physics");
  const [duration, setDuration] = useState(50);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSessionComplete = async () => {
    setSaving(true);
    setSaveMessage(null);
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, duration, sessionType: "focus" }),
    });
    if (!res.ok) {
      setSaveMessage("Could not save the session. Try again.");
      setSaving(false);
      return;
    }
    setSaveMessage("Session saved. Momentum updated.");
    setSaving(false);
    router.refresh();
  };

  return (
    <div className="grid-bg min-h-screen">
      <div className="mx-auto grid w-full max-w-[1680px] gap-4 px-3 py-4 sm:gap-6 sm:px-4 sm:py-6 lg:grid-cols-[240px_1fr]">
        <div className="glass sticky top-3 z-30 flex items-center justify-between rounded-2xl p-2.5 lg:hidden">
          <div>
            <h1 className="px-1 text-base font-semibold text-white">GrindOS</h1>
            <p className="px-1 text-[11px] text-slate-300">Discipline {" > "} motivation</p>
          </div>
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-100"
            aria-label="Toggle dashboard menu"
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {sidebarOpen ? (
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close dashboard menu overlay"
            className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden"
          />
        ) : null}

        <aside
          className={`glass fixed inset-y-4 left-3 z-40 w-[min(82vw,300px)] rounded-2xl p-4 transition-transform duration-300 lg:static lg:w-auto lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-[110%]"
          }`}
        >
          <h1 className="px-2 text-lg font-semibold text-white">GrindOS</h1>
          <p className="px-2 text-xs text-slate-300">Discipline {" > "} motivation</p>
          <nav className="mt-5 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setSidebarOpen(false)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
                  item.active ? "bg-slate-600/40 text-white" : "text-slate-300 hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-8 rounded-xl border border-white/15 bg-white/5 p-3 text-xs text-slate-200">
            Quick key: <span className="font-medium text-slate-300">Shift + T</span> starts focus timer.
          </div>
        </aside>

        <section className="space-y-4 sm:space-y-5">
          <div className="grid gap-3 min-[560px]:grid-cols-2 sm:gap-4 2xl:grid-cols-4">
            {[
              { label: "Total Focus", value: `${Math.round(data.totalMinutes / 60)} hrs`, icon: PlayCircle },
              { label: "Current Streak", value: `${data.currentStreak} days`, icon: Flame },
              { label: "Focus Score", value: `${data.focusScore}%`, icon: Zap },
              { label: "Rank Momentum", value: `+${data.rankMomentum}`, icon: Medal },
            ].map((item) => (
              <Card key={item.label}>
                <CardContent className="flex items-center justify-between p-4 min-[420px]:p-5">
                  <div>
                    <p className="text-xs text-slate-300">{item.label}</p>
                    <p className="mt-1 text-xl font-semibold text-white min-[420px]:text-2xl">{item.value}</p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-2">
                    <item.icon className="h-5 w-5 text-slate-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-3 sm:gap-4 xl:grid-cols-[1.6fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="text-white">Weekly Analytics</CardTitle>
                <CardDescription>Real minutes of focused deep work this week.</CardDescription>
              </CardHeader>
              <CardContent className="h-[230px] min-[420px]:h-[260px] lg:h-[280px]">
                <WeeklyFocusChart data={data.weeklyTrend} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-white">Upcoming Goals</CardTitle>
                <CardDescription>Your saved goals from Supabase.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.goals.length > 0 ? (
                  data.goals.map((goalItem) => (
                    <div key={goalItem.title} className="rounded-xl border border-white/15 bg-white/5 p-3">
                      <p className="text-sm font-medium text-white">{goalItem.title}</p>
                      <div className="mt-1 flex flex-wrap items-center justify-between gap-1.5 text-xs text-slate-300">
                        <span>{new Date(goalItem.created_at).toLocaleString()}</span>
                        <Badge variant="muted">{goalItem.completed ? "Completed" : "Active"}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-white/25 p-6 text-center text-sm text-slate-300">
                    No goals yet. Start with one high-impact task for tonight.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-3 sm:gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle className="text-white">Subject Progress</CardTitle>
                <CardDescription>Derived from your completed sessions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.subjectProgress.length > 0 ? (
                  data.subjectProgress.map((subject) => (
                    <div key={subject.subject}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-white">{subject.subject}</span>
                        <span className="text-slate-300">
                          {subject.chaptersDone}/{subject.total} blocks
                        </span>
                      </div>
                      <Progress value={subject.progress} />
                    </div>
                  ))
                ) : (
                  <div>
                    <p className="rounded-xl border border-dashed border-white/25 p-4 text-sm text-slate-300">
                      No sessions yet. Complete your first focus session to unlock progress analytics.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-white">Recent Sessions</CardTitle>
                <CardDescription>Latest synced sessions from your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.recentSessions.length > 0 ? (
                  data.recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between gap-2 rounded-xl bg-white/5 p-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs text-slate-200">
                          {session.subject.slice(0, 1)}
                        </span>
                        <span className="truncate text-sm text-white">{session.subject}</span>
                      </div>
                      <span className="shrink-0 text-xs text-slate-300">{session.duration} min</span>
                    </div>
                  ))
                ) : (
                    <div className="flex min-w-0 items-center gap-2">
                    <p className="rounded-xl border border-dashed border-white/25 p-4 text-sm text-slate-300">
                      No recent sessions. Add one below to start your history.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1.4fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="text-white">Productivity Heatmap</CardTitle>
                <CardDescription>Intensity of output over the last four weeks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.heatmap.map((week, i) => (
                  <div key={`w-${i}`} className="grid grid-cols-7 gap-1.5 min-[420px]:gap-2">
                    {week.map((value, j) => (
                      <div key={`${i}-${j}`} className={`h-6 rounded-md min-[420px]:h-8 ${heatColor[value]}`} />
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-white">Focus Timer</CardTitle>
                <CardDescription>Save completed sessions and update streaks automatically.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border border-slate-300/20 bg-slate-700/25 p-4 text-center min-[420px]:p-5">
                  <Hourglass className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-3 text-3xl font-semibold text-white min-[420px]:text-4xl">{duration}:00</p>
                  <p className="text-xs text-slate-300">Lock your completed focus block to sync progress.</p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="h-10 rounded-xl border border-slate-400/25 bg-slate-800/40 px-2 text-sm text-slate-100"
                  >
                    {["Physics", "Chemistry", "Mathematics", "Biology", "General Studies"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="h-10 rounded-xl border border-slate-400/25 bg-slate-800/40 px-2 text-sm text-slate-100"
                  >
                    {[25, 40, 50, 60, 90].map((m) => (
                      <option key={m} value={m}>
                        {m} min
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  className="mt-4 w-full"
                  onClick={handleSessionComplete}
                  disabled={saving}
                >
                  <Goal className="h-4 w-4" /> {saving ? "Saving..." : "Lock this session"}
                </Button>
                {saveMessage ? <p className="mt-2 text-xs text-slate-300">{saveMessage}</p> : null}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
