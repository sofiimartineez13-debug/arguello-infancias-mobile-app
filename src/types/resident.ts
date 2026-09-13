import type { ResidentStatus } from '@/utils/constants';

export type ContactoEmergencia = {
  nombre: string;
  apellido: string;
  parentesco: string;
  telefono: string | null;
};

/**
 * NNA residente (tabla `nnya` real, compartida con la web). En mobile sólo
 * se expone la información autorizada (F1): datos básicos, contacto de
 * emergencia (tutor principal), obra social, estado.
 */
export type Resident = {
  id: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string; // ISO date (YYYY-MM-DD)
  estado_actual: ResidentStatus;
  foto_url: string | null;
  alertas_importantes: string | null;
  obra_social: string | null;
  turno_escolar: string | null;
  contacto_emergencia: ContactoEmergencia | null;
};
