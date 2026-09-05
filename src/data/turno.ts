import type { Shift, ShiftSummary } from '@/types/shift';
import type { Task } from '@/types/task';
import { EDUCADOR_MOCK } from '@/data/usuarios';
import { NOVEDADES_MOCK } from '@/data/novedades';
import { residentesAsignados } from '@/data/residentes';

function turnoDeHoy(): Shift {
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
    educator_name: EDUCADOR_MOCK.full_name,
    starts_at: start.toISOString(),
    ends_at: end.toISOString(),
    status,
    assigned_minor_ids: residentesAsignados(EDUCADOR_MOCK.id).map((r) => r.id),
  };
}

const en = (horas: number) => new Date(Date.now() + horas * 3600_000).toISOString();

export const TAREAS_MOCK: Task[] = [
  {
    id: 't-1',
    type: 'medicacion',
    title: 'Medicación de María (r-1)',
    detail: 'Ibuprofeno 100 mg — cada 8 h según indicación',
    due_at: en(1),
    status: 'pendiente',
    minor_id: 'r-1',
  },
  {
    id: 't-2',
    type: 'turno_medico',
    title: 'Control pediátrico de María (r-1)',
    detail: 'Centro de salud n.º 4, 16:00',
    due_at: en(3),
    status: 'pendiente',
    minor_id: 'r-1',
  },
  {
    id: 't-3',
    type: 'actividad_programada',
    title: 'Apoyo escolar grupal',
    detail: 'Comedor, 17:30',
    due_at: en(5),
    status: 'pendiente',
  },
];

export function shiftSummaryMock(): ShiftSummary {
  const shift = turnoDeHoy();
  const desde = Date.now() - 24 * 3600_000;
  return {
    shift,
    recent_observations: NOVEDADES_MOCK.filter(
      (o) => shift.assigned_minor_ids.includes(o.minor_id) && +new Date(o.observation_date) >= desde,
    ).sort((a, b) => +new Date(b.observation_date) - +new Date(a.observation_date)),
    pending_tasks: TAREAS_MOCK.filter((t) => t.status === 'pendiente').sort(
      (a, b) => +new Date(a.due_at) - +new Date(b.due_at),
    ),
    previous_shift_notes:
      'Turno anterior sin situaciones críticas. Sofía (r-3) durmió sin novedad; revisar entrega de materiales escolares de Juan (r-2).',
  };
}
