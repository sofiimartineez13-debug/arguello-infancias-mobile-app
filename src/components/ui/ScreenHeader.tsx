import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  /** Muestra la flecha de retroceso. Por defecto true si hay historial. */
  back?: boolean;
  onBack?: () => void;
  /** Acento de color (situación crítica). */
  tone?: 'default' | 'critical';
};

export function ScreenHeader({ title, subtitle, back = true, onBack, tone = 'default' }: ScreenHeaderProps) {
  const critical = tone === 'critical';
  const handleBack = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/inicio')));

  return (
    <View className={`gap-1 px-5 pb-3 pt-2 ${critical ? 'bg-critical' : 'bg-canvas'}`}>
      {back ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={handleBack}
          hitSlop={8}
          className="mb-1 -ml-1 h-8 w-8 flex-row items-center justify-center">
          <Ionicons name="chevron-back" size={24} color={critical ? '#FFFFFF' : '#0D132B'} />
        </Pressable>
      ) : null}
      <Text className={`font-bold text-h2 ${critical ? 'text-white' : 'text-ink'}`}>{title}</Text>
      {subtitle ? (
        <Text className={`text-body-sm ${critical ? 'text-white/90' : 'text-ink-secondary'}`}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
