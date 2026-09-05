import type { ResidentStatus } from '@/utils/constants';

export type EmergencyContact = {
  name: string;
  relationship: string;
  phone: string;
};

/**
 * NNA residente. En mobile sólo se expone la información autorizada (F1):
 * datos básicos, contacto de emergencia, obra social y estado.
 */
export type Resident = {
  id: string;
  first_name: string;
  last_name: string;
  birthdate: string; // ISO date (YYYY-MM-DD)
  status: ResidentStatus;
  photo_url?: string;
  /** Educador asignado (RBAC: el educador sólo ve sus NNA). */
  primary_caregiver_id: string;
  emergency_contact?: EmergencyContact;
  health_insurance?: string;
};
