import type { ReactNode } from 'react'
import { Loader2, AlertTriangle } from 'lucide-react'

export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-24 text-text-dim" role="status" aria-live="polite">
      <Loader2 className="animate-spin mr-2" size={20} />
      <span className="font-mono text-sm">{label}</span>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <AlertTriangle className="text-accent mb-4" size={32} />
      <p className="text-text mb-2 font-medium">Terjadi kesalahan memuat data</p>
      <p className="text-text-dim text-sm font-mono mb-4 max-w-lg break-words">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 border border-border rounded-lg text-sm hover:border-primary hover:text-primary transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4 border border-dashed border-border rounded-2xl">
      <div className="w-12 h-12 rounded-lg border border-border flex items-center justify-center mb-4">
        <span className="font-mono text-primary text-xl">∅</span>
      </div>
      <p className="text-text font-medium mb-1">{title}</p>
      {hint && <p className="text-text-dim text-sm max-w-md">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
