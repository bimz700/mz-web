import { useAsync } from '@/hooks/useAsync'
import { listAllProjects, listContactSubmissions, listCategories, getSettings, isDemoMode } from '@/lib/data/repo'
import Seo from '@/components/common/Seo'
import { PageLoader, ErrorState } from '@/components/common/States'
import { FolderKanban, Mail, Tag, Settings, AlertTriangle } from 'lucide-react'

export default function Dashboard() {
  const projects = useAsync(() => listAllProjects(), [])
  const contacts = useAsync(() => listContactSubmissions(), [])
  const categories = useAsync(() => listCategories(), [])
  const settings = useAsync(() => getSettings(), [])

  const stats = [
    {
      label: 'Projects',
      value: projects.data?.length ?? 0,
      sub: `${projects.data?.filter((p) => p.published).length ?? 0} published`,
      icon: FolderKanban,
    },
    {
      label: 'Messages',
      value: contacts.data?.length ?? 0,
      sub: `${contacts.data?.filter((c) => !c.read).length ?? 0} unread`,
      icon: Mail,
    },
    {
      label: 'Categories',
      value: categories.data?.length ?? 0,
      sub: 'active',
      icon: Tag,
    },
    {
      label: 'Settings',
      value: Object.keys(settings.data || {}).length,
      sub: 'configured',
      icon: Settings,
    },
  ]

  return (
    <div>
      <Seo title="Dashboard" noindex />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">Dashboard</h1>
        <p className="text-text-dim mt-1">Welcome back. Here&apos;s your site overview.</p>
      </div>

      {isDemoMode && (
        <div className="mb-8 p-4 bg-accent/10 border border-accent/30 rounded-lg flex items-start gap-3">
          <AlertTriangle className="text-accent shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-medium text-accent">Demo Mode</p>
            <p className="text-sm text-text-dim mt-1">
              Backend belum dikonfigurasi. Set VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di .env.local,
              lalu jalankan migrasi untuk mengaktifkan penyimpanan data nyata.
            </p>
          </div>
        </div>
      )}

      {projects.loading ? (
        <PageLoader />
      ) : projects.error ? (
        <ErrorState message={projects.error} onRetry={projects.reload} />
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-text-dim">{stat.label}</span>
                  <stat.icon size={20} className="text-text-dimmer" />
                </div>
                <p className="text-3xl font-bold text-text mb-1">{stat.value}</p>
                <p className="text-xs text-text-dimmer">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Recent projects */}
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-text">Recent Projects</h2>
            </div>
            {projects.data && projects.data.length > 0 ? (
              <ul className="divide-y divide-border">
                {projects.data.slice(0, 5).map((p) => (
                  <li key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-elevated transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-text font-medium truncate">{p.title}</p>
                      <p className="text-sm text-text-dim">
                        {p.published ? 'Published' : 'Draft'} · {p.featured ? 'Featured' : 'Regular'}
                      </p>
                    </div>
                    <span className="text-xs text-text-dimmer ml-4">
                      {new Date(p.updated_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-12 text-center text-text-dim">
                <p>No projects yet</p>
                <p className="text-sm mt-1">Create your first project to get started</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
