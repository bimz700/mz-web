import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Code } from 'lucide-react'
import Seo from '../components/common/Seo'
import DemoBanner from '../components/common/DemoBanner'
import { useAsync } from '../hooks/useAsync'
import { listPublishedProjects, listSections, listPublishedExperiments, isDemoMode } from '../lib/data/repo'
import { motionStagger, fadeUp } from '../lib/motion'

export default function Home() {
  const reduceMotion = useReducedMotion()
  const projects = useAsync(() => listPublishedProjects(), [])
  const sections = useAsync(() => listSections(), [])
  const experiments = useAsync(() => listPublishedExperiments(), [])

  const hero = sections.data?.find((s) => s.section_key === 'hero')
  const focus = sections.data?.find((s) => s.section_key === 'current_focus')
  const featured = (projects.data || []).filter((p) => p.featured).slice(0, 3)
  const recent = [...(projects.data || [])]
    .sort((a, b) => (b.published_at || '').localeCompare(a.published_at || ''))
    .slice(0, 5)

  return (
    <div className="pt-16">
      <Seo
        title="BIMZ — Digital Lab"
        description="Portfolio & experiment log: coding, Android modding, reverse engineering, web development."
        canonicalPath="/"
      />
      {isDemoMode && <DemoBanner />}

      {/* ===== HERO ===== */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={motionStagger} className="lg:col-span-7">
            <motion.div variants={fadeUp}>
              <p className="font-mono text-sm text-primary mb-6 tracking-widest flex items-center gap-2">
                <Code size={14} /> [ SYSTEM: BIMZ v1.0 ]
              </p>
            </motion.div>

            {/* Wordmark — custom, editorial */}
            <motion.div variants={fadeUp}>
              <h1 aria-label="BIMZ" className="select-none leading-none mb-2">
                <span className="block font-mono font-bold tracking-tighter text-[clamp(4.5rem,14vw,11rem)] text-text">
                  BIM
                  <span className="text-primary relative">
                    Z
                    <span className="absolute -right-2 sm:-right-4 top-0 text-accent text-[0.2em] font-normal">
                      ●rec
                    </span>
                  </span>
                </span>
              </h1>
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="text-lg sm:text-xl md:text-2xl text-text-dim max-w-xl mb-10 leading-relaxed border-l-2 border-primary/50 pl-5 mt-6">
                {hero?.content || 'Developer, modder, experimenter.'}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link
                to="/projects"
                className="group inline-flex items-center px-7 py-3.5 bg-primary text-background font-semibold font-mono text-sm hover:bg-white transition-colors"
              >
                open --projects
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/lab"
                className="inline-flex items-center px-7 py-3.5 border border-border font-mono text-sm text-text-dim hover:border-accent hover:text-accent transition-colors"
              >
                run --lab
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: live system readout panel */}
          <motion.div variants={fadeUp} className="lg:col-span-5">
            <SystemPanel
              focus={focus?.content || ''}
              projectCount={projects.data?.length ?? null}
              expCount={experiments.data?.length ?? null}
              loading={projects.loading || experiments.loading || sections.loading}
            />
          </motion.div>
        </div>

        {/* Background grid — editorial, restrained */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(#00ff9f 1px, transparent 1px), linear-gradient(90deg, #00ff9f 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </section>

      {/* ===== FEATURED ===== */}
      <section className="border-t border-border py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader index="01" title="Featured Builds" linkTo="/projects" linkLabel="all projects" />

          {projects.loading && <p className="font-mono text-text-dim text-sm animate-pulse py-12">fetching projects…</p>}
          {projects.error && <p className="font-mono text-accent text-sm py-12">error: {projects.error}</p>}

          {!projects.loading && featured.length === 0 && (
            <p className="font-mono text-text-dimmer text-sm py-12">
              // no featured projects yet — publish &amp; flag some in /admin
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
            {featured.map((p, i) => (
              <motion.article
                key={p.id}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group bg-background hover:bg-surface transition-colors p-8 flex flex-col"
              >
                <p className="font-mono text-xs text-text-dimmer mb-4">
                  [{String(i + 1).padStart(2, '0')}] {p.category?.name?.toUpperCase() || 'MISC'}
                </p>
                <h3 className="text-2xl font-bold text-text mb-3 group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                <p className="text-text-dim text-sm leading-relaxed flex-1">{p.summary}</p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {p.technologies.slice(0, 4).map((t) => (
                    <span key={t.id} className="px-2 py-1 text-[11px] font-mono border border-border rounded-sm text-text-dim">
                      {t.name}
                    </span>
                  ))}
                </div>
                <Link to={`/projects/${p.slug}`} className="mt-6 inline-flex items-center text-sm font-mono text-primary">
                  cat /{p.slug} <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                {/* Full-card link overlay */}
                <span className="sr-only">{p.title}</span>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CURRENT FOCUS + EXPERIMENTS ===== */}
      <section className="border-t border-border py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <SectionHeader index="02" title="Current Experiments" linkTo="/lab" linkLabel="enter lab" />
            <ul className="space-y-1">
              {(experiments.data || []).slice(0, 4).map((exp) => (
                <li key={exp.id} className="group flex items-baseline justify-between border-b border-border-subtle py-4">
                  <span className="font-mono text-sm text-text group-hover:text-primary transition-colors">
                    {exp.title}
                  </span>
                  <span className="text-xs text-text-dimmer font-mono">
                    {exp.featured ? '★ active' : 'running'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeader index="03" title="Latest Activity" linkTo="/projects" linkLabel="history" />
            <ul className="space-y-1">
              {recent.map((p) => (
                <li key={p.id} className="group flex items-baseline justify-between border-b border-border-subtle py-4">
                  <Link to={`/projects/${p.slug}`} className="text-sm text-text group-hover:text-primary transition-colors truncate pr-4">
                    {p.title}
                  </Link>
                  <span className="text-xs text-text-dimmer font-mono whitespace-nowrap">
                    {p.published_at ? new Date(p.published_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : '—'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== CONTACT CTA ===== */}
      <section className="border-t border-border py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <h2 className="text-4xl md:text-6xl font-bold text-text leading-tight max-w-2xl">
            Punya ide gila?<br />
            <span className="text-text-dimmer">Let&apos;s break something</span>{' '}
            <span className="text-primary">together.</span>
          </h2>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 border-2 border-primary text-primary font-mono text-sm hover:bg-primary hover:text-background transition-colors shrink-0"
          >
            init --contact
          </Link>
        </div>
      </section>
    </div>
  )
}

/* Live, useful system readout — real counts from the data layer. */
function SystemPanel({ focus, projectCount, expCount, loading }: {
  focus: string; projectCount: number | null; expCount: number | null; loading: boolean
}) {
  const [clock, setClock] = useState(() => new Date())
  useState(() => {
    const id = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(id)
  })

  return (
    <div className="bg-surface border border-border rounded-sm overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-elevated">
        <span className="font-mono text-xs text-text-dim">bimz@lab — system status</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
          <span className="font-mono text-[10px] text-primary">LIVE</span>
        </span>
      </div>
      <div className="p-5 font-mono text-sm space-y-3">
        <Row label="status" value={loading ? 'syncing…' : 'online'} accent />
        <Row label="projects" value={loading ? '…' : `${projectCount ?? 0} published`} />
        <Row label="experiments" value={loading ? '…' : `${expCount ?? 0} running`} />
        <div className="pt-2 border-t border-border-subtle">
          <p className="text-[11px] text-text-dimmer uppercase tracking-widest mb-2">current focus</p>
          <p className="text-text-dim leading-relaxed">{focus || 'Android customization • Web • RE'}</p>
        </div>
        <div className="pt-2 border-t border-border-subtle flex justify-between text-[11px] text-text-dimmer">
          <span>Asia/Jakarta</span>
          <span>{clock.toLocaleTimeString('id-ID', { hour12: false })}</span>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-text-dimmer">{label}</span>
      <span className={accent ? 'text-primary' : 'text-text'}>{value}</span>
    </div>
  )
}

function SectionHeader({ index, title, linkTo, linkLabel }: {
  index: string; title: string; linkTo: string; linkLabel: string
}) {
  return (
    <div className="flex items-baseline justify-between mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-text">
        <span className="font-mono text-primary text-sm mr-3">{index}/</span>
        {title}
      </h2>
      <Link to={linkTo} className="text-sm font-mono text-text-dim hover:text-primary transition-colors">
        → {linkLabel}
      </Link>
    </div>
  )
}
