-- ============================================================
-- BIMZ — Migration 0001: Core schema
-- Normalized PostgreSQL schema for the portfolio CMS.
-- Run via Supabase CLI:  supabase db push  (or paste in SQL editor)
-- ============================================================

-- ---------- extensions ----------
create extension if not exists pgcrypto;

-- ---------- profiles / roles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Helper: admin check. SECURITY DEFINER avoids recursive RLS on profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------- categories ----------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text,
  created_at timestamptz not null default now()
);

-- ---------- technologies ----------
create table if not exists public.technologies (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

-- ---------- projects ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 140),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  summary text not null default '' check (char_length(summary) <= 500),
  content text not null default '',
  category_id uuid references public.categories (id) on delete set null,
  featured boolean not null default false,
  published boolean not null default false,
  published_at timestamptz,
  demo_url text,
  repo_url text,
  thumbnail_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_published_idx on public.projects (published, published_at desc);
create index if not exists projects_category_idx on public.projects (category_id);
create index if not exists projects_featured_idx on public.projects (featured, sort_order);

-- ---------- project images ----------
create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  url text not null,
  caption text check (caption is null or char_length(caption) <= 300),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists project_images_project_idx on public.project_images (project_id, sort_order);

-- ---------- project <-> technology ----------
create table if not exists public.project_technologies (
  project_id uuid not null references public.projects (id) on delete cascade,
  technology_id uuid not null references public.technologies (id) on delete cascade,
  primary key (project_id, technology_id)
);

-- ---------- skills ----------
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  category text not null default 'General' check (char_length(category) between 1 and 80),
  level text not null default 'Intermediate' check (level in ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  description text check (description is null or char_length(description) <= 300),
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists skills_category_idx on public.skills (category, sort_order);

-- ---------- content sections (structured, keyed rows — not one JSON blob) ----------
create table if not exists public.content_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text not null default '',
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- experiments ----------
create table if not exists public.experiments (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 140),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text not null default '' check (char_length(description) <= 500),
  component_name text not null default 'terminal',
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- contact submissions (private) ----------
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message text not null check (char_length(message) between 10 and 8000),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_created_idx on public.contact_submissions (created_at desc);

-- ---------- site settings ----------
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null default '',
  updated_at timestamptz not null default now()
);

-- ---------- audit log ----------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_created_idx on public.audit_logs (created_at desc);

-- ---------- audit trigger ----------
create or replace function public.log_audit(
  p_action text, p_entity text, p_entity_id text, p_details jsonb
)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.audit_logs (actor_id, action, entity, entity_id, details)
  values (auth.uid(), p_action, p_entity, p_entity_id, coalesce(p_details, '{}'::jsonb));
$$;

-- ---------- updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['profiles','projects','skills','content_sections','experiments','site_settings']
  loop
    execute format('drop trigger if exists trg_%1$s_updated on public.%1$s', t);
    execute format(
      'create trigger trg_%1$s_updated before update on public.%1$s
       for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ============================================================
-- RPC: contact submission with server-side validation + rate limit
-- Called by anonymous visitors. Table itself stays private.
-- ============================================================
create or replace function public.submit_contact_message(
  p_name text,
  p_email text,
  p_message text
)
returns table (ok boolean, reason text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_recent integer;
  v_id uuid;
begin
  -- Trim + basic shape validation (mirror of client Zod schema)
  p_name := trim(coalesce(p_name, ''));
  p_email := lower(trim(coalesce(p_email, '')));
  p_message := trim(coalesce(p_message, ''));

  if char_length(p_name) < 2 or char_length(p_name) > 120 then
    return query select false, 'invalid_name';
  end if;
  if p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    return query select false, 'invalid_email';
  end if;
  if char_length(p_message) < 10 or char_length(p_message) > 8000 then
    return query select false, 'invalid_message';
  end if;

  -- Honeypot / bot field convention: empty required
  -- Rate limit: max 3 submissions per email per hour
  select count(*) into v_recent
  from public.contact_submissions
  where email = p_email and created_at > now() - interval '1 hour';

  if v_recent >= 3 then
    return query select false, 'rate_limited';
  end if;

  -- Global flood guard: max 30 submissions per hour site-wide
  select count(*) into v_recent
  from public.contact_submissions
  where created_at > now() - interval '1 hour';

  if v_recent >= 30 then
    return query select false, 'rate_limited';
  end if;

  insert into public.contact_submissions (name, email, message)
  values (p_name, p_email, p_message)
  returning id into v_id;

  return query select true, v_id::text;
end;
$$;

revoke all on function public.submit_contact_message(text, text, text) from public;
grant execute on function public.submit_contact_message(text, text, text) to anon, authenticated;

-- Read access to a single submission for the notification worker (edge fn uses service role,
-- which bypasses RLS; nothing else needed here).
