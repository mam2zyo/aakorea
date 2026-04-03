import { useEffect, useEffectEvent, useState } from 'react'
import {
  AdminPageHeader,
  EmptyState,
  Field,
} from '../../components/ui'
import { adminDistrictApi } from '../../features/districts/api/admin'
import { adminGroupApi } from '../../features/groups/api/admin'
import { getApiFieldErrors, omitFieldErrors, readFieldError } from '../../lib/formErrors'
import { ensureSelectValue } from '../../lib/view'

const GROUP_SORT_MODES = {
  district: '지역연합/이름순',
  name: '이름순',
}

const EMPTY_GROUP_FORM = createEmptyGroupForm()
const textCollator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' })

export function GroupListPage({ onError, onNavigate, onSuccess }) {
  const [districts, setDistricts] = useState([])
  const [groups, setGroups] = useState([])
  const [groupForm, setGroupForm] = useState(EMPTY_GROUP_FORM)
  const [groupErrors, setGroupErrors] = useState({})
  const [editorOpen, setEditorOpen] = useState(false)
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
      onError(error, 'Group 목록을 불러오지 못했습니다.')
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
    setGroupForm((previous) => ensureSelectValue(previous, 'districtId', districts))
  }, [districts])

  const sortedDistricts = [...districts].sort((left, right) =>
    textCollator.compare(left.name, right.name),
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

  return (
    <div className="admin-flat-page">
      <AdminPageHeader title="Group 관리" />

      {loading ? <div className="section-note">Group 목록을 불러오는 중입니다...</div> : null}

      <div className="admin-list-toolbar">
        <div className="admin-list-toolbar__cluster admin-list-toolbar__cluster--start">
          <div className="admin-list-toolbar__search">
            <input
              aria-label="Group 검색"
              placeholder="Group 이름 또는 지역연합으로 검색"
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
            새 Group
          </button>
        </div>
      </div>

      <div className="admin-flat-page__workspace">
        {groups.length === 0 ? (
          <EmptyState
            title={hasDistrictOptions ? '등록된 Group이 없습니다.' : '지역연합이 먼저 필요합니다.'}
            description={
              hasDistrictOptions
                ? '새 Group을 만들고 작업공간에서 연락처와 모임 정보를 이어서 등록해 주세요.'
                : 'Group은 지역연합을 기준으로 등록하므로, 먼저 지역연합을 만들어 주세요.'
            }
          />
        ) : filteredGroups.length === 0 ? (
          <EmptyState
            title="검색 결과가 없습니다."
            description="다른 이름이나 지역연합으로 다시 검색해 주세요."
          />
        ) : (
          <div className="admin-table admin-table--group" role="table" aria-label="Group 목록">
            <div className="admin-table__header" role="row">
              <span className="admin-table__heading" role="columnheader">번호</span>
              <span className="admin-table__heading" role="columnheader">지역연합</span>
              <span className="admin-table__heading" role="columnheader">Group</span>
              <span className="admin-table__heading" role="columnheader">관리</span>
            </div>

            {filteredGroups.map((group, index) => (
              <div
                key={group.id}
                className={`admin-table__row admin-table__row--static${
                  editorOpen && groupForm.id === group.id ? ' admin-table__row--selected' : ''
                }`}
                role="row"
              >
                <span className="admin-table__cell admin-table__cell--index" data-label="번호">
                  {index + 1}
                </span>
                <span className="admin-table__cell" data-label="지역연합">
                  {districtNameFor(group.districtId, districts)}
                </span>
                <span className="admin-table__cell admin-table__cell--primary" data-label="Group">
                  <strong>{group.name}</strong>
                </span>
                <span className="admin-table__cell admin-table__cell--actions" data-label="관리">
                  <button
                    className="ghost-button ghost-button--small"
                    type="button"
                    onClick={() => startEditingGroup(group)}
                  >
                    수정
                  </button>
                  <button
                    className="ghost-button ghost-button--small"
                    type="button"
                    onClick={() => navigateToGroupEditor(group.id)}
                  >
                    작업공간
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {editorOpen ? (
        <div className="admin-overlay" role="presentation" onClick={closeEditor}>
          <div
            aria-labelledby="group-editor-title"
            aria-modal="true"
            className="admin-overlay__dialog"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-overlay__header">
              <div className="admin-overlay__heading">
                <h2 id="group-editor-title">{groupForm.id ? 'Group 수정' : '새 Group'}</h2>
                <p className="admin-form-note">
                  Group에는 이름과 지역연합만 두고, 실제 장소와 시간표는 작업공간의 모임 정보에서 관리합니다.
                </p>
              </div>

              <button
                className="ghost-button ghost-button--small"
                type="button"
                onClick={closeEditor}
                disabled={saving || deleting}
              >
                닫기
              </button>
            </div>

            <form
              className="field-grid"
              onSubmit={(event) => {
                event.preventDefault()
                void saveGroup()
              }}
            >
              <Field label="지역연합" error={readFieldError(groupErrors, 'districtId')}>
                <select
                  value={groupForm.districtId}
                  onChange={(event) => {
                    setGroupForm((previous) => ({
                      ...previous,
                      districtId: event.target.value,
                    }))
                    setGroupErrors((previous) => omitFieldErrors(previous, 'districtId'))
                  }}
                >
                  {sortedDistricts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Group 이름" error={readFieldError(groupErrors, 'name')}>
                <input
                  value={groupForm.name}
                  onChange={(event) => {
                    setGroupForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                    setGroupErrors((previous) => omitFieldErrors(previous, 'name'))
                  }}
                />
              </Field>

              <div className="button-row button-row--compact">
                <button className="primary-button" type="submit" disabled={saving || deleting}>
                  {saving ? '저장 중...' : groupForm.id ? 'Group 저장' : 'Group 생성'}
                </button>

                {groupForm.id ? (
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => navigateToGroupEditor(groupForm.id)}
                    disabled={saving || deleting}
                  >
                    작업공간 열기
                  </button>
                ) : null}

                {groupForm.id ? (
                  <button
                    className="ghost-button ghost-button--danger"
                    type="button"
                    onClick={() => void deleteGroup()}
                    disabled={saving || deleting}
                  >
                    {deleting ? '삭제 중...' : 'Group 삭제'}
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )

  function toggleSortMode() {
    setSortMode((previous) => (previous === 'district' ? 'name' : 'district'))
  }

  function startCreatingGroup() {
    if (!hasDistrictOptions) {
      return
    }

    setGroupForm({
      ...EMPTY_GROUP_FORM,
      districtId: String(sortedDistricts[0].id),
    })
    setGroupErrors({})
    setEditorOpen(true)
  }

  function startEditingGroup(group) {
    setGroupForm({
      id: group.id,
      districtId: String(group.districtId),
      name: group.name,
    })
    setGroupErrors({})
    setEditorOpen(true)
  }

  function closeEditor() {
    if (saving || deleting) {
      return
    }

    setEditorOpen(false)
    setGroupForm(EMPTY_GROUP_FORM)
    setGroupErrors({})
  }

  async function saveGroup() {
    setSaving(true)

    try {
      const payload = {
        districtId: Number(groupForm.districtId),
        name: groupForm.name,
      }
      const savedGroup = groupForm.id
        ? await adminGroupApi.updateGroup(groupForm.id, payload)
        : await adminGroupApi.createGroup(payload)

      setGroups((previous) => {
        if (groupForm.id) {
          return previous.map((group) => (group.id === savedGroup.id ? savedGroup : group))
        }

        return [...previous, savedGroup]
      })
      setSearchQuery('')
      setEditorOpen(false)
      setGroupForm(EMPTY_GROUP_FORM)
      setGroupErrors({})
      onSuccess(groupForm.id ? 'Group을 수정했습니다.' : 'Group을 생성했습니다.')
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setGroupErrors(fieldErrors)
        return
      }

      setGroupErrors({})
      onError(error, groupForm.id ? 'Group 수정에 실패했습니다.' : 'Group 생성에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteGroup() {
    if (!groupForm.id) {
      return
    }

    const confirmed = window.confirm(`"${groupForm.name}" Group을 삭제하시겠습니까?`)
    if (!confirmed) {
      return
    }

    setDeleting(true)

    try {
      const deletingId = groupForm.id

      await adminGroupApi.deleteGroup(deletingId)

      setGroups((previous) => previous.filter((group) => group.id !== deletingId))
      setEditorOpen(false)
      setGroupForm(EMPTY_GROUP_FORM)
      setGroupErrors({})
      onSuccess('Group을 삭제했습니다.')
    } catch (error) {
      setGroupErrors({})
      onError(error, 'Group 삭제에 실패했습니다.')
    } finally {
      setDeleting(false)
    }
  }

  function navigateToGroupEditor(groupId) {
    onNavigate(`/admin/groups/${groupId}`)
  }
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

function createEmptyGroupForm() {
  return {
    id: null,
    districtId: '',
    name: '',
  }
}

function districtNameFor(districtId, districts) {
  return districts.find((district) => district.id === districtId)?.name ?? `지역연합 #${districtId}`
}
