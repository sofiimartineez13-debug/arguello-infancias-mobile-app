/**
 * Enumeraciones y catálogos compartidos por tipos, schemas Zod y UI.
 * Fuente: docs/02-especificaciones/03-ARGUELLO-MOBILE-FEATURES.md
 */

/** Valores reales del CHECK de `novedades.tipo` (verificado contra la DB, no el wireframe). */
export const OBSERVATION_CATEGORIES = [
  'Salud',
  'Educación',
  'Comportamiento',
  'Alimentación',
  'Visita Familiar',
  'Otro',
] as const;
export type ObservationCategory = (typeof OBSERVATION_CATEGORIES)[number];

export const OBSERVATION_CATEGORY_LABELS: Record<ObservationCategory, string> = {
  Salud: 'Salud',
  Educación: 'Educación',
  Comportamiento: 'Comportamiento',
  Alimentación: 'Alimentación',
  'Visita Familiar': 'Visita Familiar',
  Otro: 'Otro',
};

export const ACTIVITY_TYPES = [
  'escuela',
  'recreativa',
  'deportiva',
  'comida',
  'pedagogica',
  'medico',
  'otra',
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  escuela: 'Asistencia escolar',
  recreativa: 'Actividad recreativa',
  deportiva: 'Actividad deportiva',
  comida: 'Comida',
  pedagogica: 'Actividad pedagógica',
  medico: 'Turno médico',
  otra: 'Otra',
};

export const ACTIVITY_STATUSES = ['pendiente', 'realizada', 'no_realizada'] as const;
export type ActivityStatus = (typeof ACTIVITY_STATUSES)[number];

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  pendiente: 'Pendiente',
  realizada: 'Realizada',
  no_realizada: 'No realizada',
};

export const CRITICAL_INCIDENT_TYPES = [
  'violencia',
  'crisis_emocional',
  'accidente',
  'fuga',
  'emergencia_sanitaria',
  'otra',
] as const;
export type CriticalIncidentType = (typeof CRITICAL_INCIDENT_TYPES)[number];

export const CRITICAL_INCIDENT_TYPE_LABELS: Record<CriticalIncidentType, string> = {
  violencia: 'Violencia',
  crisis_emocional: 'Crisis emocional',
  accidente: 'Accidente',
  fuga: 'Fuga',
  emergencia_sanitaria: 'Emergencia sanitaria',
  otra: 'Otra',
};

/** Valores reales de `nnya.estado_actual` (CHECK constraint del schema). */
export const RESIDENT_STATUSES = [
  'En residencia',
  'En proceso de egreso',
  'Egresado',
  'Fallecido',
] as const;
export type ResidentStatus = (typeof RESIDENT_STATUSES)[number];

/** Historial (F3): tipos de registro que se muestran en una línea de tiempo unificada. */
export const HISTORY_ENTRY_KINDS = ['novedad', 'actividad', 'critica'] as const;
export type HistoryEntryKind = (typeof HISTORY_ENTRY_KINDS)[number];

/**
 * Algunos catálogos de `tipo` no tienen CHECK en la DB real y traen valores
 * libres cargados desde la web que no están en las listas fijas de arriba
 * (ej. "educativa"/"terapeutica" en actividades, "salud"/"conductual" en
 * incidentes). Si no hay label, se muestra el valor crudo en vez de una
 * etiqueta vacía.
 */
export function labelOrRaw(labels: Record<string, string>, value: string): string {
  return labels[value] ?? value;
}
