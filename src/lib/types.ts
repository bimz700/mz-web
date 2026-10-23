/** Row types mirroring supabase/migrations — kept in sync manually. */

export type AdminRole = 'admin' | 'viewer'

export interface Profile {
  id: string
  role: AdminRole
  display_name: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export interface Technology {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  category_id: string | null
  featured: boolean
  published: boolean
  published_at: string | null
  demo_url: string | null
  repo_url: string | null
  thumbnail_url: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ProjectImage {
  id: string
  project_id: string
  url: string
  caption: string | null
  sort_order: number
  created_at: string
}

export interface Skill {
  id: string
  name: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  description: string | null
  sort_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export interface ContentSection {
  id: string
  section_key: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface ExperimentRow {
  id: string
  title: string
  slug: string
  description: string
  component_name: string
  featured: boolean
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  created_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: string
  updated_at: string
}

export interface AuditLog {
  id: string
  actor_id: string | null
  action: string
  entity: string
  entity_id: string | null
  details: Record<string, unknown>
  created_at: string
}

/** Joined shapes used by the public site */
export interface ProjectWithRelations extends Project {
  category: Category | null
  technologies: Technology[]
  images: ProjectImage[]
}

/** Database type for Supabase client - simplified to avoid generic inference issues */
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile }
      categories: { Row: Category }
      technologies: { Row: Technology }
      projects: { Row: Project }
      project_images: { Row: ProjectImage }
      project_technologies: { Row: { project_id: string; technology_id: string } }
      skills: { Row: Skill }
      content_sections: { Row: ContentSection }
      experiments: { Row: ExperimentRow }
      contact_submissions: { Row: ContactSubmission }
      site_settings: { Row: SiteSetting }
      audit_logs: { Row: AuditLog }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean }
      submit_contact_message: { Args: { p_name: string; p_email: string; p_message: string }; Returns: { ok: boolean; reason: string }[] }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
