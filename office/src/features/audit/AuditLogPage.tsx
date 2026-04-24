import { useEffect, useState, useCallback } from 'react';
import { PageHeader, EmptyState } from '@/components/ui';
import { AuditLogDetailModal } from '@/components/AuditLogDetailModal';
import { request } from '@/api';

const ENTITY_TYPE_LABELS: Record<string, string> = {
  USER: '운영자',
  GROUP: '그룹',
  DISTRICT: '지역연합',
  NOTICE: '공지',
  CONTENT_PAGE: '안내 페이지',
};

const ACTION_LABELS: Record<string, string> = {
  CREATE: '등록',
  UPDATE: '수정',
  DELETE: '삭제',
};

interface AuditLogPageProps {
  onError: (error: any, message: string) => void;
}

export function AuditLogPage({ onError }: AuditLogPageProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [entityType, setEntityType] = useState('');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLogs = useCallback(async (pageNumber: number, type: string) => {
    setLoading(true);
    try {
      let url = `/api/office/audit-logs?page=${pageNumber}&size=20&sort=createdAt,desc`;
      if (type) {
        url += `&entityType=${type}`;
      }
      const data = await request(url);
      
      setLogs(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      onError(error, '로그를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchLogs(page, entityType);
  }, [page, entityType, fetchLogs]);

  function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setEntityType(e.target.value);
    setPage(0);
  }

  function openDetails(log: any) {
    setSelectedLog(log);
    setIsModalOpen(true);
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const d = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\.$/, '');
    const t = date.toLocaleTimeString('ko-KR', {
      hour: 'numeric',
      hour12: true,
      minute: '2-digit',
      second: '2-digit'
    });
    
    return (
      <div className="timestamp-stack">
        <div className="timestamp-stack__date">{d}</div>
        <div className="timestamp-stack__time">{t}</div>
      </div>
    );
  }

  return (
    <div className="office-flat-page">
      <PageHeader title="활동 로그" />

      <div className="office-list-toolbar">
        <div className="office-list-toolbar__cluster office-list-toolbar__cluster--start">
          <select 
            value={entityType} 
            onChange={handleTypeChange}
            className="office-select"
            style={{ 
              padding: '4px 8px', 
              borderRadius: '4px', 
              border: '1px solid var(--office-border)',
              width: '160px'
            }}
          >
            <option value="">모든 유형</option>
            {Object.entries(ENTITY_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="office-list-toolbar__cluster office-list-toolbar__cluster--end">
            <span className="office-directory-toolbar__count">
                페이지 {page + 1} / {totalPages || 1}
            </span>
        </div>
      </div>

      <div className="office-flat-page__workspace">
        {loading && !logs.length ? (
          <div className="section-note">로그를 불러오는 중입니다...</div>
        ) : logs.length === 0 ? (
          <EmptyState
            title="기록된 활동 로그가 없습니다."
            description="시스템에서 발생한 변경 사항이 여기에 표시됩니다."
          />
        ) : (
          <div className="office-table office-table--audit-log" role="table">
            <div className="office-table__header" role="row">
              <span className="office-table__heading">유형</span>
              <span className="office-table__heading">대상 ID</span>
              <span className="office-table__heading">작업자</span>
              <span className="office-table__heading">구분</span>
              <span className="office-table__heading">일시</span>
              <span className="office-table__heading">관리</span>
            </div>

            {logs.map((log) => (
              <div key={log.id} className="office-table__row office-table__row--static" role="row">
                <span className="office-table__cell">{ENTITY_TYPE_LABELS[log.entityType] || log.entityType}</span>
                <span className="office-table__cell" title={`ID: ${log.entityId}`}>
                  {log.entityLabel || log.entityId}
                </span>
                <span className="office-table__cell" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {log.creatorEmail || (log.createdBy ? `User #${log.createdBy}` : 'System')}
                </span>
                <span className="office-table__cell">
                  <span className={`status-pill status-pill--${log.action.toLowerCase()}`}>
                    {ACTION_LABELS[log.action] || log.action}
                  </span>
                </span>
                <span className="office-table__cell">{formatDate(log.createdAt)}</span>
                <span className="office-table__cell">
                  <button 
                    className="ghost-button ghost-button--small"
                    onClick={() => openDetails(log)}
                  >
                    상세 보기
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="button-row" style={{ marginTop: '20px', justifyContent: 'center' }}>
            <button 
              className="ghost-button" 
              disabled={page === 0} 
              onClick={() => setPage(p => p - 1)}
            >
              이전
            </button>
            <button 
              className="ghost-button" 
              disabled={page === totalPages - 1} 
              onClick={() => setPage(p => p + 1)}
            >
              다음
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AuditLogDetailModal 
          log={selectedLog} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}
