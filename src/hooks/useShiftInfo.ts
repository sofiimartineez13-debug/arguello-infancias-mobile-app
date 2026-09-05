import { useQuery } from '@tanstack/react-query';

import type { ShiftSummary } from '@/types/shift';
import { shiftSummaryMock } from '@/data/turno';
import { useAuth } from '@/hooks/useAuth';

const delay = <T>(value: T, ms = 250): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

/**
 * F5 — Resumen consolidado del turno del educador.
 * Al integrar Supabase: combinar `GET /api/shifts/current` + novedades 24 h + tareas.
 */
export function useShiftInfo() {
  const { user } = useAuth();
  return useQuery<ShiftSummary>({
    queryKey: ['shift-summary', user?.id],
    enabled: Boolean(user),
    queryFn: () => delay(shiftSummaryMock()),
  });
}
