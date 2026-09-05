import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';

export type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  icon = 'file-tray-outline',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 p-8">
      <Ionicons name={icon} size={56} color="#9CA3AF" />
      <Text className="text-center font-semibold text-h3 text-ink">{title}</Text>
      {description ? (
        <Text className="text-center text-body-sm text-ink-secondary">{description}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <View className="mt-2 w-full max-w-xs">
          <PrimaryButton label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
