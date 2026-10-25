import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'review_signal_theme';

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (item === 'light' || item === 'dark' || item === 'system') {
      return item;
    }
  } catch {
    // localStorage not accessible
  }
  return 'system';
}

export function applyThemeToDOM(theme: ThemeMode): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'dark';
  
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  const root = document.documentElement;

  if (resolved === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
  }

  return resolved;
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => getStoredTheme());
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    const initial = getStoredTheme();
    return initial === 'system' ? getSystemTheme() : initial;
  });

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // ignore
    }
    const resolved = applyThemeToDOM(newTheme);
    setResolvedTheme(resolved);
  }, []);

  useEffect(() => {
    // Initial application
    const resolved = applyThemeToDOM(theme);
    setResolvedTheme(resolved);

    // Watch OS system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      const currentStored = getStoredTheme();
      if (currentStored === 'system') {
        const nextResolved = applyThemeToDOM('system');
        setResolvedTheme(nextResolved);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  return {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    setTheme,
  };
}
