import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code, Smartphone, Globe, BookOpen, Terminal, Shield } from 'lucide-react'
import Seo from '../components/common/Seo'
import DemoBanner from '../components/common/DemoBanner'
import { PageLoader, ErrorState, EmptyState } from '../components/common/States'
import { useAsync } from '../hooks/useAsync'
import { listSections, listPublishedSkills, isDemoMode } from '../lib/data/repo'

const categoryIcons: Record<string, typeof Code> = {
  Development: Code,
  Android: Smartphone,
  'Android Customization': Smartphone,
  'Tools & DevOps': Terminal,
  Systems: Globe,
  Design: Shield,
  Creative: BookOpen,
}

export default function About() {
  const [showPlaceholders, setShowPlaceholders] = useState(false)

  const sections = useAsync(() => listSections(), [])
  const publishedSkills = useAsync(() => listPublishedSkills(), [])

  const intro = sections.data?.find((s) => s.section_key === 'about_intro')
  const philosophy = sections.data?.find((s) => s.section_key === 'philosophy')

  const iconFor = (category: string) => categoryIcons[category] || Globe

  return (
    <div className="pt-16">
      <Seo
        title="About"
        description="Tentang BIMZ: developer, modder, dan eksperimen digital di bidang Android, web, reverse engineering, dan creative coding."
        canonicalPath="/about"
      />
      {isDemoMode && <DemoBanner />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-mono text-xs text-primary tracking-widest mb-4">about</p>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-6 leading-tight">About <span className="text-primary">BIMZ</span></h1>
          <div className="prose prose-invert max-w-none text-text-dim leading-relaxed">
            {intro?.content || 'Sedang menunggu konten diatur lewat Admin → Content. Konten ini adalah placeholder yang dapat diedit.'}
            {sections.loading && <span className="text-text-dimmer ml-2">memuat…</span>}
          </div>
          <button
            onClick={() => setShowPlaceholders((v) => !v)}
            className="mt-6 inline-flex items-center text-xs font-mono text-text-dim hover:text-primary transition-colors"
          >
            {showPlaceholders ? 'Sembunyikan placeholder' : 'Tampilkan placeholder'} 
            <span className="ml-1" style={{ fontSize: '0.8em', opacity: 0.5 }}>{showPlaceholders ? '▲' : '▼'}</span>
          </button>
        </motion.div>

        {sections.error && <ErrorState message={sections.error} onRetry={sections.reload} />}
        {sections.loading && <PageLoader label="memuat halaman…" />}
        {!sections.loading && !sections.error && sections.data && !intro && (
          <EmptyState title="Belum ada konten About" hint="Tambah section di Admin → Content dengan section_key 'about_intro'." />
        )}

        {/* Philosophy */}
        {!sections.loading && !sections.error && philosophy && (
          <section className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-text mb-6">Filosofi Pengembangan</h2>
              <div className="prose prose-invert max-w-none text-text-dim leading-relaxed">
                {philosophy.content}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-surface border border-border rounded-xl p-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/3 blur-3xl -z-10" />
              <h2 className="text-2xl font-bold text-text mb-6">Tanpa Janji Kosong</h2>
              <p className="text-text-dim mb-6 text-sm leading-relaxed">
                Tidak ada klaim prestasi, sertifikat, atau pengalaman yang dirakit. Setiap konten di sini disunting 
                secara otentik lewat admin dashboard. Jika section kosong, itu maksudnya belum diisi.
              </p>
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-[10px] font-mono text-text-dimmer uppercase tracking-wider">
                  {new Date().toLocaleDateString('id-ID')}
                </p>
              </div>
            </motion.div>
          </section>
        )}

        {/* Interests / skills */}
        {!sections.loading && !sections.error && (
          <section className="mb-16">
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="text-3xl font-bold text-text">Minat & Eksperimen</h2>
              <Link
                to="/skills"
                className="text-sm font-mono text-text-dim hover:text-primary transition-colors"
              >
                Keterampilan →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {showPlaceholders ? (
                <>
                  <div className="p-6 bg-surface border border-border rounded-xl"><p className="text-text">Android Customization</p></div>
                  <div className="p-6 bg-surface border border-border rounded-xl"><p className="text-text">Web Development</p></div>
                  <div className="p-6 bg-surface border border-border rounded-xl"><p className="text-text">Reverse Engineering</p></div>
                </>
              ) : (publishedSkills.data || []).map((s) => (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  className="p-6 bg-surface border border-border rounded-xl group hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-surface-elevated border border-border flex items-center justify-center shrink-0">
                      {(() => { const Icon = iconFor(s.category); return <Icon size={20} className="text-primary" /> })()}
                    </div>
                    <h3 className="font-semibold text-text leading-tight">{s.name}</h3>
                  </div>
                  <p className="text-sm text-text-dim">{s.description || 'Sedang menjelajahi…'}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-primary">{s.level}</span>
                    <span className="text-[10px] font-mono text-text-dimmer uppercase tracking-wide">
                      {s.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}