import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';

const CRITICAL = '#DC3545';
const ACTIVE = '#007AFF';
const INACTIVE = '#9CA3AF';

export default function TabsLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarLabelStyle: { fontSize: 11 },
        tabBarStyle: { borderTopColor: '#E5E7EB' },
        sceneStyle: { backgroundColor: '#FFFFFF' },
      }}>
      <Tabs.Screen
        name="inicio"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="residentes"
        options={{
          title: 'Residentes',
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="turno"
        options={{
          title: 'Mi turno',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="critica"
        options={{
          title: 'Crítica',
          tabBarActiveTintColor: CRITICAL,
          tabBarInactiveTintColor: CRITICAL,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
          tabBarIcon: ({ size }) => <Ionicons name="warning" color={CRITICAL} size={size} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
