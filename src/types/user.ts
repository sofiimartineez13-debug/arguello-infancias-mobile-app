export type UserRole = 'educador' | 'operador_convivencial' | 'tecnico';

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
};
