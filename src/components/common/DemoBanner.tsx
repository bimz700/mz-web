import { AlertTriangle } from 'lucide-react'

/**
 * Honest notice shown whenever the app runs without a configured backend.
 * Demo content is visibly labeled — never presented as persisted data.
 */
export default function DemoBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div className="bg-accent/10 border-y border-accent/30 text-accent">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-xs sm:text-sm font-mono">
        <AlertTriangle size={14} className="shrink-0" />
        {compact ? (
          <span>DEMO MODE — backend belum dikonfigurasi</span>
        ) : (
          <span>
            DEMO MODE: konten contoh dari file lokal, bukan database. Set
            <span className="text-text mx-1">VITE_SUPABASE_URL</span>+
            <span className="text-text mx-1">VITE_SUPABASE_ANON_KEY</span>
            dan jalankan migrasi untuk data nyata. Write operations disabled.
          </span>
        )}
      </div>
    </div>
  )
}
