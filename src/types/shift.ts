export type ShiftStatus = 'por_iniciar' | 'activo' | 'finalizado';

/**
 * Turno del educador (F5) — horario mostrado en "Mi turno". Todavía mock: la
 * tabla real `turnos_personal` está vacía (sin datos ni feature que la
 * pueble) — ver PLAN 12.
 */
export type Shift = {
  id: string;
  educator_id: string;
  educator_name: string;
  starts_at: string; // ISO datetime
  ends_at: string; // ISO datetime
  status: ShiftStatus;
};
