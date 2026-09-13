import { useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/theme';

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectFieldProps = {
  label: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

export function SelectField({
  label,
  options,
  value,
  onChange,
  error,
  required,
  disabled,
  placeholder = 'Seleccionar…',
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View className="w-full gap-1.5">
      <Text className="font-medium text-body-sm text-ink">
        {label}
        {required ? <Text className="text-critical"> *</Text> : null}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={disabled}
        onPress={() => setOpen(true)}
        className={[
          'w-full flex-row items-center justify-between rounded-md border bg-surface px-4',
          error ? 'border-critical' : 'border-line',
          disabled ? 'opacity-50' : '',
        ].join(' ')}>
        <Text
          className={[
            'h-11 flex-1 text-body-md',
            selected ? 'text-ink' : 'text-ink-secondary',
          ].join(' ')}
          style={{ textAlignVertical: 'center' }}>
          {selected ? selected.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
      </Pressable>

      {error ? <Text className="text-caption text-critical">{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/40 px-6"
          onPress={() => setOpen(false)}>
          <Pressable className="w-full max-w-sm rounded-md bg-canvas" onPress={() => {}}>
            <Text className="px-4 pb-2 pt-4 font-medium text-body-sm text-ink-secondary">
              {label}
            </Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  accessibilityRole="button"
                  className="flex-row items-center justify-between px-4 py-3"
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}>
                  <Text className="text-body-md text-ink">{item.label}</Text>
                  {item.value === value ? (
                    <Ionicons name="checkmark" size={18} color={colors.arguelloBlue} />
                  ) : null}
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
