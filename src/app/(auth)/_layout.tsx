import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Redirect href="/(tabs)/inicio" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
