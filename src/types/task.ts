import type { TaskStatus, TaskType } from '@/utils/constants';

/**
 * Tarea del turno (F5): medicación, turnos médicos, actividades programadas.
 */
export type Task = {
  id: string;
  type: TaskType;
  title: string;
  detail?: string;
  due_at: string; // ISO datetime
  status: TaskStatus;
  minor_id?: string;
};
