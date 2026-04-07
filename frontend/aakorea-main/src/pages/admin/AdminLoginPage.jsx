import { useState } from 'react'
import { EmptyState, PageSection } from '../../admin/ui'
import { buildAdminRegisterPath, sanitizeAdminRedirect } from '../../app/router'

const INITIAL_AUTH_FORM = { email: '', password: '' }

export function AdminLoginPage({
  authPending,
  onLogin,
  onNavigate,
  redirectPath,
  session,
  sessionChecked,
}) {
  const [authForm, setAuthForm] = useState(INITIAL_AUTH_FORM)

  return (
    <PageSection
      label="Office Login"
      title="GSO 업무 시스템 로그인"
      description="승인된 운영 계정만 office 업무 메뉴에 접근할 수 있습니다."
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
            <span className="field__label">이메일</span>
            <input
              autoComplete="email"
              placeholder="staff@aakorea.org"
              value={authForm.email}
              onChange={(event) =>
                setAuthForm((previous) => ({
                  ...previous,
                  email: event.target.value,
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
            <button
              className="ghost-button"
              type="button"
              onClick={() => onNavigate(buildAdminRegisterPath())}
              disabled={authPending}
            >
              GSO Staff 등록
            </button>
          </div>
        </form>
      )}
    </PageSection>
  )
}
