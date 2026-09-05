import { Redirect } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';

/** Punto de entrada: deriva a login o a la app según haya sesión. */
export default function Index() {
  const { isAuthenticated } = useAuth();
  return <Redirect href={isAuthenticated ? '/(tabs)/inicio' : '/(auth)/login'} />;
}
