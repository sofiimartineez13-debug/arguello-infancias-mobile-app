import { QueryClient } from '@tanstack/react-query';

/**
 * QueryClient compartido. Los hooks de datos (src/hooks/use*) están escritos
 * como queries de React Query aunque hoy resuelven contra datos mock, para que
 * conectar Supabase después sea sólo cambiar la función `queryFn`.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
