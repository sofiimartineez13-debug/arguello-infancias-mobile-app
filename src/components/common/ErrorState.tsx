import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { SecondaryButton } from '@/components/ui/SecondaryButton';

export type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = 'No se pudo cargar la información',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 p-8">
      <Ionicons name="warning-outline" size={56} color="#DC3545" />
      <Text className="text-center font-semibold text-h3 text-ink">{title}</Text>
      {message ? (
        <Text className="text-center text-body-sm text-ink-secondary">{message}</Text>
      ) : null}
      {onRetry ? (
        <View className="mt-2 w-full max-w-xs">
          <SecondaryButton label="Reintentar" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}
