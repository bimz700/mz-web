-- ============================================================
-- BIMZ — Migration 0003: Seed content (editable placeholders)
-- All rows below are real DB rows an admin can edit/delete.
-- Nothing here claims personal achievements; copy is placeholder
-- meant to be replaced via the /admin CMS.
-- ============================================================

-- Categories
insert into public.categories (name, slug, description) values
  ('Android', 'android', 'Customization, modding, and AOSP work'),
  ('Web', 'web', 'Web applications and browser experiments'),
  ('Tools', 'tools', 'Developer tooling and CLI utilities'),
  ('Research', 'research', 'Reverse engineering and security research')
on conflict (slug) do nothing;

-- Technologies
insert into public.technologies (name, slug) values
  ('TypeScript', 'typescript'), ('React', 'react'), ('Kotlin', 'kotlin'),
  ('Rust', 'rust'), ('Python', 'python'), ('Node.js', 'nodejs'),
  ('Tailwind CSS', 'tailwind-css'), ('Supabase', 'supabase'),
  ('Vite', 'vite'), ('Framer Motion', 'framer-motion')
on conflict (slug) do nothing;

-- Content sections (placeholder copy, editable in CMS)
insert into public.content_sections (section_key, title, content) values
  ('hero', 'BIMZ', 'Developer, modder, experimenter. Building digital experiments and tools — dari customisasi Android sampai web development.'),
  ('about_intro', 'About', 'Placeholder: perkenalkan dirimu di sini lewat admin CMS. Section ini sepenuhnya editable.'),
  ('philosophy', 'Development Philosophy', 'Learn by building. Document everything. Focus on fundamentals.'),
  ('footer', 'BIMZ', 'Placeholder tagline — edit di Admin → Content.'),
  ('current_focus', 'Current Focus', 'Android customization • Web development • Reverse engineering • Creative coding')
on conflict (section_key) do nothing;

-- Site settings (public-safe only)
insert into public.site_settings (key, value) values
  ('site_title', 'BIMZ — Digital Lab'),
  ('site_description', 'Portfolio & experiment log: coding, Android modding, reverse engineering, web development.'),
  ('contact_email', 'hello@bimz.dev'),
  ('location', 'Indonesia'),
  ('social_github', ''),
  ('social_twitter', ''),
  ('social_youtube', ''),
  ('seo_og_image', '')
on conflict (key) do nothing;

-- Skills (placeholders, editable)
insert into public.skills (name, category, level, description, sort_order) values
  ('TypeScript', 'Development', 'Advanced', 'Full-stack, strict typing, modern patterns', 1),
  ('React', 'Development', 'Advanced', 'Hooks, performance, design systems', 2),
  ('Kotlin', 'Development', 'Intermediate', 'Android apps, system integration', 3),
  ('APK Patching', 'Android', 'Advanced', 'AXML, smali, signing pipelines', 4),
  ('Custom ROMs', 'Android', 'Intermediate', 'AOSP builds, vendor patches', 5),
  ('Linux', 'Systems', 'Advanced', 'CLI, scripting, internals', 6),
  ('Reverse Engineering', 'Systems', 'Intermediate', 'Static & dynamic binary analysis', 7)
on conflict do nothing;

-- Experiments (metadata only; components live in code, visibility is CMS-controlled)
insert into public.experiments (title, slug, description, component_name, featured, published, sort_order) values
  ('Mini Terminal', 'mini-terminal', 'Simulated command environment. Ketik "help" untuk daftar command.', 'terminal', true, true, 1),
  ('Interactive Grid', 'interactive-grid', 'Distance-based hover field. Murnifront-end experiment.', 'grid', false, true, 2),
  ('Visual Playground', 'visual-playground', 'Parameter-driven animation with live controls.', 'playground', false, true, 3)
on conflict (slug) do nothing;

-- Sample published project so the site isn't empty on first setup (admin can delete)
insert into public.projects (title, slug, summary, content, category_id, featured, published, published_at)
select
  'Welcome to BIMZ Lab',
  'welcome-to-bimz-lab',
  'Contoh project pertama — hapus atau edit lewat dashboard admin.',
  'Project ini dibuat oleh seed migration sebagai contoh data nyata dari database. Semua konten bisa dikelola dari /admin.',
  (select id from public.categories where slug = 'web'),
  false,
  true,
  now()
where not exists (select 1 from public.projects where slug = 'welcome-to-bimz-lab');
