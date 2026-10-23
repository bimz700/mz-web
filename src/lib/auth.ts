import { supabase } from './supabase'

export type AdminStatus = 'checking' | 'unknown' | 'not-configured' | 'not-authenticated' | 'admin' | 'viewer'

/**
 * Server-authoritative admin check.
 * Reads the role from public.profiles via RLS-protected query — an unauthenticated
 * or non-admin user CANNOT forge this because the policy only returns their own row
 * or rows when is_admin() passes on the server. This is UX gating only;
 * every mutation is ALSO enforced by RLS policies on the database.
 */
export async function fetchAdminStatus(): Promise<AdminStatus> {
  if (!supabase) return 'not-configured'

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !sessionData.session) return 'not-authenticated'

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', sessionData.session.user.id)
    .maybeSingle()

  if (error || !data) return 'viewer'
  return (data as { role: string }).role === 'admin' ? 'admin' : 'viewer'
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut() {
  if (!supabase) return
  await supabase.auth.signOut()
}

export function onAuthChange(callback: () => void) {
  if (!supabase) return () => {}
  const { data } = supabase.auth.onAuthStateChange(() => callback())
  return () => data.subscription.unsubscribe()
}
