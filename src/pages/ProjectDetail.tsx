import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from 'lucide-react'
import Seo from '../components/common/Seo'
import DemoBanner from '../components/common/DemoBanner'
import { PageLoader, ErrorState, EmptyState } from '../components/common/States'
import { useAsync } from '../hooks/useAsync'
import { getPublishedProjectBySlug, listPublishedProjects, isDemoMode } from '../lib/data/repo'

export default function ProjectDetail() {
  const { slug } = useParams()

  const project = useAsync(() => (slug ? getPublishedProjectBySlug(slug) : Promise.resolve(null)), [slug])
  const others = useAsync(() => listPublishedProjects(), [])

  const related = (others.data || []).filter((p) => p.slug !== slug).slice(0, 3)

  if (project.loading) return <PageLoader label="memuat project…" />
  if (project.error) return <ErrorState message={project.error} onRetry={project.reload} />
  if (!project.data) return <EmptyState title="Project tidak ditemukan" hint="Slug mungkin belum diterbitkan atau sudah dihapus." />

  const p = project.data

  return (
    <div className="pt-16 min-h-screen">
      <Seo
        title={p.title}
        description={p.summary}
        canonicalPath={`/projects/${p.slug}`}
        noindex={!p.published}
      />
      {isDemoMode && <DemoBanner />}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="mb-10">
          <Link
            to="/projects"
            className="inline-flex items-center text-text-dim hover:text-primary transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            Kembali ke direktori
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-14">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="px-3 py-1 text-[11px] font-mono bg-primary/10 text-primary rounded-full">
              {p.category?.name || 'Misc'}
            </span>
            {p.featured && (
              <span className="px-3 py-1 text-[11px] font-mono bg-accent/10 text-accent rounded-full">Featured</span>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text mb-6 leading-tight">{p.title}</h1>
          <p className="text-lg text-text-dim leading-relaxed">{p.summary}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            {p.demo_url && (
              <a
                href={p.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-7 py-3 bg-primary text-background font-mono text-sm font-semibold rounded-sm hover:bg-primary-dim transition-colors"
              >
                Live Demo <ExternalLink size={16} className="ml-2" />
              </a>
            )}
            {p.repo_url && (
              <a
                href={p.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-7 py-3 border border-border font-mono text-sm text-text-dim hover:border-accent hover:text-accent transition-colors"
              >
                Source <Github size={16} className="ml-2" />
              </a>
            )}
          </div>
          <div className="mt-8 flex items-center gap-3 text-[11px] font-mono text-text-dimmer">
            <Calendar size={16} className="opacity-50" />
            <time dateTime={p.published_at ?? p.created_at}>
              {p.published_at ? new Date(p.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Draft'}
            </time>
          </div>
        </motion.div>

        {/* Content body */}
        <div className="relative">
          <div className="prose prose-invert prose-lg max-w-none text-text-dim leading-relaxed [p]:mb-6 [h2]:text-2xl [h2]:font-bold [h2]:text-text [h2]:mt-10 [h2]:mb-4 [ul]:list-disc [ul]:list-inside [ul]:mb-6 [ul]:space-y-2 [li]:text-text-dim">
            {p.content.split('\n\n').filter(Boolean).map((block, i) => {
              if (block.startsWith('## ')) return <h2 key={i}>{block.replace('## ', '')}</h2>
              if (block.startsWith('- ')) return (
                <ul key={i}>{block.split('\n').filter(Boolean).map((line, j) => (
                  <li key={j}>{line}</li>
                ))}</ul>
              )
              return <p key={i}>{block}</p>
            })}
          </div>

          <div className="mt-16 pt-8 border-t border-border bg-surface border-x border-l border-r rounded-b-xl">
            <div className="flex items-center gap-4 mb-6 text-[11px] font-mono text-text-dimmer uppercase tracking-wide">
              <Tag size={16} className="opacity-50" />
              <span>Teknologi</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {p.technologies.map((t) => (
                <span key={t.id} className="text-xs font-mono px-3 py-1.5 bg-surface-elevated border border-border rounded-full text-text-dim">
                  {t.name}
                </span>
              ))}
            </div>
            {p.images.length && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {p.images.map((img) => (
                  <figure key={img.id} className="relative rounded-sm overflow-hidden bg-surface-elevated border border-border">
                    <img src={img.url} alt={img.caption || ''} loading="lazy" className="w-full h-48 object-cover" />
                    {img.caption && (
                      <figcaption className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 text-[10px] font-mono text-text-dim">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="mt-20 pt-12 border-t border-border">
            <div className="mb-6 font-mono text-[11px] text-primary tracking-widest uppercase">Terkait</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rp) => (
                <div key={rp.id} className="flex flex-col h-full bg-surface border border-border rounded-sm p-6 hover:border-primary/50 transition-colors">
                  <span className="font-mono text-[10px] text-text-dimmer mb-3 uppercase tracking-wide">{rp.category?.name || 'Misc'}</span>
                  <Link to={`/projects/${rp.slug}`} className="text-lg font-bold text-text group-hover:text-primary transition-colors mb-2">
                    {rp.title}
                  </Link>
                  <p className="text-sm text-text-dim leading-relaxed flex-1">{rp.summary}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}