import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, Save } from 'lucide-react'
import { useAsync } from '@/hooks/useAsync'
import {
  createProject, updateProject, listCategories, listTechnologies, isDemoMode,
} from '@/lib/data/repo'
import type { Project, Technology } from '@/lib/types'
import Seo from '@/components/common/Seo'
import { PageLoader, ErrorState } from '@/components/common/States'

const schema = z.object({
  title: z.string().min(1, 'Judul wajib').max(140),
  slug: z.string().min(1).max(140).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug harus lowercase, tanpa spasi'),
  summary: z.string().max(500),
  content: z.string(),
  category_id: z.string().nullable(),
  featured: z.boolean(),
  published: z.boolean(),
  demo_url: z.string().url('URL tidak valid').nullable().or(z.literal('')),
  repo_url: z.string().url('URL tidak valid').nullable().or(z.literal('')),
  technologies: z.array(z.string()),
})

type FormData = z.infer<typeof schema>

export default function ProjectEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id

  const project = useAsync(async () => {
    if (!id) return null
    // Fetch all projects and find by ID
    const { listAllProjects } = await import('@/lib/data/repo')
    const all = await listAllProjects()
    return all.find((p) => p.id === id) || null
  }, [id])

  const categories = useAsync(() => listCategories(), [])
  const techs = useAsync(() => listTechnologies(), [])

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '', slug: '', summary: '', content: '', category_id: null,
      featured: false, published: false, demo_url: '', repo_url: '', technologies: [],
    },
  })

  useEffect(() => {
    if (project.data) {
      const p = project.data as Project & { technologies?: Technology[] }
      form.reset({
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        content: p.content,
        category_id: p.category_id,
        featured: p.featured,
        published: p.published,
        demo_url: p.demo_url || '',
        repo_url: p.repo_url || '',
        technologies: (p as unknown as { technologies?: Technology[] }).technologies?.map((t: Technology) => t.id) || [],
      })
    }
  }, [project.data])

  const [saving, setSaving] = useState(false)

  const onSubmit = async (data: FormData) => {
    if (isDemoMode) {
      toast.error('Demo mode: tidak dapat menyimpan')
      return
    }
    setSaving(true)
    try {
      const payload = {
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        content: data.content,
        category_id: data.category_id || null,
        featured: data.featured,
        published: data.published,
        published_at: data.published && !project.data?.published_at ? new Date().toISOString() : project.data?.published_at,
        demo_url: data.demo_url || null,
        repo_url: data.repo_url || null,
        sort_order: 0,
        thumbnail_url: null,
      }
      if (isNew) {
        await createProject(payload, data.technologies)
        toast.success('Project dibuat')
      } else {
        await updateProject(id!, payload, data.technologies)
        toast.success('Project diupdate')
      }
      navigate('/admin/projects')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  if (project.loading) return <PageLoader />
  if (project.error) return <ErrorState message={project.error} onRetry={project.reload} />
  if (id && !project.data) return <ErrorState message="Project tidak ditemukan" />

  return (
    <div>
      <Seo title={isNew ? 'New Project' : 'Edit Project'} noindex />

      <div className="mb-8">
        <Link to="/admin/projects" className="inline-flex items-center text-text-dim hover:text-primary transition-colors mb-4">
          <ArrowLeft size={18} className="mr-2" />
          Back to projects
        </Link>
        <h1 className="text-3xl font-bold text-text">
          {isNew ? 'New Project' : 'Edit Project'}
        </h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-text mb-4">Content</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Title</label>
                  <input
                    {...form.register('title')}
                    className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-lg text-text focus:outline-none focus:border-primary"
                  />
                  {form.formState.errors.title && (
                    <p className="mt-1 text-sm text-red-500">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Slug</label>
                  <input
                    {...form.register('slug')}
                    placeholder="project-name"
                    className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-lg text-text font-mono text-sm focus:outline-none focus:border-primary"
                  />
                  {form.formState.errors.slug && (
                    <p className="mt-1 text-sm text-red-500">{form.formState.errors.slug.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Summary</label>
                  <textarea
                    {...form.register('summary')}
                    rows={3}
                    className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-lg text-text focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Content (Markdown)</label>
                  <textarea
                    {...form.register('content')}
                    rows={12}
                    className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-lg text-text font-mono text-sm focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-text mb-4">Status</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...form.register('published')} className="w-5 h-5 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-text">Published</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...form.register('featured')} className="w-5 h-5 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-text">Featured</span>
                </label>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-text mb-4">Category</h2>
              <select
                {...form.register('category_id')}
                className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-lg text-text focus:outline-none focus:border-primary"
              >
                <option value="">None</option>
                {categories.data?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-text mb-4">Links</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-dim mb-2">Demo URL</label>
                  <input
                    {...form.register('demo_url')}
                    placeholder="https://"
                    className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-lg text-text text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-dim mb-2">Repo URL</label>
                  <input
                    {...form.register('repo_url')}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-lg text-text text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-text mb-4">Technologies</h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {techs.data?.map((t) => (
                  <label key={t.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={t.id}
                      {...form.register('technologies')}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-text">{t.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving || isDemoMode}
            className="px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-dim disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <Save size={18} className="mr-2" />
            {saving ? 'Saving…' : 'Save Project'}
          </button>
          <Link to="/admin/projects" className="px-6 py-3 border border-border text-text-dim rounded-lg hover:bg-surface-elevated transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

// Fix missing import
import { useState } from 'react'
