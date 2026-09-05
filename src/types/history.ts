import type { Activity } from '@/types/activity';
import type { CriticalIncident } from '@/types/critical';
import type { Observation } from '@/types/observation';

/**
 * Entrada unificada del historial de seguimiento (F3): novedades, actividades
 * y situaciones críticas de un NNA en una única línea de tiempo.
 */
export type HistoryEntry =
  | { kind: 'novedad'; at: string; data: Observation }
  | { kind: 'actividad'; at: string; data: Activity }
  | { kind: 'critica'; at: string; data: CriticalIncident };
