import { useQuery } from '@tanstack/react-query';

import type { Observation } from '@/types/observation';
import { novedadesDeResidente } from '@/data/novedades';

const delay = <T>(value: T, ms = 250): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

/**
 * F2/F3 — Novedades de un residente, más recientes primero.
 * Al integrar Supabase: `GET /api/minors/:id/observations`.
 */
export function useObservations(minorId: string | undefined) {
  return useQuery<Observation[]>({
    queryKey: ['observations', minorId],
    enabled: Boolean(minorId),
    queryFn: () => delay(novedadesDeResidente(minorId!)),
  });
}
