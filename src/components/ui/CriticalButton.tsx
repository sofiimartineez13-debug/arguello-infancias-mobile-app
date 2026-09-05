import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, type PressableProps } from 'react-native';

export type CriticalButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label?: string;
  fullWidth?: boolean;
};

/**
 * Botón para el flujo de situación crítica (F6). Siempre diferenciado en rojo
 * con ícono de advertencia (design system §3, CA-41 / CA-51).
 */
export function CriticalButton({
  label = 'Situación crítica',
  disabled,
  fullWidth = true,
  ...rest
}: CriticalButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      className={[
        'h-12 flex-row items-center justify-center gap-2 rounded-lg px-6',
        fullWidth ? 'w-full' : 'self-start',
        disabled ? 'bg-line' : 'bg-critical active:bg-critical-pressed',
      ].join(' ')}
      {...rest}>
      <Ionicons name="warning" size={20} color={disabled ? '#9CA3AF' : '#FFFFFF'} />
      <Text className={`font-bold text-base ${disabled ? 'text-ink-disabled' : 'text-white'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
