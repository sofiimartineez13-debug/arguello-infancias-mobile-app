/** Roles reales de `roles.nombre` con acceso permitido a mobile (decisión #1). */
export type UserRole = 'Admin' | 'Administrador' | 'Equipo Tecnico';

export type User = {
  /** usuarios.id (no el uid de auth.users). */
  id: string;
  auth_user_id: string;
  email: string;
  nombre: string;
  apellido: string;
  role: UserRole;
};
