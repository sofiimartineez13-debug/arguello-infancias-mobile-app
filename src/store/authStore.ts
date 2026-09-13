import { create } from 'zustand';

import type { User, UserRole } from '@/types/user';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

type LoginResult = { ok: true } | { ok: false; error: string };

const ALLOWED_ROLES: UserRole[] = ['Admin', 'Administrador', 'Equipo Tecnico'];

type AuthState = {
  user: User | null;
  /** false hasta que se resuelve la sesión persistida (evita parpadeo del guard). */
  hydrated: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
};

/**
 * Resuelve el `User` de la app (usuarios + rol real) para un uid de auth.users
 * ya autenticado. Devuelve null si el usuario está inactivo o su rol no tiene
 * acceso a mobile (decisión #1) — nunca deja pasar un rol fuera de
 * ALLOWED_ROLES, para no repetir en mobile el "rol rot" de la web (issue #24
 * del repo web): un login que entra pero no ve nada por RLS.
 */
async function resolveUser(authUserId: string, email: string): Promise<User | null> {
  const { data, error } = await getSupabase()
    .from('usuarios')
    .select('id, nombre, apellido, activo, roles(nombre)')
    .eq('auth_user_id', authUserId)
    .single();

  if (error || !data || !data.activo) return null;

  const rolNombre = (data.roles as unknown as { nombre: string } | null)?.nombre;
  if (!rolNombre || !ALLOWED_ROLES.includes(rolNombre as UserRole)) return null;

  return {
    id: data.id,
    auth_user_id: authUserId,
    email,
    nombre: data.nombre,
    apellido: data.apellido,
    role: rolNombre as UserRole,
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    if (!isSupabaseConfigured) {
      set({ user: null, hydrated: true });
      return;
    }
    const { data } = await getSupabase().auth.getSession();
    const session = data.session;
    if (!session) {
      set({ user: null, hydrated: true });
      return;
    }
    const user = await resolveUser(session.user.id, session.user.email ?? '');
    set({ user, hydrated: true });
  },

  login: async (email, password) => {
    if (!isSupabaseConfigured) {
      return {
        ok: false,
        error: 'Falta configurar Supabase. Copiá .env.example a .env y completá las variables.',
      };
    }
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      return { ok: false, error: 'Credenciales inválidas. Verificá el correo y la contraseña.' };
    }

    const user = await resolveUser(data.session.user.id, data.session.user.email ?? '');
    if (!user) {
      await supabase.auth.signOut();
      return {
        ok: false,
        error: 'Tu usuario no tiene acceso a la app mobile. Contactá a un administrador.',
      };
    }

    set({ user });
    return { ok: true };
  },

  logout: () => {
    if (isSupabaseConfigured) void getSupabase().auth.signOut();
    set({ user: null });
  },
}));

export function currentUser(): User | null {
  return useAuthStore.getState().user;
}
