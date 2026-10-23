import { useState, useRef } from 'react'
import { Upload, Trash2, Loader2 } from 'lucide-react'
import { useAsync } from '@/hooks/useAsync'
import { listMedia, uploadMedia, deleteMedia, isDemoMode } from '@/lib/data/repo'
import Seo from '@/components/common/Seo'
import { PageLoader, ErrorState, EmptyState } from '@/components/common/States'
import { toast } from 'sonner'

export default function MediaAdmin() {
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const media = useAsync(() => listMedia(), [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (isDemoMode) {
      toast.error('Demo mode: tidak dapat upload')
      return
    }
    setUploading(true)
    try {
      await uploadMedia(file, (p) => toast.loading(`Uploading… ${p}%`, { id: 'upload' }))
      toast.success('Upload berhasil', { id: 'upload' })
      media.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload gagal', { id: 'upload' })
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDelete = async (path: string, name: string) => {
    if (!confirm(`Hapus "${name}"?`)) return
    setDeleting(path)
    try {
      await deleteMedia(path)
      toast.success('File dihapus')
      media.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <Seo title="Media" noindex />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text">Media Library</h1>
          <p className="text-text-dim mt-1">Kelola gambar dan file</p>
        </div>
        <label className={`inline-flex items-center px-4 py-2 bg-primary text-background font-medium rounded-lg cursor-pointer transition-colors ${
          uploading || isDemoMode ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dim'
        }`}>
          {uploading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload size={18} className="mr-2" />
              Upload
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading || isDemoMode}
            className="hidden"
          />
        </label>
      </div>

      {isDemoMode && (
        <p className="mb-6 text-sm text-accent font-mono">Demo mode: upload dinonaktifkan</p>
      )}

      {media.loading && <PageLoader />}
      {media.error && <ErrorState message={media.error} onRetry={media.reload} />}

      {!media.loading && !media.error && (
        <>
          {media.data && media.data.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.data.map((file) => (
                <div key={file.path} className="group relative bg-surface border border-border rounded-xl overflow-hidden">
                  <div className="aspect-square bg-surface-elevated">
                    <img
                      src={file.url}
                      alt={file.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(file.path, file.name)}
                      disabled={deleting === file.path || isDemoMode}
                      className="p-2 bg-accent/20 rounded-lg hover:bg-accent/30 transition-colors text-accent disabled:opacity-50"
                    >
                      {deleting === file.path ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-text-dim truncate">{file.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Belum ada file"
              hint="Upload gambar pertama untuk mulai"
            />
          )}
        </>
      )}
    </div>
  )
}
