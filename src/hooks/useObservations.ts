import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { NewObservation, Observation } from '@/types/observation';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const OBSERVATION_FIELDS = 'id, nnya_id, usuario_id, tipo, descripcion, fecha_hora, created_at, usuarios(nombre, apellido)';

type ObservationRow = {
  id: string;
  nnya_id: string;
  usuario_id: string | null;
  tipo: Observation['tipo'];
  descripcion: string;
  fecha_hora: string;
  created_at: string;
  usuarios: { nombre: string; apellido: string } | null;
};

function toObservation(row: ObservationRow): Observation {
  return {
    id: row.id,
    nnya_id: row.nnya_id,
    usuario_id: row.usuario_id,
    usuario_nombre: row.usuarios ? `${row.usuarios.nombre} ${row.usuarios.apellido}` : null,
    tipo: row.tipo,
    descripcion: row.descripcion,
    fecha_hora: row.fecha_hora,
    created_at: row.created_at,
  };
}

/**
 * F2/F3 — Novedades de un residente, más recientes primero.
 */
export function useObservations(minorId: string | undefined) {
  return useQuery<Observation[]>({
    queryKey: ['observations', minorId],
    enabled: Boolean(minorId),
    queryFn: async () => {
      const { data, error } = await getSupabase()
        .from('novedades')
        .select(OBSERVATION_FIELDS)
        .eq('nnya_id', minorId!)
        .order('fecha_hora', { ascending: false });
      if (error) throw error;
      return ((data ?? []) as unknown as ObservationRow[]).map(toObservation);
    },
  });
}

/** F2 — Crea una novedad. `usuario_id` es siempre el usuario logueado. */
export function useCreateObservation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Observation, Error, NewObservation>({
    mutationFn: async (input) => {
      const { data, error } = await getSupabase()
        .from('novedades')
        .insert({
          nnya_id: input.nnya_id,
          tipo: input.tipo,
          descripcion: input.descripcion,
          usuario_id: user?.id ?? null,
        })
        .select(OBSERVATION_FIELDS)
        .single();
      if (error) throw error;
      return toObservation(data as unknown as ObservationRow);
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['observations', variables.nnya_id] });
    },
  });
}
