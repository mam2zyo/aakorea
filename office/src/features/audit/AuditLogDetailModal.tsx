import React from 'react';

// 감사 로그 데이터 구조 정의
interface AuditLog {
  diff: string; // JSON 문자열 형태의 변경 내역
  entityLabel?: string;
  entityType: string;
  entityId: number | string;
  action: string;
}

interface AuditLogDetailModalProps {
  log: AuditLog | null;
  onClose: () => void;
}

export function AuditLogDetailModal({ log, onClose }: AuditLogDetailModalProps) {
  if (!log) return null;

  let changedFields: Record<string, any> = {};
  try {
    changedFields = JSON.parse(log.diff) || {};
  } catch (e) {
    console.error('Failed to parse diff', e);
  }

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? '예' : '아니오';
    
    if (typeof value === 'object') {
      // 위치(Location) 객체 등에 대한 휴머나이즈 처리
      if (value.address || value.detail) {
        return `${value.province || ''} ${value.address || ''} ${value.detail || ''}`.trim() || '-';
      }
      return JSON.stringify(value);
    }
    
    return String(value);
  };

  return (
    <div 
      className="office-overlay"
      onClick={onClose}
    >
      <div
        aria-labelledby="audit-detail-title"
        aria-modal="true"
        className="office-overlay__dialog"
        role="dialog"
        style={{ maxWidth: '800px', width: '90%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="office-overlay__header">
          <div className="office-overlay__heading">
            <h2 id="audit-detail-title">변경 상세 내용</h2>
            <p className="office-form-note">
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
            <p style={{ textAlign: 'center', color: '#666' }}>변경 내역이 없습니다.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>필드</th>
                  <th style={{ padding: '10px' }}>변경 전</th>
                  <th style={{ padding: '10px' }}>변경 후</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(changedFields).map(([field, values]) => {
                  // values는 보통 [oldValue, newValue] 형태의 배열일 것으로 가정합니다.
                  const isArray = Array.isArray(values);
                  const oldVal = isArray ? values[0] : '-';
                  const newVal = isArray ? values[1] : values;

                  return (
                    <tr key={field} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>{field}</td>
                      <td style={{ padding: '10px', color: '#666' }}>{formatValue(oldVal)}</td>
                      <td style={{ padding: '10px', color: '#2c3e50', fontWeight: 500 }}>{formatValue(newVal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
