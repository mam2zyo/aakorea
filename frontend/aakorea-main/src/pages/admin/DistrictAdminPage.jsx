import { useEffect, useEffectEvent, useState } from 'react'
import {
  AdminPageHeader,
  EmptyState,
  Field,
} from '../../components/ui'
import { adminDistrictApi } from '../../features/districts/api/admin'
import { adminGroupApi } from '../../features/groups/api/admin'
import { getApiFieldErrors, omitFieldErrors, readFieldError } from '../../lib/formErrors'

const DISTRICT_SORT_MODES = {
  name: '이름순',
  groupCount: '연결 Group 순',
}
const EMPTY_DISTRICT_FORM = createEmptyDistrictForm()
const textCollator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' })

export function DistrictAdminPage({ onError, onSuccess }) {
  const [districts, setDistricts] = useState([])
  const [groups, setGroups] = useState([])
  const [districtForm, setDistrictForm] = useState(EMPTY_DISTRICT_FORM)
  const [districtErrors, setDistrictErrors] = useState({})
  const [editorOpen, setEditorOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortMode, setSortMode] = useState('name')

  async function loadDistrictWorkspace() {
    setLoading(true)

    try {
      const [districtData, groupData] = await Promise.all([
        adminDistrictApi.getDistricts(),
        adminGroupApi.getGroups(),
      ])

      setDistricts(districtData)
      setGroups(groupData)
    } catch (error) {
      onError(error, 'District 데이터를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadDistrictWorkspaceEffect = useEffectEvent(() => {
    void loadDistrictWorkspace()
  })

  useEffect(() => {
    loadDistrictWorkspaceEffect()
  }, [])

  const groupCountByDistrictId = groups.reduce((accumulator, group) => {
    const currentCount = accumulator[group.districtId] ?? 0
    accumulator[group.districtId] = currentCount + 1
    return accumulator
  }, {})

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('ko')
  const filteredDistricts = sortDistricts(
    districts.filter((district) =>
      district.name.toLocaleLowerCase('ko').includes(normalizedQuery),
    ),
    groupCountByDistrictId,
    sortMode,
  )
  const selectedGroupCount = districtForm.id ? (groupCountByDistrictId[districtForm.id] ?? 0) : 0

  return (
    <div className="admin-flat-page">
      <AdminPageHeader
        title="지역연합 관리"
      />

      {loading ? <div className="section-note">지역연합 데이터를 불러오는 중입니다...</div> : null}

      <div className="admin-list-toolbar admin-list-toolbar--district">
        <div className="admin-list-toolbar__cluster admin-list-toolbar__cluster--start">
          <div className="admin-list-toolbar__search admin-list-toolbar__search--district">
            <input
              aria-label="지역연합 검색"
              placeholder="지역연합 이름으로 검색"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={toggleSortMode}
          >
            정렬: {DISTRICT_SORT_MODES[sortMode]}
          </button>
        </div>

        <div className="admin-list-toolbar__cluster admin-list-toolbar__cluster--end">
          <span className="admin-directory-toolbar__count">
            총 {filteredDistricts.length}개
          </span>

          <div className="admin-list-toolbar__divider" aria-hidden="true" />

          <button
            className="primary-button primary-button--small"
            type="button"
            onClick={startCreatingDistrict}
          >
            새 지역연합
          </button>
        </div>
      </div>

      <div className="admin-flat-page__workspace">
        {districts.length === 0 ? (
          <EmptyState
            title="등록된 지역연합이 없습니다."
            description="새 지역연합을 만들어 Group 분류의 첫 기준을 준비해 주세요."
          />
        ) : filteredDistricts.length === 0 ? (
          <EmptyState
            title="검색 결과가 없습니다."
            description="다른 이름으로 검색하거나 정렬을 바꿔 다시 확인해 주세요."
          />
        ) : (
          <div className="admin-table admin-table--district" role="table" aria-label="지역연합 목록">
            <div className="admin-table__header" role="row">
              <span className="admin-table__heading" role="columnheader">번호</span>
              <span className="admin-table__heading" role="columnheader">지역연합</span>
              <span className="admin-table__heading" role="columnheader">연결 Group</span>
              <span className="admin-table__heading" role="columnheader">편집</span>
            </div>

            {filteredDistricts.map((district, index) => (
              <div
                key={district.id}
                className={`admin-table__row admin-table__row--static${
                  editorOpen && districtForm.id === district.id ? ' admin-table__row--selected' : ''
                }`}
                role="row"
              >
                <span
                  className="admin-table__cell admin-table__cell--index"
                  data-label="번호"
                >
                  {index + 1}
                </span>
                <span
                  className="admin-table__cell admin-table__cell--primary"
                  data-label="지역연합"
                >
                  <strong>{district.name}</strong>
                </span>
                <span className="admin-table__cell" data-label="연결 Group">
                  {groupCountByDistrictId[district.id] ?? 0}개
                </span>
                <span className="admin-table__cell admin-table__cell--action" data-label="편집">
                  <button
                    className="ghost-button ghost-button--small"
                    type="button"
                    onClick={() => startEditingDistrict(district)}
                  >
                    수정
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
            aria-labelledby="district-editor-title"
            aria-modal="true"
            className="admin-overlay__dialog"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-overlay__header">
              <div className="admin-overlay__heading">
                <h2 id="district-editor-title">
                  {districtForm.id ? '지역연합 수정' : '새 지역연합'}
                </h2>
                <p className="admin-form-note">
                  {districtForm.id
                    ? '이름을 수정하면 연결된 Group 화면에서도 같은 지역연합 이름으로 바로 보입니다.'
                    : '생성 후에는 Group 생성과 편집 화면에서 이 지역연합을 바로 선택할 수 있습니다.'}
                </p>
                {districtForm.id ? (
                  <p className="admin-form-note">
                    현재 연결 Group {selectedGroupCount}개
                  </p>
                ) : null}
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
                void saveDistrict()
              }}
            >
              <Field label="지역연합 이름" error={readFieldError(districtErrors, 'name')}>
                <input
                  value={districtForm.name}
                  onChange={(event) => {
                    setDistrictForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                    setDistrictErrors((previous) => omitFieldErrors(previous, 'name'))
                  }}
                />
              </Field>

              <div className="button-row button-row--compact">
                <button className="primary-button" type="submit" disabled={saving || deleting}>
                  {saving
                    ? '저장 중...'
                    : districtForm.id
                      ? '지역연합 저장'
                      : '지역연합 생성'}
                </button>

                {districtForm.id ? (
                  <button
                    className="ghost-button ghost-button--danger"
                    type="button"
                    onClick={() => void deleteDistrict()}
                    disabled={saving || deleting}
                  >
                    {deleting ? '삭제 중...' : '지역연합 삭제'}
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
    setSortMode((previous) => (previous === 'name' ? 'groupCount' : 'name'))
  }

  function startCreatingDistrict() {
    setDistrictForm(EMPTY_DISTRICT_FORM)
    setDistrictErrors({})
    setEditorOpen(true)
  }

  function startEditingDistrict(district) {
    setDistrictForm({
      id: district.id,
      name: district.name,
    })
    setDistrictErrors({})
    setEditorOpen(true)
  }

  function closeEditor() {
    if (saving || deleting) {
      return
    }

    setEditorOpen(false)
    setDistrictForm(EMPTY_DISTRICT_FORM)
    setDistrictErrors({})
  }

  async function saveDistrict() {
    setSaving(true)

    try {
      const payload = { name: districtForm.name }
      const savedDistrict = districtForm.id
        ? await adminDistrictApi.updateDistrict(districtForm.id, payload)
        : await adminDistrictApi.createDistrict(payload)

      setDistricts((previous) => {
        if (districtForm.id) {
          return previous.map((district) =>
            district.id === savedDistrict.id ? savedDistrict : district,
          )
        }

        return [...previous, savedDistrict]
      })
      setSearchQuery('')
      setEditorOpen(false)
      setDistrictForm(EMPTY_DISTRICT_FORM)
      setDistrictErrors({})
      onSuccess(
        districtForm.id ? '지역연합을 수정했습니다.' : '지역연합을 생성했습니다.',
      )
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setDistrictErrors(fieldErrors)
        return
      }

      setDistrictErrors({})
      onError(
        error,
        districtForm.id ? '지역연합 수정에 실패했습니다.' : '지역연합 생성에 실패했습니다.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function deleteDistrict() {
    if (!districtForm.id) {
      return
    }

    const confirmed = window.confirm(`"${districtForm.name}" 지역연합을 삭제하시겠습니까?`)
    if (!confirmed) {
      return
    }

    setDeleting(true)

    try {
      const deletingId = districtForm.id

      await adminDistrictApi.deleteDistrict(deletingId)

      setDistricts((previous) => previous.filter((district) => district.id !== deletingId))
      setEditorOpen(false)
      setDistrictForm(EMPTY_DISTRICT_FORM)
      setDistrictErrors({})
      onSuccess('지역연합을 삭제했습니다.')
    } catch (error) {
      setDistrictErrors({})
      onError(error, '지역연합 삭제에 실패했습니다.')
    } finally {
      setDeleting(false)
    }
  }
}

function sortDistricts(districts, groupCountByDistrictId, sortMode) {
  return [...districts].sort((left, right) => {
    if (sortMode === 'groupCount') {
      const groupCountCompare =
        (groupCountByDistrictId[right.id] ?? 0) - (groupCountByDistrictId[left.id] ?? 0)

      if (groupCountCompare !== 0) {
        return groupCountCompare
      }
    }

    return textCollator.compare(left.name, right.name)
  })
}

function createEmptyDistrictForm() {
  return {
    id: null,
    name: '',
  }
}
