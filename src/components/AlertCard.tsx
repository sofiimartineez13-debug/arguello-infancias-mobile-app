import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

const STYLE: Record<
  AlertVariant,
  { container: string; icon: keyof typeof Ionicons.glyphMap; iconColor: string; title: string }
> = {
  success: { container: 'border-success/30 bg-success/10', icon: 'checkmark-circle', iconColor: '#28A745', title: 'text-success' },
  warning: { container: 'border-warning/40 bg-warning/10', icon: 'alert-circle', iconColor: '#B45309', title: 'text-[#92400E]' },
  error: { container: 'border-critical/30 bg-critical/10', icon: 'warning', iconColor: '#DC3545', title: 'text-critical' },
  info: { container: 'border-info/30 bg-info/10', icon: 'information-circle', iconColor: '#17A2B8', title: 'text-info' },
};

export type AlertCardProps = {
  variant: AlertVariant;
  title: string;
  message?: string;
  onPress?: () => void;
};

export function AlertCard({ variant, title, message, onPress }: AlertCardProps) {
  const s = STYLE[variant];
  const Container = onPress ? Pressable : View;
  return (
    <Container
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      className={`flex-row items-start gap-3 rounded-md border p-4 ${s.container}`}>
      <Ionicons name={s.icon} size={20} color={s.iconColor} />
      <View className="flex-1 gap-0.5">
        <Text className={`font-semibold text-h4 ${s.title}`}>{title}</Text>
        {message ? <Text className="text-body-sm text-ink">{message}</Text> : null}
      </View>
      {onPress ? <Ionicons name="chevron-forward" size={18} color="#9CA3AF" /> : null}
    </Container>
  );
}
