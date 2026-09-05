import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AlertCard } from '@/components/AlertCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { useShiftInfo } from '@/hooks/useShiftInfo';
import { OBSERVATION_CATEGORY_LABELS } from '@/utils/constants';
import { formatHora } from '@/utils/formatters';

const SHIFT_STATUS_LABEL = {
  por_iniciar: 'Por iniciar',
  activo: 'Activo',
  finalizado: 'Finalizado',
} as const;

export default function TurnoScreen() {
  const { data, isLoading, isError, refetch } = useShiftInfo();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
        <LoadingState />
      </SafeAreaView>
    );
  }
  if (isError || !data) {
    return (
      <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
        <ErrorState onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const { shift, recent_observations, pending_tasks, previous_shift_notes } = data;
  const sinPendientes = recent_observations.length === 0 && pending_tasks.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <ScrollView contentContainerClassName="gap-6 px-5 py-4">
        <View className="gap-1">
          <Text className="font-bold text-h1 text-ink">Mi turno</Text>
          <Text className="text-body-sm text-ink-secondary">{shift.educator_name}</Text>
        </View>

        <View className="gap-2 rounded-lg border border-line bg-surface p-4">
          <View className="flex-row items-center justify-between">
            <Text className="font-semibold text-h4 text-ink">
              {formatHora(shift.starts_at)} – {formatHora(shift.ends_at)}
            </Text>
            <Text className="font-semibold text-caption text-arguello-blue">
              {SHIFT_STATUS_LABEL[shift.status]}
            </Text>
          </View>
          <Text className="text-body-sm text-ink-secondary">
            {shift.assigned_minor_ids.length} NNA a cargo
          </Text>
        </View>

        {sinPendientes ? (
          <EmptyState
            icon="checkmark-done-outline"
            title="No hay novedades ni tareas pendientes"
            description="Todo al día en este turno."
          />
        ) : (
          <>
            <Section title="Novedades relevantes (24 h)">
              {recent_observations.length === 0 ? (
                <Text className="text-body-sm text-ink-secondary">Sin novedades en las últimas 24 h.</Text>
              ) : (
                recent_observations.map((o) => (
                  <AlertCard
                    key={o.id}
                    variant="warning"
                    title={OBSERVATION_CATEGORY_LABELS[o.category]}
                    message={o.content}
                  />
                ))
              )}
            </Section>

            <Section title="Tareas pendientes">
              {pending_tasks.length === 0 ? (
                <Text className="text-body-sm text-ink-secondary">Sin tareas pendientes.</Text>
              ) : (
                pending_tasks.map((t) => (
                  <View
                    key={t.id}
                    className="flex-row items-start gap-3 rounded-md border border-line bg-canvas p-3">
                    <Ionicons name="alarm-outline" size={20} color="#B45309" />
                    <View className="flex-1 gap-0.5">
                      <Text className="font-semibold text-body-md text-ink">{t.title}</Text>
                      {t.detail ? (
                        <Text className="text-body-sm text-ink-secondary">{t.detail}</Text>
                      ) : null}
                      <Text className="text-caption text-ink-secondary">
                        Vence {formatHora(t.due_at)}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </Section>
          </>
        )}

        {previous_shift_notes ? (
          <Section title="Turno anterior">
            <Text className="text-body-sm text-ink">{previous_shift_notes}</Text>
          </Section>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="font-semibold text-h3 text-ink">{title}</Text>
      {children}
    </View>
  );
}
