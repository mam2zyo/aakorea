import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import {
  AdminPageHeader,
  DetailItem,
  EmptyState,
  Field,
} from '@/admin/ui'
import { adminUserApi } from '@/shared/api'
import { getApiFieldErrors, omitFieldErrors, readFieldError } from '@/shared/lib/formErrors'

const EMPTY_WORKSPACE = {
  users: [],
  creatableRoles: [],
  staffGrantOptions: [],
}

const STATUS_FILTERS = [
  { value: 'ALL', label: '전체 상태' },
  { value: 'PENDING_APPROVAL', label: '승인 대기' },
  { value: 'ACTIVE', label: '활성' },
  { value: 'SUSPENDED', label: '중지' },
]

export function AdminUsersPage({ onError, onSuccess }) {
  const [workspace, setWorkspace] = useState(EMPTY_WORKSPACE)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [formErrors, setFormErrors] = useState({})
  const [adminUserForm, setAdminUserForm] = useState(createEmptyAdminUserForm())

  async function loadWorkspace() {
    setLoading(true)

    try {
      const data = await adminUserApi.getWorkspace()
      setWorkspace(data)
    } catch (error) {
      onError(error, '운영자 계정 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadWorkspaceEffect = useEffectEvent(() => {
    void loadWorkspace()
  })

  useEffect(() => {
    loadWorkspaceEffect()
  }, [])

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('ko')
  const filteredUsers = workspace.users.filter((adminUser) => {
    const matchesSearch = [
      adminUser.email,
      adminUser.displayName,
      adminUser.roleLabel,
      adminUser.statusLabel,
    ].some((value) => value.toLocaleLowerCase('ko').includes(normalizedQuery))

    const matchesStatus = statusFilter === 'ALL' || adminUser.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const roleBadgeLabelByValue = useMemo(
    () => new Map([
      ['SYSTEM_ADMIN', '시스템 관리자'],
      ...workspace.creatableRoles.map((roleOption) => [roleOption.value, roleOption.label]),
    ]),
    [workspace.creatableRoles],
  )

  const pendingCount = workspace.users.filter((adminUser) => adminUser.status === 'PENDING_APPROVAL').length

  return (
    <div className="admin-flat-page">
      <AdminPageHeader
        title="운영자 승인 및 권한 관리"
        description="가입된 GSO Staff 계정을 검색해 승인하고 권한을 관리합니다. Manager는 Staff만, System Admin은 Manager와 Staff를 관리할 수 있습니다."
      />

      {loading ? <div className="section-note">운영자 계정을 불러오는 중입니다...</div> : null}

      <div className="admin-list-toolbar">
        <div className="admin-list-toolbar__cluster admin-list-toolbar__cluster--start">
          <div className="admin-list-toolbar__search">
            <input
              aria-label="운영자 검색"
              placeholder="이메일, 이름, 역할, 상태로 검색"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <select
            aria-label="운영자 상태 필터"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {STATUS_FILTERS.map((statusOption) => (
              <option key={statusOption.value} value={statusOption.value}>
                {statusOption.label}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-list-toolbar__cluster admin-list-toolbar__cluster--end">
          <span className="admin-directory-toolbar__count">
            총 {filteredUsers.length}명
          </span>
          <span className="shell-badge shell-badge--muted">
            승인 대기 {pendingCount}명
          </span>
        </div>
      </div>

      <div className="admin-flat-page__workspace">
        {workspace.users.length === 0 ? (
          <EmptyState
            title="표시할 운영자 계정이 없습니다."
            description="GSO Staff 등록이 시작되면 승인 대기 계정이 이 목록에 표시됩니다."
          />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            title="검색 결과가 없습니다."
            description="다른 이메일이나 상태로 다시 검색해 주세요."
          />
        ) : (
          <div className="admin-table admin-table--admin-users" role="table" aria-label="운영자 계정 목록">
            <div className="admin-table__header" role="row">
              <span className="admin-table__heading" role="columnheader">이메일</span>
              <span className="admin-table__heading" role="columnheader">이름</span>
              <span className="admin-table__heading" role="columnheader">역할</span>
              <span className="admin-table__heading" role="columnheader">상태</span>
              <span className="admin-table__heading" role="columnheader">권한</span>
              <span className="admin-table__heading" role="columnheader">마지막 로그인</span>
              <span className="admin-table__heading" role="columnheader">편집</span>
            </div>

            {filteredUsers.map((adminUser) => (
              <div key={adminUser.id} className="admin-table__row admin-table__row--static" role="row">
                <span className="admin-table__cell admin-table__cell--primary" data-label="이메일">
                  <strong>{adminUser.email}</strong>
                </span>
                <span className="admin-table__cell" data-label="이름">
                  {adminUser.displayName}
                </span>
                <span className="admin-table__cell admin-table__cell--role" data-label="역할">
                  <span className="shell-badge shell-badge--muted admin-user-role-chip">
                    {roleBadgeLabelByValue.get(adminUser.role) ?? adminUser.roleLabel}
                  </span>
                </span>
                <span className="admin-table__cell" data-label="상태">
                  <span className={`status-pill ${statusClassName(adminUser.status)}`}>
                    {adminUser.statusLabel}
                  </span>
                </span>
                <span className="admin-table__cell" data-label="권한">
                  {formatPermissionSummary(adminUser)}
                </span>
                <span className="admin-table__cell" data-label="마지막 로그인">
                  {formatDateTimeLabel(adminUser.lastLoginAt)}
                </span>
                <span className="admin-table__cell admin-table__cell--action" data-label="편집">
                  {adminUser.editable ? (
                    <button
                      className="ghost-button ghost-button--small"
                      type="button"
                      onClick={() => startEditingAdminUser(adminUser)}
                    >
                      {adminUser.status === 'PENDING_APPROVAL' ? '승인 / 수정' : '수정'}
                    </button>
                  ) : (
                    <span className="shell-badge shell-badge--muted">읽기 전용</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {editorOpen ? (
        <div className="admin-overlay" role="presentation">
          <div
            aria-labelledby="admin-user-editor-title"
            aria-modal="true"
            className="admin-overlay__dialog admin-overlay__dialog--wide"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-overlay__header admin-user-editor__header">
              <div className="admin-overlay__heading">
                <h2 id="admin-user-editor-title">운영자 승인 및 권한 편집</h2>
              </div>

              <button
                className="ghost-button ghost-button--small"
                type="button"
                onClick={closeEditor}
                disabled={saving}
              >
                닫기
              </button>
            </div>

            <form
              className="field-grid admin-user-editor"
              onSubmit={(event) => {
                event.preventDefault()
                void saveAdminUser()
              }}
            >
              <section className="admin-user-editor__section admin-user-editor__section--identity">
                <div className="admin-user-editor__identity-card">
                  <div className="detail-grid admin-user-editor__identity-grid">
                    <DetailItem
                      label="이름"
                      value={adminUserForm.displayName}
                    />
                    <DetailItem
                      label="이메일"
                      value={adminUserForm.email}
                    />
                  </div>
                </div>
              </section>

              <section className="admin-user-editor__section">
                <div className="admin-user-editor__control-grid">
                  <Field
                    className="admin-user-editor__field"
                    label="역할"
                    error={readFieldError(formErrors, 'role')}
                  >
                    <select
                      value={adminUserForm.role}
                      disabled={saving}
                      onChange={(event) => {
                        const nextRole = event.target.value
                        setAdminUserForm((previous) => ({
                          ...previous,
                          role: nextRole,
                          grantedPermissions: nextRole === 'STAFF' ? previous.grantedPermissions : [],
                        }))
                        setFormErrors((previous) => omitFieldErrors(previous, 'role', 'grantedPermissions'))
                      }}
                    >
                      {workspace.creatableRoles.map((roleOption) => (
                        <option key={roleOption.value} value={roleOption.value}>
                          {roleOption.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    className="admin-user-editor__field"
                    label="상태"
                    error={readFieldError(formErrors, 'status')}
                  >
                    <select
                      value={adminUserForm.status}
                      disabled={saving}
                      onChange={(event) => {
                        setAdminUserForm((previous) => ({
                          ...previous,
                          status: event.target.value,
                        }))
                        setFormErrors((previous) => omitFieldErrors(previous, 'status'))
                      }}
                    >
                      {buildStatusOptions(adminUserForm.originalStatus).map((statusOption) => (
                        <option key={statusOption.value} value={statusOption.value}>
                          {statusOption.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </section>

              <div className="empty-state admin-user-editor__audit-card">
                <strong>관리 이력</strong>
                <div className="detail-grid">
                  <DetailItem
                    label="승인 시점"
                    value={formatDateTimeLabel(adminUserForm.approvedAt)}
                  />
                  <DetailItem
                    label="승인자"
                    value={adminUserForm.approvedByLabel ?? '기록 없음'}
                  />
                  <DetailItem
                    label="최근 수정 시각"
                    value={formatDateTimeLabel(adminUserForm.updatedAt)}
                  />
                  <DetailItem
                    label="최근 수정자"
                    value={adminUserForm.updatedByLabel ?? '기록 없음'}
                  />
                </div>
                <div className="admin-user-editor__history-block">
                  <strong className="admin-user-editor__history-heading">최근 변경</strong>
                  {adminUserForm.managementHistory.length > 0 ? (
                    <div className="admin-user-editor__history-list" role="list" aria-label="운영자 최근 변경 이력">
                      {adminUserForm.managementHistory.map((event) => (
                        <div key={event.id} className="admin-user-editor__history-item" role="listitem">
                          <div className="admin-user-editor__history-row">
                            <strong>{event.title}</strong>
                            <span>{formatDateTimeLabel(event.happenedAt)}</span>
                          </div>
                          <div className="admin-user-editor__history-meta">
                            <span>{event.detail}</span>
                            <span>{event.actorLabel}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="section-note admin-user-editor__history-empty">
                      아직 기록된 변경 이력이 없습니다.
                    </p>
                  )}
                </div>
              </div>

              {adminUserForm.role === 'STAFF' ? (
                <section className="admin-user-editor__section">
                  <div className="admin-user-editor__section-header">
                    <span className="field__label">추가 권한</span>
                  </div>
                  <div className="admin-user-permission-grid" role="list" aria-label="Staff 추가 권한 선택">
                    {workspace.staffGrantOptions.map((permissionOption) => {
                      const selected = adminUserForm.grantedPermissions.includes(permissionOption.key)
                      return (
                        <button
                          key={permissionOption.key}
                          aria-pressed={selected}
                          className={`ghost-button admin-user-permission-button${
                            selected ? ' admin-user-permission-button--active' : ''
                          }`}
                          disabled={saving}
                          type="button"
                          onClick={() => toggleGrantedPermission(permissionOption.key)}
                        >
                          <strong>{permissionOption.label}</strong>
                          <span className="admin-user-permission-button__description">
                            {permissionOption.description}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  {readFieldError(formErrors, 'grantedPermissions') ? (
                    <p className="field__error">{readFieldError(formErrors, 'grantedPermissions')}</p>
                  ) : null}
                </section>
              ) : null}

              <div className="button-row button-row--compact admin-user-editor__actions">
                <button className="primary-button" type="submit" disabled={saving}>
                  {saving ? '저장 중...' : '승인 정보 저장'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )

  function startEditingAdminUser(adminUser) {
    setAdminUserForm({
      id: adminUser.id,
      email: adminUser.email,
      displayName: adminUser.displayName,
      role: adminUser.role,
      status: adminUser.status,
      originalStatus: adminUser.status,
      approvedAt: adminUser.approvedAt,
      approvedByLabel: adminUser.approvedByLabel,
      updatedAt: adminUser.updatedAt,
      updatedByLabel: adminUser.updatedByLabel,
      managementHistory: [...(adminUser.managementHistory ?? [])],
      grantedPermissions: [...adminUser.grantedPermissions],
    })
    setFormErrors({})
    setEditorOpen(true)
  }

  function closeEditor() {
    if (saving) {
      return
    }

    setEditorOpen(false)
    setAdminUserForm(createEmptyAdminUserForm())
    setFormErrors({})
  }

  function toggleGrantedPermission(permissionKey) {
    setAdminUserForm((previous) => {
      const alreadySelected = previous.grantedPermissions.includes(permissionKey)
      return {
        ...previous,
        grantedPermissions: alreadySelected
          ? previous.grantedPermissions.filter((value) => value !== permissionKey)
          : [...previous.grantedPermissions, permissionKey].sort(),
      }
    })
    setFormErrors((previous) => omitFieldErrors(previous, 'grantedPermissions'))
  }

  async function saveAdminUser() {
    setSaving(true)

    try {
      await adminUserApi.updateUser(adminUserForm.id, {
        displayName: adminUserForm.displayName,
        role: adminUserForm.role,
        status: adminUserForm.status,
        grantedPermissions: adminUserForm.role === 'STAFF' ? adminUserForm.grantedPermissions : [],
      })

      await loadWorkspace()
      setEditorOpen(false)
      setAdminUserForm(createEmptyAdminUserForm())
      setFormErrors({})
      onSuccess('운영자 승인 정보를 저장했습니다.')
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setFormErrors(fieldErrors)
        return
      }

      setFormErrors({})
      onError(error, '운영자 승인 정보 저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }
}

function createEmptyAdminUserForm() {
  return {
    id: null,
    email: '',
    displayName: '',
    role: 'STAFF',
    status: 'PENDING_APPROVAL',
    originalStatus: 'PENDING_APPROVAL',
    approvedAt: null,
    approvedByLabel: null,
    updatedAt: null,
    updatedByLabel: null,
    managementHistory: [],
    grantedPermissions: [],
  }
}

function buildStatusOptions(originalStatus) {
  if (originalStatus === 'PENDING_APPROVAL') {
    return [
      { value: 'PENDING_APPROVAL', label: '승인 대기 유지' },
      { value: 'ACTIVE', label: '활성' },
      { value: 'SUSPENDED', label: '중지' },
    ]
  }

  return [
    { value: 'ACTIVE', label: '활성' },
    { value: 'SUSPENDED', label: '중지' },
  ]
}

function formatPermissionSummary(adminUser) {
  if (adminUser.status !== 'ACTIVE') {
    return '승인 후 적용'
  }

  if (adminUser.role === 'STAFF') {
    return adminUser.grantedPermissions.length > 0
      ? `기본 1개 · 추가 ${adminUser.grantedPermissions.length}개`
      : '기본 1개'
  }

  return `기본 ${adminUser.effectivePermissions.length}개`
}

function statusClassName(status) {
  if (status === 'ACTIVE') {
    return 'status-pill--active'
  }

  if (status === 'PENDING_APPROVAL') {
    return 'status-pill--pending'
  }

  return 'status-pill--inactive'
}

function formatDateTimeLabel(value) {
  if (!value) {
    return '기록 없음'
  }

  return value.replace('T', ' ').slice(0, 16)
}
