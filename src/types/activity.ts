import type { ActivityStatus, ActivityType } from '@/utils/constants';

/**
 * Actividad diaria de un NNA (F4).
 */
export type Activity = {
  id: string;
  minor_id: string;
  activity_type: ActivityType;
  status: ActivityStatus;
  observations?: string;
  duration_minutes?: number;
  participants?: string;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
  created_by: string; // user id
  created_by_name: string;
};

export type NewActivity = Pick<
  Activity,
  'minor_id' | 'activity_type' | 'status' | 'observations' | 'duration_minutes' | 'participants'
>;
