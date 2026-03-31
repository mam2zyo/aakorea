import { useState } from 'react'
import { EmptyState, PageSection } from '../../components/ui'
import { sanitizeAdminRedirect } from '../../app/router'

const INITIAL_AUTH_FORM = { username: '', password: '' }

export function AdminLoginPage({
  authPending,
  onLogin,
  redirectPath,
  session,
  sessionChecked,
}) {
  const [authForm, setAuthForm] = useState(INITIAL_AUTH_FORM)

  return (
    <PageSection
      label="Admin Auth"
      title="운영 세션을 시작합니다."
      description="운영 화면은 세션 기반 인증으로 보호되며, 로그인 후 District와 Group 작업공간으로 이동합니다."
    >
      {sessionChecked && session.authenticated ? (
        <EmptyState
          title="이미 로그인되어 있습니다."
          description="운영 기본 화면으로 이동하고 있습니다."
        />
      ) : (
        <form
          className="field-grid"
          onSubmit={(event) => {
            event.preventDefault()
            void onLogin(authForm, sanitizeAdminRedirect(redirectPath))
          }}
        >
          <label className="field">
            <span className="field__label">아이디</span>
            <input
              placeholder="admin"
              value={authForm.username}
              onChange={(event) =>
                setAuthForm((previous) => ({
                  ...previous,
                  username: event.target.value,
                }))
              }
            />
          </label>

          <label className="field">
            <span className="field__label">비밀번호</span>
            <input
              type="password"
              placeholder="password"
              value={authForm.password}
              onChange={(event) =>
                setAuthForm((previous) => ({
                  ...previous,
                  password: event.target.value,
                }))
              }
            />
          </label>

          <div className="auth-note">
            로그인 후 이동 경로: <strong>{sanitizeAdminRedirect(redirectPath)}</strong>
          </div>

          <div className="button-row button-row--compact">
            <button
              className="primary-button"
              type="submit"
              disabled={authPending}
            >
              {authPending ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </form>
      )}
    </PageSection>
  )
}
