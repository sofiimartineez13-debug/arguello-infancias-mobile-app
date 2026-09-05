import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CriticalButton } from '@/components/ui/CriticalButton';
import { LoadingState } from '@/components/common/LoadingState';
import { useAuth } from '@/hooks/useAuth';
import { useShiftInfo } from '@/hooks/useShiftInfo';
import { formatHora } from '@/utils/formatters';

const SHIFT_STATUS_LABEL = {
  por_iniciar: 'Por iniciar',
  activo: 'Activo',
  finalizado: 'Finalizado',
} as const;

type QuickAction = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: Parameters<typeof router.push>[0];
};

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Residentes', icon: 'people-outline', href: '/(tabs)/residentes' },
  { label: 'Mi turno', icon: 'clipboard-outline', href: '/(tabs)/turno' },
  { label: 'Registrar novedad', icon: 'create-outline', href: '/(tabs)/residentes' },
  { label: 'Registrar actividad', icon: 'checkbox-outline', href: '/(tabs)/residentes' },
];

export default function InicioScreen() {
  const { user } = useAuth();
  const { data, isLoading } = useShiftInfo();

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <ScrollView contentContainerClassName="gap-6 px-5 py-4">
        <View className="gap-1">
          <Text className="text-body-sm text-ink-secondary">Hola,</Text>
          <Text className="font-bold text-h1 text-ink">{user?.full_name ?? 'Educador/a'}</Text>
        </View>

        {isLoading || !data ? (
          <View className="h-28">
            <LoadingState message="Cargando turno…" />
          </View>
        ) : (
          <View className="gap-2 rounded-lg border border-line bg-surface p-4">
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold text-h4 text-ink">Turno de hoy</Text>
              <Text className="font-semibold text-caption text-arguello-blue">
                {SHIFT_STATUS_LABEL[data.shift.status]}
              </Text>
            </View>
            <Text className="text-body-md text-ink">
              {formatHora(data.shift.starts_at)} – {formatHora(data.shift.ends_at)}
            </Text>
            <Text className="text-body-sm text-ink-secondary">
              {data.shift.assigned_minor_ids.length} NNA a cargo · {data.pending_tasks.length} tareas
              pendientes
            </Text>
          </View>
        )}

        <View className="flex-row flex-wrap gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Pressable
              key={action.label}
              accessibilityRole="button"
              onPress={() => router.push(action.href)}
              className="min-w-[45%] flex-1 items-start gap-2 rounded-lg border border-line bg-canvas p-4 active:bg-surface">
              <Ionicons name={action.icon} size={24} color="#007AFF" />
              <Text className="font-medium text-body-md text-ink">{action.label}</Text>
            </Pressable>
          ))}
        </View>

        <View className="gap-2 rounded-lg border-2 border-critical/20 bg-critical/5 p-4">
          <Text className="font-semibold text-h4 text-critical">¿Situación crítica?</Text>
          <Text className="text-body-sm text-ink-secondary">
            Usá este acceso sólo ante una situación que deba reportarse como crítica.
          </Text>
          <CriticalButton label="Reportar situación crítica" onPress={() => router.push('/(tabs)/critica')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
