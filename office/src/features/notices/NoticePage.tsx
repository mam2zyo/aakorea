import { useEffect, useState, useCallback } from 'react';
import { PageHeader, EmptyState } from '@/shared/components/ui';
import { contentApi } from '@/shared/api';

interface Notice {
  id: number;
  title: string;
  createdAt: string;
  authorName: string;
}

export function NoticePage({ onError }: { onError: (error: unknown, message: string) => void, onSuccess: (message: string) => void }) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNotices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contentApi.getNotices();
      setNotices(data);
    } catch (error) {
      onError(error, '공지사항을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  return (
    <div className="office-flat-page">
      <PageHeader title="공지 관리" />
      <div className="office-flat-page__workspace">
        {loading ? (
          <div className="section-note">불러오는 중...</div>
        ) : notices.length === 0 ? (
          <EmptyState title="등록된 공지가 없습니다." />
        ) : (
          <div className="office-table">
            <div className="office-table__header">
              <span>제목</span>
              <span>작성일</span>
              <span>작성자</span>
            </div>
            {notices.map(n => (
              <div key={n.id} className="office-table__row">
                <span>{n.title}</span>
                <span>{n.createdAt?.slice(0, 10) || '-'}</span>
                <span>{n.authorName}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
