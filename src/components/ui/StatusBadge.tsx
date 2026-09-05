import { Text, View } from 'react-native';

import type { ActivityStatus, ResidentStatus, TaskStatus } from '@/utils/constants';

type Tone = 'success' | 'pending' | 'progress' | 'neutral' | 'critical';

const TONE_CLASS: Record<Tone, string> = {
  success: 'bg-badge-success-bg',
  pending: 'bg-badge-pending-bg',
  progress: 'bg-badge-progress-bg',
  neutral: 'bg-badge-locked-bg',
  critical: 'bg-critical/10',
};

const TONE_TEXT: Record<Tone, string> = {
  success: 'text-badge-success-text',
  pending: 'text-badge-pending-text',
  progress: 'text-badge-progress-text',
  neutral: 'text-badge-locked-text',
  critical: 'text-critical',
};

export function StatusBadge({ label, tone }: { label: string; tone: Tone }) {
  return (
    <View className={`self-start rounded-full px-2 py-0.5 ${TONE_CLASS[tone]}`}>
      <Text className={`font-semibold text-xs ${TONE_TEXT[tone]}`}>{label}</Text>
    </View>
  );
}

const ACTIVITY_TONE: Record<ActivityStatus, Tone> = {
  pendiente: 'pending',
  realizada: 'success',
  no_realizada: 'neutral',
};

const ACTIVITY_LABELS: Record<ActivityStatus, string> = {
  pendiente: 'Pendiente',
  realizada: 'Realizada',
  no_realizada: 'No realizada',
};

export function ActivityStatusBadge({ status }: { status: ActivityStatus }) {
  return <StatusBadge label={ACTIVITY_LABELS[status]} tone={ACTIVITY_TONE[status]} />;
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return status === 'completada' ? (
    <StatusBadge label="Completada" tone="success" />
  ) : (
    <StatusBadge label="Pendiente" tone="pending" />
  );
}

export function ResidentStatusBadge({ status }: { status: ResidentStatus }) {
  return status === 'activo' ? (
    <StatusBadge label="Activo" tone="success" />
  ) : (
    <StatusBadge label="Egresado" tone="neutral" />
  );
}
