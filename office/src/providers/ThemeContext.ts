import { createContext, useContext } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextType {
  /** OS 설정 또는 사용자 선택에 따라 실제 적용된 테마 */
  resolvedTheme: ResolvedTheme;
  /** 사용자가 명시적으로 선택한 테마 선호도 */
  themePreference: ThemePreference;
  /** OS 다크모드 여부 */
  systemTheme: ResolvedTheme;
  /** 테마 선호도 변경 */
  setThemePreference: (preference: ThemePreference) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  resolvedTheme: 'dark',
  themePreference: 'system',
  systemTheme: 'dark',
  setThemePreference: () => undefined,
});

export function useOfficeTheme() {
  return useContext(ThemeContext);
}

/** @deprecated useOfficeTheme 으로 교체 예정 */
export function useOfficeThemeContext() {
  return useContext(ThemeContext);
}
