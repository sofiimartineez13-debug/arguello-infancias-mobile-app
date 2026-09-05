import type { User } from '@/types/user';

/** Usuario educador de demostración (scaffold, sin backend). */
export const EDUCADOR_MOCK: User = {
  id: 'u-educador-1',
  email: 'usuario@test.com',
  full_name: 'Lucía Fernández',
  role: 'educador',
};

type MockCredential = { email: string; password: string; user: User };

export const MOCK_CREDENTIALS: MockCredential[] = [
  { email: 'usuario@test.com', password: 'password123', user: EDUCADOR_MOCK },
];

export function findMockUser(email: string, password: string): User | null {
  const match = MOCK_CREDENTIALS.find(
    (c) => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === password,
  );
  return match?.user ?? null;
}
