import { useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type FormFieldProps = TextInputProps & {
  label: string;
  error?: string;
  required?: boolean;
  /** Muestra el toggle de mostrar/ocultar (para contraseñas). */
  secure?: boolean;
};

export function FormField({ label, error, required, secure, ...inputProps }: FormFieldProps) {
  const [hidden, setHidden] = useState(true);

  return (
    <View className="w-full gap-1.5">
      <Text className="font-medium text-body-sm text-ink">
        {label}
        {required ? <Text className="text-critical"> *</Text> : null}
      </Text>

      <View
        className={[
          'w-full flex-row items-center rounded-md border bg-surface px-4',
          error ? 'border-critical' : 'border-line',
        ].join(' ')}>
        <TextInput
          className="h-11 flex-1 text-body-md text-ink"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secure ? hidden : false}
          accessibilityLabel={label}
          {...inputProps}
        />
        {secure ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar contraseña' : 'Ocultar contraseña'}
            onPress={() => setHidden((v) => !v)}
            hitSlop={8}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color="#6B7280" />
          </Pressable>
        ) : null}
      </View>

      {error ? <Text className="text-caption text-critical">{error}</Text> : null}
    </View>
  );
}
