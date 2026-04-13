import { useEffect, useState, useCallback } from 'react'
import {
  AdminPageHeader,
  EmptyState,
} from '@/admin/ui'
import { AuditLogDetailModal } from '../components/AuditLogDetailModal'
import { request } from '@/shared/lib/request'

const ENTITY_TYPE_LABELS = {
  'District': '지역연합',
  'Group': '그룹',
  'Notice': '공지',
  'ContentPage': '안내 페이지'
}

const ACTION_LABELS = {
  'CREATE': '생성',
  'UPDATE': '수정',
  'DELETE': '삭제'
}

export function AuditLogPage({ onError, onSuccess }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedLog, setSelectedLog] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [entityType, setEntityType] = useState('')

  const fetchLogs = useCallback(async (pageNumber, type) => {
    setLoading(true)
    try {
      let url = `/api/admin/audit-logs?page=${pageNumber}&size=20&sort=createdAt,desc`
      if (type) {
        url += `&entityType=${type}`
      }
      const data = await request(url)
      
      setLogs(data.content)
      setTotalPages(data.totalPages)
    } catch (error) {
      onError(error, '로그를 불러오는 데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [onError])

  useEffect(() => {
    fetchLogs(page, entityType)
  }, [page, entityType, fetchLogs])

  function handleTypeChange(e) {
    setEntityType(e.target.value)
    setPage(0)
  }

  function openDetails(log) {
    setSelectedLog(log)
    setIsModalOpen(true)
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    const d = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\.$/, '')
    const t = date.toLocaleTimeString('ko-KR', {
      hour: 'numeric',
      hour12: true,
      minute: '2-digit',
      second: '2-digit'
    })
    
    return (
      <div className="timestamp-stack">
        <div className="timestamp-stack__date">{d}</div>
        <div className="timestamp-stack__time">{t}</div>
      </div>
    )
  }

  return (
    <div className="admin-flat-page">
      <AdminPageHeader title="활동 로그" />

      <div className="admin-list-toolbar">
        <div className="admin-list-toolbar__cluster admin-list-toolbar__cluster--start">
          <select 
            value={entityType} 
            onChange={handleTypeChange}
            className="admin-select"
            style={{ 
              padding: '4px 8px', 
              borderRadius: '4px', 
              border: '1px solid var(--admin-border)',
              width: '160px'
            }}
          >
            <option value="">모든 유형</option>
            {Object.entries(ENTITY_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="admin-list-toolbar__cluster admin-list-toolbar__cluster--end">
            <span className="admin-directory-toolbar__count">
                페이지 {page + 1} / {totalPages || 1}
            </span>
        </div>
      </div>

      <div className="admin-flat-page__workspace">
        {loading && !logs.length ? (
          <div className="section-note">로그를 불러오는 중입니다...</div>
        ) : logs.length === 0 ? (
          <EmptyState
            title="기록된 활동 로그가 없습니다."
            description="시스템에서 발생한 변경 사항이 여기에 표시됩니다."
          />
        ) : (
          <div className="admin-table admin-table--audit-log" role="table">
            <div className="admin-table__header" role="row">
              <span className="admin-table__heading">유형</span>
              <span className="admin-table__heading">대상 ID</span>
              <span className="admin-table__heading">작업자</span>
              <span className="admin-table__heading">구분</span>
              <span className="admin-table__heading">일시</span>
              <span className="admin-table__heading">관리</span>
            </div>

            {logs.map((log) => (
              <div key={log.id} className="admin-table__row admin-table__row--static" role="row">
                <span className="admin-table__cell">{ENTITY_TYPE_LABELS[log.entityType] || log.entityType}</span>
                <span className="admin-table__cell" title={`ID: ${log.entityId}`}>
                  {log.entityLabel || log.entityId}
                </span>
                <span className="admin-table__cell" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {log.creatorEmail || (log.createdBy ? `User #${log.createdBy}` : 'System')}
                </span>
                <span className="admin-table__cell">
                  <span className={`badge badge--${log.action.toLowerCase()}`}>
                    {ACTION_LABELS[log.action] || log.action}
                  </span>
                </span>
                <span className="admin-table__cell">{formatDate(log.createdAt)}</span>
                <span className="admin-table__cell">
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
  )
}
