import { useAsync } from '@/hooks/useAsync'
import { listSections, upsertSection, isDemoMode } from '@/lib/data/repo'
import Seo from '@/components/common/Seo'
import { PageLoader, ErrorState } from '@/components/common/States'
import { toast } from 'sonner'
import { useState } from 'react'

const editableSections = [
  { key: 'hero', label: 'Hero', description: 'Homepage hero copy' },
  { key: 'about_intro', label: 'About Intro', description: 'Opening paragraph on About page' },
  { key: 'philosophy', label: 'Philosophy', description: 'Development philosophy section' },
  { key: 'current_focus', label: 'Current Focus', description: 'What you\'re working on now' },
  { key: 'footer', label: 'Footer', description: 'Footer tagline' },
]

export default function ContentAdmin() {
  const [editing, setEditing] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const sections = useAsync(() => listSections(), [])

  const handleSave = async (key: string) => {
    if (isDemoMode) {
      toast.error('Demo mode: tidak dapat menyimpan')
      return
    }
    setEditing(null)
    try {
      await upsertSection({ section_key: key, title: key, content: values[key] || '' })
      toast.success('Content disimpan')
      sections.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan')
    }
  }

  const getValue = (key: string) => {
    const existing = sections.data?.find((s) => s.section_key === key)
    return values[key] ?? existing?.content ?? ''
  }

  return (
    <div>
      <Seo title="Content" noindex />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">Content</h1>
        <p className="text-text-dim mt-1">Edit konten statis website</p>
      </div>

      {isDemoMode && (
        <p className="mb-6 text-sm text-accent font-mono">Demo mode: write operations disabled</p>
      )}

      {sections.loading && <PageLoader />}
      {sections.error && <ErrorState message={sections.error} onRetry={sections.reload} />}

      {!sections.loading && !sections.error && (
        <div className="space-y-4">
          {editableSections.map((section) => (
            <div key={section.key} className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-text">{section.label}</h3>
                  <p className="text-sm text-text-dim">{section.description}</p>
                </div>
                {editing === section.key ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(null)}
                      className="px-4 py-2 border border-border text-text-dim rounded-lg hover:bg-surface-elevated transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(section.key)}
                      disabled={isDemoMode}
                      className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary-dim disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditing(section.key)
                      setValues((v) => ({ ...v, [section.key]: getValue(section.key) }))
                    }}
                    className="px-4 py-2 border border-border text-text-dim rounded-lg hover:text-primary hover:border-primary transition-colors text-sm"
                  >
                    Edit
                  </button>
                )}
              </div>
              <div className="p-6">
                {editing === section.key ? (
                  <textarea
                    value={values[section.key] || ''}
                    onChange={(e) => setValues((v) => ({ ...v, [section.key]: e.target.value }))}
                    rows={5}
                    className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-lg text-text focus:outline-none focus:border-primary resize-none"
                  />
                ) : (
                  <p className="text-text-dim text-sm leading-relaxed whitespace-pre-wrap">
                    {getValue(section.key) || <span className="text-text-dimmer italic">No content</span>}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
