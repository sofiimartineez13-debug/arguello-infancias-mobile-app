import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useActivities } from '@/hooks/useActivities';
import { useCriticalIncidents } from '@/hooks/useCriticalIncidents';
import { useObservations } from '@/hooks/useObservations';
import { useResident } from '@/hooks/useResidents';
import type { HistoryEntry } from '@/types/history';
import {
  ACTIVITY_STATUS_LABELS,
  ACTIVITY_TYPE_LABELS,
  CRITICAL_INCIDENT_TYPE_LABELS,
  labelOrRaw,
  OBSERVATION_CATEGORY_LABELS,
} from '@/utils/constants';
import { formatFechaHora } from '@/utils/formatters';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="gap-0.5">
      <Text className="text-caption text-ink-secondary">{label}</Text>
      <Text className="text-body-md text-ink">{value}</Text>
    </View>
  );
}

/**
 * F3 — WF-08: detalle completo de un registro del historial. Solo lectura.
 * No pega de nuevo a Supabase: busca el registro por id dentro de lo que
 * ya devolvieron `useObservations`/`useActivities`/`useCriticalIncidents`
 * para ese NNA (ya en caché de React Query desde la pestaña Historial).
 */
export default function HistorialDetalleScreen() {
  const { kind, id, minorId } = useLocalSearchParams<{
    kind: HistoryEntry['kind'];
    id: string;
    minorId: string;
  }>();

  const { data: resident } = useResident(minorId);
  const observations = useObservations(minorId);
  const activities = useActivities(minorId);
  const criticas = useCriticalIncidents(minorId);

  if (observations.isLoading || activities.isLoading || criticas.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
        <ScreenHeader title="Detalle" />
        <LoadingState />
      </SafeAreaView>
    );
  }

  const residentName = resident ? `${resident.nombre} ${resident.apellido}` : '—';

  if (kind === 'novedad') {
    const novedad = observations.data?.find((o) => o.id === id);
    if (!novedad) return <NotFound />;
    return (
      <Detail title="Novedad" at={novedad.fecha_hora}>
        <Row label="Tipo" value={labelOrRaw(OBSERVATION_CATEGORY_LABELS, novedad.tipo)} />
        <Row label="NNA" value={residentName} />
        <Row label="Descripción" value={novedad.descripcion} />
        <Row label="Usuario responsable" value={novedad.usuario_nombre ?? 'Usuario desconocido'} />
        <Row label="Fecha y hora" value={formatFechaHora(novedad.fecha_hora)} />
      </Detail>
    );
  }

  if (kind === 'actividad') {
    const actividad = activities.data?.find((a) => a.id === id);
    if (!actividad) return <NotFound />;
    return (
      <Detail title="Actividad" at={actividad.created_at}>
        <Row label="Tipo" value={labelOrRaw(ACTIVITY_TYPE_LABELS, actividad.tipo)} />
        <Row label="Estado" value={ACTIVITY_STATUS_LABELS[actividad.status]} />
        <Row label="NNA" value={residentName} />
        <Row label="Observaciones" value={actividad.observaciones ?? 'Sin observaciones'} />
        <Row label="Usuario responsable" value={actividad.created_by_nombre ?? 'Usuario desconocido'} />
        <Row label="Fecha y hora" value={formatFechaHora(actividad.created_at)} />
      </Detail>
    );
  }

  const critica = criticas.data?.find((c) => c.id === id);
  if (!critica) return <NotFound />;
  return (
    <Detail title="Situación crítica" at={critica.fecha_hora} tone="critical">
      <Row label="Tipo" value={labelOrRaw(CRITICAL_INCIDENT_TYPE_LABELS, critica.tipo)} />
      <Row label="NNA" value={residentName} />
      <Row label="Descripción" value={critica.descripcion} />
      {critica.acciones_tomadas ? (
        <Row label="Acciones tomadas" value={critica.acciones_tomadas} />
      ) : null}
      <Row label="Usuario responsable" value={critica.reportado_por_nombre ?? 'Usuario desconocido'} />
      <Row label="Fecha y hora" value={formatFechaHora(critica.fecha_hora)} />
    </Detail>
  );
}

function Detail({
  title,
  at,
  tone,
  children,
}: {
  title: string;
  at: string;
  tone?: 'default' | 'critical';
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <ScreenHeader title={title} subtitle={formatFechaHora(at)} tone={tone} />
      <ScrollView contentContainerClassName="gap-4 px-5 py-4">
        <View className="gap-4 rounded-lg border border-line bg-surface p-5">{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

function NotFound() {
  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <ScreenHeader title="Detalle" />
      <ErrorState title="No se encontró el registro" />
    </SafeAreaView>
  );
}
