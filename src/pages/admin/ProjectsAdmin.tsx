import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import { useAsync } from '@/hooks/useAsync'
import { listAllProjects, deleteProject, isDemoMode } from '@/lib/data/repo'
import Seo from '@/components/common/Seo'
import { PageLoader, ErrorState, EmptyState } from '@/components/common/States'
import { toast } from 'sonner'

export default function ProjectsAdmin() {
  const [deleting, setDeleting] = useState<string | null>(null)
  const projects = useAsync(() => listAllProjects(), [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus project "${title}"? Tindakan ini tidak dapat dibatalkan.`)) return
    setDeleting(id)
    try {
      await deleteProject(id)
      toast.success('Project dihapus')
      projects.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <Seo title="Projects" noindex />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text">Projects</h1>
          <p className="text-text-dim mt-1">Kelola semua project portfolio</p>
        </div>
        <Link
          to="/admin/projects/new"
          className="inline-flex items-center px-4 py-2 bg-primary text-background font-medium rounded-lg hover:bg-primary-dim transition-colors"
        >
          <Plus size={18} className="mr-2" />
          New Project
        </Link>
      </div>

      {isDemoMode && (
        <p className="mb-6 text-sm text-accent font-mono">
          Demo mode: write operations disabled
        </p>
      )}

      {projects.loading && <PageLoader />}
      {projects.error && <ErrorState message={projects.error} onRetry={projects.reload} />}

      {!projects.loading && !projects.error && (
        <>
          {projects.data && projects.data.length > 0 ? (
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-surface-elevated border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-mono font-medium text-text-dimmer uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-mono font-medium text-text-dimmer uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-mono font-medium text-text-dimmer uppercase tracking-wider">
                      Featured
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-mono font-medium text-text-dimmer uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-mono font-medium text-text-dimmer uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {projects.data.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-elevated transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-text font-medium">{p.title}</p>
                        <p className="text-sm text-text-dim">{p.slug}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono ${
                          p.published
                            ? 'bg-primary/10 text-primary'
                            : 'bg-surface-elevated text-text-dim'
                        }`}>
                          {p.published ? <Eye size={12} /> : <EyeOff size={12} />}
                          {p.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {p.featured ? (
                          <Star size={16} className="text-primary fill-primary" />
                        ) : (
                          <span className="text-text-dimmer">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-dim">
                        {new Date(p.updated_at).toLocaleDateString('id-ID', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/projects/${p.id}/edit`}
                            className="p-2 text-text-dim hover:text-primary transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            disabled={deleting === p.id || isDemoMode}
                            className="p-2 text-text-dim hover:text-accent transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="Belum ada project"
              hint="Buat project pertama untuk mulai membangun portfolio"
              action={
                <Link
                  to="/admin/projects/new"
                  className="px-4 py-2 bg-primary text-background font-medium rounded-lg hover:bg-primary-dim transition-colors"
                >
                  Create Project
                </Link>
              }
            />
          )}
        </>
      )}
    </div>
  )
}
