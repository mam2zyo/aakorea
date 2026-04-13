import { useState } from 'react'
import { EmptyState, Field, PageSection } from '@/admin/ui'
import { buildAdminLoginPath } from '@/admin/app/router'
import { getApiFieldErrors, omitFieldErrors, readFieldError } from '@/shared/lib/formErrors'

const INITIAL_REGISTER_FORM = {
  email: '',
  displayName: '',
  password: '',
  passwordConfirm: '',
}

export function AdminRegisterPage({
  authPending,
  onNavigate,
  onError,
  onRegister,
  session,
  sessionChecked,
}) {
  const [form, setForm] = useState(INITIAL_REGISTER_FORM)
  const [formErrors, setFormErrors] = useState({})

  if (sessionChecked && session.authenticated) {
    return (
      <PageSection
        label="Office Register"
        title="이미 로그인되어 있습니다."
        description="현재 계정 상태에 맞는 화면으로 이동하고 있습니다."
      >
        <EmptyState
          title="등록이 필요하지 않습니다."
          description="현재 로그인 상태에서는 새 GSO Staff 등록 화면을 열 수 없습니다."
        />
      </PageSection>
    )
  }

  return (
    <PageSection
      label="Office Register"
      title="GSO Staff 등록"
      description="등록 후에는 업무 승인과 권한 부여가 완료될 때까지 업무 메뉴에 접근할 수 없습니다."
    >
      <form
        className="field-grid"
        onSubmit={(event) => {
          event.preventDefault()
          void submitRegistration()
        }}
      >
        <Field label="이메일" error={readFieldError(formErrors, 'email')}>
          <input
            autoComplete="email"
            placeholder="staff@aakorea.org"
            value={form.email}
            disabled={authPending}
            onChange={(event) => {
              setForm((previous) => ({
                ...previous,
                email: event.target.value,
              }))
              setFormErrors((previous) => omitFieldErrors(previous, 'email'))
            }}
          />
        </Field>

        <Field label="이름" error={readFieldError(formErrors, 'displayName')}>
          <input
            autoComplete="name"
            placeholder="홍길동"
            value={form.displayName}
            disabled={authPending}
            onChange={(event) => {
              setForm((previous) => ({
                ...previous,
                displayName: event.target.value,
              }))
              setFormErrors((previous) => omitFieldErrors(previous, 'displayName'))
            }}
          />
        </Field>

        <Field label="비밀번호" error={readFieldError(formErrors, 'password')}>
          <input
            autoComplete="new-password"
            type="password"
            value={form.password}
            disabled={authPending}
            onChange={(event) => {
              setForm((previous) => ({
                ...previous,
                password: event.target.value,
              }))
              setFormErrors((previous) => omitFieldErrors(previous, 'password', 'passwordConfirm'))
            }}
          />
        </Field>

        <Field label="비밀번호 확인" error={readFieldError(formErrors, 'passwordConfirm')}>
          <input
            autoComplete="new-password"
            type="password"
            value={form.passwordConfirm}
            disabled={authPending}
            onChange={(event) => {
              setForm((previous) => ({
                ...previous,
                passwordConfirm: event.target.value,
              }))
              setFormErrors((previous) => omitFieldErrors(previous, 'passwordConfirm'))
            }}
          />
        </Field>

        <div className="empty-state">
          <strong>등록 후 진행 방식</strong>
          <p>계정은 Staff 역할의 승인 대기 상태로 생성되며, 승인과 업무 권한 설정이 완료되면 등록한 이메일로 안내할 예정입니다.</p>
        </div>

        <div className="button-row button-row--compact">
          <button className="primary-button" type="submit" disabled={authPending}>
            {authPending ? '등록 중...' : 'GSO Staff 등록'}
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={() => onNavigate(buildAdminLoginPath())}
            disabled={authPending}
          >
            로그인으로 돌아가기
          </button>
        </div>
      </form>
    </PageSection>
  )

  async function submitRegistration() {
    if (form.password !== form.passwordConfirm) {
      setFormErrors({
        passwordConfirm: '비밀번호 확인이 일치하지 않습니다.',
      })
      return
    }

    try {
      await onRegister({
        email: form.email,
        displayName: form.displayName,
        password: form.password,
      })
      setForm(INITIAL_REGISTER_FORM)
      setFormErrors({})
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setFormErrors(fieldErrors)
        return
      }

      setFormErrors({})
      onError(error, 'GSO Staff 등록에 실패했습니다.')
    }
  }
}
