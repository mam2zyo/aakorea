import { useEffect, useEffectEvent, useState } from 'react'
import { authApi } from '../../lib/api'
import { ApiError } from '../../shared/lib/request'
import { navigate } from '../router'

const UNAUTHENTICATED_SESSION = {
  authenticated: false,
  username: null,
}

export function useAdminSession(route, { onError, onSuccess }) {
  const [authPending, setAuthPending] = useState(false)
  const [session, setSession] = useState(UNAUTHENTICATED_SESSION)
  const [sessionChecked, setSessionChecked] = useState(false)

  async function checkSession() {
    try {
      const authStatus = await authApi.me()
      setSession(authStatus)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setSession(UNAUTHENTICATED_SESSION)
      } else {
        onError(error, '운영 세션 상태를 확인하지 못했습니다.')
      }
    } finally {
      setSessionChecked(true)
    }
  }

  const checkSessionEffect = useEffectEvent(() => {
    void checkSession()
  })

  useEffect(() => {
    checkSessionEffect()
  }, [])

  async function handleLogin(credentials, redirectPath) {
    setAuthPending(true)

    try {
      const authStatus = await authApi.login(credentials)
      setSession(authStatus)
      setSessionChecked(true)
      onSuccess('운영 세션에 로그인했습니다.')
      navigate(redirectPath, { replace: true })
    } catch (error) {
      onError(error, '로그인에 실패했습니다.')
    } finally {
      setAuthPending(false)
    }
  }

  async function handleLogout(redirectPath = '/') {
    setAuthPending(true)

    try {
      await authApi.logout()
      setSession(UNAUTHENTICATED_SESSION)
      setSessionChecked(true)
      onSuccess('운영 세션에서 로그아웃했습니다.')
      navigate(redirectPath, { replace: true })
    } catch (error) {
      onError(error, '로그아웃에 실패했습니다.')
    } finally {
      setAuthPending(false)
    }
  }

  useEffect(() => {
    if (route.section === 'admin' && !sessionChecked) {
      checkSessionEffect()
    }
  }, [route.section, sessionChecked])

  return {
    authPending,
    handleLogin,
    handleLogout,
    session,
    sessionChecked,
  }
}
