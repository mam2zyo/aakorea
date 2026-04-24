import { useEffect, useState, useMemo, useCallback } from 'react';
import { PageHeader, EmptyState } from '@/shared/components/ui';
import { userApi } from '@/shared/api';

interface User {
  id: number;
  email: string;
  displayName: string;
  roleLabel: string;
  statusLabel: string;
}

export function UserManagementPage({ onError }: { onError: (error: unknown, fallback?: string) => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadUsers = useCallback(async () => {
    try {
      const data = await userApi.getWorkspace() as unknown as { users: User[] };
      setUsers(data.users || []);
    } catch (error) {
      onError(error, '사용자 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadUsers();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter(u => 
      u.email.toLowerCase().includes(q) || 
      u.displayName.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  return (
    <div className="office-theme office-flat-page">
      <PageHeader title="운영자 관리" />
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
            </div>
            {filteredUsers.map(u => (
              <div key={u.id} className="office-table__row">
                <span>{u.email}</span>
                <span>{u.displayName}</span>
                <span>{u.roleLabel}</span>
                <span>{u.statusLabel}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
