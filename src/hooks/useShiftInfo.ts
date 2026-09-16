import { useQuery } from '@tanstack/react-query';

import { estadoToStatus } from '@/hooks/useActivities';
import { getSupabase } from '@/lib/supabase';
import type { Shift } from '@/types/shift';
import { turnoDeHoy } from '@/data/turno';
import type { ActivityStatus, ActivityType, ObservationCategory } from '@/utils/constants';

/**
 * F5 — Horario del turno de hoy. Todavía mock: `turnos_personal` está vacía
 * en la DB real (sin datos ni feature que la pueble) — ver PLAN 12.
 */
export function useTurnoHoy() {
  return useQuery<Shift>({
    queryKey: ['turno-hoy'],
    queryFn: () => turnoDeHoy(),
  });
}

export type NovedadReciente = {
  id: string;
  nnya_id: string;
  tipo: ObservationCategory;
  descripcion: string;
  fecha_hora: string;
};

/** F5 — Novedades de todas las NNA en las últimas `horas` (CA-35). */
export function useNovedadesRecientes(horas = 24) {
  return useQuery<NovedadReciente[]>({
    queryKey: ['novedades-recientes', horas],
    queryFn: async () => {
      const desde = new Date(Date.now() - horas * 3600_000).toISOString();
      const { data, error } = await getSupabase()
        .from('novedades')
        .select('id, nnya_id, tipo, descripcion, fecha_hora')
        .gte('fecha_hora', desde)
        .order('fecha_hora', { ascending: false });
      if (error) throw error;
      return (data ?? []) as NovedadReciente[];
    },
  });
}

export type ActividadDeHoy = {
  id: string;
  nnya_id: string;
  tipo: ActivityType;
  status: ActivityStatus;
  observaciones: string | null;
};

/**
 * F5 — Actividades de todas las NNA para hoy (CA-36), incluye realizadas y
 * pendientes para poder diferenciarlas visualmente (CA-38). Cubre lo que
 * WF-11 describe como "tareas pendientes" (medicación, turnos médicos,
 * actividades programadas) — todo vive en la tabla real `actividades`.
 */
export function useActividadesDeHoy() {
  return useQuery<ActividadDeHoy[]>({
    queryKey: ['actividades-hoy'],
    queryFn: async () => {
      const hoy = new Date().toISOString().slice(0, 10);
      const { data, error } = await getSupabase()
        .from('actividades')
        .select('id, nnya_ids, tipo, estado, observaciones')
        .eq('fecha', hoy)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data ?? []).map((row) => ({
        id: row.id as string,
        nnya_id: (row.nnya_ids as string[])[0],
        tipo: row.tipo as ActivityType,
        status: estadoToStatus(row.estado as string),
        observaciones: row.observaciones as string | null,
      }));
    },
  });
}
