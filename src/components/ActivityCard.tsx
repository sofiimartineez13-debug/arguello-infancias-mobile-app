import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { ActivityStatusBadge } from '@/components/ui/StatusBadge';
import type { Activity } from '@/types/activity';
import { ACTIVITY_TYPE_LABELS, type ActivityType } from '@/utils/constants';
import { formatFechaHora } from '@/utils/formatters';

const ICON: Record<ActivityType, keyof typeof Ionicons.glyphMap> = {
  escuela: 'school-outline',
  recreativa: 'happy-outline',
  deportiva: 'football-outline',
  comida: 'restaurant-outline',
  pedagogica: 'book-outline',
  medico: 'medkit-outline',
  otra: 'ellipsis-horizontal',
};

export type ActivityCardProps = {
  activity: Activity;
  onPress?: () => void;
};

export function ActivityCard({ activity, onPress }: ActivityCardProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      className="flex-row items-start gap-3 rounded-md border border-line bg-canvas p-3 active:bg-surface">
      <View className="h-9 w-9 items-center justify-center rounded-md bg-surface">
        <Ionicons name={ICON[activity.activity_type]} size={20} color="#007AFF" />
      </View>

      <View className="flex-1 gap-1">
        <Text className="font-semibold text-h4 text-ink">
          {ACTIVITY_TYPE_LABELS[activity.activity_type]}
        </Text>
        {activity.observations ? (
          <Text className="text-body-sm text-ink-secondary" numberOfLines={2}>
            {activity.observations}
          </Text>
        ) : null}
        <Text className="text-caption text-ink-secondary">{formatFechaHora(activity.created_at)}</Text>
      </View>

      <ActivityStatusBadge status={activity.status} />
    </Pressable>
  );
}
