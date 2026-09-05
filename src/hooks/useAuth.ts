import { useAuthStore } from '@/store/authStore';

/** Acceso a la sesión actual y acciones de login/logout. */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  return {
    user,
    isAuthenticated: user !== null,
    hydrated,
    login,
    logout,
  };
}
