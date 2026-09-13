/**
 * Enumeraciones y catálogos compartidos por tipos, schemas Zod y UI.
 * Fuente: docs/02-especificaciones/03-ARGUELLO-MOBILE-FEATURES.md
 */

export const OBSERVATION_CATEGORIES = [
  'conducta',
  'emocional',
  'educativo',
  'sanitario',
  'otro',
] as const;
export type ObservationCategory = (typeof OBSERVATION_CATEGORIES)[number];

export const OBSERVATION_CATEGORY_LABELS: Record<ObservationCategory, string> = {
  conducta: 'Conducta',
  emocional: 'Emocional',
  educativo: 'Educativo',
  sanitario: 'Sanitario',
  otro: 'Otro',
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

export const TASK_TYPES = ['medicacion', 'turno_medico', 'actividad_programada', 'otra'] as const;
export type TaskType = (typeof TASK_TYPES)[number];

export const TASK_STATUSES = ['pendiente', 'completada'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

/** Historial (F3): tipos de registro que se muestran en una línea de tiempo unificada. */
export const HISTORY_ENTRY_KINDS = ['novedad', 'actividad', 'critica'] as const;
export type HistoryEntryKind = (typeof HISTORY_ENTRY_KINDS)[number];
