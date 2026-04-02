import { useEffect, useEffectEvent, useState } from 'react'
import { authApi } from '../../lib/api'
import { ApiError } from '../../shared/lib/request'
import { navigate } from '../router'

const UNAUTHENTICATED_SESSION = {
  authenticated: false,
  username: null,
}

export function useAdminSession(route, { onError }) {
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
    if (route.section !== 'admin') {
      setSessionChecked(false)
      return
    }

    // public 화면은 SEO/분리 배포를 염두에 두고 관리자 세션 확인과 분리한다.
    checkSessionEffect()
  }, [route.section])

  async function handleLogin(credentials, redirectPath) {
    setAuthPending(true)

    try {
      const authStatus = await authApi.login(credentials)
      setSession(authStatus)
      setSessionChecked(true)
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
      navigate(redirectPath, { replace: true })
    } catch (error) {
      onError(error, '로그아웃에 실패했습니다.')
    } finally {
      setAuthPending(false)
    }
  }

  return {
    authPending,
    handleLogin,
    handleLogout,
    session,
    sessionChecked,
  }
}
