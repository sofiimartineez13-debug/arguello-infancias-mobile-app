import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityCard } from '@/components/ActivityCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ResidentStatusBadge } from '@/components/ui/StatusBadge';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useActivities } from '@/hooks/useActivities';
import { useCriticalIncidents } from '@/hooks/useCriticalIncidents';
import { useObservations } from '@/hooks/useObservations';
import { useResident } from '@/hooks/useResidents';
import type { Resident } from '@/types/resident';
import type { HistoryEntry } from '@/types/history';
import {
  ACTIVITY_TYPE_LABELS,
  CRITICAL_INCIDENT_TYPE_LABELS,
  labelOrRaw,
  OBSERVATION_CATEGORY_LABELS,
} from '@/utils/constants';
import { agruparPorDia, edadLabel, formatFecha, formatFechaHora, formatHora, iniciales } from '@/utils/formatters';

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

  const nombre = `${resident.nombre} ${resident.apellido}`;

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <ScreenHeader title={nombre} subtitle={edadLabel(resident.fecha_nacimiento)} />

      <View className="flex-row items-center gap-3 px-5 pb-3">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-arguello-blue/10">
          <Text className="font-semibold text-h4 text-arguello-blue">
            {iniciales(resident.nombre, resident.apellido)}
          </Text>
        </View>
        <ResidentStatusBadge status={resident.estado_actual} />
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
      <Row label="Nombre completo" value={`${resident.nombre} ${resident.apellido}`} />
      <Row label="Fecha de nacimiento" value={formatFecha(resident.fecha_nacimiento)} />
      <Row label="Edad" value={edadLabel(resident.fecha_nacimiento)} />
      <Row label="Obra social" value={resident.obra_social ?? 'Sin datos'} />
      {resident.contacto_emergencia ? (
        <Row
          label="Contacto de emergencia"
          value={`${resident.contacto_emergencia.nombre} ${resident.contacto_emergencia.apellido} (${resident.contacto_emergencia.parentesco})${resident.contacto_emergencia.telefono ? ` · ${resident.contacto_emergencia.telefono}` : ''}`}
        />
      ) : (
        <Row label="Contacto de emergencia" value="Sin datos" />
      )}
      {resident.alertas_importantes ? (
        <Row label="Alertas importantes" value={resident.alertas_importantes} />
      ) : null}
    </View>
  );
}

function NovedadesTab({ minorId }: { minorId: string }) {
  const { data, isLoading } = useObservations(minorId);
  if (isLoading) return <LoadingState />;
  const items = data ?? [];
  return (
    <View className="gap-3">
      <PrimaryButton
        label="+ Nueva novedad"
        fullWidth={false}
        onPress={() => router.push({ pathname: '/nueva-novedad', params: { minorId } })}
      />
      {items.length === 0 ? (
        <EmptyState icon="document-text-outline" title="No hay novedades registradas" />
      ) : (
        items.map((o) => (
          <View key={o.id} className="gap-1 rounded-md border border-line bg-canvas p-3">
            <Text className="font-semibold text-body-sm text-arguello-blue">
              {labelOrRaw(OBSERVATION_CATEGORY_LABELS, o.tipo)}
            </Text>
            <Text className="text-body-md text-ink">{o.descripcion}</Text>
            <Text className="text-caption text-ink-secondary">
              {formatFechaHora(o.fecha_hora)} · {o.usuario_nombre ?? 'Usuario desconocido'}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

type EntryMeta = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  kindLabel: string;
  tipoLabel: string;
  resumen: string;
  usuario: string;
};

function entryMeta(entry: HistoryEntry): EntryMeta {
  switch (entry.kind) {
    case 'novedad':
      return {
        icon: 'document-text-outline',
        color: '#007AFF',
        kindLabel: 'Novedad',
        tipoLabel: labelOrRaw(OBSERVATION_CATEGORY_LABELS, entry.data.tipo),
        resumen: entry.data.descripcion,
        usuario: entry.data.usuario_nombre ?? 'Usuario desconocido',
      };
    case 'actividad': {
      const tipoLabel = labelOrRaw(ACTIVITY_TYPE_LABELS, entry.data.tipo);
      return {
        icon: 'checkbox-outline',
        color: '#28A745',
        kindLabel: 'Actividad',
        tipoLabel,
        resumen: entry.data.observaciones ?? tipoLabel,
        usuario: entry.data.created_by_nombre ?? 'Usuario desconocido',
      };
    }
    case 'critica':
      return {
        icon: 'warning',
        color: '#DC3545',
        kindLabel: 'Situación crítica',
        tipoLabel: labelOrRaw(CRITICAL_INCIDENT_TYPE_LABELS, entry.data.tipo),
        resumen: entry.data.descripcion,
        usuario: entry.data.reportado_por_nombre ?? 'Usuario desconocido',
      };
  }
}

function HistorialTab({ minorId }: { minorId: string }) {
  const observations = useObservations(minorId);
  const activities = useActivities(minorId);
  const criticas = useCriticalIncidents(minorId);
  if (observations.isLoading || activities.isLoading || criticas.isLoading) return <LoadingState />;

  const entries: HistoryEntry[] = [
    ...(observations.data ?? []).map((o): HistoryEntry => ({ kind: 'novedad', at: o.fecha_hora, data: o })),
    ...(activities.data ?? []).map((a): HistoryEntry => ({ kind: 'actividad', at: a.created_at, data: a })),
    ...(criticas.data ?? []).map((c): HistoryEntry => ({ kind: 'critica', at: c.fecha_hora, data: c })),
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at));

  if (entries.length === 0) {
    return <EmptyState icon="time-outline" title="No hay registros para mostrar" />;
  }

  const grupos = agruparPorDia(entries, (e) => e.at);

  return (
    <View className="gap-4">
      {grupos.map((grupo) => (
        <View key={grupo.dia} className="gap-2">
          <Text className="font-semibold text-caption text-ink-secondary">{grupo.label}</Text>
          <View className="gap-2">
            {grupo.items.map((entry) => {
              const meta = entryMeta(entry);
              const critica = entry.kind === 'critica';
              return (
                <Pressable
                  key={`${entry.kind}-${entry.data.id}`}
                  accessibilityRole="button"
                  onPress={() =>
                    router.push({
                      pathname: '/historial-detalle',
                      params: { kind: entry.kind, id: entry.data.id, minorId },
                    })
                  }
                  className={`gap-1 rounded-md border p-3 active:bg-surface ${
                    critica ? 'border-critical bg-critical/5' : 'border-line bg-canvas'
                  }`}>
                  <View className="flex-row items-center gap-2">
                    <Ionicons name={meta.icon} size={16} color={meta.color} />
                    <Text
                      className={`flex-1 font-semibold text-caption ${critica ? 'text-critical' : 'text-ink-secondary'}`}>
                      {meta.kindLabel} · {meta.tipoLabel}
                    </Text>
                    <Text className="text-caption text-ink-secondary">{formatHora(entry.at)}</Text>
                  </View>
                  <Text className="text-body-md text-ink" numberOfLines={2}>
                    {meta.resumen}
                  </Text>
                  <Text className="text-caption text-ink-secondary">{meta.usuario}</Text>
                </Pressable>
              );
            })}
          </View>
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
      <PrimaryButton
        label="+ Nueva actividad"
        fullWidth={false}
        onPress={() => router.push({ pathname: '/nueva-actividad', params: { minorId } })}
      />
      {items.length === 0 ? (
        <EmptyState icon="checkbox-outline" title="No hay actividades para hoy" />
      ) : (
        items.map((a) => <ActivityCard key={a.id} activity={a} />)
      )}
    </View>
  );
}
