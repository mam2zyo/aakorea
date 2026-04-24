import { type ReactNode } from 'react';
import { ThemeContext, type ThemeContextType } from './ThemeContext';

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
