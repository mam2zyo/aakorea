import React from 'react'

export function AuditLogDetailModal({ log, onClose }) {
  if (!log) return null

  let changedFields = {}
  try {
    changedFields = JSON.parse(log.diff) || {}
  } catch (e) {
    console.error('Failed to parse diff', e)
  }

  const formatValue = (value) => {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'boolean') return value ? '예' : '아니오'
    if (typeof value === 'object') {
      // Humanize Location object
      if (value.address || value.detail) {
        return `${value.province || ''} ${value.address || ''} ${value.detail || ''}`.trim() || '-'
      }
      return JSON.stringify(value)
    }
    return String(value)
  }

  return (
    <div className="admin-overlay" role="presentation" onClick={onClose}>
      <div
        aria-labelledby="audit-detail-title"
        aria-modal="true"
        className="admin-overlay__dialog"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
        style={{ maxWidth: '800px', width: '90%' }}
      >
        <div className="admin-overlay__header">
          <div className="admin-overlay__heading">
            <h2 id="audit-detail-title">변경 상세 내용</h2>
            <p className="admin-form-note">
              {log.entityLabel || log.entityType} (ID: {log.entityId}) - {log.action}
            </p>
          </div>
          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={onClose}
          >
            닫기
          </button>
        </div>

        <div className="audit-detail-content" style={{ padding: '20px 0' }}>
          {Object.keys(changedFields).length === 0 ? (
            <div className="section-note">
              {log.action === 'CREATE' ? '신규 생성되었습니다.' : 
               log.action === 'DELETE' ? '삭제되었습니다.' : 
               '변경된 필드가 없습니다.'}
            </div>
          ) : (
            <div className="admin-table" role="table">
              <div className="admin-table__header" role="row">
                <span className="admin-table__heading" style={{ flex: '1.2' }}>필드</span>
                <span className="admin-table__heading" style={{ flex: '2' }}>변경 전</span>
                <span className="admin-table__heading" style={{ flex: '2' }}>변경 후</span>
              </div>
              {Object.entries(changedFields).map(([field, delta]) => (
                <div key={field} className="admin-table__row admin-table__row--static" role="row">
                  <span className="admin-table__cell" style={{ flex: '1.2' }}><code style={{ fontSize: '0.9em', color: 'var(--admin-accent)' }}>{field}</code></span>
                  <span className="admin-table__cell" style={{ flex: '2', color: 'var(--admin-text-soft)', wordBreak: 'break-all' }}>
                    {formatValue(delta.oldValue)}
                  </span>
                  <span className="admin-table__cell" style={{ flex: '2', color: 'var(--admin-text-strong)', wordBreak: 'break-all' }}>
                    {formatValue(delta.newValue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
