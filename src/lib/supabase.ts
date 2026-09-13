import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { secure } from '@/lib/storage';

/**
 * Cliente Supabase. Sesión persistida en SecureStore (vía `secure` de
 * src/lib/storage.ts) — nunca en AsyncStorage plano (regla de AGENTS.md:
 * tokens JWT en SecureStore). Requiere definir en .env (ver .env.example):
 *   EXPO_PUBLIC_SUPABASE_URL
 *   EXPO_PUBLIC_SUPABASE_ANON_KEY
 */
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

/** Adapta `secure` (get/set/remove) a la interfaz de storage que espera supabase-js. */
const authStorage = {
  getItem: (key: string) => secure.get(key),
  setItem: (key: string, value: string) => secure.set(key, value),
  removeItem: (key: string) => secure.remove(key),
};

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase no está configurado. Copiá .env.example a .env y completá las variables EXPO_PUBLIC_SUPABASE_*.',
    );
  }
  client ??= createClient(url!, anonKey!, {
    auth: {
      storage: authStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
  return client;
}
