import { create } from 'zustand';

import { cache, STORAGE_KEYS } from '@/lib/storage';

/** Tema de la app. El MVP es sólo claro; 'dark' queda para una versión futura. */
export type ThemePreference = 'light' | 'dark';

type UiState = {
  theme: ThemePreference;
  hydrate: () => Promise<void>;
  setTheme: (theme: ThemePreference) => void;
};

export const useUiStore = create<UiState>((set) => ({
  theme: 'light',
  hydrate: async () => {
    const stored = await cache.get<ThemePreference>(STORAGE_KEYS.uiTheme);
    if (stored === 'light' || stored === 'dark') set({ theme: stored });
  },
  setTheme: (theme) => {
    set({ theme });
    void cache.set(STORAGE_KEYS.uiTheme, theme);
  },
}));
