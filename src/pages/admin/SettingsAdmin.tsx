import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Save } from 'lucide-react'
import { useAsync } from '@/hooks/useAsync'
import { getSettings, setSetting, isDemoMode } from '@/lib/data/repo'
import Seo from '@/components/common/Seo'
import { PageLoader, ErrorState } from '@/components/common/States'

const settingsFields = [
  { key: 'site_title', label: 'Site Title', placeholder: 'BIMZ — Digital Lab' },
  { key: 'site_description', label: 'Site Description', placeholder: 'Portfolio & experiment log…', multiline: true },
  { key: 'contact_email', label: 'Contact Email', placeholder: 'hello@bimz.dev' },
  { key: 'location', label: 'Location', placeholder: 'Indonesia' },
  { key: 'social_github', label: 'GitHub URL', placeholder: 'https://github.com/username' },
  { key: 'social_twitter', label: 'Twitter URL', placeholder: 'https://twitter.com/username' },
  { key: 'social_youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/@channel' },
  { key: 'seo_og_image', label: 'OG Image URL', placeholder: 'https://…' },
]

export default function SettingsAdmin() {
  const [saving, setSaving] = useState(false)
  const settings = useAsync(() => getSettings(), [])

  const form = useForm<Record<string, string>>({
    defaultValues: settings.data || {},
  })

  // Update form when settings load
  useState(() => {
    if (settings.data) {
      Object.entries(settings.data).forEach(([key, value]) => {
        form.setValue(key, value)
      })
    }
  })

  const onSubmit = async (data: Record<string, string>) => {
    if (isDemoMode) {
      toast.error('Demo mode: tidak dapat menyimpan')
      return
    }
    setSaving(true)
    try {
      await Promise.all(
        Object.entries(data).map(([key, value]) => setSetting(key, value))
      )
      toast.success('Settings disimpan')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Seo title="Settings" noindex />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">Settings</h1>
        <p className="text-text-dim mt-1">Konfigurasi global website</p>
      </div>

      {isDemoMode && (
        <p className="mb-6 text-sm text-accent font-mono">Demo mode: write operations disabled</p>
      )}

      {settings.loading && <PageLoader />}
      {settings.error && <ErrorState message={settings.error} onRetry={settings.reload} />}

      {!settings.loading && !settings.error && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text mb-6">General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settingsFields.slice(0, 4).map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-text mb-2">{field.label}</label>
                  {field.multiline ? (
                    <textarea
                      {...form.register(field.key)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-lg text-text focus:outline-none focus:border-primary resize-none"
                    />
                  ) : (
                    <input
                      {...form.register(field.key)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-lg text-text focus:outline-none focus:border-primary"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text mb-6">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settingsFields.slice(4, 7).map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-text mb-2">{field.label}</label>
                  <input
                    {...form.register(field.key)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-lg text-text focus:outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text mb-6">SEO</h2>
            <div>
              <label className="block text-sm font-medium text-text mb-2">OG Image URL</label>
              <input
                {...form.register('seo_og_image')}
                placeholder="https://…"
                className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-lg text-text focus:outline-none focus:border-primary"
              />
              <p className="mt-2 text-xs text-text-dim">Gambar yang ditampilkan saat link di-share di social media</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || isDemoMode}
            className="px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-dim disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <Save size={18} className="mr-2" />
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </form>
      )}
    </div>
  )
}

import { useState } from 'react'
