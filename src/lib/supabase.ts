import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase. TODAVÍA NO SE USA: el scaffold funciona con datos mock
 * (ver src/data/). Se deja configurado para conectar el backend real al
 * implementar F1–F6. Requiere definir en .env (ver .env.example):
 *   EXPO_PUBLIC_SUPABASE_URL
 *   EXPO_PUBLIC_SUPABASE_ANON_KEY
 */
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase no está configurado. Copiá .env.example a .env y completá las variables EXPO_PUBLIC_SUPABASE_*.',
    );
  }
  client ??= createClient(url!, anonKey!, {
    auth: { persistSession: false, autoRefreshToken: true },
  });
  return client;
}
