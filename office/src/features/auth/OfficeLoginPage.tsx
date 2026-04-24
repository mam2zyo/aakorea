import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState, OfficePageHeader, Field } from '@/shared/components/ui';
import type { UserSession } from '@/shared/types/auth';

const INITIAL_AUTH_FORM = { email: '', password: '' };

interface OfficeLoginPageProps {
  authPending?: boolean;
  onLogin: (credentials: typeof INITIAL_AUTH_FORM, redirectPath: string) => Promise<any>;
  redirectPath?: string;
  session: UserSession;
  sessionChecked: boolean;
}

export function OfficeLoginPage({
  authPending,
  onLogin,
  redirectPath = '/office',
  session,
  sessionChecked,
}: OfficeLoginPageProps) {
  const [authForm, setAuthForm] = useState(INITIAL_AUTH_FORM);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await onLogin(authForm, redirectPath);
    } catch (err: any) {
      setError(err.message || '로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="office-theme office-surface" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <OfficePageHeader
          eyebrow="GSO 업무 시스템"
          title="로그인"
          description="승인된 운영 계정으로 접속해 주세요."
        />

        <div className="panel" style={{ marginTop: '2rem' }}>
          {sessionChecked && session.authenticated ? (
            <EmptyState
              title="이미 로그인되어 있습니다."
              description="잠시 후 메인 화면으로 이동합니다."
            />
          ) : (
            <form className="field-grid" onSubmit={handleSubmit}>
              {error && (
                <div style={{ color: 'var(--color-danger)', backgroundColor: 'var(--color-danger-soft)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                  {error}
                </div>
              )}
              <Field label="이메일">
                <input
                  className="office-input"
                  autoComplete="email"
                  placeholder="staff@aakorea.org"
                  value={authForm.email}
                  disabled={authPending}
                  onChange={(event) =>
                    setAuthForm((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }))
                  }
                />
              </Field>

              <Field label="비밀번호">
                <input
                  className="office-input"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={authForm.password}
                  disabled={authPending}
                  onChange={(event) =>
                    setAuthForm((previous) => ({
                      ...previous,
                      password: event.target.value,
                    }))
                  }
                />
              </Field>

              <div className="button-row" style={{ marginTop: '1.5rem', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  className="primary-button"
                  type="submit"
                  disabled={authPending}
                  style={{ width: '100%' }}
                >
                  {authPending ? '로그인 처리 중...' : '로그인'}
                </button>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => navigate('/office/register')}
                  disabled={authPending}
                  style={{ width: '100%' }}
                >
                  새 운영자 등록 신청
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
