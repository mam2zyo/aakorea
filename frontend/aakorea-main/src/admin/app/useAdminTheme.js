import { useEffect, useState } from 'react'
import {
  ADMIN_THEME_STORAGE_KEY,
  DEFAULT_ADMIN_THEME_PREFERENCE,
  normalizeAdminThemePreference,
} from '../../app/themeDocument'

function readStoredThemePreference() {
  if (typeof window === 'undefined') {
    return DEFAULT_ADMIN_THEME_PREFERENCE
  }

  try {
    const storedValue = window.localStorage.getItem(ADMIN_THEME_STORAGE_KEY)
    return normalizeAdminThemePreference(storedValue)
  } catch {
    return DEFAULT_ADMIN_THEME_PREFERENCE
  }
}

function readSystemTheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function useAdminTheme() {
  const [themePreference, setThemePreferenceState] = useState(() => readStoredThemePreference())
  const [systemTheme, setSystemTheme] = useState(() => readSystemTheme())

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (event) => {
      setSystemTheme(event.matches ? 'dark' : 'light')
    }
    const handleStorageChange = (event) => {
      if (event.key === ADMIN_THEME_STORAGE_KEY) {
        setThemePreferenceState(readStoredThemePreference())
      }
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleSystemThemeChange)
    } else {
      mediaQuery.addListener(handleSystemThemeChange)
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleSystemThemeChange)
      } else {
        mediaQuery.removeListener(handleSystemThemeChange)
      }

      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.setItem(ADMIN_THEME_STORAGE_KEY, themePreference)
    } catch {
      // Ignore storage failures and keep the in-memory preference.
    }
  }, [themePreference])

  function setThemePreference(nextPreference) {
    const normalizedPreference = normalizeAdminThemePreference(nextPreference)
    if (normalizedPreference !== nextPreference) {
      return
    }

    setThemePreferenceState(normalizedPreference)
  }

  const resolvedTheme = themePreference === 'system'
    ? systemTheme
    : themePreference

  return {
    resolvedTheme,
    setThemePreference,
    systemTheme,
    themePreference,
  }
}
