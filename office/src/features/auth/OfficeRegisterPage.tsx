import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OfficePageHeader, Field } from '@/shared/components/ui';
import { authApi } from '@/shared/api';

const INITIAL_REGISTER_FORM = {
  username: '',
  email: '',
  password: '',
  displayName: '',
};

export function OfficeRegisterPage() {
  const [form, setForm] = useState(INITIAL_REGISTER_FORM);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    try {
      const user = await authApi.register(form) as unknown as { displayName: string };
      setMessage(`${user.displayName}님, 계정 등록이 완료되었습니다. 승인 후 이용 가능합니다.`);
      setTimeout(() => navigate('/office/login'), 3000);
    } catch (error) {
      console.error('Registration failed', error);
      alert('등록에 실패했습니다. 정보를 다시 확인해주세요.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="office-surface" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '450px' }}>
        <OfficePageHeader
          eyebrow="GSO 업무 시스템"
          title="운영자 등록"
          description="AAKorea 운영을 위한 스태프 계정을 신청합니다."
        />

        <div className="panel" style={{ marginTop: '2rem' }}>
          {message ? (
            <div className="section-note section-note--success">
              {message}
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>잠시 후 로그인 페이지로 이동합니다...</p>
            </div>
          ) : (
            <form className="field-grid" onSubmit={handleSubmit}>
              <Field label="이메일">
                <input
                  className="office-input"
                  type="email"
                  required
                  placeholder="staff@aakorea.org"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={pending}
                />
              </Field>

              <Field label="이름 (표시용)">
                <input
                  className="office-input"
                  type="text"
                  required
                  placeholder="홍길동"
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  disabled={pending}
                />
              </Field>

              <Field label="비밀번호">
                <input
                  className="office-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  disabled={pending}
                />
              </Field>

              <div className="button-row" style={{ marginTop: '1.5rem', flexDirection: 'column', gap: '0.75rem' }}>
                <button className="primary-button" type="submit" disabled={pending} style={{ width: '100%' }}>
                  {pending ? '처리 중...' : '계정 등록 신청'}
                </button>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => navigate('/office/login')}
                  disabled={pending}
                  style={{ width: '100%' }}
                >
                  로그인으로 돌아가기
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
