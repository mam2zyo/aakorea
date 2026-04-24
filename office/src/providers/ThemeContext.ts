import { createContext, useContext } from 'react';

export interface ThemeContextType {
  resolvedTheme: 'light' | 'dark';
  themePreference: 'light' | 'dark' | 'system';
  systemTheme: 'light' | 'dark';
}

export const ThemeContext = createContext<ThemeContextType>({
  resolvedTheme: 'light',
  themePreference: 'system',
  systemTheme: 'light',
});

export function useOfficeThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useOfficeThemeContext must be used within a ThemeProvider');
  }
  return context;
}
