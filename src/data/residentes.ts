import type { Resident } from '@/types/resident';
import { EDUCADOR_MOCK } from '@/data/usuarios';

/**
 * NNA residentes de demostración. Todos asignados al educador mock salvo uno
 * (para poder probar el filtro RBAC de F1 / CA-24).
 */
export const RESIDENTES_MOCK: Resident[] = [
  {
    id: 'r-1',
    first_name: 'María',
    last_name: 'García',
    birthdate: '2013-04-18',
    status: 'activo',
    primary_caregiver_id: EDUCADOR_MOCK.id,
    emergency_contact: { name: 'Ana García', relationship: 'Tía', phone: '+54 9 351 555-1234' },
    health_insurance: 'PAMI',
  },
  {
    id: 'r-2',
    first_name: 'Juan',
    last_name: 'Pérez',
    birthdate: '2011-09-02',
    status: 'activo',
    primary_caregiver_id: EDUCADOR_MOCK.id,
    emergency_contact: { name: 'Defensoría NNA', relationship: 'Institucional', phone: '+54 9 351 555-9000' },
    health_insurance: 'Sin cobertura',
  },
  {
    id: 'r-3',
    first_name: 'Sofía',
    last_name: 'López',
    birthdate: '2014-12-11',
    status: 'activo',
    primary_caregiver_id: EDUCADOR_MOCK.id,
    emergency_contact: { name: 'Marta López', relationship: 'Abuela', phone: '+54 9 351 555-4477' },
    health_insurance: 'APROSS',
  },
  {
    id: 'r-4',
    first_name: 'Tomás',
    last_name: 'Sánchez',
    birthdate: '2009-06-25',
    status: 'activo',
    primary_caregiver_id: EDUCADOR_MOCK.id,
    emergency_contact: { name: 'Defensoría NNA', relationship: 'Institucional', phone: '+54 9 351 555-9000' },
    health_insurance: 'APROSS',
  },
  {
    id: 'r-5',
    first_name: 'Valentina',
    last_name: 'Ruiz',
    birthdate: '2016-02-07',
    status: 'activo',
    // Asignada a otro educador: no debe verse en el listado del educador mock.
    primary_caregiver_id: 'u-educador-2',
    health_insurance: 'PAMI',
  },
];

export function residentesAsignados(caregiverId: string): Resident[] {
  return RESIDENTES_MOCK.filter((r) => r.primary_caregiver_id === caregiverId);
}

export function residentePorId(id: string): Resident | undefined {
  return RESIDENTES_MOCK.find((r) => r.id === id);
}
