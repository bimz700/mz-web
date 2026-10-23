import { useState, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Search, ExternalLink, Github, ArrowUpRight } from 'lucide-react'
import Seo from '../components/common/Seo'
import DemoBanner from '../components/common/DemoBanner'
import { PageLoader, ErrorState, EmptyState } from '../components/common/States'
import { useAsync } from '../hooks/useAsync'
import { listPublishedProjects, listCategories, listTechnologies, isDemoMode } from '../lib/data/repo'

type SortKey = 'featured' | 'newest' | 'title'

export default function Projects() {
  const reduce = useReducedMotion()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [tech, setTech] = useState<string>('all')
  const [sort, setSort] = useState<SortKey>('featured')

  const projects = useAsync(() => listPublishedProjects(), [])
  const categories = useAsync(() => listCategories(), [])
  const technologies = useAsync(() => listTechnologies(), [])

  const filtered = useMemo(() => {
    let list = projects.data || []
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.name.toLowerCase().includes(q))
      )
    }
    if (category !== 'all') list = list.filter((p) => p.category_id === category)
    if (tech !== 'all') list = list.filter((p) => p.technologies.some((t) => t.id === tech))

    switch (sort) {
      case 'newest':
        return [...list].sort((a, b) => (b.published_at || b.created_at).localeCompare(a.published_at || a.created_at))
      case 'title':
        return [...list].sort((a, b) => a.title.localeCompare(b.title))
      case 'featured':
      default:
        return list
    }
  }, [projects.data, query, category, tech, sort])

  return (
    <div className="pt-16 min-h-screen">
      <Seo
        title="Projects"
        description="Project directory: tools, Android mods, web apps and technical experiments by BIMZ."
        canonicalPath="/projects"
      />
      {isDemoMode && <DemoBanner />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Editorial header */}
        <header className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="font-mono text-xs text-primary tracking-widest mb-3">// DIRECTORY</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Projects<span className="text-primary">.</span>
            </h1>
          </div>
          <p className="text-text-dim max-w-xs text-sm leading-relaxed font-mono">
            {projects.data ? `${filtered.length} of ${projects.data.length} builds shown. Everything here lives in the database — editable via /admin.` : 'loading directory…'}
          </p>
        </header>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-12">
          <div className="md:col-span-4 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dimmer" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="grep projects…"
              aria-label="Search projects"
              className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-sm text-sm text-text placeholder:text-text-dimmer focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
            className="md:col-span-2 px-4 py-3 bg-surface border border-border rounded-sm text-sm text-text focus:outline-none focus:border-primary"
          >
            <option value="all">All categories</option>
            {(categories.data || []).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            aria-label="Filter by technology"
            className="md:col-span-3 px-4 py-3 bg-surface border border-border rounded-sm text-sm text-text focus:outline-none focus:border-primary"
          >
            <option value="all">All technologies</option>
            {(technologies.data || []).map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <div className="md:col-span-3 flex border border-border rounded-sm overflow-hidden">
            {(['featured', 'newest', 'title'] as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                aria-pressed={sort === key}
                className={`flex-1 text-xs font-mono uppercase tracking-wide transition-colors ${
                  sort === key ? 'bg-primary text-background' : 'text-text-dim hover:bg-surface-elevated'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {projects.loading && <PageLoader label="querying database…" />}
        {projects.error && <ErrorState message={projects.error} onRetry={projects.reload} />}

        {!projects.loading && !projects.error && filtered.length === 0 && (
          <EmptyState
            title="No projects match the filter"
            hint={query || category !== 'all' || tech !== 'all'
              ? 'Try widening your query, or create a project in the admin CMS.'
              : 'Database is empty. Create your first project in /admin.'}
            action={
              (query || category !== 'all' || tech !== 'all') ? (
                <button
                  onClick={() => { setQuery(''); setCategory('all'); setTech('all') }}
                  className="px-4 py-2 text-sm font-mono border border-border rounded-sm hover:border-primary hover:text-primary transition-colors"
                >
                  clear filters
                </button>
              ) : undefined
            }
          />
        )}

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none">
          {filtered.map((p, i) => (
            <motion.li
              key={p.id}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
            >
              <article className="group relative h-full bg-surface border border-border rounded-sm hover:border-primary/50 transition-all hover:-translate-y-0.5">
                {/* thumbnail zone: stable 16:9 to avoid CLS */}
                <div className="aspect-video bg-surface-elevated relative overflow-hidden rounded-t-sm">
                  {p.images[0]?.url ? (
                    <img
                      src={p.images[0].url}
                      alt={p.images[0].caption || `${p.title} cover`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  ) : (
                    <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-2 opacity-30 group-hover:opacity-60 transition-opacity">
                        {Array.from({ length: 9 }).map((_, k) => (
                          <span
                            key={k}
                            className="w-6 h-6 border border-primary/60"
                            style={{ transitionDelay: `${k * 30}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {p.featured && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-accent text-background text-[10px] font-mono uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                  <ArrowUpRight size={18} className="absolute top-3 right-3 text-text opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                </div>

                <div className="p-6">
                  <p className="font-mono text-[11px] text-text-dimmer mb-2 uppercase tracking-widest">
                    {p.category?.name || 'uncategorized'}
                  </p>
                  <h2 className="text-xl font-bold text-text group-hover:text-primary transition-colors mb-2">
                    {p.title}
                  </h2>
                  <p className="text-sm text-text-dim leading-relaxed mb-4 line-clamp-2">{p.summary}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {p.technologies.slice(0, 4).map((t) => (
                        <span key={t.id} className="text-[11px] font-mono px-2 py-0.5 border border-border rounded-full text-text-dim">
                          {t.name}
                        </span>
                      ))}
                    </div>
                    <span className="ml-auto flex gap-3 text-text-dimmer">
                      {p.demo_url && (
                        <span
                          role="link"
                          tabIndex={-1}
                          onClick={(e) => { e.preventDefault(); window.open(p.demo_url!, '_blank', 'noopener') }}
                          className="hover:text-primary transition-colors"
                          title="Open live demo"
                        >
                          <ExternalLink size={14} />
                        </span>
                      )}
                      {p.repo_url && (
                        <span
                          role="link"
                          tabIndex={-1}
                          onClick={(e) => { e.preventDefault(); window.open(p.repo_url!, '_blank', 'noopener') }}
                          className="hover:text-primary transition-colors"
                          title="Open repository"
                        >
                          <Github size={14} />
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  )
}
