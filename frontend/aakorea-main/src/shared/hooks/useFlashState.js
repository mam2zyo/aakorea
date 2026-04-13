import { useEffect, useState } from 'react'
import { ApiError } from '@/shared/lib/request'

export function useFlashState() {
  const [flash, setFlash] = useState(null)

  useEffect(() => {
    if (!flash) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setFlash(null)
    }, 4000)

    return () => window.clearTimeout(timeoutId)
  }, [flash])

  function showSuccess(message) {
    setFlash({
      tone: 'success',
      message,
    })
  }

  function showError(error, fallbackMessage = '요청을 처리하지 못했습니다.') {
    const message = error instanceof ApiError
      ? error.message
      : error instanceof Error && error.message
        ? error.message
        : fallbackMessage

    setFlash({
      tone: 'error',
      message: message || fallbackMessage,
    })
  }

  return {
    flash,
    showError,
    showSuccess,
  }
}
