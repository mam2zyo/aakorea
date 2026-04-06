import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import {
  AdminPageHeader,
  EmptyState,
} from '../../../components/ui'
import { adminDistrictApi } from '../../districts/api/admin'
import {
  adminGroupApi,
  adminGroupContactApi,
  adminMeetingApi,
} from '../../../lib/api'
import { getApiFieldErrors, omitFieldErrors } from '../../../lib/formErrors'
import { normalizePhoneFieldValue } from '../../../lib/phone'
import { ensureSelectValue } from '../../../lib/view'
import { CreateGroupWizard } from './components/CreateGroupWizard'
import { EditGroupSheet } from './components/EditGroupSheet'
import {
  createClosedEditor,
  createEmptyCreateForm,
  districtNameFor,
  GROUP_SORT_MODES,
  hasCreateBasicsErrors,
  sortGroups,
  toPostalContactPayload,
} from './utils'

const EMPTY_CREATE_FORM = createEmptyCreateForm()
const CLOSED_EDITOR = createClosedEditor()

export function GroupManagementPage({
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
      }
    })
  }, [editorGroupId])

  const sortedDistricts = useMemo(
    () => [...districts].sort((left, right) => left.name.localeCompare(right.name, 'ko')),
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
  const createStepLabel = createStep === 1 ? '기본 정보' : '모임 정보'

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
        <div className="admin-overlay" role="presentation">
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
                  saving={saving}
                  sortedDistricts={sortedDistricts}
                  onFieldChange={updateCreateField}
                  onNext={() => void saveCreateBasics()}
                  onPrevious={() => setCreateStep(1)}
                  onResetPostalContactInfo={resetCreatePostalContactInfo}
                  onSubmit={() => void completeCreateFlow()}
                />
              ) : (
                <EditGroupSheet
                  group={currentEditorGroup}
                  onError={onError}
                  onGroupSaved={handleGroupSaved}
                  onClose={closeEditor}
                  onSuccess={onSuccess}
                  sortedDistricts={sortedDistricts}
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
    const nextValue = normalizePhoneFieldValue(field, value)

    setCreateForm((previous) => ({
      ...previous,
      [field]: nextValue,
    }))
    setCreateErrors((previous) => omitFieldErrors(previous, field))
  }

  function resetCreatePostalContactInfo() {
    setCreateForm((previous) => ({
      ...previous,
      postalRecipient: '',
      postalCode: '',
      postalRoadAddress: '',
      postalDetailAddress: '',
    }))
    setCreateErrors((previous) =>
      omitFieldErrors(
        previous,
        'postalRecipient',
        'postalCode',
        'postalRoadAddress',
        'postalDetailAddress',
      ),
    )
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
    if (!createForm.meetings?.length) {
      setCreateErrors((previous) => ({
        ...omitFieldErrors(previous, 'meetings'),
        meetings: '최소 한 개의 모임을 등록해 주세요.',
      }))
      return
    }

    setSaving(true)

    try {
      const savedGroup = await adminGroupApi.createGroup({
        districtId: Number(createForm.districtId),
        name: createForm.name,
      })

      await adminGroupContactApi.createGroupContact({
        groupId: savedGroup.id,
        phone: createForm.phone,
        email: createForm.email,
        postalContact: toPostalContactPayload(createForm),
      })

      for (const meeting of createForm.meetings) {
        await adminMeetingApi.createMeeting({
          groupId: savedGroup.id,
          locationDetail: meeting.locationDetail,
          locationAddress: meeting.locationAddress,
          contactPhoneOverride: meeting.contactPhoneOverride,
          dayOfWeek: meeting.dayOfWeek,
          startTime: meeting.startTime,
          type: meeting.type,
          active: true,
        })
      }

      await loadGroupIndex()
      setSearchQuery('')
      resetCreateFlow()
      setEditorState(CLOSED_EDITOR)
      onSuccess('새 그룹과 모임 정보를 등록했습니다.')
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        if (hasCreateBasicsErrors(fieldErrors)) {
          setCreateStep(1)
          setCreateErrors(fieldErrors)
          return
        }
        setCreateErrors({
          meetings: '모임 정보 저장에 실패했습니다. 각 모임 정보를 다시 확인해 주세요.',
        })
        return
      }

      onError(error, '모임 등록에 실패했습니다.')
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
