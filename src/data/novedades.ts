import type { Observation } from '@/types/observation';
import { EDUCADOR_MOCK } from '@/data/usuarios';

const hace = (horas: number) => new Date(Date.now() - horas * 3600_000).toISOString();

/** Mock de novedades — usado por `data/turno.ts` para el resumen de F5 (Mi turno). */
export const NOVEDADES_MOCK: Observation[] = [
  {
    id: 'o-1',
    nnya_id: 'r-1',
    usuario_id: EDUCADOR_MOCK.id,
    usuario_nombre: `${EDUCADOR_MOCK.nombre} ${EDUCADOR_MOCK.apellido}`,
    tipo: 'Comportamiento',
    descripcion: 'Se mostró angustiada luego de la videollamada familiar. Se la acompañó y mejoró antes de la cena.',
    fecha_hora: hace(3),
    created_at: hace(3),
  },
  {
    id: 'o-2',
    nnya_id: 'r-2',
    usuario_id: EDUCADOR_MOCK.id,
    usuario_nombre: `${EDUCADOR_MOCK.nombre} ${EDUCADOR_MOCK.apellido}`,
    tipo: 'Educación',
    descripcion: 'Entregó la tarea de matemática completa. La docente destacó su avance en la semana.',
    fecha_hora: hace(20),
    created_at: hace(20),
  },
  {
    id: 'o-3',
    nnya_id: 'r-1',
    usuario_id: EDUCADOR_MOCK.id,
    usuario_nombre: `${EDUCADOR_MOCK.nombre} ${EDUCADOR_MOCK.apellido}`,
    tipo: 'Salud',
    descripcion: 'Refiere dolor de garganta leve. Se registra para seguimiento; sin fiebre.',
    fecha_hora: hace(30),
    created_at: hace(30),
  },
  {
    id: 'o-4',
    nnya_id: 'r-3',
    usuario_id: EDUCADOR_MOCK.id,
    usuario_nombre: `${EDUCADOR_MOCK.nombre} ${EDUCADOR_MOCK.apellido}`,
    tipo: 'Comportamiento',
    descripcion: 'Participó de la merienda colaborando con el orden de la mesa sin que se lo pidieran.',
    fecha_hora: hace(52),
    created_at: hace(52),
  },
];
