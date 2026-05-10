-- GrindOS core schema
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  exam_type text,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  duration integer not null check (duration > 0),
  session_type text not null default 'focus',
  created_at timestamp with time zone not null default now()
);

create table if not exists public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_session_date date
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  created_at timestamp with time zone not null default now()
);

alter table public.profiles enable row level security;
alter table public.study_sessions enable row level security;
alter table public.streaks enable row level security;
alter table public.goals enable row level security;

create policy "users_can_select_own_profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "users_can_upsert_own_profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "users_can_update_own_profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "users_can_manage_own_sessions"
  on public.study_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users_can_manage_own_streaks"
  on public.streaks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users_can_manage_own_goals"
  on public.goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
