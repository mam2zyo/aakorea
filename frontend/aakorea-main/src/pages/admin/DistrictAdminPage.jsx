import { useEffect, useEffectEvent, useState } from 'react'
import {
  AdminPageHeader,
  EntityList,
  PageSection,
  SectionHeader,
  StatCard,
  Field,
} from '../../components/ui'
import { adminDistrictApi } from '../../features/districts/api/admin'
import { adminGroupApi } from '../../features/groups/api/admin'
import { getApiFieldErrors, omitFieldErrors, readFieldError } from '../../lib/formErrors'

const EMPTY_DISTRICT_FORM = { id: null, name: '' }
const textCollator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' })

export function DistrictAdminPage({ onError, onSuccess }) {
  const [districts, setDistricts] = useState([])
  const [groups, setGroups] = useState([])
  const [districtForm, setDistrictForm] = useState(EMPTY_DISTRICT_FORM)
  const [districtErrors, setDistrictErrors] = useState({})
  const [loading, setLoading] = useState(false)

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
  const sortedDistricts = [...districts].sort((left, right) =>
    textCollator.compare(left.name, right.name),
  )

  return (
    <>
      <AdminPageHeader
        eyebrow="District Directory"
        title="District 기준 정보를 이름순으로 정리합니다."
        description="Group 생성과 연결되는 운영 기준 단위를 별도 화면에서 유지합니다."
        meta={
          <div className="stats-grid stats-grid--compact">
            <StatCard label="District" value={districts.length} />
            <StatCard label="연결 Group" value={groups.length} />
          </div>
        }
      />

      <PageSection
        label="District Workspace"
        title="목록과 입력을 같은 흐름에서 다룹니다."
        description="목록은 이름순으로 정렬되며, 편집은 오른쪽 입력 패널에서 이어집니다."
      >
        {loading ? <div className="section-note">District 데이터를 불러오는 중입니다...</div> : null}

        <div className="editor-grid">
          <section className="editor-card">
            <SectionHeader
              title="District 입력"
              actionLabel="새 District"
              onAction={() => {
                setDistrictForm(EMPTY_DISTRICT_FORM)
                setDistrictErrors({})
              }}
            />

            <form
              className="field-grid"
              onSubmit={(event) => {
                event.preventDefault()
                void saveDistrict()
              }}
            >
              <Field label="이름" error={readFieldError(districtErrors, 'name')}>
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
              items={sortedDistricts}
              onAction={(district) =>
                {
                  setDistrictForm({
                    id: district.id,
                    name: district.name,
                  })
                  setDistrictErrors({})
                }
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
        await adminDistrictApi.updateDistrict(districtForm.id, {
          name: districtForm.name,
        })
        onSuccess('District를 수정했습니다.')
      } else {
        await adminDistrictApi.createDistrict({
          name: districtForm.name,
        })
        onSuccess('District를 생성했습니다.')
      }

      setDistrictErrors({})
      setDistrictForm(EMPTY_DISTRICT_FORM)
      await loadDistrictWorkspace()
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setDistrictErrors(fieldErrors)
        return
      }

      setDistrictErrors({})
      onError(error, 'District 저장에 실패했습니다.')
    }
  }
}
