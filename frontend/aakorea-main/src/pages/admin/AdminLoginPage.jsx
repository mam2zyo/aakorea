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
      label="Admin Login"
      title="운영 콘솔 로그인"
      description="관리자 메뉴는 로그인 후 접근할 수 있습니다."
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
              autoComplete="username"
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
              autoComplete="current-password"
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
