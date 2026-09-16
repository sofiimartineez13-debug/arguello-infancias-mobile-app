import type { Shift } from '@/types/shift';
import { EDUCADOR_MOCK } from '@/data/usuarios';

/**
 * Horario del turno de hoy — mock. La tabla real `turnos_personal` está
 * vacía (sin datos ni feature que la pueble); se documenta en el PLAN 12 y
 * se deja este mock hasta que haya algo real que consultar.
 */
export function turnoDeHoy(): Shift {
  const start = new Date();
  start.setHours(8, 0, 0, 0);
  const end = new Date();
  end.setHours(16, 0, 0, 0);
  const now = Date.now();
  const status: Shift['status'] =
    now < start.getTime() ? 'por_iniciar' : now > end.getTime() ? 'finalizado' : 'activo';

  return {
    id: 's-hoy',
    educator_id: EDUCADOR_MOCK.id,
    educator_name: `${EDUCADOR_MOCK.nombre} ${EDUCADOR_MOCK.apellido}`,
    starts_at: start.toISOString(),
    ends_at: end.toISOString(),
    status,
  };
}

/**
 * Notas del turno anterior — mock (WF-11 lo marca opcional/expandible,
 * ningún CA lo exige en detalle; no hay tabla real de traspaso de turno
 * conectada todavía).
 */
export const NOTAS_TURNO_ANTERIOR =
  'Turno anterior sin situaciones críticas. Revisar entrega de materiales escolares pendientes.';
