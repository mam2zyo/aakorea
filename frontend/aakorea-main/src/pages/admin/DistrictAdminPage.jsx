import { useEffect, useEffectEvent, useState } from 'react'
import {
  EntityList,
  PageIntro,
  PageSection,
  SectionHeader,
  StatCard,
  Field,
} from '../../components/ui'
import { adminOrgApi } from '../../lib/api'

const EMPTY_DISTRICT_FORM = { id: null, name: '' }

export function DistrictAdminPage({ onError, onSuccess }) {
  const [districts, setDistricts] = useState([])
  const [groups, setGroups] = useState([])
  const [districtForm, setDistrictForm] = useState(EMPTY_DISTRICT_FORM)
  const [loading, setLoading] = useState(false)

  async function loadDistrictWorkspace() {
    setLoading(true)

    try {
      const [districtData, groupData] = await Promise.all([
        adminOrgApi.getDistricts(),
        adminOrgApi.getGroups(),
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

  return (
    <>
      <PageIntro
        eyebrow="Admin Districts"
        title="District는 독립 화면에서 관리합니다."
        description="지금은 비교적 단순해 보여도, District는 이후 조직 구조 확장을 고려해 별도 화면으로 유지합니다."
        aside={
          <div className="stats-grid stats-grid--compact">
            <StatCard label="District" value={districts.length} />
            <StatCard label="연결 Group" value={groups.length} />
          </div>
        }
      />

      <PageSection
        label="District Workspace"
        title="조직 기준 단위를 먼저 정리합니다."
        description="Group 편집은 별도 화면에서 진행하고, 여기서는 District 자체의 목록과 기준 정보를 관리합니다."
      >
        {loading ? <div className="section-note">District 데이터를 불러오는 중입니다...</div> : null}

        <div className="editor-grid">
          <section className="editor-card">
            <SectionHeader
              title="District 입력"
              actionLabel="새 District"
              onAction={() => setDistrictForm(EMPTY_DISTRICT_FORM)}
            />

            <form
              className="field-grid"
              onSubmit={(event) => {
                event.preventDefault()
                void saveDistrict()
              }}
            >
              <Field label="이름">
                <input
                  value={districtForm.name}
                  onChange={(event) =>
                    setDistrictForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                />
              </Field>

              <div className="button-row button-row--compact">
                <button className="primary-button" type="submit">
                  {districtForm.id ? 'District 수정' : 'District 생성'}
                </button>
              </div>
            </form>
          </section>

          <section className="editor-card">
            <SectionHeader title="District 목록" />

            <EntityList
              emptyTitle="District가 없습니다."
              emptyDescription="운영 조직 기준 단위를 먼저 등록해 주세요."
              items={districts}
              onAction={(district) =>
                setDistrictForm({
                  id: district.id,
                  name: district.name,
                })
              }
              renderItem={(district) => (
                <div className="entity-item__body">
                  <strong>{district.name}</strong>
                  <span className="entity-item__meta">
                    연결 Group {groupCountByDistrictId[district.id] ?? 0}개
                  </span>
                </div>
              )}
            />
          </section>
        </div>
      </PageSection>
    </>
  )

  async function saveDistrict() {
    try {
      if (districtForm.id) {
        await adminOrgApi.updateDistrict(districtForm.id, {
          name: districtForm.name,
        })
        onSuccess('District를 수정했습니다.')
      } else {
        await adminOrgApi.createDistrict({
          name: districtForm.name,
        })
        onSuccess('District를 생성했습니다.')
      }

      setDistrictForm(EMPTY_DISTRICT_FORM)
      await loadDistrictWorkspace()
    } catch (error) {
      onError(error, 'District 저장에 실패했습니다.')
    }
  }
}
