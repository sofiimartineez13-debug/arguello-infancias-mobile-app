import { Pressable, Text, type PressableProps } from 'react-native';

export type SecondaryButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  fullWidth?: boolean;
};

export function SecondaryButton({
  label,
  disabled,
  fullWidth = true,
  ...rest
}: SecondaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      className={[
        'h-12 flex-row items-center justify-center rounded-lg border-2 px-6',
        fullWidth ? 'w-full' : 'self-start',
        disabled ? 'border-line' : 'border-arguello-blue active:bg-arguello-blue/10',
      ].join(' ')}
      {...rest}>
      <Text className={`font-semibold text-base ${disabled ? 'text-ink-disabled' : 'text-arguello-blue'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
