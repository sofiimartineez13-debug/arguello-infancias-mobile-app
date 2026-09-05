import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

export type PrimaryButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  loading?: boolean;
  fullWidth?: boolean;
};

export function PrimaryButton({
  label,
  loading = false,
  disabled,
  fullWidth = true,
  ...rest
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(isDisabled), busy: loading }}
      disabled={isDisabled}
      className={[
        'h-12 flex-row items-center justify-center rounded-lg px-6',
        fullWidth ? 'w-full' : 'self-start',
        isDisabled ? 'bg-line' : 'bg-arguello-blue active:bg-arguello-blue-pressed',
      ].join(' ')}
      {...rest}>
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text className={`font-semibold text-base ${isDisabled ? 'text-ink-disabled' : 'text-white'}`}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
