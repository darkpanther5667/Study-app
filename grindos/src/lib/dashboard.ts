import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DashboardData, Goal, Profile, Streak, StudySession, SubjectProgressPoint, WeeklyPoint } from "@/lib/types";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function clampHeat(value: number) {
  if (value <= 0) return 0;
  if (value < 30) return 1;
  if (value < 60) return 2;
  if (value < 120) return 3;
  return 4;
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const supabase = await createSupabaseServerClient();
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const [{ data: profile }, { data: streak }, { data: goals }, { data: sessions }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).returns<Profile>().single(),
    supabase.from("streaks").select("*").eq("user_id", userId).returns<Streak>().single(),
    supabase.from("goals").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(6).returns<Goal[]>(),
    supabase
      .from("study_sessions")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", ninetyDaysAgo.toISOString())
      .order("created_at", { ascending: false })
      .returns<StudySession[]>(),
  ]);

  const safeSessions = sessions ?? [];
  const safeStreak = (streak ?? null) as Streak | null;
  const totalMinutes = safeSessions.reduce((sum, s) => sum + s.duration, 0);
  const totalSessions = safeSessions.length;

  const last7Dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const weeklyTrend: WeeklyPoint[] = last7Dates.map((date) => {
    const key = toDateKey(date);
    const daySessions = safeSessions.filter((s) => s.created_at.slice(0, 10) === key);
    const focus = daySessions.reduce((sum, s) => sum + s.duration, 0);
    return { day: WEEK_DAYS[date.getDay()], focus, sessions: daySessions.length };
  });

  const subjectMap = new Map<string, { minutes: number; sessions: number }>();
  safeSessions.forEach((session) => {
    const prev = subjectMap.get(session.subject) ?? { minutes: 0, sessions: 0 };
    subjectMap.set(session.subject, {
      minutes: prev.minutes + session.duration,
      sessions: prev.sessions + 1,
    });
  });

  const maxMinutes = Math.max(...Array.from(subjectMap.values()).map((x) => x.minutes), 1);
  const subjectProgress: SubjectProgressPoint[] = Array.from(subjectMap.entries())
    .map(([subject, value]) => ({
      subject,
      progress: Math.round((value.minutes / maxMinutes) * 100),
      chaptersDone: value.sessions,
      total: Math.max(value.sessions + 2, 8),
    }))
    .sort((a, b) => b.chaptersDone - a.chaptersDone)
    .slice(0, 4);

  const recentSessions = safeSessions.slice(0, 5);

  const last28Days = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    return d;
  });
  const dayToMinutes = new Map<string, number>();
  safeSessions.forEach((s) => {
    const key = s.created_at.slice(0, 10);
    dayToMinutes.set(key, (dayToMinutes.get(key) ?? 0) + s.duration);
  });
  const heatmapFlat = last28Days.map((d) => clampHeat(dayToMinutes.get(toDateKey(d)) ?? 0));
  const heatmap = [0, 1, 2, 3].map((row) => heatmapFlat.slice(row * 7, row * 7 + 7));

  const thisWeekMinutes = weeklyTrend.reduce((sum, d) => sum + d.focus, 0);
  const focusScore = Math.min(100, Math.round((thisWeekMinutes / 600) * 100));
  const rankMomentum = Math.max(0, Math.round((focusScore + (safeStreak?.current_streak ?? 0)) / 6));

  return {
    profile: profile ?? null,
    totalMinutes,
    totalSessions,
    focusScore,
    rankMomentum,
    currentStreak: safeStreak?.current_streak ?? 0,
    longestStreak: safeStreak?.longest_streak ?? 0,
    weeklyTrend,
    subjectProgress,
    goals: goals ?? [],
    recentSessions,
    heatmap,
  };
}
