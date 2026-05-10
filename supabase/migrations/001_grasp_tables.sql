-- Grasp Study App Database Tables

-- Flashcards table for Doubt Snap and Memory Vault
CREATE TABLE IF NOT EXISTS flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    ease_factor NUMERIC DEFAULT 2.5,
    interval INTEGER DEFAULT 1,
    next_review_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    source TEXT CHECK (source IN ('manual', 'doubt_snap')) DEFAULT 'manual'
);

-- Battle rooms for Battle Mode
CREATE TABLE IF NOT EXISTS battle_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code TEXT UNIQUE NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
    status TEXT CHECK (status IN ('waiting', 'playing', 'finished')) DEFAULT 'waiting',
    topic TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Battle players
CREATE TABLE IF NOT EXISTS battle_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES battle_rooms(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    score INTEGER DEFAULT 0,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(room_id, user_id)
);

-- Battle questions
CREATE TABLE IF NOT EXISTS battle_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES battle_rooms(id) ON DELETE CASCADE NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_index INTEGER NOT NULL,
    "order" INTEGER NOT NULL
);

-- Battle answers
CREATE TABLE IF NOT EXISTS battle_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES battle_rooms(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    question_index INTEGER NOT NULL,
    selected_index INTEGER NOT NULL,
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Focus sessions for Focus Room
CREATE TABLE IF NOT EXISTS focus_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Concept threads for Explore page
CREATE TABLE IF NOT EXISTS concept_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    subject TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Thread upvotes
CREATE TABLE IF NOT EXISTS thread_upvotes (
    thread_id UUID REFERENCES concept_threads(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (thread_id, user_id)
);

-- User subject scores for Weak Spot Radar
CREATE TABLE IF NOT EXISTS user_subject_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, subject)
);

-- Enable Row Level Security
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE battle_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE battle_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE battle_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE battle_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subject_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for flashcards
CREATE POLICY "Users can view own flashcards" ON flashcards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flashcards" ON flashcards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flashcards" ON flashcards
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own flashcards" ON flashcards
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for battle_rooms
CREATE POLICY "Anyone can view battle_rooms" ON battle_rooms
    FOR SELECT USING (true);

CREATE POLICY "Users can insert battle_rooms" ON battle_rooms
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- RLS Policies for battle_players
CREATE POLICY "Anyone can view battle_players" ON battle_players
    FOR SELECT USING (true);

CREATE POLICY "Users can insert battle_players" ON battle_players
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for focus_sessions
CREATE POLICY "Users can view own focus_sessions" ON focus_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own focus_sessions" ON focus_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for concept_threads
CREATE POLICY "Anyone can view concept_threads" ON concept_threads
    FOR SELECT USING (true);

CREATE POLICY "Users can insert concept_threads" ON concept_threads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own concept_threads" ON concept_threads
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_subject_scores
CREATE POLICY "Users can view own scores" ON user_subject_scores
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scores" ON user_subject_scores
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scores" ON user_subject_scores
    FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX idx_flashcards_next_review ON flashcards(next_review_date);
CREATE INDEX idx_battle_rooms_room_code ON battle_rooms(room_code);
CREATE INDEX idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX idx_concept_threads_subject ON concept_threads(subject);
CREATE INDEX idx_user_subject_scores_user ON user_subject_scores(user_id);