-- =====================================================================
-- QR STUDIO - PRODUCTION DATABASE SCHEMA (PHASE 2 & PHASE 3 ARCHITECTURE)
-- =====================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends Supabase Auth users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. WORKSPACES
create table if not exists public.workspaces (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  owner_id uuid references public.profiles(id) on delete restrict not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. WORKSPACE MEMBERS
do $$ begin
  create type workspace_role as enum ('owner', 'admin', 'member');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.workspace_members (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role workspace_role default 'member'::workspace_role not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (workspace_id, user_id)
);

-- 4. FOLDERS (For organizing QR codes)
create table if not exists public.folders (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  name text not null,
  color text default '#2563EB',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. QR CODES
do $$ begin
  create type qr_mode as enum ('static', 'dynamic');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type qr_status as enum ('active', 'paused', 'archived');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.qr_codes (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  folder_id uuid references public.folders(id) on delete set null,
  name text not null,
  type text not null, -- url, wifi, text, email, phone, sms, vcard
  mode qr_mode default 'static'::qr_mode not null,
  slug text unique, -- Short slug for dynamic redirect (e.g. /r/abc123)
  destination_url text, -- Validated redirect destination
  payload jsonb not null default '{}'::jsonb, -- Structured form data & encoded payload
  design jsonb not null default '{}'::jsonb, -- Styling options (colors, shapes, logo)
  status qr_status default 'active'::qr_status not null,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint check_dynamic_slug check (
    (mode = 'static') or (mode = 'dynamic' and slug is not null and destination_url is not null)
  )
);

-- Indexes for fast lookups
create index if not exists idx_qr_codes_slug on public.qr_codes(slug) where slug is not null;
create index if not exists idx_qr_codes_workspace on public.qr_codes(workspace_id);
create index if not exists idx_qr_codes_folder on public.qr_codes(folder_id);
create index if not exists idx_workspace_members_user on public.workspace_members(user_id);

-- 6. QR SCANS (Analytics)
create table if not exists public.qr_scans (
  id uuid primary key default uuid_generate_v4(),
  qr_code_id uuid references public.qr_codes(id) on delete cascade not null,
  scanned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ip_hash text, -- Cryptographic hash to avoid storing raw PII
  user_agent text,
  device_type text, -- mobile, desktop, tablet
  os text,
  browser text,
  country_code varchar(2),
  city text,
  referrer text
);

create index if not exists idx_qr_scans_qr_time on public.qr_scans(qr_code_id, scanned_at desc);

-- 7. PLANS & SUBSCRIPTIONS
create table if not exists public.plans (
  id text primary key, -- 'free', 'starter', 'pro', 'business'
  name text not null,
  description text,
  monthly_price_cents integer not null default 0,
  max_dynamic_qrs integer not null default 1,
  max_scans_per_month integer not null default 100,
  allows_custom_branding boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

insert into public.plans (id, name, description, monthly_price_cents, max_dynamic_qrs, max_scans_per_month, allows_custom_branding)
values
  ('free', 'Free Static', 'Unlimited static QR codes and basic management', 0, 1, 100, true),
  ('starter', 'Starter', 'For individuals and freelancers', 500, 5, 5000, true),
  ('pro', 'Pro', 'For marketers and growing businesses', 1200, 50, 50000, true),
  ('business', 'Business', 'For agencies and enterprise teams', 2900, 500, 500000, true)
on conflict (id) do nothing;

create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null unique,
  plan_id text references public.plans(id) not null default 'free',
  status text not null default 'active', -- active, trialing, past_due, canceled
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. BILLING EVENTS (Audit log)
create table if not exists public.billing_events (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =====================================================================
-- HELPER FUNCTION FOR RLS (SECURITY DEFINER TO PREVENT RECURSION)
-- =====================================================================

create or replace function public.is_workspace_member(ws_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = ws_id
      and user_id = auth.uid()
  );
$$;

-- =====================================================================
-- AUTOMATIC ONBOARDING TRIGGER FOR NEW AUTH USERS
-- =====================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_ws_id uuid;
  user_name text;
  ws_slug text;
begin
  user_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    split_part(new.email, '@', 1),
    'User'
  );

  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    user_name,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(public.profiles.full_name, excluded.full_name);

  ws_slug := lower(regexp_replace(user_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(new.id::text, 1, 8);

  insert into public.workspaces (name, slug, owner_id)
  values (user_name || '''s Workspace', ws_slug, new.id)
  returning id into new_ws_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (new_ws_id, new.id, 'owner');

  insert into public.subscriptions (workspace_id, plan_id, status)
  values (new_ws_id, 'free', 'active');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.folders enable row level security;
alter table public.qr_codes enable row level security;
alter table public.qr_scans enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.billing_events enable row level security;

-- Plans: Anyone can read plans
create policy "Anyone can view plans" on public.plans
  for select using (true);

-- Profiles: Users can view, insert, and update their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Workspaces: Members can view, owners can insert/update/delete
create policy "Members can view workspaces" on public.workspaces
  for select using (
    owner_id = auth.uid() or public.is_workspace_member(id)
  );

create policy "Authenticated users can create workspaces" on public.workspaces
  for insert with check (auth.uid() = owner_id);

create policy "Owners can update workspaces" on public.workspaces
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Owners can delete workspaces" on public.workspaces
  for delete using (auth.uid() = owner_id);

-- Workspace Members: Members can view roster; workspace owners can manage members
create policy "Members can view workspace_members" on public.workspace_members
  for select using (
    user_id = auth.uid() or public.is_workspace_member(workspace_id)
  );

create policy "Users can join own workspace as owner" on public.workspace_members
  for insert with check (
    user_id = auth.uid() and exists (
      select 1 from public.workspaces
      where id = workspace_id and owner_id = auth.uid()
    )
  );

-- Folders: Workspace members have full CRUD access to folders in their workspace
create policy "Members can view folders" on public.folders
  for select using (public.is_workspace_member(workspace_id));

create policy "Members can insert folders" on public.folders
  for insert with check (public.is_workspace_member(workspace_id));

create policy "Members can update folders" on public.folders
  for update using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "Members can delete folders" on public.folders
  for delete using (public.is_workspace_member(workspace_id));

-- QR Codes: Workspace members have full CRUD access to QR codes in their workspace
create policy "Members can view workspace QR codes" on public.qr_codes
  for select using (public.is_workspace_member(workspace_id));

create policy "Members can insert QR codes" on public.qr_codes
  for insert with check (public.is_workspace_member(workspace_id));

create policy "Members can update QR codes" on public.qr_codes
  for update using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "Members can delete QR codes" on public.qr_codes
  for delete using (public.is_workspace_member(workspace_id));

-- QR Scans: Workspace members can view scan analytics for their QR codes
create policy "Members can view qr_scans" on public.qr_scans
  for select using (
    exists (
      select 1 from public.qr_codes
      where qr_codes.id = qr_scans.qr_code_id
        and public.is_workspace_member(qr_codes.workspace_id)
    )
  );

-- Subscriptions: Workspace members can view their workspace subscription
create policy "Members can view subscriptions" on public.subscriptions
  for select using (public.is_workspace_member(workspace_id));
