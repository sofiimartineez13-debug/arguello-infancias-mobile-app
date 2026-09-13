import type { Resident } from '@/types/resident';
import { EDUCADOR_MOCK } from '@/data/usuarios';

/**
 * NNA residentes de demostración — usados hoy solo por `data/turno.ts` (F5,
 * todavía mock; F1 ya usa Supabase real, ver src/hooks/useResidents.ts).
 *
 * `primary_caregiver_id` ya no es parte de `Resident` (decisión #2: no hay
 * asignación individual NNA↔educador) — queda como campo extra local, solo
 * para que `residentesAsignados()` siga sirviendo el mock de "mi turno" que
 * usa F5, sin tocar su comportamiento.
 */
type MockResident = Resident & { primary_caregiver_id: string };

export const RESIDENTES_MOCK: MockResident[] = [
  {
    id: 'r-1',
    nombre: 'María',
    apellido: 'García',
    fecha_nacimiento: '2013-04-18',
    estado_actual: 'En residencia',
    foto_url: null,
    alertas_importantes: null,
    obra_social: 'PAMI',
    turno_escolar: null,
    contacto_emergencia: { nombre: 'Ana', apellido: 'García', parentesco: 'Tía', telefono: '+54 9 351 555-1234' },
    primary_caregiver_id: EDUCADOR_MOCK.id,
  },
  {
    id: 'r-2',
    nombre: 'Juan',
    apellido: 'Pérez',
    fecha_nacimiento: '2011-09-02',
    estado_actual: 'En residencia',
    foto_url: null,
    alertas_importantes: null,
    obra_social: 'Sin cobertura',
    turno_escolar: null,
    contacto_emergencia: {
      nombre: 'Defensoría',
      apellido: 'NNA',
      parentesco: 'Institucional',
      telefono: '+54 9 351 555-9000',
    },
    primary_caregiver_id: EDUCADOR_MOCK.id,
  },
  {
    id: 'r-3',
    nombre: 'Sofía',
    apellido: 'López',
    fecha_nacimiento: '2014-12-11',
    estado_actual: 'En residencia',
    foto_url: null,
    alertas_importantes: null,
    obra_social: 'APROSS',
    turno_escolar: null,
    contacto_emergencia: {
      nombre: 'Marta',
      apellido: 'López',
      parentesco: 'Abuela',
      telefono: '+54 9 351 555-4477',
    },
    primary_caregiver_id: EDUCADOR_MOCK.id,
  },
  {
    id: 'r-4',
    nombre: 'Tomás',
    apellido: 'Sánchez',
    fecha_nacimiento: '2009-06-25',
    estado_actual: 'En residencia',
    foto_url: null,
    alertas_importantes: null,
    obra_social: 'APROSS',
    turno_escolar: null,
    contacto_emergencia: {
      nombre: 'Defensoría',
      apellido: 'NNA',
      parentesco: 'Institucional',
      telefono: '+54 9 351 555-9000',
    },
    primary_caregiver_id: EDUCADOR_MOCK.id,
  },
  {
    id: 'r-5',
    nombre: 'Valentina',
    apellido: 'Ruiz',
    fecha_nacimiento: '2016-02-07',
    estado_actual: 'En residencia',
    foto_url: null,
    alertas_importantes: null,
    obra_social: 'PAMI',
    turno_escolar: null,
    contacto_emergencia: null,
    // Distinto "educador" mock, para variar el dato de ejemplo del turno.
    primary_caregiver_id: 'u-educador-2',
  },
];

export function residentesAsignados(caregiverId: string): MockResident[] {
  return RESIDENTES_MOCK.filter((r) => r.primary_caregiver_id === caregiverId);
}
