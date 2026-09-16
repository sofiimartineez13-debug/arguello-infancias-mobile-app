import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AlertCard } from '@/components/AlertCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { ActivityStatusBadge } from '@/components/ui/StatusBadge';
import { useActividadesDeHoy, useNovedadesRecientes, useTurnoHoy } from '@/hooks/useShiftInfo';
import { useResidents } from '@/hooks/useResidents';
import { NOTAS_TURNO_ANTERIOR } from '@/data/turno';
import { ACTIVITY_TYPE_LABELS, OBSERVATION_CATEGORY_LABELS, labelOrRaw } from '@/utils/constants';
import { formatHora } from '@/utils/formatters';

const SHIFT_STATUS_LABEL = {
  por_iniciar: 'Por iniciar',
  activo: 'Activo',
  finalizado: 'Finalizado',
} as const;

export default function TurnoScreen() {
  const turno = useTurnoHoy();
  const residents = useResidents();
  const novedades = useNovedadesRecientes(24);
  const actividades = useActividadesDeHoy();

  const isLoading =
    turno.isLoading || residents.isLoading || novedades.isLoading || actividades.isLoading;
  const isError = turno.isError || residents.isError || novedades.isError || actividades.isError;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
        <LoadingState />
      </SafeAreaView>
    );
  }
  if (isError || !turno.data) {
    return (
      <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
        <ErrorState
          onRetry={() => {
            void turno.refetch();
            void residents.refetch();
            void novedades.refetch();
            void actividades.refetch();
          }}
        />
      </SafeAreaView>
    );
  }

  const shift = turno.data;
  const nombreDe = (nnyaId: string) => {
    const r = residents.data?.find((r) => r.id === nnyaId);
    return r ? `${r.nombre} ${r.apellido}` : 'NNA';
  };

  const novedadesData = novedades.data ?? [];
  const actividadesData = actividades.data ?? [];
  const sinPendientes = novedadesData.length === 0 && actividadesData.length === 0;

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
            {residents.data?.length ?? 0} NNA a cargo
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
              {novedadesData.length === 0 ? (
                <Text className="text-body-sm text-ink-secondary">Sin novedades en las últimas 24 h.</Text>
              ) : (
                novedadesData.map((o) => (
                  <AlertCard
                    key={o.id}
                    variant="warning"
                    title={`${labelOrRaw(OBSERVATION_CATEGORY_LABELS, o.tipo)} · ${nombreDe(o.nnya_id)}`}
                    message={o.descripcion}
                    onPress={() =>
                      router.push({
                        pathname: '/historial-detalle',
                        params: { kind: 'novedad', id: o.id, minorId: o.nnya_id },
                      })
                    }
                  />
                ))
              )}
            </Section>

            <Section title="Actividades de hoy">
              {actividadesData.length === 0 ? (
                <Text className="text-body-sm text-ink-secondary">Sin actividades para hoy.</Text>
              ) : (
                actividadesData.map((a) => (
                  <Pressable
                    key={a.id}
                    accessibilityRole="button"
                    onPress={() =>
                      router.push({
                        pathname: '/historial-detalle',
                        params: { kind: 'actividad', id: a.id, minorId: a.nnya_id },
                      })
                    }
                    className="flex-row items-start gap-3 rounded-md border border-line bg-canvas p-3 active:bg-surface">
                    <View className="flex-1 gap-0.5">
                      <Text className="font-semibold text-body-md text-ink">
                        {labelOrRaw(ACTIVITY_TYPE_LABELS, a.tipo)}
                      </Text>
                      <Text className="text-body-sm text-ink-secondary">{nombreDe(a.nnya_id)}</Text>
                      {a.observaciones ? (
                        <Text className="text-caption text-ink-secondary" numberOfLines={1}>
                          {a.observaciones}
                        </Text>
                      ) : null}
                    </View>
                    <ActivityStatusBadge status={a.status} />
                  </Pressable>
                ))
              )}
            </Section>
          </>
        )}

        <Section title="Turno anterior">
          <Text className="text-body-sm text-ink">{NOTAS_TURNO_ANTERIOR}</Text>
        </Section>
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
