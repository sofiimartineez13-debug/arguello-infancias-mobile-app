import { useQuery } from '@tanstack/react-query';

import type { Activity } from '@/types/activity';
import { actividadesDeResidente } from '@/data/actividades';

const delay = <T>(value: T, ms = 250): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

/**
 * F4 — Actividades de un residente, más recientes primero.
 * Al integrar Supabase: `GET /api/minors/:id/activities`.
 */
export function useActivities(minorId: string | undefined) {
  return useQuery<Activity[]>({
    queryKey: ['activities', minorId],
    enabled: Boolean(minorId),
    queryFn: () => delay(actividadesDeResidente(minorId!)),
  });
}
