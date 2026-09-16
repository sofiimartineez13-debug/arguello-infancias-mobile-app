import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { CriticalIncident, NewCriticalIncident } from '@/types/critical';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const INCIDENT_FIELDS =
  'id, nnya_id, tipo, descripcion, fecha_hora, gravedad, reportado_por, acciones_tomadas, estado, created_at, usuarios(nombre, apellido)';

type IncidentRow = {
  id: string;
  nnya_id: string;
  tipo: CriticalIncident['tipo'];
  descripcion: string;
  fecha_hora: string;
  gravedad: CriticalIncident['gravedad'];
  reportado_por: string | null;
  acciones_tomadas: string | null;
  estado: CriticalIncident['estado'];
  created_at: string;
  usuarios: { nombre: string; apellido: string } | null;
};

function toCriticalIncident(row: IncidentRow): CriticalIncident {
  return {
    id: row.id,
    nnya_id: row.nnya_id,
    tipo: row.tipo,
    descripcion: row.descripcion,
    fecha_hora: row.fecha_hora,
    gravedad: row.gravedad,
    reportado_por: row.reportado_por,
    reportado_por_nombre: row.usuarios ? `${row.usuarios.nombre} ${row.usuarios.apellido}` : null,
    acciones_tomadas: row.acciones_tomadas,
    estado: row.estado,
    created_at: row.created_at,
  };
}

/**
 * F6 — Crea un incidente por cada NNA seleccionado en el formulario (la
 * tabla real `incidentes` vincula un solo `nnya_id` por fila — ver PLAN 08).
 * `reportado_por` es siempre el usuario logueado; `gravedad`/`estado` quedan
 * en su default de la DB (`media`/`abierto`), no se piden en el form.
 */
export function useCreateCriticalIncident() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<CriticalIncident[], Error, NewCriticalIncident>({
    mutationFn: async (input) => {
      const rows = input.nnya_ids.map((nnya_id) => ({
        nnya_id,
        tipo: input.tipo,
        descripcion: input.descripcion,
        acciones_tomadas: input.acciones_tomadas || null,
        reportado_por: user?.id ?? null,
      }));

      const { data, error } = await getSupabase()
        .from('incidentes')
        .insert(rows)
        .select(INCIDENT_FIELDS);
      if (error) throw error;
      return ((data ?? []) as unknown as IncidentRow[]).map(toCriticalIncident);
    },
    onSuccess: (_data, variables) => {
      for (const nnyaId of variables.nnya_ids) {
        void queryClient.invalidateQueries({ queryKey: ['critical-incidents', nnyaId] });
      }
    },
  });
}

/**
 * F3/F6 — Incidentes de un NNA, más recientes primero. El historial (#13)
 * los consume directo para armar el timeline con diferenciación visual
 * (CA-50).
 */
export function useCriticalIncidents(nnyaId: string | undefined) {
  return useQuery<CriticalIncident[]>({
    queryKey: ['critical-incidents', nnyaId],
    enabled: Boolean(nnyaId),
    queryFn: async () => {
      const { data, error } = await getSupabase()
        .from('incidentes')
        .select(INCIDENT_FIELDS)
        .eq('nnya_id', nnyaId!)
        .order('fecha_hora', { ascending: false });
      if (error) throw error;
      return ((data ?? []) as unknown as IncidentRow[]).map(toCriticalIncident);
    },
  });
}
