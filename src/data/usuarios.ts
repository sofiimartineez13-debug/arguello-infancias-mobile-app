import type { User } from '@/types/user';

/**
 * Usuario educador de demostración — usado hoy solo para vincular los mocks
 * de F2/F4/F5 (`data/actividades.ts`, `data/novedades.ts`, `data/turno.ts`,
 * todavía sin conectar). El login real usa `authStore` contra Supabase Auth
 * (ver src/store/authStore.ts); `findMockUser`/`MOCK_CREDENTIALS` se
 * eliminaron acá porque ya nadie los llama.
 */
export const EDUCADOR_MOCK: User = {
  id: 'u-educador-1',
  auth_user_id: 'u-educador-1',
  email: 'usuario@test.com',
  nombre: 'Lucía',
  apellido: 'Fernández',
  role: 'Equipo Tecnico',
};
