import type { CriticalIncidentType } from '@/utils/constants';

/**
 * Situación crítica (F6). Registro diferenciado e inmutable.
 */
export type CriticalIncident = {
  id: string;
  minor_ids: string[];
  incident_type: CriticalIncidentType;
  description: string;
  actions_taken?: string;
  people_notified?: string[];
  reported_by: string; // user id
  reported_by_name: string;
  occurred_at: string; // ISO datetime (hora exacta)
  created_at: string; // ISO datetime
};

export type NewCriticalIncident = Pick<
  CriticalIncident,
  'minor_ids' | 'incident_type' | 'description' | 'actions_taken' | 'people_notified'
>;
