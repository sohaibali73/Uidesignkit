import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  accentColor: string;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
  const [accentColor, setAccentColorState] = useState<string>('#FEC00F');

  // Load theme and accent color from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('user_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.appearance?.theme) {
          setThemeState(parsed.appearance.theme as Theme);
        }
        if (parsed.appearance?.accentColor) {
          setAccentColorState(parsed.appearance.accentColor);
        }
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        document.documentElement.classList.add('dark');
        setResolvedTheme('dark');
      } else {
        document.documentElement.classList.remove('dark');
        setResolvedTheme('light');
      }
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      applyTheme(theme === 'dark');
    }
  }, [theme]);

  // Apply accent color when it changes
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--accent-text-color', getAccentTextColor(accentColor));
  }, [accentColor]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    // Save to localStorage
    const savedSettings = localStorage.getItem('user_settings');
    let settings = {};
    if (savedSettings) {
      try {
        settings = JSON.parse(savedSettings);
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
    const updatedSettings = {
      ...settings,
      appearance: {
        ...(settings as any).appearance,
        theme: newTheme,
      },
    };
    localStorage.setItem('user_settings', JSON.stringify(updatedSettings));
  };

  const setAccentColor = (color: string) => {
    setAccentColorState(color);
    // Save to localStorage
    const savedSettings = localStorage.getItem('user_settings');
    let settings = {};
    if (savedSettings) {
      try {
        settings = JSON.parse(savedSettings);
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
    const updatedSettings = {
      ...settings,
      appearance: {
        ...(settings as any).appearance,
        accentColor: color,
      },
    };
    localStorage.setItem('user_settings', JSON.stringify(updatedSettings));
  };

  // Helper function to determine if accent color needs dark text
  const getAccentTextColor = (color: string) => {
    // Simple luminance check to determine if text should be dark or light
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 140 ? '#212121' : '#FFFFFF';
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, accentColor, setTheme, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
