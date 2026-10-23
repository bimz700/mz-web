import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { supabase } from '@/lib/supabase'
import { fetchAdminStatus, signOut, onAuthChange, type AdminStatus } from '@/lib/auth'
import type { Session } from '@supabase/supabase-js'

interface AuthContextValue {
  session: Session | null
  status: AdminStatus
  loading: boolean
  isAdmin: boolean
  configured: boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<AdminStatus>('checking')
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!supabase) {
      setStatus('not-configured')
      setLoading(false)
      return
    }
    setLoading(true)
    const { data } = await supabase.auth.getSession()
    setSession(data.session)
    setStatus(await fetchAdminStatus())
    setLoading(false)
  }, [])

  useEffect(() => {
    void refresh()
    const unsubscribe = onAuthChange(() => void refresh())
    return unsubscribe
  }, [refresh])

  const logout = useCallback(async () => {
    await signOut()
    setSession(null)
    setStatus('not-authenticated')
  }, [])

  return (
    <AuthContext.Provider
      value={{
        session,
        status,
        loading,
        isAdmin: status === 'admin',
        configured: status !== 'not-configured',
        refresh,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
