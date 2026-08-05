import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'colorful' | 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'colorful', // Default to colorful
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('colorful-theme');
          } else if (theme === 'colorful') {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('colorful-theme');
          } else {
            document.documentElement.classList.remove('dark', 'colorful-theme');
          }
        }
      },
    }),
    {
      name: 'trinetra-theme',
    }
  )
);
