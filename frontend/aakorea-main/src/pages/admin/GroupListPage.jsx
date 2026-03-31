import { useEffect, useEffectEvent, useState } from 'react'
import {
  EmptyState,
  EntityList,
  Field,
  PageIntro,
  PageSection,
  SectionHeader,
  StatCard,
} from '../../components/ui'
import { adminOrgApi } from '../../lib/api'
import { ensureSelectValue } from '../../lib/view'

const EMPTY_GROUP_FORM = { districtId: '', name: '' }

export function GroupListPage({ onError, onNavigate, onSuccess }) {
  const [districts, setDistricts] = useState([])
  const [groups, setGroups] = useState([])
  const [groupForm, setGroupForm] = useState(EMPTY_GROUP_FORM)
  const [loading, setLoading] = useState(false)

  async function loadGroupIndex() {
    setLoading(true)

    try {
      const [districtData, groupData] = await Promise.all([
        adminOrgApi.getDistricts(),
        adminOrgApi.getGroups(),
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

  const hasDistrictOptions = districts.length > 0

  return (
    <>
      <PageIntro
        eyebrow="Admin Groups"
        title="Group이 운영 관리의 중심입니다."
        description="Group 목록에서 관리 대상을 선택하고, 상세 작업공간에서 연락처와 모임을 함께 수정합니다."
        aside={
          <div className="stats-grid stats-grid--compact">
            <StatCard label="District" value={districts.length} />
            <StatCard label="Group" value={groups.length} />
          </div>
        }
      />

      <PageSection
        label="Group Index"
        title="새 Group을 만들고 작업공간으로 이어집니다."
        description="최소한의 Group 정보를 먼저 저장한 뒤, 편집 화면에서 연락처와 모임 정보를 이어서 입력합니다."
      >
        {loading ? <div className="section-note">Group 목록을 불러오는 중입니다...</div> : null}

        <div className="editor-grid">
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
                <Field label="District">
                  <select
                    value={groupForm.districtId}
                    onChange={(event) =>
                      setGroupForm((previous) => ({
                        ...previous,
                        districtId: event.target.value,
                      }))
                    }
                  >
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Group 이름">
                  <input
                    value={groupForm.name}
                    onChange={(event) =>
                      setGroupForm((previous) => ({
                        ...previous,
                        name: event.target.value,
                      }))
                    }
                />
              </Field>

                <div className="button-row button-row--compact">
                  <button className="primary-button" type="submit">
                    Group 생성 후 작업공간 열기
                  </button>
                </div>
              </form>
            ) : (
              <EmptyState
                title="District가 먼저 필요합니다."
                description="Group을 만들기 전에 District 관리 화면에서 조직 기준 단위를 등록해 주세요."
              />
            )}
          </section>

          <section className="editor-card">
            <SectionHeader title="Group 목록" />

            <EntityList
              actionLabel="작업공간 열기"
              emptyDescription="District를 만든 뒤 첫 Group을 등록해 주세요."
              emptyTitle="Group이 없습니다."
              items={groups}
              onAction={(group) => onNavigate(`/admin/groups/${group.id}`)}
              renderItem={(group) => (
                <div className="entity-item__body">
                  <strong>{group.name}</strong>
                  <span className="entity-item__meta">
                    {districts.find((district) => district.id === group.districtId)?.name ??
                      `District #${group.districtId}`}
                  </span>
                </div>
              )}
            />
          </section>
        </div>
      </PageSection>
    </>
  )

  async function createGroup() {
    try {
      const createdGroup = await adminOrgApi.createGroup({
        districtId: Number(groupForm.districtId),
        name: groupForm.name,
      })

      onSuccess('Group을 생성했습니다. 작업공간으로 이동합니다.')
      setGroupForm((previous) => ({
        ...EMPTY_GROUP_FORM,
        districtId: previous.districtId,
      }))
      navigateToGroupEditor(createdGroup.id)
    } catch (error) {
      onError(error, 'Group 생성에 실패했습니다.')
    }
  }

  function navigateToGroupEditor(groupId) {
    onNavigate(`/admin/groups/${groupId}`)
  }
}
