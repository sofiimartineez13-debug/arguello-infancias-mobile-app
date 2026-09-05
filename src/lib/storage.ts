import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Cache local NO sensible (preferencias, flags, borradores).
 * Nunca guardar datos de NNA ni credenciales acá.
 */
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
      // almacenamiento no disponible: se ignora (la app funciona sin cache)
    }
  },
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // no-op
    }
  },
};

/**
 * Almacenamiento seguro para tokens (JWT). En web SecureStore no existe:
 * se degrada a memoria (los tokens no persisten entre recargas, que es lo deseable).
 */
const memoryStore = new Map<string, string>();

export const secure = {
  async get(key: string): Promise<string | null> {
    if (Platform.OS === 'web') return memoryStore.get(key) ?? null;
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async set(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      memoryStore.set(key, value);
      return;
    }
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // no-op
    }
  },
  async remove(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      memoryStore.delete(key);
      return;
    }
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // no-op
    }
  },
};

export const STORAGE_KEYS = {
  authSession: 'arguello.auth.session',
  uiTheme: 'arguello.ui.theme',
} as const;
