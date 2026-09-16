import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Activity, NewActivity } from '@/types/activity';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { ACTIVITY_TYPE_LABELS, type ActivityStatus } from '@/utils/constants';

// `actividades` tiene dos FK a `usuarios` (responsable_id y created_by) — hay
// que nombrar la relación (`usuarios!created_by`) o PostgREST no puede
// desambiguar el embed.
const ACTIVITY_FIELDS =
  'id, nnya_ids, tipo, estado, observaciones, fecha, created_by, created_at, updated_at, usuarios!created_by(nombre, apellido)';

/**
 * Traducción entre el `status` friendly que usa toda la UI
 * (pendiente/realizada/no_realizada, CA-27/WF-10) y el `estado` real de la
 * tabla `actividades` (programada/en_curso/realizada/cancelada, CHECK de la
 * DB). Solo vive acá — ver PLAN 10.
 */
const STATUS_TO_ESTADO: Record<ActivityStatus, string> = {
  pendiente: 'programada',
  realizada: 'realizada',
  no_realizada: 'cancelada',
};
const ESTADO_TO_STATUS: Record<string, ActivityStatus> = {
  programada: 'pendiente',
  en_curso: 'pendiente', // sin equivalente en el wireframe, se muestra como pendiente
  realizada: 'realizada',
  cancelada: 'no_realizada',
};

/** Traduce el `estado` real de la DB al `status` friendly. Reusado por F5 (Mi turno). */
export function estadoToStatus(estado: string): ActivityStatus {
  return ESTADO_TO_STATUS[estado] ?? 'pendiente';
}

type ActivityRow = {
  id: string;
  nnya_ids: string[];
  tipo: Activity['tipo'];
  estado: string;
  observaciones: string | null;
  fecha: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  usuarios: { nombre: string; apellido: string } | null;
};

function toActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    nnya_ids: row.nnya_ids,
    tipo: row.tipo,
    status: estadoToStatus(row.estado),
    observaciones: row.observaciones,
    fecha: row.fecha,
    created_by: row.created_by,
    created_by_nombre: row.usuarios ? `${row.usuarios.nombre} ${row.usuarios.apellido}` : null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * F4 — Actividades de un residente, más recientes primero. Filtra por
 * `nnya_ids @> [minorId]` (array de PostgreSQL) ya que una actividad puede
 * involucrar más de un NNA.
 */
export function useActivities(minorId: string | undefined) {
  return useQuery<Activity[]>({
    queryKey: ['activities', minorId],
    enabled: Boolean(minorId),
    queryFn: async () => {
      const { data, error } = await getSupabase()
        .from('actividades')
        .select(ACTIVITY_FIELDS)
        .contains('nnya_ids', [minorId!])
        .order('created_at', { ascending: false });
      if (error) throw error;
      return ((data ?? []) as unknown as ActivityRow[]).map(toActivity);
    },
  });
}

/**
 * F4 — Crea una actividad. `fecha` y `titulo` son NOT NULL en la DB pero
 * WF-10 no los pide: se completan solos (fecha = hoy, título = la etiqueta
 * del tipo elegido).
 */
export function useCreateActivity() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Activity, Error, NewActivity>({
    mutationFn: async (input) => {
      const { data, error } = await getSupabase()
        .from('actividades')
        .insert({
          titulo: ACTIVITY_TYPE_LABELS[input.tipo],
          tipo: input.tipo,
          fecha: new Date().toISOString().slice(0, 10),
          estado: STATUS_TO_ESTADO[input.status],
          observaciones: input.observaciones || null,
          nnya_ids: [input.nnya_id],
          created_by: user?.id ?? null,
        })
        .select(ACTIVITY_FIELDS)
        .single();
      if (error) throw error;
      return toActivity(data as unknown as ActivityRow);
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['activities', variables.nnya_id] });
    },
  });
}
