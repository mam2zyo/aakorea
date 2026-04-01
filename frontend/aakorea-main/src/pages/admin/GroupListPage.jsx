import { useEffect, useEffectEvent, useState } from 'react'
import {
  AdminPageHeader,
  EmptyState,
  Field,
  PageSection,
  SectionHeader,
  StatCard,
} from '../../components/ui'
import { adminDistrictApi } from '../../features/districts/api/admin'
import { adminGroupApi } from '../../features/groups/api/admin'
import { getApiFieldErrors, omitFieldErrors, readFieldError } from '../../lib/formErrors'
import { ensureSelectValue } from '../../lib/view'

const EMPTY_GROUP_FORM = { districtId: '', name: '' }
const textCollator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' })

export function GroupListPage({ onError, onNavigate, onSuccess }) {
  const [districts, setDistricts] = useState([])
  const [groups, setGroups] = useState([])
  const [groupForm, setGroupForm] = useState(EMPTY_GROUP_FORM)
  const [groupErrors, setGroupErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const sortedDistricts = [...districts].sort((left, right) =>
    textCollator.compare(left.name, right.name),
  )
  const sortedGroups = [...groups].sort((left, right) => {
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
    const nextDistrictOptions = [...districts].sort((left, right) =>
      textCollator.compare(left.name, right.name),
    )
    setGroupForm((previous) => ensureSelectValue(previous, 'districtId', nextDistrictOptions))
  }, [districts])

  const hasDistrictOptions = sortedDistricts.length > 0

  return (
    <>
      <AdminPageHeader
        eyebrow="Group Directory"
        title="로그인 직후 정렬된 Group 목록이 먼저 보입니다."
        description="기본 정렬은 District와 Group 이름 순서이며, 운영자는 목록에서 바로 작업공간으로 진입할 수 있습니다."
        meta={
          <div className="stats-grid stats-grid--compact">
            <StatCard label="District" value={sortedDistricts.length} />
            <StatCard label="Group" value={sortedGroups.length} />
            <StatCard label="기본 정렬" value="District / 이름" />
          </div>
        }
      />

      <PageSection
        label="Group Index"
        title="목록 중심 콘솔"
        description="목록에는 핵심 식별 정보만 노출하고, 생성은 별도 패널에서 이어서 처리합니다."
      >
        {loading ? <div className="section-note">Group 목록을 불러오는 중입니다...</div> : null}

        <div className="admin-index-grid">
          <section className="editor-card">
            <SectionHeader title="Group 목록" />

            <div className="admin-directory-toolbar">
              <p className="section-note">
                정렬 기준: District 이름 오름차순, Group 이름 오름차순
              </p>
              <span className="admin-directory-toolbar__count">
                전체 {sortedGroups.length}개
              </span>
            </div>

            {sortedGroups.length === 0 ? (
              <EmptyState
                title="Group이 없습니다."
                description="District를 만든 뒤 첫 Group을 등록해 주세요."
              />
            ) : (
              <div className="admin-table" role="table" aria-label="Group 목록">
                <div className="admin-table__header" role="row">
                  <span className="admin-table__heading" role="columnheader">District</span>
                  <span className="admin-table__heading" role="columnheader">Group</span>
                  <span className="admin-table__heading" role="columnheader">기본 장소명</span>
                  <span className="admin-table__heading" role="columnheader">열기</span>
                </div>

                {sortedGroups.map((group) => (
                  <button
                    key={group.id}
                    className="admin-table__row"
                    type="button"
                    onClick={() => navigateToGroupEditor(group.id)}
                  >
                    <span className="admin-table__cell" data-label="District">
                      {districtNameFor(group.districtId, districts)}
                    </span>
                    <span
                      className="admin-table__cell admin-table__cell--primary"
                      data-label="Group"
                    >
                      <strong>{group.name}</strong>
                    </span>
                    <span className="admin-table__cell" data-label="기본 장소명">
                      {group.locationName || '기본 장소 미입력'}
                    </span>
                    <span
                      className="admin-table__cell admin-table__cell--action"
                      data-label="열기"
                    >
                      작업공간
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="editor-card">
            <SectionHeader title="새 Group 만들기" />

            {hasDistrictOptions ? (
              <form
                className="field-grid"
                onSubmit={(event) => {
                  event.preventDefault()
                  void createGroup()
                }}
              >
                <Field
                  label="District"
                  error={readFieldError(groupErrors, 'districtId')}
                >
                  <select
                    value={groupForm.districtId}
                    onChange={(event) => {
                      setGroupForm((previous) => ({
                        ...previous,
                        districtId: event.target.value,
                      }))
                      setGroupErrors((previous) =>
                        omitFieldErrors(previous, 'districtId'),
                      )
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

                <div className="admin-form-note">
                  생성 후에는 바로 작업공간으로 이동해 연락처와 모임 정보를 이어서 입력합니다.
                </div>

                <div className="button-row button-row--compact">
                  <button className="primary-button" type="submit">
                    Group 생성 후 작업공간 열기
                  </button>
                </div>
              </form>
            ) : (
              <EmptyState
                title="District가 먼저 필요합니다."
                description="현재 모델에서는 Group 생성 전에 District를 하나 이상 등록해야 합니다."
              />
            )}
          </section>
        </div>
      </PageSection>
    </>
  )

  async function createGroup() {
    try {
      const createdGroup = await adminGroupApi.createGroup({
        districtId: Number(groupForm.districtId),
        name: groupForm.name,
      })

      onSuccess('Group을 생성했습니다. 작업공간으로 이동합니다.')
      setGroupErrors({})
      setGroupForm((previous) => ({
        ...EMPTY_GROUP_FORM,
        districtId: previous.districtId,
      }))
      navigateToGroupEditor(createdGroup.id)
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setGroupErrors(fieldErrors)
        return
      }

      setGroupErrors({})
      onError(error, 'Group 생성에 실패했습니다.')
    }
  }

  function navigateToGroupEditor(groupId) {
    onNavigate(`/admin/groups/${groupId}`)
  }
}

function districtNameFor(districtId, districts) {
  return districts.find((district) => district.id === districtId)?.name ?? `District #${districtId}`
}
