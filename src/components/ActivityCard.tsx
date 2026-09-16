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
  // `tipo` no tiene CHECK en la DB real — puede traer valores libres cargados
  // desde la web que no están en el catálogo fijo de mobile (ej. "educativa").
  const tipoLabel = ACTIVITY_TYPE_LABELS[activity.tipo] ?? activity.tipo;
  const icon = ICON[activity.tipo] ?? 'ellipsis-horizontal';

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      className="flex-row items-start gap-3 rounded-md border border-line bg-canvas p-3 active:bg-surface">
      <View className="h-9 w-9 items-center justify-center rounded-md bg-surface">
        <Ionicons name={icon} size={20} color="#007AFF" />
      </View>

      <View className="flex-1 gap-1">
        <Text className="font-semibold text-h4 text-ink">{tipoLabel}</Text>
        {activity.observaciones ? (
          <Text className="text-body-sm text-ink-secondary" numberOfLines={2}>
            {activity.observaciones}
          </Text>
        ) : null}
        <Text className="text-caption text-ink-secondary">{formatFechaHora(activity.created_at)}</Text>
      </View>

      <ActivityStatusBadge status={activity.status} />
    </Pressable>
  );
}
