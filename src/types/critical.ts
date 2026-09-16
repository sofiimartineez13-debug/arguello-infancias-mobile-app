import type { CriticalIncidentType } from '@/utils/constants';

/**
 * Situación crítica (F6) — una fila de la tabla real `incidentes` (compartida
 * con el sistema web, decisión #4 de CORRECCIONES-Y-DUDAS-PARA-MELI-SOFI.md).
 * Un incidente vincula UN solo NNA (`nnya_id`); la selección múltiple de la UI
 * se resuelve insertando una fila por NNA seleccionado (ver PLAN 08).
 */
export type CriticalIncident = {
  id: string;
  nnya_id: string;
  tipo: CriticalIncidentType;
  descripcion: string;
  fecha_hora: string; // ISO datetime, default now() en la DB
  gravedad: 'leve' | 'media' | 'grave' | 'critico';
  reportado_por: string | null; // usuarios.id
  reportado_por_nombre: string | null; // nombre + apellido de usuarios, joineado al leer
  acciones_tomadas: string | null;
  estado: 'abierto' | 'en_seguimiento' | 'cerrado';
  created_at: string;
};

/** Input del formulario (WF-14). `nnya_ids` puede tener 1+ NNA seleccionados. */
export type NewCriticalIncident = {
  nnya_ids: string[];
  tipo: CriticalIncidentType;
  descripcion: string;
  acciones_tomadas?: string;
};
