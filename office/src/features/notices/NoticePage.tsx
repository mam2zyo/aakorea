import { useEffect, useState, useMemo, useCallback } from 'react';
import { PageHeader, EmptyState, Field, RichTextEditor, AttachmentField } from '@/shared/components/ui';
import { contentApi, getApiFieldErrors, omitFieldErrors, readFieldError } from '@/shared/api';
import { useAuth } from '@/features/auth/AuthContext';
import { OfficePermission } from '@/shared/constants/auth';
import type { Attachment } from '@/shared/components/ui/AttachmentField';

interface Notice {
  id: number;
  title: string;
  bodyHtml: string;
  bodyJson: string;
  published: boolean;
  publishedAt: string | null;
  authorName?: string;
  attachments?: Attachment[];
}

interface NoticeForm {
  id: number | null;
  title: string;
  bodyHtml: string;
  bodyJson: string;
  originalPublished: boolean;
  published: boolean;
  publishedAt: string;
  attachments: Attachment[];
}

const NOTICE_SORT_MODES = {
  recent: '최신순',
  title: '제목순',
} as const;

type SortMode = keyof typeof NOTICE_SORT_MODES;

const EMPTY_NOTICE_FORM: NoticeForm = {
  id: null,
  title: '',
  bodyHtml: '',
  bodyJson: '',
  originalPublished: false,
  published: false,
  publishedAt: createCurrentDateTimeValue(),
  attachments: [],
};

const textCollator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' });

export function NoticePage({ onError, onSuccess }: { onError: (error: unknown, message: string) => void, onSuccess: (message: string) => void }) {
  const { hasPermission } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [noticeForm, setNoticeForm] = useState<NoticeForm>(EMPTY_NOTICE_FORM);
  const [noticeErrors, setNoticeErrors] = useState<Record<string, string>>({});
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('recent');

  const loadNotices = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await contentApi.getNotices()) as unknown as Notice[];
      setNotices(data);
    } catch (error) {
      onError(error, '공지 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadNotices();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadNotices]);

  const canPublish = hasPermission(OfficePermission.CONTENT_PUBLISH);
  const publishedContentLocked = !canPublish && (noticeForm.originalPublished || noticeForm.published);
  const formBusy = saving || deleting;
  const formReadOnly = formBusy || publishedContentLocked;

  const filteredNotices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const noticesList = Array.isArray(notices) ? notices : [];
    const filtered = noticesList.filter(n => n && n.title && n.title.toLowerCase().includes(q));
    
    return [...filtered].sort((left, right) => {
      if (sortMode === 'title') {
        const titleCompare = textCollator.compare(left.title, right.title);
        if (titleCompare !== 0) return titleCompare;
      }

      const leftPublishedAt = left.publishedAt ?? '';
      const rightPublishedAt = right.publishedAt ?? '';
      if (leftPublishedAt !== rightPublishedAt) {
        return rightPublishedAt.localeCompare(leftPublishedAt);
      }

      return right.id - left.id;
    });
  }, [notices, searchQuery, sortMode]);

  const startCreatingNotice = () => {
    setNoticeForm(createEmptyNoticeForm());
    setNoticeErrors({});
    setEditorOpen(true);
  };

  const startEditingNotice = async (id: number) => {
    setDetailLoading(true);
    try {
      const data = (await contentApi.getNotice(id)) as unknown as Notice;
      setNoticeForm({
        id: data.id,
        title: data.title,
        bodyHtml: data.bodyHtml,
        bodyJson: data.bodyJson,
        originalPublished: data.published,
        published: data.published,
        publishedAt: toInputDateTimeValue(data.publishedAt),
        attachments: data.attachments || [],
      });
      setNoticeErrors({});
      setEditorOpen(true);
    } catch (error) {
      onError(error, '공지 상세를 불러오지 못했습니다.');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeEditor = () => {
    if (saving || deleting) return;
    setEditorOpen(false);
    setNoticeForm(EMPTY_NOTICE_FORM);
    setNoticeErrors({});
  };

  const saveNotice = async () => {
    setSaving(true);
    try {
      const payload = {
        title: noticeForm.title,
        bodyHtml: noticeForm.bodyHtml,
        bodyJson: noticeForm.bodyJson,
        published: noticeForm.published,
        publishedAt: noticeForm.published ? toApiDateTimeValue(noticeForm.publishedAt) : null,
        attachmentIds: noticeForm.attachments.map(a => a.id),
      };

      if (noticeForm.id) {
        await contentApi.updateNotice(noticeForm.id, payload);
        onSuccess('공지를 수정했습니다.');
      } else {
        await contentApi.createNotice(payload);
        onSuccess('공지를 생성했습니다.');
      }

      setEditorOpen(false);
      loadNotices();
    } catch (error) {
      const errors = getApiFieldErrors(error);
      if (errors) setNoticeErrors(errors);
      else onError(error, noticeForm.id ? '수정에 실패했습니다.' : '생성에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const deleteNotice = async (notice: Notice) => {
    if (!window.confirm(`"${notice.title}" 공지를 삭제하시겠습니까?`)) return;
    setDeleting(true);
    try {
      await contentApi.deleteNotice(notice.id);
      onSuccess('삭제했습니다.');
      loadNotices();
    } catch (error) {
      onError(error, '삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="office-flat-page">
      <PageHeader title="공지 관리" />

      {detailLoading && (
        <div className="office-overlay" style={{ background: 'rgba(0,0,0,0.1)', zIndex: 1000 }}>
          <div className="office-overlay__dialog" style={{ width: 'auto', padding: '1rem 2rem' }}>
            <p>공지 정보를 불러오는 중입니다...</p>
          </div>
        </div>
      )}

      <div className="office-list-toolbar">
        <div className="office-list-toolbar__cluster office-list-toolbar__cluster--start">
          <input 
            placeholder="공지 제목으로 검색" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button 
            className="ghost-button ghost-button--small"
            onClick={() => setSortMode(prev => prev === 'recent' ? 'title' : 'recent')}
          >
            정렬: {NOTICE_SORT_MODES[sortMode]}
          </button>
        </div>
        <div className="office-list-toolbar__cluster office-list-toolbar__cluster--end">
          <span className="office-toolbar-count">총 {(filteredNotices || []).length}개</span>
          <button className="primary-button" onClick={startCreatingNotice}>새 공지</button>
        </div>
      </div>

      <div className="office-flat-page__workspace">
        {loading ? (
          <div className="section-note">불러오는 중...</div>
        ) : (notices || []).length === 0 ? (
          <EmptyState title="등록된 공지가 없습니다." description="첫 공지를 등록해 공개 사이트의 최신 소식을 준비해 주세요." />
        ) : (filteredNotices || []).length === 0 ? (
          <EmptyState title="검색 결과가 없습니다." description="다른 제목으로 다시 검색해 주세요." />
        ) : (
          <div className="office-table office-table--notice">
            <div className="office-table__header">
              <span className="cell-index">번호</span>
              <span className="cell-title">제목</span>
              <span>게시 시각</span>
              <span>상태</span>
              <span>관리</span>
            </div>
            {filteredNotices.map((notice) => (
              <div key={notice.id} className="office-table__row">
                <div className="office-table__cell office-table__cell--index">{notice.id}</div>
                <div className="office-table__cell office-table__cell--primary">
                  <strong>{notice.title}</strong>
                </div>
                <div className="office-table__cell">{formatDateTimeLabel(notice.publishedAt)}</div>
                <div className="office-table__cell">
                  {notice.published ? (
                    <span className="office-badge office-badge--success">게시</span>
                  ) : (
                    <span className="office-badge office-badge--subtle">임시</span>
                  )}
                </div>
                <div className="office-table__cell office-table__cell--actions">
                  <button className="ghost-button ghost-button--small" onClick={() => startEditingNotice(notice.id)}>수정</button>
                  <button className="ghost-button ghost-button--small ghost-button--danger" onClick={() => deleteNotice(notice)}>삭제</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editorOpen && (
        <div className="office-overlay">
          <div className="office-overlay__dialog office-overlay__dialog--wide">
            <div className="office-overlay__header">
              <div>
                <h2>{noticeForm.id ? '공지 수정' : '새 공지'}</h2>
                <p className="admin-form-note">공지는 최신순 흐름으로 보여지며, 게시 상태일 때만 공개 페이지에서 바로 확인할 수 있습니다.</p>
              </div>
              <button className="ghost-button ghost-button--small" onClick={closeEditor} disabled={formBusy}>닫기</button>
            </div>

            <form className="office-form-grid" onSubmit={e => { e.preventDefault(); void saveNotice(); }}>
              <Field label="제목" error={readFieldError(noticeErrors, 'title') || undefined}>
                <input 
                  value={noticeForm.title} 
                  disabled={formReadOnly}
                  onChange={e => {
                    setNoticeForm({...noticeForm, title: e.target.value});
                    setNoticeErrors(omitFieldErrors(noticeErrors, 'title'));
                  }}
                />
              </Field>

              <Field label="본문" error={readFieldError(noticeErrors, 'bodyHtml') || undefined}>
                <RichTextEditor 
                  valueHtml={noticeForm.bodyHtml}
                  valueJson={noticeForm.bodyJson}
                  disabled={formReadOnly}
                  onChange={({ html, json }) => {
                    setNoticeForm({...noticeForm, bodyHtml: html, bodyJson: json});
                    setNoticeErrors(omitFieldErrors(noticeErrors, 'bodyHtml'));
                  }}
                />
              </Field>

              <div className="office-form-row">
                <Field label="게시 시각" error={readFieldError(noticeErrors, 'publishedAt') || undefined}>
                  <input 
                    type="datetime-local" 
                    value={noticeForm.publishedAt}
                    disabled={formReadOnly || !canPublish}
                    onChange={e => {
                      setNoticeForm({...noticeForm, publishedAt: e.target.value});
                      setNoticeErrors(omitFieldErrors(noticeErrors, 'publishedAt'));
                    }}
                  />
                </Field>

                <div className="office-field">
                  <label className="office-toggle">
                    <input 
                      type="checkbox" 
                      checked={noticeForm.published}
                      disabled={formReadOnly || !canPublish}
                      onChange={e => setNoticeForm({...noticeForm, published: e.target.checked})}
                    />
                    <span>게시 상태로 저장</span>
                  </label>
                </div>
              </div>

              <Field label="첨부파일">
                <AttachmentField 
                  attachments={noticeForm.attachments}
                  disabled={formReadOnly}
                  onChange={newFiles => setNoticeForm({...noticeForm, attachments: newFiles})}
                />
              </Field>

              <div className="button-row" style={{ marginTop: '2rem' }}>
                <button type="submit" className="primary-button" disabled={formReadOnly}>
                  {saving ? '저장 중...' : (noticeForm.id ? '공지 저장' : '공지 생성')}
                </button>
                <button type="button" className="ghost-button" onClick={closeEditor} disabled={formBusy}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Utilities
function createEmptyNoticeForm(): NoticeForm {
  return {
    id: null,
    title: '',
    bodyHtml: '',
    bodyJson: '',
    originalPublished: false,
    published: false,
    publishedAt: createCurrentDateTimeValue(),
    attachments: [],
  };
}

function createCurrentDateTimeValue() {
  const now = new Date();
  now.setSeconds(0, 0);
  return formatDateTimeValue(now);
}

function formatDateTimeValue(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  const hour = String(value.getHours()).padStart(2, '0');
  const minute = String(value.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function toInputDateTimeValue(value: string | null) {
  return value ? value.slice(0, 16) : createCurrentDateTimeValue();
}

function toApiDateTimeValue(value: string) {
  return value.length === 16 ? `${value}:00` : value;
}

function formatDateTimeLabel(value: string | null) {
  if (!value) return '게시 전';
  return value.replace('T', ' ').slice(0, 16);
}
