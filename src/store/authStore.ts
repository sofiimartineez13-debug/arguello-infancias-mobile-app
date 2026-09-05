import { create } from 'zustand';

import type { User } from '@/types/user';
import { findMockUser } from '@/data/usuarios';
import { cache, STORAGE_KEYS } from '@/lib/storage';

type LoginResult = { ok: true } | { ok: false; error: string };

type AuthState = {
  user: User | null;
  /** false hasta que se lee el estado persistido (evita parpadeo del guard). */
  hydrated: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    const stored = await cache.get<User>(STORAGE_KEYS.authSession);
    set({ user: stored ?? null, hydrated: true });
  },

  login: async (email, password) => {
    // Scaffold: autenticación simulada contra src/data/usuarios.ts.
    // Al integrar Supabase, reemplazar por auth.signInWithPassword.
    await new Promise((r) => setTimeout(r, 350));
    const user = findMockUser(email, password);
    if (!user) {
      return { ok: false, error: 'Credenciales inválidas. Verificá el correo y la contraseña.' };
    }
    set({ user });
    void cache.set(STORAGE_KEYS.authSession, user);
    return { ok: true };
  },

  logout: () => {
    set({ user: null });
    void cache.remove(STORAGE_KEYS.authSession);
  },
}));

export function currentUser(): User | null {
  return useAuthStore.getState().user;
}
