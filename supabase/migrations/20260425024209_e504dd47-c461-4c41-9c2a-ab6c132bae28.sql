
-- Enums
create type public.draft_status as enum ('drafting','awaiting_edits','approved','archived','cancelled');
create type public.topic_source as enum ('in_app','inbound_email');
create type public.topic_status as enum ('pending','generating','done','failed');
create type public.sample_type as enum ('best_of','story','bio','long_form');
create type public.kya_status as enum ('none','pending','active');

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  primary_email text,
  agent_name text,
  agent_email_alias text,
  agnic_sub text unique,
  agnic_agent_id integer,
  kya_status public.kya_status not null default 'none',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.voice_dna (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  version integer not null default 1,
  summary text,
  dna_json jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.voice_dna(user_id);

create table public.voice_samples (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type public.sample_type not null,
  title text,
  content text not null,
  created_at timestamptz not null default now()
);
create index on public.voice_samples(user_id);

create table public.archetype_selections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  archetype_id text not null,
  weight numeric(3,2) not null default 0.5,
  features_enabled jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(user_id, archetype_id)
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source public.topic_source not null default 'in_app',
  content text not null,
  status public.topic_status not null default 'pending',
  created_at timestamptz not null default now()
);
create index on public.topics(user_id);

create table public.drafts (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references public.topics(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  version integer not null default 1,
  body_long text,
  body_short_1 text,
  body_short_2 text,
  hook_carousel text,
  status public.draft_status not null default 'drafting',
  agnic_message_id text,
  parent_draft_id uuid references public.drafts(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.drafts(user_id);
create index on public.drafts(topic_id);

create table public.edit_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  draft_id uuid not null references public.drafts(id) on delete cascade,
  agnic_message_id text,
  instruction_text text not null,
  processed_at timestamptz,
  regen_draft_id uuid references public.drafts(id) on delete set null,
  created_at timestamptz not null default now()
);
create index on public.edit_requests(draft_id);

create table public.processed_emails (
  id uuid primary key default gen_random_uuid(),
  agnic_message_id text not null unique,
  processed_at timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.voice_dna enable row level security;
alter table public.voice_samples enable row level security;
alter table public.archetype_selections enable row level security;
alter table public.topics enable row level security;
alter table public.drafts enable row level security;
alter table public.edit_requests enable row level security;
alter table public.processed_emails enable row level security;

-- Profiles: user sees/edits own
create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id);

-- Generic owner policies
create policy "vdna_all_own" on public.voice_dna for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "vsamples_all_own" on public.voice_samples for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "asel_all_own" on public.archetype_selections for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "topics_all_own" on public.topics for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "drafts_all_own" on public.drafts for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "edit_req_all_own" on public.edit_requests for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- processed_emails: backend-only (no user policies = locked down to service role)

-- updated_at trigger
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.tg_set_updated_at();
create trigger vdna_updated_at before update on public.voice_dna for each row execute function public.tg_set_updated_at();
create trigger drafts_updated_at before update on public.drafts for each row execute function public.tg_set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, primary_email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
