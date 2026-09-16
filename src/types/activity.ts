import type { ActivityStatus, ActivityType } from '@/utils/constants';

/**
 * Actividad diaria de un NNA (F4) — una fila de la tabla real `actividades`.
 * `status` es el enum "friendly" (pendiente/realizada/no_realizada) que usa
 * toda la UI; el mapeo al `estado` real de la DB
 * (programada/en_curso/realizada/cancelada) vive solo en
 * `src/hooks/useActivities.ts`, el resto de la app no se entera.
 */
export type Activity = {
  id: string;
  nnya_ids: string[];
  tipo: ActivityType;
  status: ActivityStatus;
  observaciones: string | null;
  fecha: string; // ISO date (YYYY-MM-DD)
  created_by: string | null;
  created_by_nombre: string | null;
  created_at: string;
  updated_at: string;
};

/** Payload para crear una actividad desde el detalle de un NNA puntual. */
export type NewActivity = {
  nnya_id: string;
  tipo: ActivityType;
  status: ActivityStatus;
  observaciones?: string;
};
