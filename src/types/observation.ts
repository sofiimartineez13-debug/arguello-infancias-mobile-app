import type { ObservationCategory } from '@/utils/constants';

/**
 * Novedad del turno (F2). Una vez registrada es inmutable (trazabilidad).
 */
export type Observation = {
  id: string;
  minor_id: string;
  category: ObservationCategory;
  content: string;
  reported_by: string; // user id
  reported_by_name: string;
  observation_date: string; // ISO datetime
  created_at: string; // ISO datetime
};

/** Payload para crear una novedad (fecha/hora y responsable se completan en el sistema). */
export type NewObservation = Pick<Observation, 'minor_id' | 'category' | 'content'>;
