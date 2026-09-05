import type { Observation } from '@/types/observation';
import { EDUCADOR_MOCK } from '@/data/usuarios';

const hace = (horas: number) => new Date(Date.now() - horas * 3600_000).toISOString();

export const NOVEDADES_MOCK: Observation[] = [
  {
    id: 'o-1',
    minor_id: 'r-1',
    category: 'emocional',
    content: 'Se mostró angustiada luego de la videollamada familiar. Se la acompañó y mejoró antes de la cena.',
    reported_by: EDUCADOR_MOCK.id,
    reported_by_name: EDUCADOR_MOCK.full_name,
    observation_date: hace(3),
    created_at: hace(3),
  },
  {
    id: 'o-2',
    minor_id: 'r-2',
    category: 'educativo',
    content: 'Entregó la tarea de matemática completa. La docente destacó su avance en la semana.',
    reported_by: EDUCADOR_MOCK.id,
    reported_by_name: EDUCADOR_MOCK.full_name,
    observation_date: hace(20),
    created_at: hace(20),
  },
  {
    id: 'o-3',
    minor_id: 'r-1',
    category: 'sanitario',
    content: 'Refiere dolor de garganta leve. Se registra para seguimiento; sin fiebre.',
    reported_by: EDUCADOR_MOCK.id,
    reported_by_name: EDUCADOR_MOCK.full_name,
    observation_date: hace(30),
    created_at: hace(30),
  },
  {
    id: 'o-4',
    minor_id: 'r-3',
    category: 'conducta',
    content: 'Participó de la merienda colaborando con el orden de la mesa sin que se lo pidieran.',
    reported_by: EDUCADOR_MOCK.id,
    reported_by_name: EDUCADOR_MOCK.full_name,
    observation_date: hace(52),
    created_at: hace(52),
  },
];

export function novedadesDeResidente(minorId: string): Observation[] {
  return NOVEDADES_MOCK.filter((o) => o.minor_id === minorId).sort(
    (a, b) => +new Date(b.observation_date) - +new Date(a.observation_date),
  );
}
