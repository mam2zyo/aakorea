import { useState, useEffect } from 'react';
import { Field } from '@/shared/components/ui';
import { userApi } from '@/shared/api';

export interface UserData {
  id: number;
  email: string;
  displayName: string;
  role: string;
  roleLabel: string;
  status: string;
  statusLabel: string;
  editable: boolean;
  grantedPermissions: string[];
  effectivePermissions: string[];
}

interface UserEditorModalProps {
  isOpen: boolean;
  user: UserData | null; // null 이면 생성 모드, 객체가 있으면 수정 모드
  creatableRoles: { value: string; label: string }[];
  staffGrantOptions: { key: string; label: string; description: string }[];
  onClose: () => void;
  onSave: () => void;
  onError: (error: unknown, fallback?: string) => void;
}

export function UserEditorModal({
  isOpen,
  user,
  creatableRoles,
  staffGrantOptions,
  onClose,
  onSave,
  onError,
}: UserEditorModalProps) {
  const isEditMode = !!user;

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [password, setPassword] = useState('');
  const [grantedPermissions, setGrantedPermissions] = useState<string[]>([]);
  const [pending, setPending] = useState(false);

  // 모달이 열리거나 user 객체가 변경될 때 상태 초기화
  useEffect(() => {
    if (isOpen) {
      if (user) {
        setEmail(user.email);
        setDisplayName(user.displayName);
        setRole(user.role);
        setStatus(user.status);
        setPassword('');
        setGrantedPermissions(user.grantedPermissions || []);
      } else {
        setEmail('');
        setDisplayName('');
        // 기본 역할은 첫 번째 사용 가능한 역할로 지정
        setRole(creatableRoles[0]?.value || 'STAFF');
        setStatus('ACTIVE');
        setPassword('');
        setGrantedPermissions([]);
      }
    }
  }, [isOpen, user, creatableRoles]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    try {
      if (isEditMode && user) {
        await userApi.updateUser(user.id, {
          displayName,
          role,
          status,
          password: password || undefined,
          grantedPermissions: role === 'STAFF' ? grantedPermissions : [],
        });
      } else {
        if (!password) {
          alert('비밀번호를 입력해주세요.');
          setPending(false);
          return;
        }
        await userApi.createUser({
          email,
          displayName,
          role,
          password,
          grantedPermissions: role === 'STAFF' ? grantedPermissions : [],
        });
      }
      onSave();
    } catch (error) {
      onError(error, isEditMode ? '사용자 정보 수정에 실패했습니다.' : '사용자 등록에 실패했습니다.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="office-overlay" onClick={onClose}>
      <div
        className="office-overlay__dialog"
        role="dialog"
        style={{ maxWidth: '500px', width: '90%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="office-overlay__header">
          <div className="office-overlay__heading">
            <h2>{isEditMode ? '운영자 정보 수정' : '신규 운영자 등록'}</h2>
          </div>
          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={onClose}
            disabled={pending}
          >
            닫기
          </button>
        </div>

        <form className="field-grid" onSubmit={handleSubmit} style={{ padding: '1rem 0' }}>
          <Field label="이메일 (계정명)">
            <input
              className="office-input"
              type="email"
              required
              disabled={isEditMode || pending}
              placeholder="example@aakorea.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field label="이름">
            <input
              className="office-input"
              type="text"
              required
              disabled={pending}
              placeholder="홍길동"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </Field>

          <Field label="역할">
            <select
              className="office-input"
              disabled={pending}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {creatableRoles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </Field>

          {isEditMode && (
            <Field label="계정 상태">
              <select
                className="office-input"
                disabled={pending}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="ACTIVE">활성</option>
                <option value="SUSPENDED">중지</option>
                <option value="PENDING_APPROVAL">승인 대기</option>
              </select>
            </Field>
          )}

          <Field label={isEditMode ? '비밀번호 변경 (변경할 때만 입력)' : '비밀번호'}>
            <input
              className="office-input"
              type="password"
              required={!isEditMode}
              disabled={pending}
              placeholder={isEditMode ? '••••••••' : '최소 6자 이상'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          {role === 'STAFF' && staffGrantOptions.length > 0 && (
            <Field label="부여할 개별 권한">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem', maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--color-border)', padding: '0.75rem', borderRadius: '4px' }}>
                {staffGrantOptions.map((opt) => (
                  <label key={opt.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      disabled={pending}
                      checked={grantedPermissions.includes(opt.key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setGrantedPermissions([...grantedPermissions, opt.key]);
                        } else {
                          setGrantedPermissions(grantedPermissions.filter((k) => k !== opt.key));
                        }
                      }}
                    />
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>{opt.label}</span>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', lineHeight: 1.3 }}>{opt.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </Field>
          )}

          <div className="button-row" style={{ marginTop: '1.5rem', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button
              className="ghost-button"
              type="button"
              onClick={onClose}
              disabled={pending}
            >
              취소
            </button>
            <button className="primary-button" type="submit" disabled={pending}>
              {pending ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
