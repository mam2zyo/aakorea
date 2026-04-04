import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import {
  AdminPageHeader,
  EmptyState,
  Field,
  StatusPill,
} from '../../components/ui'
import { adminDistrictApi } from '../../features/districts/api/admin'
import { adminGroupApi, adminMeetingApi } from '../../features/groups/api/admin'
import { useGroupWorkspace } from '../../features/groups/admin/hooks/useGroupWorkspace'
import {
  getApiFieldErrors,
  omitFieldErrors,
  readFieldError,
} from '../../lib/formErrors'
import {
  DAY_OF_WEEK_OPTIONS,
  MEETING_TYPE_OPTIONS,
  PROVINCE_OPTIONS,
} from '../../lib/options'
import { ensureSelectValue, lookupLabel } from '../../lib/view'

const GROUP_SORT_MODES = {
  district: '지역연합/이름순',
  name: '이름순',
}

const EMPTY_CREATE_FORM = createEmptyCreateForm()
const CLOSED_EDITOR = createClosedEditor()
const textCollator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' })

export function GroupListPage({
  editorGroupId,
  onError,
  onNavigate,
  onSuccess,
}) {
  const [districts, setDistricts] = useState([])
  const [groups, setGroups] = useState([])
  const [createForm, setCreateForm] = useState(EMPTY_CREATE_FORM)
  const [createErrors, setCreateErrors] = useState({})
  const [createStep, setCreateStep] = useState(1)
  const [editorState, setEditorState] = useState(CLOSED_EDITOR)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortMode, setSortMode] = useState('district')

  async function loadGroupIndex() {
    setLoading(true)

    try {
      const [districtData, groupData] = await Promise.all([
        adminDistrictApi.getDistricts(),
        adminGroupApi.getGroups(),
      ])

      setDistricts(districtData)
      setGroups(groupData)
    } catch (error) {
      onError(error, '그룹 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadGroupIndexEffect = useEffectEvent(() => {
    void loadGroupIndex()
  })

  useEffect(() => {
    loadGroupIndexEffect()
  }, [])

  useEffect(() => {
    setCreateForm((previous) => ensureSelectValue(previous, 'districtId', districts))
  }, [districts])

  useEffect(() => {
    if (!Number.isFinite(editorGroupId)) {
      setEditorState((previous) => (previous.source === 'route' ? CLOSED_EDITOR : previous))
      return
    }

    setEditorState((previous) => {
      if (
        previous.open &&
        previous.source === 'route' &&
        previous.groupId === editorGroupId
      ) {
        return previous
      }

      return {
        open: true,
        source: 'route',
        groupId: editorGroupId,
        activeTab: 'group',
      }
    })
  }, [editorGroupId])

  const sortedDistricts = useMemo(
    () => [...districts].sort((left, right) => textCollator.compare(left.name, right.name)),
    [districts],
  )
  const hasDistrictOptions = sortedDistricts.length > 0
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('ko')
  const filteredGroups = sortGroups(
    groups.filter((group) => {
      const districtName = districtNameFor(group.districtId, districts)
      return [group.name, districtName].some((value) =>
        value.toLocaleLowerCase('ko').includes(normalizedQuery),
      )
    }),
    districts,
    sortMode,
  )
  const currentEditorGroup = Number.isFinite(editorState.groupId)
    ? groups.find((group) => group.id === editorState.groupId) ?? null
    : null
  const isCreateMode = editorState.open && !Number.isFinite(editorState.groupId)
  const editorTitle = isCreateMode
    ? '새 그룹'
    : currentEditorGroup
      ? currentEditorGroup.name
      : '그룹 수정'
  const createStepLabel = createStep === 1 ? '기본 정보' : '첫 모임'

  return (
    <div className="admin-flat-page">
      <AdminPageHeader
        title="그룹 관리"
        description="그룹 목록 위에서 큰 모달로 기본정보, 연락처, 모임 일정을 이어서 관리합니다."
      />

      {loading ? <div className="section-note">그룹 목록을 불러오는 중입니다...</div> : null}

      <div className="admin-list-toolbar">
        <div className="admin-list-toolbar__cluster admin-list-toolbar__cluster--start">
          <div className="admin-list-toolbar__search">
            <input
              aria-label="그룹 검색"
              placeholder="그룹 이름 또는 지역연합으로 검색"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={toggleSortMode}
          >
            정렬: {GROUP_SORT_MODES[sortMode]}
          </button>
        </div>

        <div className="admin-list-toolbar__cluster admin-list-toolbar__cluster--end">
          <span className="admin-directory-toolbar__count">총 {filteredGroups.length}개</span>

          <div className="admin-list-toolbar__divider" aria-hidden="true" />

          <button
            className={`primary-button primary-button--small${
              hasDistrictOptions ? '' : ' primary-button--placeholder'
            }`}
            type="button"
            onClick={startCreatingGroup}
            disabled={!hasDistrictOptions}
          >
            새 그룹
          </button>
        </div>
      </div>

      <div className="admin-flat-page__workspace">
        {groups.length === 0 ? (
          <EmptyState
            title={hasDistrictOptions ? '등록된 그룹이 없습니다.' : '지역연합이 먼저 필요합니다.'}
            description={
              hasDistrictOptions
                ? '새 그룹을 만들고 같은 모달 안에서 연락처와 모임 정보를 이어서 등록해 주세요.'
                : '그룹은 지역연합을 기준으로 등록하므로, 먼저 지역연합을 만들어 주세요.'
            }
          />
        ) : filteredGroups.length === 0 ? (
          <EmptyState
            title="검색 결과가 없습니다."
            description="다른 이름이나 지역연합으로 다시 검색해 주세요."
          />
        ) : (
          <div className="admin-table admin-table--group" role="table" aria-label="그룹 목록">
            <div className="admin-table__header" role="row">
              <span className="admin-table__heading" role="columnheader">번호</span>
              <span className="admin-table__heading" role="columnheader">그룹</span>
              <span className="admin-table__heading" role="columnheader">지역연합</span>
              <span className="admin-table__heading" role="columnheader">관리</span>
            </div>

            {filteredGroups.map((group, index) => (
              <div
                key={group.id}
                className={`admin-table__row admin-table__row--static${
                  editorState.open && editorState.groupId === group.id ? ' admin-table__row--selected' : ''
                }`}
                role="row"
              >
                <span className="admin-table__cell admin-table__cell--index" data-label="번호">
                  {index + 1}
                </span>
                <span className="admin-table__cell admin-table__cell--primary" data-label="그룹">
                  <strong>{group.name}</strong>
                </span>
                <span className="admin-table__cell" data-label="지역연합">
                  {districtNameFor(group.districtId, districts)}
                </span>
                <span className="admin-table__cell admin-table__cell--actions" data-label="관리">
                  <button
                    className="ghost-button ghost-button--small"
                    type="button"
                    onClick={() => startEditingGroup(group.id)}
                  >
                    수정
                  </button>
                  <button
                    className="ghost-button ghost-button--danger ghost-button--small"
                    type="button"
                    onClick={() => void deleteGroupFromList(group)}
                    disabled={deleting}
                  >
                    삭제
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {editorState.open ? (
        <div className="admin-overlay" role="presentation" onClick={closeEditor}>
          <section
            aria-labelledby="group-editor-title"
            aria-modal="true"
            className={`admin-overlay__dialog admin-overlay__dialog--wide admin-overlay__dialog--editor${
              isCreateMode ? ' admin-overlay__dialog--editor-create' : ''
            }`}
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            {isCreateMode ? (
              <header className="admin-group-modal__header">
                <div className="admin-overlay__heading">
                  <h2 id="group-editor-title">{editorTitle}</h2>
                  <p className="admin-group-wizard__progress">
                    {createStep} / 2 · {createStepLabel}
                  </p>
                </div>

                <button
                  className="ghost-button ghost-button--small"
                  type="button"
                  onClick={closeEditor}
                  disabled={saving || deleting}
                >
                  취소
                </button>
              </header>
            ) : null}

            <div className="admin-group-modal__body">
              {isCreateMode ? (
                <CreateGroupWizard
                  createErrors={createErrors}
                  createForm={createForm}
                  createStep={createStep}
                  districtName={districtNameFor(Number(createForm.districtId), districts)}
                  saving={saving}
                  sortedDistricts={sortedDistricts}
                  onFieldChange={updateCreateField}
                  onNext={() => void saveCreateBasics()}
                  onPrevious={() => setCreateStep(1)}
                  onSubmit={() => void completeCreateFlow()}
                  onToggleMailingInfo={toggleMailingInfo}
                />
              ) : (
                <EditGroupSheet
                  groupId={editorState.groupId}
                  onError={onError}
                  onGroupSaved={handleGroupSaved}
                  onClose={closeEditor}
                  onSuccess={onSuccess}
                />
              )}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )

  function toggleSortMode() {
    setSortMode((previous) => (previous === 'district' ? 'name' : 'district'))
  }

  function updateCreateField(field, value) {
    setCreateForm((previous) => ({
      ...previous,
      [field]: value,
    }))
    setCreateErrors((previous) => omitFieldErrors(previous, field))
  }

  function toggleMailingInfo() {
    setCreateForm((previous) => ({
      ...previous,
      mailingInfoExpanded: !previous.mailingInfoExpanded,
    }))
  }

  function startCreatingGroup() {
    if (!hasDistrictOptions) {
      return
    }

    setCreateForm({
      ...EMPTY_CREATE_FORM,
      districtId: String(sortedDistricts[0].id),
    })
    setCreateErrors({})
    setCreateStep(1)
    setEditorState({
      open: true,
      source: 'local',
      groupId: null,
      activeTab: 'group',
    })
  }

  function startEditingGroup(groupId) {
    onNavigate(`/admin/groups/${groupId}`)
  }

  function closeEditor() {
    if (saving || deleting) {
      return
    }

    resetCreateFlow()

    if (editorState.source === 'route') {
      onNavigate('/admin/groups')
      return
    }

    setEditorState(CLOSED_EDITOR)
  }

  async function saveCreateBasics() {
    try {
      if (!createForm.name.trim()) {
        setCreateErrors({
          name: '그룹 이름을 입력해 주세요.',
        })
        return
      }

      if (!createForm.phone.trim()) {
        setCreateErrors({
          phone: '대표 연락처 전화번호를 입력해 주세요.',
        })
        return
      }
      setCreateErrors({})
      setCreateStep(2)
    } catch {
      setCreateErrors({})
    }
  }

  async function completeCreateFlow() {
    setSaving(true)

    try {
      const savedGroup = await adminGroupApi.createGroup({
        districtId: Number(createForm.districtId),
        name: createForm.name,
      })

      await adminGroupApi.createGroupContact({
        groupId: savedGroup.id,
        phone: createForm.phone,
      })

      await adminMeetingApi.createMeeting({
        groupId: savedGroup.id,
        province: createForm.province,
        locationName: createForm.locationName,
        locationAddress: createForm.locationAddress,
        dayOfWeek: createForm.dayOfWeek,
        startTime: createForm.startTime,
        type: createForm.type,
        active: true,
      })

      await loadGroupIndex()
      setSearchQuery('')
      resetCreateFlow()
      setEditorState(CLOSED_EDITOR)
      onSuccess('새 그룹과 첫 모임을 등록했습니다.')
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setCreateErrors(fieldErrors)
        return
      }

      onError(error, '첫 모임 등록에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  function handleGroupSaved(savedGroup) {
    setGroups((previous) =>
      previous.map((group) => (group.id === savedGroup.id ? savedGroup : group)),
    )
  }

  async function deleteGroupFromList(group) {
    if (!group) {
      return
    }

    const confirmed = window.confirm(`"${group.name}" 그룹과 연결된 대표 연락처 및 모든 모임을 함께 삭제하시겠습니까?`)
    if (!confirmed) {
      return
    }

    setDeleting(true)

    try {
      await adminGroupApi.deleteGroup(group.id)

      setGroups((previous) => previous.filter((item) => item.id !== group.id))
      resetCreateFlow()

      if (editorState.open && editorState.groupId === group.id) {
        onNavigate('/admin/groups')
      }

      onSuccess('그룹을 삭제했습니다.')
    } catch (error) {
      onError(error, '그룹 삭제에 실패했습니다.')
    } finally {
      setDeleting(false)
    }
  }

  function resetCreateFlow() {
    setCreateErrors({})
    setCreateStep(1)
    setCreateForm((previous) => ({
      ...EMPTY_CREATE_FORM,
      districtId: previous.districtId || String(sortedDistricts[0]?.id ?? ''),
    }))
  }
}

function EditGroupSheet({
  groupId,
  onError,
  onGroupSaved,
  onClose,
  onSuccess,
}) {
  const workspace = useGroupWorkspace({
    groupId,
    onError,
    onGroupSaved,
    onSuccess,
  })
  const {
    districts,
    groupData,
    groupContacts,
    meetings,
    groupForm,
    contactForm,
    meetingForm,
    groupErrors,
    contactErrors,
    meetingErrors,
    loading,
    missingGroup,
    saveGroup,
    saveContact,
    saveMeeting,
    deleteMeeting,
    startNewContact,
    startEditContact,
    startNewMeeting,
    startEditMeeting,
    updateGroupField,
    updateContactField,
    updateMeetingField,
    updateMeetingActive,
    resetGroupForm,
  } = workspace
  const sortedDistricts = useMemo(
    () => [...districts].sort((left, right) => textCollator.compare(left.name, right.name)),
    [districts],
  )
  const [editingSection, setEditingSection] = useState(null)
  const [editingMeetingId, setEditingMeetingId] = useState(null)
  const [showGroupEditModal, setShowGroupEditModal] = useState(false)
  const [showContactEditModal, setShowContactEditModal] = useState(false)
  const [showMeetingEditModal, setShowMeetingEditModal] = useState(false)
  const [showCreateMeetingModal, setShowCreateMeetingModal] = useState(false)
  const [returnMeeting, setReturnMeeting] = useState(null)
  const selectedContact = groupContacts[0] ?? null
  const contactEmailMock = 'abc@example.org'
  const contactMailingAddressMock = '경기도 어쩌구 저쩌구'

  if (missingGroup) {
    return (
      <EmptyState
        title="요청한 그룹을 찾지 못했습니다."
        description="목록에서 다시 그룹을 선택해 주세요."
      />
    )
  }

  return (
    <section className="admin-group-edit-sheet">
      {loading ? <div className="section-note">그룹 정보를 불러오는 중입니다...</div> : null}

      <header className="admin-group-edit-sheet__header">
        <h2 className="admin-group-edit-sheet__title">{groupData?.name || '그룹 수정'}</h2>

        <div className="admin-group-edit-sheet__header-actions">
          <button
            className="primary-button primary-button--small"
            type="button"
            onClick={() => void handleApplyAndClose()}
          >
            적용하고 닫기
          </button>
          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={handleCancelSheet}
          >
            취소
          </button>
        </div>
      </header>

      <section className="admin-group-edit-sheet__section">
        <div className="admin-group-edit-sheet__section-head">
          <h3>기본 정보</h3>
          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={openGroupEditModal}
          >
            수정
          </button>
        </div>

        <div className="admin-group-edit-sheet__rows">
          <div className="admin-group-edit-sheet__rowline">
            <span className="admin-group-edit-sheet__rowlabel">그룹 이름</span>
            <div className="admin-group-edit-sheet__rowcontrol">
              <span className="admin-group-edit-sheet__rowvalue">{groupForm.name || '-'}</span>
            </div>
          </div>

          <div className="admin-group-edit-sheet__rowline">
            <span className="admin-group-edit-sheet__rowlabel">지역연합</span>
            <div className="admin-group-edit-sheet__rowcontrol">
              <span className="admin-group-edit-sheet__rowvalue">
                {sortedDistricts.find((district) => String(district.id) === groupForm.districtId)?.name || '-'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-group-edit-sheet__section">
        <div className="admin-group-edit-sheet__section-head">
          <h3>연락처</h3>
          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={openContactEditModal}
          >
            수정
          </button>
        </div>

        <div className="admin-group-edit-sheet__rows">
          <div className="admin-group-edit-sheet__rowline">
            <span className="admin-group-edit-sheet__rowlabel">전화번호</span>
            <div className="admin-group-edit-sheet__rowcontrol">
              <span className="admin-group-edit-sheet__rowvalue">{contactForm.phone || '-'}</span>
            </div>
          </div>

          <div className="admin-group-edit-sheet__rowline">
            <span className="admin-group-edit-sheet__rowlabel">이메일</span>
            <div className="admin-group-edit-sheet__rowcontrol">
              <span className="admin-group-edit-sheet__rowvalue admin-group-edit-sheet__rowvalue--muted">{contactEmailMock}</span>
            </div>
          </div>

          <div className="admin-group-edit-sheet__rowline">
            <span className="admin-group-edit-sheet__rowlabel">우편수신주소</span>
            <div className="admin-group-edit-sheet__rowcontrol admin-group-edit-sheet__rowcontrol--wide">
              <span className="admin-group-edit-sheet__rowvalue admin-group-edit-sheet__rowvalue--muted">{contactMailingAddressMock}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-group-edit-sheet__section admin-group-edit-sheet__section--meetings">
        <div className="admin-group-edit-sheet__section-head">
          <h3>모임 정보</h3>

          <div className="admin-group-edit-sheet__section-actions">
            <button
              className="ghost-button ghost-button--small"
              type="button"
              onClick={openCreateMeetingModal}
            >
              새 모임 추가
            </button>
          </div>
        </div>

        {meetings.length > 0 ? (
          <div className="admin-group-edit-sheet__meeting-list">
            {meetings.map((meeting) => {
              return (
                <article key={meeting.id} className="admin-group-edit-sheet__meeting-item">
                  <div className="admin-group-edit-sheet__meeting-summary">
                    <strong>
                      {lookupLabel(DAY_OF_WEEK_OPTIONS, meeting.dayOfWeek)} {meeting.startTime}
                    </strong>
                    <span>{meeting.locationName || '장소명 미입력'}</span>
                  </div>

                  <div className="admin-group-edit-sheet__meeting-meta-actions">
                    <button
                      className="ghost-button ghost-button--small"
                      type="button"
                      onClick={() => openMeetingEditModal(meeting)}
                    >
                      수정
                    </button>
                    <button
                      className="ghost-button ghost-button--danger ghost-button--small"
                      type="button"
                      onClick={() => void handleDeleteMeeting(meeting)}
                    >
                      삭제
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        ) : null}

        {meetings.length === 0 ? (
          <div className="section-note">등록된 모임이 없습니다. `새 모임 추가`로 첫 모임을 등록해 주세요.</div>
        ) : null}
      </section>

      {showGroupEditModal ? (
        <div className="admin-overlay admin-overlay--nested" role="presentation" onClick={handleCancelGroupEdit}>
          <section
            aria-modal="true"
            className="admin-overlay__dialog admin-overlay__dialog--submodal"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="admin-group-modal__header admin-group-modal__header--submodal">
              <div className="admin-overlay__heading">
                <h2>기본 정보 수정</h2>
              </div>

              <button
                className="ghost-button ghost-button--small"
                type="button"
                onClick={handleCancelGroupEdit}
              >
                취소
              </button>
            </header>

            <div className="admin-group-modal__body">
              <form
                className="admin-group-edit-sheet__rows"
                onSubmit={(event) => {
                  event.preventDefault()
                  void handleSaveGroup()
                }}
              >
                <div className="admin-group-edit-sheet__rowline">
                  <label className="admin-group-edit-sheet__rowlabel" htmlFor="group-modal-name">
                    그룹 이름
                  </label>
                  <div className="admin-group-edit-sheet__rowcontrol">
                    <input
                      id="group-modal-name"
                      value={groupForm.name}
                      onChange={(event) => updateGroupField('name', event.target.value)}
                    />
                    {readFieldError(groupErrors, 'name') ? (
                      <span className="field__error">{readFieldError(groupErrors, 'name')}</span>
                    ) : null}
                  </div>
                </div>

                <div className="admin-group-edit-sheet__rowline">
                  <label className="admin-group-edit-sheet__rowlabel" htmlFor="group-modal-district">
                    지역연합
                  </label>
                  <div className="admin-group-edit-sheet__rowcontrol admin-group-edit-sheet__rowcontrol--compact">
                    <select
                      id="group-modal-district"
                      value={groupForm.districtId}
                      onChange={(event) => updateGroupField('districtId', event.target.value)}
                    >
                      {sortedDistricts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                    {readFieldError(groupErrors, 'districtId') ? (
                      <span className="field__error">{readFieldError(groupErrors, 'districtId')}</span>
                    ) : null}
                  </div>
                </div>

                <div className="admin-group-wizard__actions">
                  <button className="primary-button" type="submit">
                    저장
                  </button>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={handleCancelGroupEdit}
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      ) : null}

      {showContactEditModal ? (
        <div className="admin-overlay admin-overlay--nested" role="presentation" onClick={handleCancelContactEdit}>
          <section
            aria-modal="true"
            className="admin-overlay__dialog admin-overlay__dialog--submodal"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="admin-group-modal__header admin-group-modal__header--submodal">
              <div className="admin-overlay__heading">
                <h2>연락처 수정</h2>
              </div>

              <button
                className="ghost-button ghost-button--small"
                type="button"
                onClick={handleCancelContactEdit}
              >
                취소
              </button>
            </header>

            <div className="admin-group-modal__body">
              <form
                className="admin-group-edit-sheet__rows"
                onSubmit={(event) => {
                  event.preventDefault()
                  void handleSaveContact()
                }}
              >
                <div className="admin-group-edit-sheet__rowline">
                  <label className="admin-group-edit-sheet__rowlabel" htmlFor="contact-modal-phone">
                    전화번호
                  </label>
                  <div className="admin-group-edit-sheet__rowcontrol">
                    <input
                      id="contact-modal-phone"
                      placeholder="010-1234-5678"
                      value={contactForm.phone}
                      onChange={(event) => updateContactField('phone', event.target.value)}
                    />
                    {readFieldError(contactErrors, 'phone') ? (
                      <span className="field__error">{readFieldError(contactErrors, 'phone')}</span>
                    ) : null}
                  </div>
                </div>

                <div className="admin-group-edit-sheet__rowline">
                  <span className="admin-group-edit-sheet__rowlabel">이메일</span>
                  <div className="admin-group-edit-sheet__rowcontrol">
                    <input disabled value={contactEmailMock} />
                  </div>
                </div>

                <div className="admin-group-edit-sheet__rowline">
                  <span className="admin-group-edit-sheet__rowlabel">우편수신주소</span>
                  <div className="admin-group-edit-sheet__rowcontrol admin-group-edit-sheet__rowcontrol--wide">
                    <input disabled value={contactMailingAddressMock} />
                  </div>
                </div>

                <div className="admin-group-wizard__actions">
                  <button className="primary-button" type="submit">
                    저장
                  </button>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={handleCancelContactEdit}
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      ) : null}

      {showCreateMeetingModal ? (
        <div className="admin-overlay admin-overlay--nested" role="presentation" onClick={handleCancelCreateMeeting}>
          <section
            aria-modal="true"
            className="admin-overlay__dialog admin-overlay__dialog--submodal"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="admin-group-modal__header admin-group-modal__header--submodal">
              <div className="admin-overlay__heading">
                <h2>새 모임 추가</h2>
              </div>

              <button
                className="ghost-button ghost-button--small"
                type="button"
                onClick={handleCancelCreateMeeting}
              >
                취소
              </button>
            </header>

            <div className="admin-group-modal__body">
              <form
                className="admin-group-wizard__form"
                onSubmit={(event) => {
                  event.preventDefault()
                  void handleCreateMeeting()
                }}
              >
                <div className="admin-group-wizard__grid admin-group-wizard__grid--meeting-meta">
                  <Field label="요일" error={readFieldError(meetingErrors, 'dayOfWeek')}>
                    <select
                      value={meetingForm.dayOfWeek}
                      onChange={(event) => updateMeetingField('dayOfWeek', event.target.value)}
                    >
                      {DAY_OF_WEEK_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="시작 시간" error={readFieldError(meetingErrors, 'startTime')}>
                    <input
                      type="time"
                      value={meetingForm.startTime}
                      onChange={(event) => updateMeetingField('startTime', event.target.value)}
                    />
                  </Field>

                  <Field label="모임 유형" error={readFieldError(meetingErrors, 'type')}>
                    <select
                      value={meetingForm.type}
                      onChange={(event) => updateMeetingField('type', event.target.value)}
                    >
                      {MEETING_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="admin-group-wizard__grid">
                  <Field
                    className="admin-group-wizard__field admin-group-wizard__field--wide"
                    label="장소명"
                    error={readFieldError(meetingErrors, 'locationName')}
                  >
                    <input
                      value={meetingForm.locationName}
                      onChange={(event) => updateMeetingField('locationName', event.target.value)}
                    />
                  </Field>

                  <Field
                    className="admin-group-wizard__field admin-group-wizard__field--compact"
                    label="지역"
                    error={readFieldError(meetingErrors, 'province')}
                  >
                    <select
                      value={meetingForm.province}
                      onChange={(event) => updateMeetingField('province', event.target.value)}
                    >
                      {PROVINCE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="admin-group-wizard__address-row">
                  <Field
                    className="admin-group-wizard__field admin-group-wizard__field--wide"
                    label="주소"
                    error={readFieldError(meetingErrors, 'locationAddress')}
                  >
                    <input
                      value={meetingForm.locationAddress}
                      onChange={(event) => updateMeetingField('locationAddress', event.target.value)}
                    />
                  </Field>

                  <button className="ghost-button ghost-button--small" type="button">
                    주소 검색
                  </button>
                </div>

                <div className="admin-group-wizard__actions">
                  <button className="primary-button" type="submit">
                    추가
                  </button>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={handleCancelCreateMeeting}
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      ) : null}

      {showMeetingEditModal ? (
        <div className="admin-overlay admin-overlay--nested" role="presentation" onClick={handleCancelMeetingEdit}>
          <section
            aria-modal="true"
            className="admin-overlay__dialog admin-overlay__dialog--submodal"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="admin-group-modal__header admin-group-modal__header--submodal">
              <div className="admin-overlay__heading">
                <h2>모임 수정</h2>
              </div>

              <button
                className="ghost-button ghost-button--small"
                type="button"
                onClick={handleCancelMeetingEdit}
              >
                취소
              </button>
            </header>

            <div className="admin-group-modal__body">
              <form
                className="admin-group-wizard__form"
                onSubmit={(event) => {
                  event.preventDefault()
                  void handleSaveMeeting()
                }}
              >
                <div className="admin-group-wizard__grid admin-group-wizard__grid--meeting-meta">
                  <Field label="요일" error={readFieldError(meetingErrors, 'dayOfWeek')}>
                    <select
                      value={meetingForm.dayOfWeek}
                      onChange={(event) => updateMeetingField('dayOfWeek', event.target.value)}
                    >
                      {DAY_OF_WEEK_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="시작 시간" error={readFieldError(meetingErrors, 'startTime')}>
                    <input
                      type="time"
                      value={meetingForm.startTime}
                      onChange={(event) => updateMeetingField('startTime', event.target.value)}
                    />
                  </Field>

                  <Field label="모임 유형" error={readFieldError(meetingErrors, 'type')}>
                    <select
                      value={meetingForm.type}
                      onChange={(event) => updateMeetingField('type', event.target.value)}
                    >
                      {MEETING_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="admin-group-wizard__grid">
                  <Field
                    className="admin-group-wizard__field admin-group-wizard__field--wide"
                    label="장소명"
                    error={readFieldError(meetingErrors, 'locationName')}
                  >
                    <input
                      value={meetingForm.locationName}
                      onChange={(event) => updateMeetingField('locationName', event.target.value)}
                    />
                  </Field>

                  <Field
                    className="admin-group-wizard__field admin-group-wizard__field--compact"
                    label="지역"
                    error={readFieldError(meetingErrors, 'province')}
                  >
                    <select
                      value={meetingForm.province}
                      onChange={(event) => updateMeetingField('province', event.target.value)}
                    >
                      {PROVINCE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="admin-group-wizard__address-row">
                  <Field
                    className="admin-group-wizard__field admin-group-wizard__field--wide"
                    label="주소"
                    error={readFieldError(meetingErrors, 'locationAddress')}
                  >
                    <input
                      value={meetingForm.locationAddress}
                      onChange={(event) => updateMeetingField('locationAddress', event.target.value)}
                    />
                  </Field>

                  <button className="ghost-button ghost-button--small" type="button">
                    주소 검색
                  </button>
                </div>

                <MeetingActiveToggle
                  active={meetingForm.active}
                  onToggle={() => updateMeetingActive(!meetingForm.active)}
                />

                <div className="admin-group-wizard__actions">
                  <button className="primary-button" type="submit">
                    저장
                  </button>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={handleCancelMeetingEdit}
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  )

  function openGroupEditModal() {
    resetGroupForm()
    setShowGroupEditModal(true)
  }

  function openContactEditModal() {
    if (selectedContact) {
      startEditContact(selectedContact)
    } else {
      startNewContact()
    }
    setEditingMeetingId(null)
    setShowContactEditModal(true)
  }

  async function handleSaveGroup() {
    const success = await saveGroup()
    if (success) {
      setShowGroupEditModal(false)
    }
  }

  function handleCancelGroupEdit() {
    resetGroupForm()
    setShowGroupEditModal(false)
  }

  async function handleSaveContact() {
    const success = await saveContact()
    if (success) {
      setShowContactEditModal(false)
    }
  }

  function handleCancelContactEdit() {
    if (selectedContact) {
      startEditContact(selectedContact)
    } else {
      startNewContact()
    }
    setShowContactEditModal(false)
  }

  async function handleSaveMeeting() {
    const success = await saveMeeting()
    if (success) {
      setShowMeetingEditModal(false)
      setEditingMeetingId(null)
      setEditingSection(null)
    }
  }

  function handleCancelMeetingEdit() {
    if (editingMeetingId) {
      const targetMeeting = meetings.find((meeting) => meeting.id === editingMeetingId)
      if (targetMeeting) {
        startEditMeeting(targetMeeting)
      }
    }
    setShowMeetingEditModal(false)
    setEditingMeetingId(null)
    setEditingSection(null)
  }

  function openCreateMeetingModal() {
    const activeMeeting = editingMeetingId
      ? meetings.find((meeting) => meeting.id === editingMeetingId) ?? null
      : null

    setReturnMeeting(activeMeeting)
    startNewMeeting()
    setShowCreateMeetingModal(true)
    setEditingMeetingId(null)
    setEditingSection(null)
  }

  async function handleCreateMeeting() {
    const success = await saveMeeting()
    if (!success) {
      return
    }

    setShowCreateMeetingModal(false)
    setReturnMeeting(null)
  }

  function handleCancelCreateMeeting() {
    if (returnMeeting) {
      startEditMeeting(returnMeeting)
      setEditingMeetingId(returnMeeting.id)
    }
    setShowCreateMeetingModal(false)
    setReturnMeeting(null)
  }

  function handleStartMeetingEdit(meeting) {
    startEditMeeting(meeting)
    setEditingMeetingId(meeting.id)
    setEditingSection('meeting')
  }

  function openMeetingEditModal(meeting) {
    handleStartMeetingEdit(meeting)
    setShowMeetingEditModal(true)
  }

  async function handleDeleteMeeting(meeting) {
    const meetingLabel = `${lookupLabel(DAY_OF_WEEK_OPTIONS, meeting.dayOfWeek)} ${meeting.startTime}`
    const locationLabel = meeting.locationName || '장소명 미입력'
    const confirmed = window.confirm(`"${meetingLabel} · ${locationLabel}" 모임을 삭제하시겠습니까?`)

    if (!confirmed) {
      return
    }

    const success = await deleteMeeting(meeting.id)
    if (!success) {
      return
    }

    if (editingMeetingId === meeting.id) {
      setShowMeetingEditModal(false)
      setEditingMeetingId(null)
      setEditingSection(null)
    }

    if (returnMeeting?.id === meeting.id) {
      setReturnMeeting(null)
    }
  }

  async function handleApplyAndClose() {
    let success = true

    if (showGroupEditModal) {
      success = await saveGroup()
      if (success) {
        setShowGroupEditModal(false)
      }
    } else if (showContactEditModal) {
      success = await saveContact()
      if (success) {
        setShowContactEditModal(false)
      }
    } else if (showMeetingEditModal) {
      success = await saveMeeting()
      if (success) {
        setShowMeetingEditModal(false)
        setEditingMeetingId(null)
      }
    } else if (editingSection === 'meeting') {
      success = await saveMeeting()
      if (success) {
        setEditingMeetingId(null)
      }
    }

    if (!success) {
      return
    }

    setShowGroupEditModal(false)
    setShowContactEditModal(false)
    setShowMeetingEditModal(false)
    setEditingSection(null)
    setEditingMeetingId(null)
    onClose()
  }

  function handleCancelSheet() {
    handleResetAll()
    onClose()
  }

  function handleResetAll() {
    setShowGroupEditModal(false)
    setShowContactEditModal(false)
    setShowMeetingEditModal(false)
    setShowCreateMeetingModal(false)
    setEditingSection(null)
    setEditingMeetingId(null)
    setReturnMeeting(null)
  }
}

function CreateGroupWizard({
  createErrors,
  createForm,
  createStep,
  districtName,
  saving,
  sortedDistricts,
  onFieldChange,
  onNext,
  onPrevious,
  onSubmit,
  onToggleMailingInfo,
}) {
  const addressPreviewTitle = createForm.locationName || '지도 연동 예정'
  const addressPreviewText = createForm.locationAddress || '주소 검색 API 연결 후 이 영역에 지도가 표시됩니다.'

  return (
    <section className="admin-group-wizard">
      {createStep === 1 ? (
        <form
          className="admin-group-wizard__form"
          onSubmit={(event) => {
            event.preventDefault()
            void onNext()
          }}
        >
          <div className="admin-group-wizard__grid admin-group-wizard__grid--intro">
            <Field
              className="admin-group-wizard__field admin-group-wizard__field--wide"
              label="그룹 이름"
              error={readFieldError(createErrors, 'name')}
            >
              <input
                placeholder="예: 소망"
                value={createForm.name}
                onChange={(event) => onFieldChange('name', event.target.value)}
              />
            </Field>

            <Field
              className="admin-group-wizard__field admin-group-wizard__field--compact"
              label="지역연합"
              error={readFieldError(createErrors, 'districtId')}
            >
              <select
                value={createForm.districtId}
                onChange={(event) => onFieldChange('districtId', event.target.value)}
              >
                {sortedDistricts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="admin-group-wizard__section">
            <Field label="대표 연락처" error={readFieldError(createErrors, 'phone')}>
              <input
                placeholder="010-1234-5678"
                value={createForm.phone}
                onChange={(event) => onFieldChange('phone', event.target.value)}
              />
            </Field>

            <Field label="이메일 (선택)">
              <input
                placeholder="example@email.com"
                value={createForm.email}
                onChange={(event) => onFieldChange('email', event.target.value)}
              />
            </Field>
          </div>

          <section className="admin-group-wizard__section admin-group-wizard__section--mailing">
            <div className="admin-group-wizard__section-head">
              <div>
                <strong>우편물 수령 정보</strong>
                <p>백엔드 연결 전까지는 화면 목업용으로만 유지됩니다.</p>
              </div>

              <button
                className="ghost-button ghost-button--small"
                type="button"
                onClick={onToggleMailingInfo}
              >
                {createForm.mailingInfoExpanded ? '접기' : '입력'}
              </button>
            </div>

            {createForm.mailingInfoExpanded ? (
              <div className="admin-group-wizard__grid">
                <Field label="수령인">
                  <input
                    value={createForm.mailingRecipient}
                    onChange={(event) => onFieldChange('mailingRecipient', event.target.value)}
                  />
                </Field>

                <div className="admin-group-wizard__postcode">
                  <Field label="우편번호">
                    <input
                      value={createForm.mailingPostalCode}
                      onChange={(event) => onFieldChange('mailingPostalCode', event.target.value)}
                    />
                  </Field>

                  <button className="ghost-button ghost-button--small" type="button">
                    주소 검색
                  </button>
                </div>

                <Field className="admin-group-wizard__field admin-group-wizard__field--wide" label="도로명 주소">
                  <input
                    value={createForm.mailingRoadAddress}
                    onChange={(event) => onFieldChange('mailingRoadAddress', event.target.value)}
                  />
                </Field>

                <Field className="admin-group-wizard__field admin-group-wizard__field--wide" label="상세 주소">
                  <input
                    value={createForm.mailingAddressDetails}
                    onChange={(event) => onFieldChange('mailingAddressDetails', event.target.value)}
                  />
                </Field>
              </div>
            ) : null}
          </section>

          <div className="admin-group-wizard__actions">
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? '저장 중...' : '다음'}
            </button>
          </div>
        </form>
      ) : (
        <form
          className="admin-group-wizard__form"
          onSubmit={(event) => {
            event.preventDefault()
            void onSubmit()
          }}
        >
          <div className="admin-group-wizard__summary">
            <strong>{createForm.name || '새 그룹'}</strong>
            <span>{districtName}</span>
          </div>

          <div className="admin-group-wizard__grid admin-group-wizard__grid--meeting-meta">
            <Field label="요일" error={readFieldError(createErrors, 'dayOfWeek')}>
              <select
                value={createForm.dayOfWeek}
                onChange={(event) => onFieldChange('dayOfWeek', event.target.value)}
              >
                {DAY_OF_WEEK_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="시작 시간" error={readFieldError(createErrors, 'startTime')}>
              <input
                type="time"
                value={createForm.startTime}
                onChange={(event) => onFieldChange('startTime', event.target.value)}
              />
            </Field>

            <Field label="모임 유형" error={readFieldError(createErrors, 'type')}>
              <select
                value={createForm.type}
                onChange={(event) => onFieldChange('type', event.target.value)}
              >
                {MEETING_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="admin-group-wizard__address-row">
            <Field
              className="admin-group-wizard__field admin-group-wizard__field--wide"
              label="주소"
              error={readFieldError(createErrors, 'locationAddress')}
            >
              <input
                value={createForm.locationAddress}
                onChange={(event) => onFieldChange('locationAddress', event.target.value)}
              />
            </Field>

            <button className="ghost-button ghost-button--small" type="button">
              주소 검색
            </button>
          </div>

          <div className="admin-group-wizard__grid">
            <Field
              className="admin-group-wizard__field admin-group-wizard__field--compact"
              label="지역"
              error={readFieldError(createErrors, 'province')}
            >
              <select
                value={createForm.province}
                onChange={(event) => onFieldChange('province', event.target.value)}
              >
                {PROVINCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              className="admin-group-wizard__field admin-group-wizard__field--wide"
              label="장소명"
              error={readFieldError(createErrors, 'locationName')}
            >
              <input
                value={createForm.locationName}
                onChange={(event) => onFieldChange('locationName', event.target.value)}
              />
            </Field>
          </div>

          <div className="admin-group-wizard__map-mock">
            <span className="admin-group-wizard__map-pin" aria-hidden="true" />
            <div className="admin-group-wizard__map-card">
              <strong>{addressPreviewTitle}</strong>
              <span>{addressPreviewText}</span>
            </div>
          </div>

          <div className="admin-group-wizard__meeting-preview">
            <strong>
              {lookupLabel(DAY_OF_WEEK_OPTIONS, createForm.dayOfWeek)} {createForm.startTime} · {lookupLabel(MEETING_TYPE_OPTIONS, createForm.type)}
            </strong>
            <span>{createForm.locationName || '장소명을 입력해 주세요.'}</span>
          </div>

          <div className="admin-group-wizard__actions admin-group-wizard__actions--split">
            <button className="ghost-button" type="button" onClick={onPrevious} disabled={saving}>
              이전
            </button>

            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? '등록 중...' : '완료'}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

function sortGroups(groups, districts, sortMode) {
  return [...groups].sort((left, right) => {
    if (sortMode === 'name') {
      const nameCompare = textCollator.compare(left.name, right.name)
      if (nameCompare !== 0) {
        return nameCompare
      }
    }

    const districtCompare = textCollator.compare(
      districtNameFor(left.districtId, districts),
      districtNameFor(right.districtId, districts),
    )
    if (districtCompare !== 0) {
      return districtCompare
    }

    const nameCompare = textCollator.compare(left.name, right.name)
    if (nameCompare !== 0) {
      return nameCompare
    }

    return left.id - right.id
  })
}

function createEmptyCreateForm() {
  return {
    phone: '',
    email: '',
    districtId: '',
    mailingAddressDetails: '',
    mailingInfoExpanded: false,
    mailingPostalCode: '',
    mailingRecipient: '',
    mailingRoadAddress: '',
    name: '',
    province: PROVINCE_OPTIONS[0]?.value ?? 'seoul',
    locationAddress: '',
    locationName: '',
    dayOfWeek: DAY_OF_WEEK_OPTIONS[0]?.value ?? 'MONDAY',
    startTime: '19:00',
    type: MEETING_TYPE_OPTIONS[0]?.value ?? 'OPEN',
  }
}

function createClosedEditor() {
  return {
    open: false,
    source: 'local',
    groupId: null,
    activeTab: 'group',
  }
}

function MeetingActiveToggle({ active, onToggle }) {
  return (
    <div className="admin-group-edit-sheet__status-toggle">
      <span className="admin-group-edit-sheet__status-label">모임 상태</span>

      <button
        aria-checked={active}
        className={`admin-group-edit-sheet__switch${active ? ' admin-group-edit-sheet__switch--active' : ''}`}
        role="switch"
        type="button"
        onClick={onToggle}
      >
        <span className="admin-group-edit-sheet__switch-track" aria-hidden="true">
          <span className="admin-group-edit-sheet__switch-thumb" />
        </span>
        <span
          className={`admin-group-edit-sheet__switch-text${
            active
              ? ' admin-group-edit-sheet__switch-text--active'
              : ' admin-group-edit-sheet__switch-text--inactive'
          }`}
        >
          {active ? '진행중' : '잠정 중단'}
        </span>
      </button>
    </div>
  )
}

function mergeById(items, savedItem) {
  const existingIndex = items.findIndex((item) => item.id === savedItem.id)
  if (existingIndex === -1) {
    return [...items, savedItem]
  }

  const nextItems = [...items]
  nextItems[existingIndex] = savedItem
  return nextItems
}

function districtNameFor(districtId, districts) {
  return districts.find((district) => district.id === districtId)?.name ?? `지역연합 #${districtId}`
}
