import { useQuery } from '@tanstack/react-query';

import type { Resident } from '@/types/resident';
import { residentePorId, residentesAsignados } from '@/data/residentes';
import { useAuth } from '@/hooks/useAuth';

const delay = <T>(value: T, ms = 250): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

/**
 * F1 — Listado de residentes asignados al educador autenticado (RBAC).
 * Hoy resuelve contra src/data/residentes.ts; al integrar Supabase, cambiar
 * `queryFn` por `GET /api/minors?filter=assigned_to_me`.
 */
export function useResidents() {
  const { user } = useAuth();
  return useQuery<Resident[]>({
    queryKey: ['residents', user?.id],
    enabled: Boolean(user),
    queryFn: () => delay(residentesAsignados(user!.id)),
  });
}

/** F1 — Detalle de un residente. */
export function useResident(id: string | undefined) {
  const { user } = useAuth();
  return useQuery<Resident | null>({
    queryKey: ['resident', id],
    enabled: Boolean(id && user),
    queryFn: () => {
      const resident = residentePorId(id!);
      // RBAC: no exponer NNA de otro educador.
      if (!resident || resident.primary_caregiver_id !== user!.id) return delay(null);
      return delay(resident);
    },
  });
}
