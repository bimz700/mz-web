/**
 * Environment configuration.
 * Only public (anon) values may be exposed to the client bundle.
 * Never add service-role keys or private credentials here.
 */

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

function isValidUrl(value?: string): value is string {
  if (!value) return false
  try {
    const u = new URL(value)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

export const supabaseUrl = isValidUrl(rawUrl) ? rawUrl : null
export const supabaseAnonKey = rawAnonKey && rawAnonKey.length > 20 ? rawAnonKey : null

/** True only when BOTH public credentials exist. Gates all real backend calls. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
