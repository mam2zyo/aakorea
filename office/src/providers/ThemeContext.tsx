import React, { createContext, useContext, ReactNode } from 'react';

interface ThemeContextType {
  resolvedTheme: 'light' | 'dark';
  themePreference: 'light' | 'dark' | 'system';
  systemTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  resolvedTheme: 'light',
  themePreference: 'system',
  systemTheme: 'light',
});

export function ThemeProvider({ children, value }: { children: ReactNode; value?: ThemeContextType }) {
  const defaultValue: ThemeContextType = value || {
    resolvedTheme: 'light',
    themePreference: 'system',
    systemTheme: 'light',
  };

  return (
    <ThemeContext.Provider value={defaultValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useOfficeThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useOfficeThemeContext must be used within a ThemeProvider');
  }
  return context;
}
