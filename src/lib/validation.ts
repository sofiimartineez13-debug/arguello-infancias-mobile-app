import { z } from 'zod';

import {
  ACTIVITY_STATUSES,
  ACTIVITY_TYPES,
  CRITICAL_INCIDENT_TYPES,
  OBSERVATION_CATEGORIES,
  TASK_STATUSES,
} from '@/utils/constants';

export const LoginSchema = z.object({
  email: z.string().trim().min(1, 'Ingresá tu correo').pipe(z.email('Correo inválido')),
  password: z.string().min(1, 'Ingresá tu contraseña'),
});
export type LoginInput = z.infer<typeof LoginSchema>;

/** F2 — Registrar novedad (CA-08 a CA-14). */
export const ObservationSchema = z.object({
  minor_id: z.string().min(1, 'Seleccioná un residente'),
  category: z.enum(OBSERVATION_CATEGORIES, { message: 'Elegí un tipo de novedad' }),
  content: z
    .string()
    .trim()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'Máximo 500 caracteres'),
});
export type ObservationInput = z.infer<typeof ObservationSchema>;

/** F4 — Registrar actividad (CA-25 a CA-30). */
export const ActivitySchema = z.object({
  minor_id: z.string().min(1, 'Seleccioná un residente'),
  activity_type: z.enum(ACTIVITY_TYPES, { message: 'Elegí una actividad' }),
  status: z.enum(ACTIVITY_STATUSES, { message: 'Elegí un estado' }),
  observations: z.string().trim().max(500, 'Máximo 500 caracteres').optional(),
  duration_minutes: z.coerce.number().int().positive().max(1440).optional(),
  participants: z.string().trim().max(200).optional(),
});
export type ActivityInput = z.infer<typeof ActivitySchema>;

/** F6 — Reportar situación crítica (CA-43 a CA-47). */
export const CriticalIncidentSchema = z.object({
  minor_ids: z.array(z.string().min(1)).min(1, 'Seleccioná al menos un residente'),
  incident_type: z.enum(CRITICAL_INCIDENT_TYPES, { message: 'Elegí el tipo de situación' }),
  description: z
    .string()
    .trim()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(1000, 'Máximo 1000 caracteres'),
  actions_taken: z.string().trim().max(1000).optional(),
  people_notified: z.array(z.string().min(1)).optional(),
});
export type CriticalIncidentInput = z.infer<typeof CriticalIncidentSchema>;

/** F5 — Actualizar estado de una tarea del turno. */
export const TaskUpdateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(TASK_STATUSES),
});
export type TaskUpdateInput = z.infer<typeof TaskUpdateSchema>;

/** Aplana los errores de Zod a un mapa campo → primer mensaje. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_';
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
