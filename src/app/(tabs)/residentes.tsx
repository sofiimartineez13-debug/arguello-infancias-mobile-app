import { router } from 'expo-router';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ResidentCard } from '@/components/ResidentCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { useResidents } from '@/hooks/useResidents';
import { useResidentStore } from '@/store/residentStore';

export default function ResidentesScreen() {
  const { data, isLoading, isError, refetch } = useResidents();
  const setSelectedResident = useResidentStore((s) => s.setSelectedResident);

  function openResident(id: string) {
    setSelectedResident(id);
    router.push(`/residentes/${id}`);
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <View className="gap-1 px-5 pb-2 pt-2">
        <Text className="font-bold text-h1 text-ink">Residentes</Text>
        <Text className="text-body-sm text-ink-secondary">NNA asignados a tu acompañamiento</Text>
      </View>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-3 px-5 pb-8 pt-2"
          ItemSeparatorComponent={null}
          renderItem={({ item }) => (
            <ResidentCard resident={item} onPress={() => openResident(item.id)} />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              title="No hay residentes para mostrar"
              description="No tenés NNA asignados en este momento."
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
