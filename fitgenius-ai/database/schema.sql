-- FITGENIUS AI: Supabase / PostgreSQL schema for the future database version.
-- Run in the Supabase SQL editor. Not used by the localStorage demo.
-- The existing user_profiles table is NOT recreated: only missing columns are added.

-- 1) Extend the existing user_profiles table
alter table public.user_profiles add column if not exists gender text;
alter table public.user_profiles add column if not exists diet_preference text;
alter table public.user_profiles add column if not exists activity_level text;
alter table public.user_profiles add column if not exists water_goal_ml integer not null default 2500;
alter table public.user_profiles add column if not exists updated_at timestamptz not null default now();

alter table public.user_profiles enable row level security;
drop policy if exists "own profile" on public.user_profiles;
create policy "own profile" on public.user_profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- 2) New tables
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  day_of_week smallint not null check (day_of_week between 0 and 6),  -- 0 = Monday
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts(id) on delete cascade,
  exercise_name text not null,
  sets smallint not null check (sets between 1 and 10),
  reps text not null,
  rest_seconds integer not null default 60 check (rest_seconds between 0 and 600),
  position smallint not null default 0
);

-- Completed sessions (the "history" list in the app)
create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_id uuid references public.workouts(id) on delete set null,
  workout_name text not null,
  completed_on date not null default current_date,
  est_kcal integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  eaten_on date not null default current_date,
  meal_type text not null check (meal_type in ('Breakfast','Lunch','Dinner','Snacks')),
  name text not null,
  kcal integer not null check (kcal >= 0),
  protein_g numeric(6,1) not null default 0,
  carbs_g numeric(6,1) not null default 0,
  fat_g numeric(6,1) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.water_intake (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  logged_on date not null default current_date,
  amount_ml integer not null check (amount_ml > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  logged_on date not null default current_date,
  weight_kg numeric(5,1) not null check (weight_kg between 30 and 300),
  created_at timestamptz not null default now(),
  unique (user_id, logged_on)
);

create table if not exists public.fitness_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_type text not null,
  start_weight_kg numeric(5,1),
  target_weight_kg numeric(5,1),
  status text not null default 'active' check (status in ('active','achieved','paused')),
  started_on date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists meals_user_day on public.meals (user_id, eaten_on);
create index if not exists water_user_day on public.water_intake (user_id, logged_on);
create index if not exists logs_user_day on public.workout_logs (user_id, completed_on);
create index if not exists chat_user_time on public.ai_chat_history (user_id, created_at);

-- 3) Row Level Security: users can only touch their own rows
do $$
declare t text;
begin
  foreach t in array array['workouts','workout_logs','meals','water_intake','weight_logs','fitness_goals','ai_chat_history'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "own rows" on public.%I', t);
    execute format('create policy "own rows" on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
  end loop;
end $$;

alter table public.workout_exercises enable row level security;
drop policy if exists "own exercises" on public.workout_exercises;
create policy "own exercises" on public.workout_exercises
  for all
  using (exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()))
  with check (exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()));
