export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  exam_type: string | null;
  created_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  subject: string;
  duration: number;
  session_type: string;
  created_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_session_date: string | null;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

export interface WeeklyPoint {
  day: string;
  focus: number;
  sessions: number;
}

export interface SubjectProgressPoint {
  subject: string;
  progress: number;
  chaptersDone: number;
  total: number;
}

export interface DashboardData {
  profile: Profile | null;
  totalMinutes: number;
  totalSessions: number;
  focusScore: number;
  rankMomentum: number;
  currentStreak: number;
  longestStreak: number;
  weeklyTrend: WeeklyPoint[];
  subjectProgress: SubjectProgressPoint[];
  goals: Goal[];
  recentSessions: StudySession[];
  heatmap: number[][];
}
