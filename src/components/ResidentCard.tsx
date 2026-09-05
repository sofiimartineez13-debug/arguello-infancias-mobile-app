import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { ResidentStatusBadge } from '@/components/ui/StatusBadge';
import type { Resident } from '@/types/resident';
import { edadLabel, iniciales } from '@/utils/formatters';

export type ResidentCardProps = {
  resident: Resident;
  onPress?: () => void;
};

export function ResidentCard({ resident, onPress }: ResidentCardProps) {
  const nombre = `${resident.first_name} ${resident.last_name}`;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${nombre}, ${edadLabel(resident.birthdate)}`}
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-lg border border-line bg-canvas p-4 active:bg-surface">
      {resident.photo_url ? (
        <Image source={{ uri: resident.photo_url }} style={{ width: 48, height: 48, borderRadius: 24 }} />
      ) : (
        <View className="h-12 w-12 items-center justify-center rounded-full bg-arguello-blue/10">
          <Text className="font-semibold text-body-md text-arguello-blue">
            {iniciales(resident.first_name, resident.last_name)}
          </Text>
        </View>
      )}

      <View className="flex-1 gap-0.5">
        <Text className="font-semibold text-h4 text-ink" numberOfLines={1}>
          {nombre}
        </Text>
        <Text className="text-body-sm text-ink-secondary">{edadLabel(resident.birthdate)}</Text>
      </View>

      <View className="items-end gap-1">
        <ResidentStatusBadge status={resident.status} />
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </View>
    </Pressable>
  );
}
