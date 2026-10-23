import { supabase } from '../supabase'
import type {
  Category, Technology, Project, ProjectWithRelations, ProjectImage, Skill,
  ContentSection, ExperimentRow, AuditLog,
} from '../types'
import {
  demoCategories, demoTechnologies, demoProjects, demoProjectTech,
  demoSkills, demoSections, demoExperiments, demoSettings,
} from '../demo-data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = supabase

/** True when running on demo data (Supabase not configured). */
export const isDemoMode = supabase === null

function demoTechFor(projectId: string): Technology[] {
  return (demoProjectTech[projectId] || [])
    .map((tid) => demoTechnologies.find((t) => t.id === tid))
    .filter((t): t is Technology => Boolean(t))
}

function demoHydrate(p: Project): ProjectWithRelations {
  return {
    ...p,
    category: demoCategories.find((c) => c.id === p.category_id) || null,
    technologies: demoTechFor(p.id),
    images: [],
  }
}

/* ---------------- reads ---------------- */

export async function listPublishedProjects(): Promise<ProjectWithRelations[]> {
  if (!supabase) {
    return demoProjects.filter((p) => p.published).map(demoHydrate)
  }
  const { data, error } = await db
    .from('projects')
    .select(`*, category:categories(*), project_images(*), project_technologies(technology:technologies(*))`)
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false })
  if (error) throw error
  return (data as unknown as (Project & {
    category: Category | null
    project_images: ProjectImage[]
    project_technologies: { technology: Technology }[]
  })[]).map(({ project_technologies, project_images, ...p }) => ({
    ...p,
    category: p.category ?? null,
    images: project_images || [],
    technologies: (project_technologies || []).map((r) => r.technology),
  }))
}

export async function getPublishedProjectBySlug(slug: string): Promise<ProjectWithRelations | null> {
  if (!supabase) {
    const p = demoProjects.find((x) => x.slug === slug && x.published)
    return p ? demoHydrate(p) : null
  }
  const { data, error } = await db
    .from('projects')
    .select(`*, category:categories(*), project_images(*), project_technologies(technology:technologies(*))`)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  const { project_technologies, project_images, ...p } = data as unknown as Project & {
    category: Category | null
    project_images: ProjectImage[]
    project_technologies: { technology: Technology }[]
  }
  return {
    ...p,
    category: p.category ?? null,
    images: project_images || [],
    technologies: (project_technologies || []).map((r) => r.technology),
  }
}

/** Admin sees drafts too. RLS rejects this call for non-admins server-side. */
export async function listAllProjects(): Promise<Project[]> {
  if (!supabase) return demoProjects
  const { data, error } = await db
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data
}

export async function listCategories(): Promise<Category[]> {
  if (!supabase) return demoCategories
  const { data, error } = await db.from('categories').select('*').order('name')
  if (error) throw error
  return data
}

export async function listTechnologies(): Promise<Technology[]> {
  if (!supabase) return demoTechnologies
  const { data, error } = await db.from('technologies').select('*').order('name')
  if (error) throw error
  return data
}

export async function listPublishedSkills(): Promise<Skill[]> {
  if (!supabase) return demoSkills.filter((s) => s.published)
  const { data, error } = await db
    .from('skills').select('*').eq('published', true)
    .order('category').order('sort_order')
  if (error) throw error
  return data
}

export async function listAllSkills(): Promise<Skill[]> {
  if (!supabase) return demoSkills
  const { data, error } = await db.from('skills').select('*').order('category').order('sort_order')
  if (error) throw error
  return data
}

export async function listSections(): Promise<ContentSection[]> {
  if (!supabase) return demoSections
  const { data, error } = await db.from('content_sections').select('*').order('section_key')
  if (error) throw error
  return data
}

export async function listPublishedExperiments(): Promise<ExperimentRow[]> {
  if (!supabase) return demoExperiments.filter((e) => e.published)
  const { data, error } = await db
    .from('experiments').select('*').eq('published', true).order('sort_order')
  if (error) throw error
  return data
}

export async function listAllExperiments(): Promise<ExperimentRow[]> {
  if (!supabase) return demoExperiments
  const { data, error } = await db.from('experiments').select('*').order('sort_order')
  if (error) throw error
  return data
}

export async function getSettings(): Promise<Record<string, string>> {
  const rows = supabase
    ? (await db.from('site_settings').select('*')).data || []
    : demoSettings
  const out: Record<string, string> = {}
  for (const r of rows) out[r.key] = r.value
  return out
}

export async function getAuditLogs(limit = 20): Promise<AuditLog[]> {
  if (!supabase) return []
  const { data, error } = await db
    .from('audit_logs').select('*').order('created_at', { ascending: false }).limit(limit)
  if (error) throw error
  return data
}

/* ---------------- project writes (admin; enforced again by RLS) ---------------- */

export type ProjectInput = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'category_id' | 'published_at'> & {
  category_id: string | null
}

function refuseWrite(): never {
  throw new Error('Demo mode: backend tidak terkonfigurasi. Set Supabase env vars untuk menyimpan perubahan.')
}

export async function createProject(input: ProjectInput, technologyIds: string[]): Promise<Project> {
  if (!supabase) refuseWrite()
  const { data, error } = await db.from('projects').insert(input).select().single()
  if (error) throw error
  if (technologyIds.length) {
    const links = technologyIds.map((technology_id) => ({ project_id: data.id, technology_id }))
    const { error: linkError } = await db.from('project_technologies').insert(links)
    if (linkError) throw linkError
  }
  // Audit logged server-side via database trigger
  return data
}

export async function updateProject(id: string, patch: Partial<ProjectInput>, technologyIds?: string[]): Promise<Project> {
  if (!supabase) refuseWrite()
  const { data, error } = await db.from('projects').update(patch).eq('id', id).select().single()
  if (error) throw error
  if (technologyIds) {
    const { error: delError } = await db.from('project_technologies').delete().eq('project_id', id)
    if (delError) throw delError
    if (technologyIds.length) {
      const links = technologyIds.map((technology_id) => ({ project_id: id, technology_id }))
      const { error: insError } = await db.from('project_technologies').insert(links)
      if (insError) throw insError
    }
  }
  // Audit logged server-side
  return data
}

export async function deleteProject(id: string): Promise<void> {
  if (!supabase) refuseWrite()
  const { error } = await db.from('projects').delete().eq('id', id)
  if (error) throw error
  // Audit logged server-side
}

/* ---------------- category / tech / experiment / settings writes ---------------- */

export async function upsertCategory(input: Pick<Category, 'name' | 'slug' | 'description'>, id?: string): Promise<void> {
  if (!supabase) refuseWrite()
  if (id) {
    const { error } = await db.from('categories').update(input).eq('id', id)
    if (error) throw error
  } else {
    const { error } = await db.from('categories').insert(input)
    if (error) throw error
  }
  // Audit logged server-side
}

export async function deleteCategory(id: string): Promise<void> {
  if (!supabase) refuseWrite()
  const { error } = await db.from('categories').delete().eq('id', id)
  if (error) throw error
  // Audit logged server-side
}

export async function upsertTechnology(input: Pick<Technology, 'name' | 'slug'>, id?: string): Promise<void> {
  if (!supabase) refuseWrite()
  if (id) {
    const { error } = await db.from('technologies').update(input).eq('id', id)
    if (error) throw error
  } else {
    const { error } = await db.from('technologies').insert(input)
    if (error) throw error
  }
  // Audit logged server-side
}

export async function upsertSection(input: Pick<ContentSection, 'section_key' | 'title' | 'content'>): Promise<void> {
  if (!supabase) refuseWrite()
  const { error } = await db
    .from('content_sections')
    .upsert(input, { onConflict: 'section_key' })
  if (error) throw error
  // Audit logged server-side
}

export async function setSetting(key: string, value: string): Promise<void> {
  if (!supabase) refuseWrite()
  const existing = await db.from('site_settings').select('id').eq('key', key).maybeSingle()
  if (existing?.data) {
    const { error } = await db.from('site_settings').update({ value }).eq('key', key)
    if (error) throw error
  } else {
    const { error } = await db.from('site_settings').insert({ key, value })
    if (error) throw error
  }
  // Audit logged server-side
}

export async function upsertExperiment(input: Omit<ExperimentRow, 'id' | 'created_at' | 'updated_at'>, id?: string): Promise<void> {
  if (!supabase) refuseWrite()
  if (id) {
    const { error } = await db.from('experiments').update(input).eq('id', id)
    if (error) throw error
  } else {
    const { error } = await db.from('experiments').insert(input)
    if (error) throw error
  }
  // Audit logged server-side
}

export async function deleteExperiment(id: string): Promise<void> {
  if (!supabase) refuseWrite()
  const { error } = await db.from('experiments').delete().eq('id', id)
  if (error) throw error
  // Audit logged server-side
}

/* ---------------- skills writes ---------------- */

export type SkillInput = Omit<Skill, 'id' | 'created_at' | 'updated_at'>

export async function upsertSkill(input: SkillInput, id?: string): Promise<void> {
  if (!supabase) refuseWrite()
  if (id) {
    const { error } = await db.from('skills').update(input).eq('id', id)
    if (error) throw error
  } else {
    const { error } = await db.from('skills').insert(input)
    if (error) throw error
  }
  // Audit logged server-side
}

export async function deleteSkill(id: string): Promise<void> {
  if (!supabase) refuseWrite()
  const { error } = await db.from('skills').delete().eq('id', id)
  if (error) throw error
  // Audit logged server-side
}

/* ---------------- contact ---------------- */

export interface ContactResult {
  ok: boolean
  reason?: string
  submissionId?: string
}

export async function submitContact(name: string, email: string, message: string): Promise<ContactResult> {
  if (!supabase) refuseWrite()
  const { data, error } = await db.rpc('submit_contact_message', {
    p_name: name, p_email: email, p_message: message,
  })
  if (error) throw error
  const row = Array.isArray(data) ? data[0] : (data as { ok: boolean; reason: string })
  if (!row?.ok) return { ok: false, reason: row?.reason || 'unknown' }
  return { ok: true, submissionId: row.reason }
}

export async function listContactSubmissions(): Promise<import('../types').ContactSubmission[]> {
  if (!supabase) return []
  const { data, error } = await db
    .from('contact_submissions').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function markContactRead(id: string, read: boolean): Promise<void> {
  if (!supabase) refuseWrite()
  const { error } = await db.from('contact_submissions').update({ read }).eq('id', id)
  if (error) throw error
}

export async function deleteContactSubmission(id: string): Promise<void> {
  if (!supabase) refuseWrite()
  const { error } = await db.from('contact_submissions').delete().eq('id', id)
  if (error) throw error
  // Audit logged server-side
}

/** Best-effort email notification; never claims success unless provider says so. */
export async function notifyAdminByEmail(submissionId: string): Promise<{ emailSent: boolean; detail: string }> {
  if (!supabase) return { emailSent: false, detail: 'not configured' }
  try {
    const res = await fetch(`${supabaseUrlForFunctions()}/functions/v1/send-contact-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId }),
    })
    if (!res.ok) return { emailSent: false, detail: `function status ${res.status}` }
    const json = (await res.json()) as { emailSent?: boolean; reason?: string; providerStatus?: number }
    return { emailSent: Boolean(json.emailSent), detail: json.reason || `provider status ${json.providerStatus}` }
  } catch (e) {
    return { emailSent: false, detail: String(e) }
  }
}

function supabaseUrlForFunctions() {
  if (!supabase) throw new Error('not configured')
  return import.meta.env.VITE_SUPABASE_URL as string
}

/* ---------------- audit helper ---------------- */
// Audit logging is done SERVER-SIDE only via database triggers or service role.
// Client-side RPC calls to log_audit would be a security violation.
// The log_audit function exists in migrations but is intentionally NOT exposed to client.

/* ---------------- media (storage) ---------------- */

export interface MediaFile {
  name: string
  path: string
  url: string
  updated_at: string
}

export async function listMedia(): Promise<MediaFile[]> {
  if (!supabase) return []
  const { data, error } = await db.storage.from('media').list('uploads', { limit: 200 })
  if (error) throw error
  return (data || []).map((f: { name: string; updated_at?: string }) => ({
    name: f.name,
    path: `uploads/${f.name}`,
    url: db.storage.from('media').getPublicUrl(`uploads/${f.name}`).data.publicUrl,
    updated_at: String(f.updated_at || ''),
  }))
}

export async function uploadMedia(file: File, onProgress?: (p: number) => void): Promise<{ path: string; url: string }> {
  if (!supabase) refuseWrite()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const path = `uploads/${safeName}`

  const { error } = await db.storage.from('media').upload(path, file, {
    cacheControl: '31536000', contentType: file.type, upsert: false,
  })
  if (error) throw error
  onProgress?.(100)
  const url = db.storage.from('media').getPublicUrl(path).data.publicUrl
  // Audit logged server-side
  return { path, url }
}

export async function deleteMedia(path: string): Promise<void> {
  if (!supabase) refuseWrite()
  const { error } = await db.storage.from('media').remove([path])
  if (error) throw error
  // Audit logged server-side
}
