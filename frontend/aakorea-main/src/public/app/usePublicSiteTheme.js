import { useEffect, useEffectEvent, useState } from 'react'
import { PUBLIC_ACTIVE_THEME_STORAGE_KEY } from '../../app/themeDocument'
import { publicSiteThemeApi } from '../../lib/api'
import { DEFAULT_PUBLIC_THEME_ID, isPublicThemeId } from './publicTheme'

function readInitialActiveThemeId() {
  if (typeof document !== 'undefined') {
    const bootstrappedThemeId = document.documentElement.dataset.publicActiveTheme
    if (isPublicThemeId(bootstrappedThemeId)) {
      return bootstrappedThemeId
    }
  }

  try {
    const storedThemeId = window.localStorage.getItem(PUBLIC_ACTIVE_THEME_STORAGE_KEY)
    if (isPublicThemeId(storedThemeId)) {
      return storedThemeId
    }
  } catch {
    // Ignore storage failures and fall back to the default theme.
  }

  return DEFAULT_PUBLIC_THEME_ID
}

function persistActiveThemeId(themeId) {
  try {
    window.localStorage.setItem(PUBLIC_ACTIVE_THEME_STORAGE_KEY, themeId)
  } catch {
    // Ignore storage failures and keep the in-memory theme.
  }
}

export function usePublicSiteTheme() {
  const [activeThemeId, setActiveThemeIdState] = useState(() => readInitialActiveThemeId())
  const [activeThemeLoaded, setActiveThemeLoaded] = useState(false)
  const [activeThemeLoading, setActiveThemeLoading] = useState(false)

  function setActiveThemeId(nextThemeId) {
    const normalizedThemeId = isPublicThemeId(nextThemeId)
      ? nextThemeId
      : DEFAULT_PUBLIC_THEME_ID

    setActiveThemeIdState(normalizedThemeId)
    persistActiveThemeId(normalizedThemeId)
  }

  async function refreshActiveTheme() {
    setActiveThemeLoading(true)

    try {
      const data = await publicSiteThemeApi.getPublicTheme()
      setActiveThemeId(data?.activeThemeId)
    } catch {
      setActiveThemeIdState((currentThemeId) => currentThemeId)
    } finally {
      setActiveThemeLoading(false)
      setActiveThemeLoaded(true)
    }
  }

  const refreshActiveThemeEffect = useEffectEvent(() => {
    void refreshActiveTheme()
  })

  useEffect(() => {
    refreshActiveThemeEffect()
  }, [])

  return {
    activeThemeId,
    activeThemeLoaded,
    activeThemeLoading,
    refreshActiveTheme,
    setActiveThemeId,
  }
}
