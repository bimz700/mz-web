import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'
import { supabaseUrl, supabaseAnonKey, isSupabaseConfigured } from './env'

/**
 * Single shared Supabase client, created ONLY when public credentials exist.
 * When null, all repositories fall back to demo data and every mutating 
 * operation refuses with an explicit error — no silent fakes.
 */
export const supabase = isSupabaseConfigured && supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.'
    )
  }
  return supabase
}
