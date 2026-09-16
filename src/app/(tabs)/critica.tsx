import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CriticalButton } from '@/components/ui/CriticalButton';
import { CRITICAL_INCIDENT_TYPE_LABELS } from '@/utils/constants';

export default function CriticaScreen() {
  function onContinuar() {
    router.push('/situacion-critica');
  }

  return (
    <SafeAreaView className="flex-1 bg-critical" edges={['top']}>
      <ScrollView contentContainerClassName="grow gap-6 px-6 py-8">
        <View className="items-center gap-3">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-white/15">
            <Ionicons name="warning" size={36} color="#FFFFFF" />
          </View>
          <Text className="text-center font-bold text-h1 text-white">Situación crítica</Text>
        </View>

        <View className="gap-3 rounded-lg bg-white p-5">
          <Text className="text-body-md text-ink">
            Esta funcionalidad debe utilizarse únicamente cuando exista una situación que requiera
            ser reportada como crítica (violencia, crisis emocional, accidente, fuga, emergencia
            sanitaria u otra que requiera intervención inmediata).
          </Text>
          <Text className="font-semibold text-body-sm text-ink">Tipos de situación:</Text>
          <View className="gap-1">
            {Object.values(CRITICAL_INCIDENT_TYPE_LABELS).map((label) => (
              <Text key={label} className="text-body-sm text-ink-secondary">
                • {label}
              </Text>
            ))}
          </View>
          <Text className="text-caption text-ink-secondary">
            Al continuar se registran fecha, hora exacta y usuario responsable. El registro no puede
            editarse luego.
          </Text>
        </View>

        <View className="mt-auto gap-3">
          <CriticalButton label="Continuar con el reporte" onPress={onContinuar} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
