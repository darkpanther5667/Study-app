export interface Flashcard {
  id: string;
  user_id: string;
  subject: string;
  question: string;
  answer: string;
  ease_factor: number;
  interval: number;
  next_review_date: string;
  created_at: string;
  source: 'manual' | 'doubt_snap';
}

export interface BattleRoom {
  id: string;
  room_code: string;
  created_by: string;
  status: 'waiting' | 'playing' | 'finished';
  topic: string | null;
  created_at: string;
}

export interface BattlePlayer {
  room_id: string;
  user_id: string;
  score: number;
  joined_at: string;
  user_name?: string;
}

export interface BattleQuestion {
  id: string;
  room_id: string;
  question: string;
  options: string[];
  correctIndex: number;
  order: number;
}

export interface BattleAnswer {
  room_id: string;
  user_id: string;
  question_index: number;
  selected_index: number;
  is_correct: boolean;
  answered_at: string;
}

export interface FocusSession {
  id: string;
  user_id: string;
  subject: string;
  duration_minutes: number;
  notes: string | null;
  created_at: string;
}

export interface ConceptThread {
  id: string;
  user_id: string;
  title: string;
  content: string;
  subject: string;
  upvotes: number;
  created_at: string;
  user_name?: string;
}

export interface ThreadUpvote {
  thread_id: string;
  user_id: string;
}

export interface UserSubjectScore {
  id: string;
  user_id: string;
  subject: string;
  score: number;
  updated_at: string;
}

export interface DoubtExplanation {
  question: string;
  steps: string[];
  keyConcept: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  correctIndex: number;
}

export interface ConceptExplanation {
  explanation: string;
  example: string;
  analogy: string;
}

export type Subject = 'Physics' | 'Chemistry' | 'Maths' | 'Biology' | 'History' | 'Geography' | 'English' | 'Other';

export const SUBJECT_COLORS: Record<Subject, string> = {
  Physics: '#8B5CF6',
  Chemistry: '#14B8A6',
  Maths: '#3B82F6',
  Biology: '#22C55E',
  History: '#F59E0B',
  Geography: '#EAB308',
  English: '#EC4899',
  Other: '#6B7280',
};