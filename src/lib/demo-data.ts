import type {
  Category,
  Technology,
  Project,
  Skill,
  ContentSection,
  ExperimentRow,
  SiteSetting,
} from './types'

/**
 * Demo content used ONLY when Supabase env vars are absent (e.g. first clone,
 * offline preview). The UI visibly marks demo mode, and every write
 * operation refuses to pretend it persisted.
 */

export const demoCategories: Category[] = [
  { id: 'c1', name: 'Android', slug: 'android', description: 'Customization, modding, AOSP', created_at: '2026-01-01T00:00:00Z' },
  { id: 'c2', name: 'Web', slug: 'web', description: 'Web apps & experiments', created_at: '2026-01-01T00:00:00Z' },
  { id: 'c3', name: 'Tools', slug: 'tools', description: 'Developer tooling', created_at: '2026-01-01T00:00:00Z' },
]

export const demoTechnologies: Technology[] = [
  { id: 't1', name: 'TypeScript', slug: 'typescript', created_at: '2026-01-01T00:00:00Z' },
  { id: 't2', name: 'React', slug: 'react', created_at: '2026-01-01T00:00:00Z' },
  { id: 't3', name: 'Kotlin', slug: 'kotlin', created_at: '2026-01-01T00:00:00Z' },
  { id: 't4', name: 'Rust', slug: 'rust', created_at: '2026-01-01T00:00:00Z' },
  { id: 't5', name: 'Python', slug: 'python', created_at: '2026-01-01T00:00:00Z' },
]

const now = new Date().toISOString()

export const demoProjects: Project[] = [
  {
    id: 'p1', title: 'Android Mod Manager', slug: 'android-mod-manager',
    summary: 'APK patching & mod management dengan live log dan batch processing.',
    content: '## Demo content\n\nProject contoh dari demo mode. Setelah Supabase dikonfigurasi, project nyata dari database akan tampil di sini dan sepenuhnya dikelola lewat /admin.',
    category_id: 'c1', featured: true, published: true, published_at: now,
    demo_url: null, repo_url: 'https://github.com', thumbnail_url: null, sort_order: 1,
    created_at: now, updated_at: now,
  },
  {
    id: 'p2', title: 'Web Terminal Emulator', slug: 'web-terminal-emulator',
    summary: 'Terminal di browser dengan plugin system dan theming.',
    content: '## Demo content\n\nData nyata diambil dari Supabase setelah setup.',
    category_id: 'c2', featured: true, published: true, published_at: now,
    demo_url: null, repo_url: 'https://github.com', thumbnail_url: null, sort_order: 2,
    created_at: now, updated_at: now,
  },
  {
    id: 'p3', title: 'RE Toolkit', slug: 're-toolkit',
    summary: 'Utilities untuk binary analysis dan debugging.',
    content: '## Demo content\n\nData nyata diambil dari Supabase setelah setup.',
    category_id: 'c3', featured: false, published: true, published_at: now,
    demo_url: null, repo_url: 'https://github.com', thumbnail_url: null, sort_order: 3,
    created_at: now, updated_at: now,
  },
]

export const demoProjectTech: Record<string, string[]> = {
  p1: ['t3', 't4'], p2: ['t1', 't2'], p3: ['t5'],
}

export const demoSkills: Skill[] = [
  { id: 's1', name: 'TypeScript', category: 'Development', level: 'Advanced', description: 'Full-stack, strict typing', sort_order: 1, published: true, created_at: now, updated_at: now },
  { id: 's2', name: 'React', category: 'Development', level: 'Advanced', description: 'Hooks, performance, design systems', sort_order: 2, published: true, created_at: now, updated_at: now },
  { id: 's3', name: 'Kotlin', category: 'Development', level: 'Intermediate', description: 'Android, system integration', sort_order: 3, published: true, created_at: now, updated_at: now },
  { id: 's4', name: 'APK Patching', category: 'Android', level: 'Advanced', description: 'AXML, smali, signing', sort_order: 4, published: true, created_at: now, updated_at: now },
  { id: 's5', name: 'Custom ROMs', category: 'Android', level: 'Intermediate', description: 'AOSP builds, vendor patches', sort_order: 5, published: true, created_at: now, updated_at: now },
  { id: 's6', name: 'Linux', category: 'Systems', level: 'Advanced', description: 'CLI, scripting, internals', sort_order: 6, published: true, created_at: now, updated_at: now },
  { id: 's7', name: 'Reverse Engineering', category: 'Systems', level: 'Intermediate', description: 'Static & dynamic analysis', sort_order: 7, published: true, created_at: now, updated_at: now },
]

export const demoSections: ContentSection[] = [
  { id: 'h1', section_key: 'hero', title: 'BIMZ', content: 'Developer, modder, experimenter. Building digital experiments and tools — dari customisasi Android sampai web development.', created_at: now, updated_at: now },
  { id: 'h2', section_key: 'about_intro', title: 'About', content: 'Placeholder: sunting halaman ini lewat Admin → Content. Mode demo — data belum tersimpan di database.', created_at: now, updated_at: now },
  { id: 'h3', section_key: 'philosophy', title: 'Development Philosophy', content: 'Learn by building. Document everything. Focus on fundamentals.', created_at: now, updated_at: now },
  { id: 'h4', section_key: 'current_focus', title: 'Current Focus', content: 'Android customization • Web development • Reverse engineering • Creative coding', created_at: now, updated_at: now },
]

export const demoExperiments: ExperimentRow[] = [
  { id: 'e1', title: 'Mini Terminal', slug: 'mini-terminal', description: 'Simulated command environment. Ketik "help" untuk daftar command.', component_name: 'terminal', featured: true, published: true, sort_order: 1, created_at: now, updated_at: now },
  { id: 'e2', title: 'Interactive Grid', slug: 'interactive-grid', description: 'Distance-based hover field experiment.', component_name: 'grid', featured: false, published: true, sort_order: 2, created_at: now, updated_at: now },
  { id: 'e3', title: 'Visual Playground', slug: 'visual-playground', description: 'Parameter-driven animation dengan live controls.', component_name: 'playground', featured: false, published: true, sort_order: 3, created_at: now, updated_at: now },
]

export const demoSettings: SiteSetting[] = [
  { id: 'g1', key: 'site_title', value: 'BIMZ — Digital Lab', updated_at: now },
  { id: 'g2', key: 'site_description', value: 'Portfolio & experiment log: coding, Android modding, reverse engineering, web development.', updated_at: now },
  { id: 'g3', key: 'contact_email', value: 'hello@bimz.dev', updated_at: now },
  { id: 'g4', key: 'location', value: 'Indonesia', updated_at: now },
  { id: 'g5', key: 'social_github', value: 'https://github.com', updated_at: now },
  { id: 'g6', key: 'social_twitter', value: '', updated_at: now },
  { id: 'g7', key: 'social_youtube', value: '', updated_at: now },
  { id: 'g8', key: 'seo_og_image', value: '', updated_at: now },
]
