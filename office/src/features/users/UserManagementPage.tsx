import { useEffect, useState, useMemo } from 'react';
import { PageHeader, EmptyState } from '@/shared/components/ui';
import { userApi } from '@/shared/api';
import { UserEditorModal } from './components/UserEditorModal';
import type { UserData } from './components/UserEditorModal';

export function UserManagementPage({ onError }: { onError: (error: unknown, fallback?: string) => void }) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [creatableRoles, setCreatableRoles] = useState<{ value: string; label: string }[]>([]);
  const [staffGrantOptions, setStaffGrantOptions] = useState<{ key: string; label: string; description: string }[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const load = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await userApi.getWorkspace() as any;
      setUsers(data.users || []);
      setCreatableRoles(data.creatableRoles || []);
      setStaffGrantOptions(data.staffGrantOptions || []);
    } catch (error) {
      onError(error, '사용자 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [onError]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter(u => 
      u.email.toLowerCase().includes(q) || 
      u.displayName.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: UserData) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, email: string) => {
    if (confirm(`정말 ${email} 관리자 계정을 삭제하시겠습니까?\n부여받은 모든 개별 권한과 이력도 함께 삭제됩니다.`)) {
      try {
        await userApi.deleteUser(id);
        alert('성공적으로 삭제되었습니다.');
        void load(false);
      } catch (error) {
        onError(error, '사용자 삭제에 실패했습니다.');
      }
    }
  };

  const handleSaveSuccess = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    alert(selectedUser ? '정보가 수정되었습니다.' : '신규 운영자가 등록되었습니다.');
    void load(false);
  };

  return (
    <div className="office-theme office-flat-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <PageHeader title="운영자 관리" />
        <button 
          className="primary-button" 
          onClick={handleCreate}
          style={{ height: '38px', padding: '0 1rem', display: 'flex', alignItems: 'center' }}
        >
          운영자 등록
        </button>
      </div>

      <div className="office-list-toolbar">
        <input 
          placeholder="이메일 또는 이름으로 검색" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="office-input"
        />
      </div>

      <div className="office-flat-page__workspace">
        {loading ? (
          <div className="section-note">불러오는 중...</div>
        ) : filteredUsers.length === 0 ? (
          <EmptyState title="사용자가 없습니다." description="검색어에 일치하는 사용자가 없습니다." />
        ) : (
          <div className="office-table office-table--users">
            <div className="office-table__header">
              <span>이메일</span>
              <span>이름</span>
              <span>역할</span>
              <span>상태</span>
              <span style={{ textAlign: 'right', paddingRight: '1rem' }}>관리</span>
            </div>
            {filteredUsers.map(u => (
              <div key={u.id} className="office-table__row">
                <span>{u.email}</span>
                <span>{u.displayName}</span>
                <span>{u.roleLabel}</span>
                <span>
                  <span className={`status-badge status-badge--${u.status?.toLowerCase() || 'active'}`} style={{
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    backgroundColor: u.status === 'ACTIVE' ? '#e2f6ea' : u.status === 'SUSPENDED' ? '#fde8e8' : '#fef3c7',
                    color: u.status === 'ACTIVE' ? '#117b43' : u.status === 'SUSPENDED' ? '#c81e1e' : '#d97706',
                  }}>
                    {u.statusLabel}
                  </span>
                </span>
                <span style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', paddingRight: '0.5rem' }}>
                  {u.editable ? (
                    <>
                      <button
                        className="ghost-button ghost-button--small"
                        onClick={() => handleEdit(u)}
                        style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                      >
                        수정
                      </button>
                      <button
                        className="ghost-button ghost-button--small"
                        onClick={() => handleDelete(u.id, u.email)}
                        style={{ padding: '2px 8px', fontSize: '0.8rem', color: '#e74c3c' }}
                      >
                        삭제
                      </button>
                    </>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#999', paddingRight: '0.5rem' }}>편집 불가</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <UserEditorModal
        isOpen={isModalOpen}
        user={selectedUser}
        creatableRoles={creatableRoles}
        staffGrantOptions={staffGrantOptions}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSaveSuccess}
        onError={onError}
      />
    </div>
  );
}

