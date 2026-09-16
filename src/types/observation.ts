import type { ObservationCategory } from '@/utils/constants';

/**
 * Novedad del turno (F2) — una fila de la tabla real `novedades`. Una vez
 * registrada es inmutable (trazabilidad).
 */
export type Observation = {
  id: string;
  nnya_id: string;
  usuario_id: string | null;
  usuario_nombre: string | null; // nombre + apellido de usuarios, joineado al leer
  tipo: ObservationCategory;
  descripcion: string;
  fecha_hora: string; // ISO datetime, default now() en la DB
  created_at: string;
};

/** Payload para crear una novedad (fecha/hora y usuario se completan en el sistema). */
export type NewObservation = {
  nnya_id: string;
  tipo: ObservationCategory;
  descripcion: string;
};
