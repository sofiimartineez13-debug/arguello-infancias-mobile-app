import type { Activity } from '@/types/activity';
import { EDUCADOR_MOCK } from '@/data/usuarios';

const hace = (horas: number) => new Date(Date.now() - horas * 3600_000).toISOString();

export const ACTIVIDADES_MOCK: Activity[] = [
  {
    id: 'a-1',
    minor_id: 'r-1',
    activity_type: 'escuela',
    status: 'realizada',
    observations: 'Asistió a la jornada completa.',
    created_at: hace(6),
    updated_at: hace(6),
    created_by: EDUCADOR_MOCK.id,
    created_by_name: EDUCADOR_MOCK.full_name,
  },
  {
    id: 'a-2',
    minor_id: 'r-1',
    activity_type: 'medico',
    status: 'pendiente',
    observations: 'Control con pediatra a las 16:00.',
    created_at: hace(5),
    updated_at: hace(5),
    created_by: EDUCADOR_MOCK.id,
    created_by_name: EDUCADOR_MOCK.full_name,
  },
  {
    id: 'a-3',
    minor_id: 'r-2',
    activity_type: 'deportiva',
    status: 'realizada',
    duration_minutes: 90,
    participants: 'Grupo de fútbol del club barrial',
    created_at: hace(28),
    updated_at: hace(28),
    created_by: EDUCADOR_MOCK.id,
    created_by_name: EDUCADOR_MOCK.full_name,
  },
  {
    id: 'a-4',
    minor_id: 'r-3',
    activity_type: 'recreativa',
    status: 'no_realizada',
    observations: 'Se suspendió la salida por lluvia.',
    created_at: hace(50),
    updated_at: hace(50),
    created_by: EDUCADOR_MOCK.id,
    created_by_name: EDUCADOR_MOCK.full_name,
  },
];

export function actividadesDeResidente(minorId: string): Activity[] {
  return ACTIVIDADES_MOCK.filter((a) => a.minor_id === minorId).sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
  );
}
