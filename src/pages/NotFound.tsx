import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import Seo from '../components/common/Seo'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Seo title="404 — Not Found" noindex />
      <div className="text-center max-w-md">
        <div className="mb-8">
          <span className="font-mono text-[120px] md:text-[160px] font-bold text-surface-elevated leading-none">
            404
          </span>
        </div>
        <h1 className="text-2xl font-bold text-text mb-4">Page not found</h1>
        <p className="text-text-dim mb-8">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-background font-medium rounded-sm hover:bg-primary-dim transition-colors"
          >
            <Home size={18} className="mr-2" />
            Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-border text-text-dim font-medium rounded-sm hover:bg-surface-elevated transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </button>
        </div>
      </div>
    </div>
  )
}
