import { ActivityIndicator, Text, View } from 'react-native';

import { colors } from '@/theme';

export function LoadingState({ message = 'Cargando…' }: { message?: string }) {
  return (
    <View className="flex-1 items-center justify-center gap-3 p-6">
      <ActivityIndicator size="large" color={colors.arguelloBlue} />
      <Text className="text-body-sm text-ink-secondary">{message}</Text>
    </View>
  );
}
