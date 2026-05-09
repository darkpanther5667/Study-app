import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { subject?: string; duration?: number; sessionType?: string };
    const subject = body.subject?.trim() || "General Study";
    const duration = Number(body.duration ?? 0);
    const sessionType = body.sessionType?.trim() || "focus";

    if (!duration || duration <= 0) {
      return NextResponse.json({ error: "Duration must be greater than zero." }, { status: 400 });
    }

    const { error: insertError } = await supabase.from("study_sessions").insert({
      user_id: user.id,
      subject,
      duration,
      session_type: sessionType,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const today = new Date();
    const todayKey = toDateKey(today);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = toDateKey(yesterday);

    const { data: streakRow } = await supabase
      .from("streaks")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!streakRow) {
      await supabase.from("streaks").insert({
        user_id: user.id,
        current_streak: 1,
        longest_streak: 1,
        last_session_date: todayKey,
      });
    } else {
      const lastDate = streakRow.last_session_date as string | null;
      let currentStreak = streakRow.current_streak as number;
      let longestStreak = streakRow.longest_streak as number;

      if (lastDate !== todayKey) {
        if (lastDate === yesterdayKey) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
        longestStreak = Math.max(longestStreak, currentStreak);
      }

      await supabase
        .from("streaks")
        .update({
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_session_date: todayKey,
        })
        .eq("id", streakRow.id);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unexpected error saving session." }, { status: 500 });
  }
}
