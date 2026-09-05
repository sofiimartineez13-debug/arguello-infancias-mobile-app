import type { Observation } from '@/types/observation';
import type { Task } from '@/types/task';

export type ShiftStatus = 'por_iniciar' | 'activo' | 'finalizado';

/**
 * Turno del educador (F5). Vista consolidada del acompañamiento.
 */
export type Shift = {
  id: string;
  educator_id: string;
  educator_name: string;
  starts_at: string; // ISO datetime
  ends_at: string; // ISO datetime
  status: ShiftStatus;
  assigned_minor_ids: string[];
};

/** Resumen operativo que se muestra en "Mi turno". */
export type ShiftSummary = {
  shift: Shift;
  recent_observations: Observation[]; // últimas 24 h
  pending_tasks: Task[];
  previous_shift_notes?: string;
};
