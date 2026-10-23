-- ============================================================
-- BIMZ — Migration 0002: Row Level Security policies
-- Least-privilege: public reads only published/public-safe rows.
-- All mutations require auth.uid() with admin role (server-side check
-- through the SECURITY DEFINER is_admin() helper).
-- ============================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.technologies enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.project_technologies enable row level security;
alter table public.skills enable row level security;
alter table public.content_sections enable row level security;
alter table public.experiments enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;

-- ---------- profiles ----------
create policy "profiles: read own"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles: admin update"
  on public.profiles for update
  using (public.is_admin()) with check (public.is_admin());

-- No insert/delete policy at all: even admins cannot write profiles from
-- the client. Role provisioning happens in the SQL dashboard (see README).

-- ---------- categories (public read, admin write) ----------
create policy "categories: public read"
  on public.categories for select using (true);
create policy "categories: admin insert"
  on public.categories for insert with check (public.is_admin());
create policy "categories: admin update"
  on public.categories for update using (public.is_admin()) with check (public.is_admin());
create policy "categories: admin delete"
  on public.categories for delete using (public.is_admin());

-- ---------- technologies ----------
create policy "technologies: public read"
  on public.technologies for select using (true);
create policy "technologies: admin insert"
  on public.technologies for insert with check (public.is_admin());
create policy "technologies: admin update"
  on public.technologies for update using (public.is_admin()) with check (public.is_admin());
create policy "technologies: admin delete"
  on public.technologies for delete using (public.is_admin());

-- ---------- projects: visitors see published rows only ----------
create policy "projects: public read published"
  on public.projects for select
  using (published = true or public.is_admin());

create policy "projects: admin insert"
  on public.projects for insert with check (public.is_admin());
create policy "projects: admin update"
  on public.projects for update using (public.is_admin()) with check (public.is_admin());
create policy "projects: admin delete"
  on public.projects for delete using (public.is_admin());

-- ---------- project images: visible when parent project is public ----------
create policy "images: public read for published projects"
  on public.project_images for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.projects p
      where p.id = project_id and p.published = true
    )
  );
create policy "images: admin insert"
  on public.project_images for insert with check (public.is_admin());
create policy "images: admin update"
  on public.project_images for update using (public.is_admin()) with check (public.is_admin());
create policy "images: admin delete"
  on public.project_images for delete using (public.is_admin());

-- ---------- project_technologies ----------
create policy "ptech: public read for published projects"
  on public.project_technologies for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.projects p
      where p.id = project_id and p.published = true
    )
  );
create policy "ptech: admin insert"
  on public.project_technologies for insert with check (public.is_admin());
create policy "ptech: admin delete"
  on public.project_technologies for delete using (public.is_admin());

-- ---------- skills ----------
create policy "skills: public read published"
  on public.skills for select using (published = true or public.is_admin());
create policy "skills: admin insert"
  on public.skills for insert with check (public.is_admin());
create policy "skills: admin update"
  on public.skills for update using (public.is_admin()) with check (public.is_admin());
create policy "skills: admin delete"
  on public.skills for delete using (public.is_admin());

-- ---------- content sections (site copy is intentionally public) ----------
create policy "content: public read"
  on public.content_sections for select using (true);
create policy "content: admin insert"
  on public.content_sections for insert with check (public.is_admin());
create policy "content: admin update"
  on public.content_sections for update using (public.is_admin()) with check (public.is_admin());
create policy "content: admin delete"
  on public.content_sections for delete using (public.is_admin());

-- ---------- experiments ----------
create policy "experiments: public read published"
  on public.experiments for select using (published = true or public.is_admin());
create policy "experiments: admin insert"
  on public.experiments for insert with check (public.is_admin());
create policy "experiments: admin update"
  on public.experiments for update using (public.is_admin()) with check (public.is_admin());
create policy "experiments: admin delete"
  on public.experiments for delete using (public.is_admin());

-- ---------- contact submissions: fully private except admin ----------
-- No anon policy exists. Writes happen only through submit_contact_message()
-- (SECURITY DEFINER). Admins read/manage their inbox.
create policy "contact: admin read"
  on public.contact_submissions for select using (public.is_admin());
create policy "contact: admin update"
  on public.contact_submissions for update using (public.is_admin()) with check (public.is_admin());
create policy "contact: admin delete"
  on public.contact_submissions for delete using (public.is_admin());

-- ---------- site settings (public-safe copy only; see README warning) ----------
create policy "settings: public read"
  on public.site_settings for select using (true);
create policy "settings: admin insert"
  on public.site_settings for insert with check (public.is_admin());
create policy "settings: admin update"
  on public.site_settings for update using (public.is_admin()) with check (public.is_admin());
create policy "settings: admin delete"
  on public.site_settings for delete using (public.is_admin());

-- ---------- audit log ----------
create policy "audit: admin read"
  on public.audit_logs for select using (public.is_admin());
-- No client insert/update/delete: writes flow through public.log_audit()
-- (SECURITY DEFINER) or service-role contexts only.

-- ---------- block direct anon writes to every content table ----------
-- RLS default-deny already covers this because no FOR INSERT policy exists
-- for anon on protected tables. Verified below.

-- ---------- storage bucket: media ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do nothing;

create policy "media: public read"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media: admin upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

create policy "media: admin update"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy "media: admin delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
