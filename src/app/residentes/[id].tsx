import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityCard } from '@/components/ActivityCard';
import { AlertCard } from '@/components/AlertCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { ResidentStatusBadge } from '@/components/ui/StatusBadge';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useActivities } from '@/hooks/useActivities';
import { useObservations } from '@/hooks/useObservations';
import { useResident } from '@/hooks/useResidents';
import type { Resident } from '@/types/resident';
import { OBSERVATION_CATEGORY_LABELS } from '@/utils/constants';
import { edadLabel, formatFecha, formatFechaHora, iniciales } from '@/utils/formatters';

const TABS = ['Info', 'Novedades', 'Historial', 'Actividades'] as const;
type Tab = (typeof TABS)[number];

export default function ResidentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: resident, isLoading, isError, refetch } = useResident(id);
  const [tab, setTab] = useState<Tab>('Info');

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
        <ScreenHeader title="Residente" />
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (isError || !resident) {
    return (
      <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
        <ScreenHeader title="Residente" />
        <ErrorState
          title="No se encontró el residente"
          message="Puede que no tengas autorización para consultarlo."
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  const nombre = `${resident.first_name} ${resident.last_name}`;

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <ScreenHeader title={nombre} subtitle={edadLabel(resident.birthdate)} />

      <View className="flex-row items-center gap-3 px-5 pb-3">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-arguello-blue/10">
          <Text className="font-semibold text-h4 text-arguello-blue">
            {iniciales(resident.first_name, resident.last_name)}
          </Text>
        </View>
        <ResidentStatusBadge status={resident.status} />
      </View>

      <View className="flex-row gap-2 border-b border-line px-5">
        {TABS.map((t) => (
          <Pressable
            key={t}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === t }}
            onPress={() => setTab(t)}
            className={`border-b-2 px-2 pb-2 ${tab === t ? 'border-arguello-blue' : 'border-transparent'}`}>
            <Text
              className={`text-body-sm ${tab === t ? 'font-semibold text-arguello-blue' : 'text-ink-secondary'}`}>
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerClassName="gap-3 px-5 py-4">
        {tab === 'Info' && <InfoTab resident={resident} />}
        {tab === 'Novedades' && <NovedadesTab minorId={resident.id} />}
        {tab === 'Historial' && <HistorialTab minorId={resident.id} />}
        {tab === 'Actividades' && <ActividadesTab minorId={resident.id} />}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="gap-0.5">
      <Text className="text-caption text-ink-secondary">{label}</Text>
      <Text className="text-body-md text-ink">{value}</Text>
    </View>
  );
}

function InfoTab({ resident }: { resident: Resident }) {
  return (
    <View className="gap-4 rounded-lg border border-line bg-canvas p-4">
      <Row label="Nombre completo" value={`${resident.first_name} ${resident.last_name}`} />
      <Row label="Fecha de nacimiento" value={formatFecha(resident.birthdate)} />
      <Row label="Edad" value={edadLabel(resident.birthdate)} />
      <Row label="Obra social" value={resident.health_insurance ?? 'Sin datos'} />
      {resident.emergency_contact ? (
        <Row
          label="Contacto de emergencia"
          value={`${resident.emergency_contact.name} (${resident.emergency_contact.relationship}) · ${resident.emergency_contact.phone}`}
        />
      ) : (
        <Row label="Contacto de emergencia" value="Sin datos" />
      )}
    </View>
  );
}

function PendingFeatureNote({ feature }: { feature: string }) {
  return (
    <AlertCard
      variant="info"
      title={`Registro pendiente (${feature})`}
      message={`El alta de registros desde esta sección se implementa en ${feature}. Por ahora es de sólo lectura.`}
    />
  );
}

function NovedadesTab({ minorId }: { minorId: string }) {
  const { data, isLoading } = useObservations(minorId);
  if (isLoading) return <LoadingState />;
  const items = data ?? [];
  return (
    <View className="gap-3">
      <PendingFeatureNote feature="F2" />
      {items.length === 0 ? (
        <EmptyState icon="document-text-outline" title="No hay novedades registradas" />
      ) : (
        items.map((o) => (
          <View key={o.id} className="gap-1 rounded-md border border-line bg-canvas p-3">
            <Text className="font-semibold text-body-sm text-arguello-blue">
              {OBSERVATION_CATEGORY_LABELS[o.category]}
            </Text>
            <Text className="text-body-md text-ink">{o.content}</Text>
            <Text className="text-caption text-ink-secondary">
              {formatFechaHora(o.observation_date)} · {o.reported_by_name}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

function HistorialTab({ minorId }: { minorId: string }) {
  const observations = useObservations(minorId);
  const activities = useActivities(minorId);
  if (observations.isLoading || activities.isLoading) return <LoadingState />;

  const entries = [
    ...(observations.data ?? []).map((o) => ({
      at: o.observation_date,
      kind: 'Novedad',
      text: o.content,
      by: o.reported_by_name,
    })),
    ...(activities.data ?? []).map((a) => ({
      at: a.created_at,
      kind: 'Actividad',
      text: a.observations ?? a.activity_type,
      by: a.created_by_name,
    })),
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at));

  if (entries.length === 0) {
    return <EmptyState icon="time-outline" title="No hay registros para mostrar" />;
  }

  return (
    <View className="gap-3">
      <PendingFeatureNote feature="F3" />
      {entries.map((e, i) => (
        <View key={i} className="gap-1 rounded-md border border-line bg-canvas p-3">
          <View className="flex-row items-center justify-between">
            <Text className="font-semibold text-caption text-ink-secondary">{e.kind}</Text>
            <Text className="text-caption text-ink-secondary">{formatFechaHora(e.at)}</Text>
          </View>
          <Text className="text-body-md text-ink">{e.text}</Text>
          <Text className="text-caption text-ink-secondary">{e.by}</Text>
        </View>
      ))}
    </View>
  );
}

function ActividadesTab({ minorId }: { minorId: string }) {
  const { data, isLoading } = useActivities(minorId);
  if (isLoading) return <LoadingState />;
  const items = data ?? [];
  return (
    <View className="gap-3">
      <PendingFeatureNote feature="F4" />
      {items.length === 0 ? (
        <EmptyState icon="checkbox-outline" title="No hay actividades para hoy" />
      ) : (
        items.map((a) => <ActivityCard key={a.id} activity={a} />)
      )}
    </View>
  );
}
