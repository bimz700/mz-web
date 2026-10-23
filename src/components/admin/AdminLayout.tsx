import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, FileText, Image, Settings, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Seo from '@/components/common/Seo'
import { isDemoMode } from '@/lib/data/repo'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/content', label: 'Content', icon: FileText },
  { to: '/admin/media', label: 'Media', icon: Image },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout, status } = useAuth()
  const navigate = useNavigate()

  // Redirect if not admin - but AuthProvider handles this
  // This layout is only rendered when user is authenticated

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Admin" noindex />

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface border-b border-border z-40 flex items-center px-4">
        <button onClick={() => setSidebarOpen(true)} className="p-2 text-text-dim hover:text-text">
          <Menu size={24} />
        </button>
        <span className="ml-4 font-mono font-bold text-primary">BIMZ Admin</span>
        {isDemoMode && (
          <span className="ml-2 px-2 py-0.5 text-[10px] font-mono bg-accent/20 text-accent rounded">DEMO</span>
        )}
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-surface border-r border-border z-50 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <span className="font-mono font-bold text-primary text-lg">BIMZ Admin</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-text-dim hover:text-text">
            <X size={20} />
          </button>
        </div>

        {isDemoMode && (
          <div className="px-4 py-3 bg-accent/10 border-b border-accent/30">
            <p className="text-xs font-mono text-accent">DEMO MODE</p>
            <p className="text-[11px] text-text-dim mt-1">Data contoh. Tulis dinonaktifkan.</p>
          </div>
        )}

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-dim hover:text-text hover:bg-surface-elevated'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="mb-4 px-4">
            <p className="text-xs text-text-dimmer">Logged in as</p>
            <p className="text-sm text-text-dim truncate">{status === 'admin' ? 'admin' : 'viewer'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-dim hover:text-accent hover:bg-surface-elevated transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
