import { useEffect, useEffectEvent, useMemo, useReducer } from 'react'
import { districtApi, groupApi, getApiFieldErrors } from '@/shared/api'
import { syncSelectionWithList } from '@/shared/utils';
import { normalizePhoneFieldValue } from '@/shared/utils/phone'
import {
  districtNameFor,
  hasCreateBasicsErrors,
  sortGroups,
  toPostalContactPayload,
  validateCreateBasics,
} from '@/features/groups/utils'
import { GROUP_MGMT_ACTION, groupManagementReducer, initialState } from '@/features/groups/store/groupReducer';
import { GroupListPresenter } from './GroupListPresenter';
import { GroupEditorPresenter } from './GroupEditorPresenter';

export function GroupListPage({
  editorGroupId,
  onError,
  onNavigate,
  onSuccess,
}) {
  const [state, dispatch] = useReducer(groupManagementReducer, initialState)

  const {
    loading,
    saving,
    deleting,
    districts,
    groups,
    searchQuery,
    sortMode,
    createForm,
    createErrors,
    createStep,
    districtFilter,
    editor: editorState,
  } = state

  // ── 데이터 로드 ──────────────────────────────────────────
  async function loadGroupIndex() {
    dispatch({ type: GROUP_MGMT_ACTION.SET_LOADING, payload: true })
    try {
      const [districtData, groupData] = await Promise.all([
        districtApi.getDistricts(),
        groupApi.getGroups(),
      ])
      dispatch({
        type: GROUP_MGMT_ACTION.LOAD_INDEX_SUCCESS,
        payload: { districts: districtData, groups: groupData },
      })

      // '강원연합'을 찾아 기본 필터로 설정
      const gangwon = districtData.find((d) => d.name === '강원연합')
      if (gangwon) {
        dispatch({ type: GROUP_MGMT_ACTION.SET_DISTRICT_FILTER, payload: gangwon.id })
      }
    } catch (error) {
      onError(error, '그룹 목록을 불러오지 못했습니다.')
      dispatch({ type: GROUP_MGMT_ACTION.SET_LOADING, payload: false })
    }
  }

  const loadGroupIndexEffect = useEffectEvent(() => {
    void loadGroupIndex()
  })

  useEffect(() => {
    loadGroupIndexEffect()
  }, [])

  // ── 동기화 및 라우트 연동 ────────────────────────────────
  useEffect(() => {
    const syncedForm = syncSelectionWithList(createForm, 'districtId', districts)
    if (syncedForm.districtId !== createForm.districtId) {
      dispatch({ type: GROUP_MGMT_ACTION.UPDATE_CREATE_FORM, payload: { districtId: syncedForm.districtId } })
    }
  }, [districts])

  useEffect(() => {
    if (!Number.isFinite(editorGroupId)) {
      if (editorState.open && editorState.source === 'route') {
        dispatch({ type: GROUP_MGMT_ACTION.CLOSE_EDITOR })
      }
      return
    }

    if (editorState.open && editorState.source === 'route' && editorState.groupId === editorGroupId) {
      return
    }

    dispatch({ type: GROUP_MGMT_ACTION.START_EDITING, payload: { groupId: editorGroupId, source: 'route' } })
  }, [editorGroupId])

  // ── 필터링 및 정렬 ──────────────────────────────────────
  const sortedDistricts = useMemo(
    () => [...districts].sort((left, right) => left.name.localeCompare(right.name, 'ko')),
    [districts],
  )

  const filteredGroups = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase('ko')
    const filtered = groups.filter((group) => {
      // 1. 지역연합 필터
      if (districtFilter !== null && group.districtId !== districtFilter) {
        return false
      }

      // 2. 검색어 필터 (그룹 이름만 검색)
      return group.name.toLocaleLowerCase('ko').includes(normalizedQuery)
    })
    return sortGroups(filtered, districts, sortMode)
  }, [groups, districts, searchQuery, districtFilter, sortMode])

  // ── 액션 핸들러 ──────────────────────────────────────────
  const handleSearchChange = (query) => {
    dispatch({ type: GROUP_MGMT_ACTION.UPDATE_SEARCH_QUERY, payload: query })
  }

  const handleToggleSort = () => {
    dispatch({ type: GROUP_MGMT_ACTION.TOGGLE_SORT_MODE })
  }

  const handleDistrictFilterChange = (id) => {
    dispatch({ type: GROUP_MGMT_ACTION.SET_DISTRICT_FILTER, payload: id ? Number(id) : null })
  }

  const handleStartCreating = () => {
    dispatch({ type: GROUP_MGMT_ACTION.START_CREATING })
    if (sortedDistricts.length > 0) {
      dispatch({ type: GROUP_MGMT_ACTION.UPDATE_CREATE_FORM, payload: { districtId: String(sortedDistricts[0].id) } })
    }
  }

  const handleStartEditing = (id) => {
    onNavigate(`/admin/groups/${id}`)
  }

  const handleCloseEditor = () => {
    if (editorState.open && Number.isFinite(editorGroupId)) {
      onNavigate('/admin/groups')
    } else {
      dispatch({ type: GROUP_MGMT_ACTION.CLOSE_EDITOR })
    }
  }

  const handleUpdateCreateField = (field, value) => {
    const nextValue = (field === 'phone') ? normalizePhoneFieldValue(value) : value
    dispatch({ type: GROUP_MGMT_ACTION.UPDATE_CREATE_FORM, payload: { [field]: nextValue } })
  }

  // ── 비즈니스 로직 (Bulk API 연동) ────────────────────────
  async function saveCreateBasics() {
    const errors = validateCreateBasics(createForm)
    if (Object.keys(errors).length > 0) {
      dispatch({ type: GROUP_MGMT_ACTION.SET_CREATE_ERRORS, payload: errors })
      return
    }
    dispatch({ type: GROUP_MGMT_ACTION.SET_CREATE_ERRORS, payload: {} })
    dispatch({ type: GROUP_MGMT_ACTION.SET_CREATE_STEP, payload: 2 })
  }

  async function completeCreateFlow() {
    if (!createForm.meetings?.length) {
      dispatch({ type: GROUP_MGMT_ACTION.SET_CREATE_ERRORS, payload: { meetings: '최소 한 개의 모임을 등록해 주세요.' } })
      return
    }

    dispatch({ type: GROUP_MGMT_ACTION.SET_SAVING, payload: true })
    try {
      const payload = {
        name: createForm.name,
        districtId: Number(createForm.districtId),
        notice: '', 
        contact: {
          phone: createForm.phone,
          email: createForm.email || null,
          postalContact: toPostalContactPayload(createForm),
        },
        meetings: createForm.meetings.map(m => ({
          locationDetail: m.locationDetail,
          locationAddress: m.locationAddress,
          latitude: m.latitude,
          longitude: m.longitude,
          contactPhoneOverride: m.contactPhoneOverride,
          dayOfWeek: m.dayOfWeek,
          startTime: m.startTime,
          type: m.type,
          active: true
        }))
      }

      await groupApi.createGroupBulk(payload)
      
      onSuccess('새 그룹이 등록되었습니다.')
      dispatch({ type: GROUP_MGMT_ACTION.CLOSE_EDITOR })
      await loadGroupIndex()
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        if (hasCreateBasicsErrors(fieldErrors)) {
          dispatch({ type: GROUP_MGMT_ACTION.SET_CREATE_STEP, payload: 1 })
        }
        dispatch({ type: GROUP_MGMT_ACTION.SET_CREATE_ERRORS, payload: fieldErrors })
      } else {
        onError(error, '그룹을 등록하지 못했습니다.')
      }
    } finally {
      dispatch({ type: GROUP_MGMT_ACTION.SET_SAVING, payload: false })
    }
  }

  async function handleDeleteGroup(group) {
    if (!window.confirm(`'${group.name}' 그룹을 삭제하시겠습니까? 관련 연락처와 모임 일정도 모두 삭제됩니다.`)) {
      return
    }

    dispatch({ type: GROUP_MGMT_ACTION.SET_DELETING, payload: true })
    try {
      await groupApi.deleteGroup(group.id)
      onSuccess(`'${group.name}' 그룹이 삭제되었습니다.`)
      await loadGroupIndex()
    } catch (error) {
      onError(error, '그룹을 삭제하지 못했습니다.')
    } finally {
      dispatch({ type: GROUP_MGMT_ACTION.SET_DELETING, payload: false })
    }
  }

  const handleGroupSaved = async () => {
    await loadGroupIndex()
  }

  // ── UI 변수 ────────────────────────────────────────────
  const currentEditorGroup = Number.isFinite(editorState.groupId)
    ? groups.find((g) => g.id === editorState.groupId) ?? null
    : null
  const isCreateMode = editorState.open && !Number.isFinite(editorState.groupId)
  const editorTitle = isCreateMode ? '새 그룹' : (currentEditorGroup?.name ?? '그룹 수정')
  const createStepLabel = createStep === 1 ? '기본 정보' : '모임 정보'

  return (
    <div className="office-theme">
      <GroupListPresenter
        filteredGroups={filteredGroups}
        groupsCount={groups.length}
        searchQuery={searchQuery}
        sortMode={sortMode}
        districtFilter={districtFilter}
        loading={loading}
        deleting={deleting}
        hasDistrictOptions={districts.length > 0}
        districts={districts}
        editorState={editorState}
        onSearchChange={handleSearchChange}
        onDistrictFilterChange={handleDistrictFilterChange}
        onToggleSort={handleToggleSort}
        onStartCreating={handleStartCreating}
        onStartEditing={handleStartEditing}
        onDeleteGroup={handleDeleteGroup}
        districtNameFor={districtNameFor}
      />

      <GroupEditorPresenter
        editorState={editorState}
        isCreateMode={isCreateMode}
        editorTitle={editorTitle}
        createStep={createStep}
        createStepLabel={createStepLabel}
        createForm={createForm}
        createErrors={createErrors}
        saving={saving}
        deleting={deleting}
        sortedDistricts={sortedDistricts}
        currentEditorGroup={currentEditorGroup}
        onClose={handleCloseEditor}
        onUpdateField={handleUpdateCreateField}
        onNext={saveCreateBasics}
        onPrevious={() => dispatch({ type: GROUP_MGMT_ACTION.SET_CREATE_STEP, payload: 1 })}
        onResetPostal={() => dispatch({ type: GROUP_MGMT_ACTION.RESET_POSTAL_INFO })}
        onCompleteCreate={completeCreateFlow}
        onGroupSaved={handleGroupSaved}
        onError={onError}
        onSuccess={onSuccess}
      />
    </div>
  )
}
