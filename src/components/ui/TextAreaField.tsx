import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/theme';

export type TextAreaFieldProps = Omit<TextInputProps, 'multiline'> & {
  label: string;
  error?: string;
  required?: boolean;
  numberOfLines?: number;
};

export function TextAreaField({
  label,
  error,
  required,
  numberOfLines = 4,
  ...inputProps
}: TextAreaFieldProps) {
  return (
    <View className="w-full gap-1.5">
      <Text className="font-medium text-body-sm text-ink">
        {label}
        {required ? <Text className="text-critical"> *</Text> : null}
      </Text>

      <View
        className={[
          'w-full rounded-md border bg-surface px-4 py-3',
          error ? 'border-critical' : 'border-line',
        ].join(' ')}>
        <TextInput
          className="text-body-md text-ink"
          placeholderTextColor={colors.textDisabled}
          multiline
          numberOfLines={numberOfLines}
          textAlignVertical="top"
          accessibilityLabel={label}
          {...inputProps}
        />
      </View>

      {error ? <Text className="text-caption text-critical">{error}</Text> : null}
    </View>
  );
}
