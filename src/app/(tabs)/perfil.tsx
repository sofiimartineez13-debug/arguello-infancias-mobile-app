import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { useAuth } from '@/hooks/useAuth';
import { iniciales } from '@/utils/formatters';

const ROLE_LABEL: Record<string, string> = {
  educador: 'Educador/a',
  operador_convivencial: 'Operador/a convivencial',
  tecnico: 'Técnico/a',
};

export default function PerfilScreen() {
  const { user, logout } = useAuth();

  function onLogout() {
    Alert.alert('Cerrar sesión', '¿Querés salir de tu cuenta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  }

  const [first = '', last = ''] = (user?.full_name ?? '').split(' ');

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <ScrollView contentContainerClassName="gap-6 px-5 py-4">
        <Text className="font-bold text-h1 text-ink">Perfil</Text>

        <View className="items-center gap-2">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-arguello-blue/10">
            <Text className="font-semibold text-h2 text-arguello-blue">
              {iniciales(first || 'A', last || 'I')}
            </Text>
          </View>
          <Text className="font-semibold text-h3 text-ink">{user?.full_name}</Text>
          <Text className="text-body-sm text-ink-secondary">
            {ROLE_LABEL[user?.role ?? ''] ?? user?.role}
          </Text>
        </View>

        <View className="gap-3 rounded-lg border border-line bg-canvas p-4">
          <View className="flex-row items-center gap-3">
            <Ionicons name="mail-outline" size={20} color="#6B7280" />
            <Text className="text-body-md text-ink">{user?.email}</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />
            <Text className="text-body-md text-ink">Acceso limitado a NNA asignados</Text>
          </View>
        </View>

        <SecondaryButton label="Cerrar sesión" onPress={onLogout} />
      </ScrollView>
    </SafeAreaView>
  );
}
