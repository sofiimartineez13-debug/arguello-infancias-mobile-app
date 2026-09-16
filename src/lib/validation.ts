import { z } from 'zod';

import {
  ACTIVITY_STATUSES,
  ACTIVITY_TYPES,
  CRITICAL_INCIDENT_TYPES,
  OBSERVATION_CATEGORIES,
} from '@/utils/constants';

export const LoginSchema = z.object({
  email: z.string().trim().min(1, 'Ingresá tu correo').pipe(z.email('Correo inválido')),
  password: z.string().min(1, 'Ingresá tu contraseña'),
});
export type LoginInput = z.infer<typeof LoginSchema>;

/** F2 — Registrar novedad (CA-08 a CA-14). Campos alineados a la tabla real `novedades`. */
export const ObservationSchema = z.object({
  nnya_id: z.string().min(1, 'Seleccioná un residente'),
  tipo: z.enum(OBSERVATION_CATEGORIES, { message: 'Elegí un tipo de novedad' }),
  descripcion: z
    .string()
    .trim()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'Máximo 500 caracteres'),
});
export type ObservationInput = z.infer<typeof ObservationSchema>;

/**
 * F4 — Registrar actividad (CA-25 a CA-30). `duration_minutes`/`participants`
 * salen del schema: no existen en la tabla real `actividades` ni los pide WF-10.
 */
export const ActivitySchema = z.object({
  nnya_id: z.string().min(1, 'Seleccioná un residente'),
  tipo: z.enum(ACTIVITY_TYPES, { message: 'Elegí una actividad' }),
  status: z.enum(ACTIVITY_STATUSES, { message: 'Elegí un estado' }),
  observaciones: z.string().trim().max(500, 'Máximo 500 caracteres').optional(),
});
export type ActivityInput = z.infer<typeof ActivitySchema>;

/**
 * F6 — Reportar situación crítica (CA-43 a CA-47). Campos alineados a la
 * tabla real `incidentes` (ver PLAN 08) — sin `people_notified`, no existe
 * esa columna en la DB.
 */
export const CriticalIncidentSchema = z.object({
  nnya_ids: z.array(z.string().min(1)).min(1, 'Seleccioná al menos un residente'),
  tipo: z.enum(CRITICAL_INCIDENT_TYPES, { message: 'Elegí el tipo de situación' }),
  descripcion: z
    .string()
    .trim()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(1000, 'Máximo 1000 caracteres'),
  acciones_tomadas: z.string().trim().max(1000).optional(),
});
export type CriticalIncidentInput = z.infer<typeof CriticalIncidentSchema>;

/** Aplana los errores de Zod a un mapa campo → primer mensaje. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_';
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
