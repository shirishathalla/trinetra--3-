'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Initial hydration of class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('colorful-theme');
    } else if (theme === 'colorful') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('colorful-theme');
    } else {
      document.documentElement.classList.remove('dark', 'colorful-theme');
    }
  }, [theme]);

  return <>{children}</>;
}
