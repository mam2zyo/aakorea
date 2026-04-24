import {
  AdminPageHeader,
  EmptyState,
} from '@/components/ui'
import { GROUP_SORT_MODES } from '@/features/groups/utils'

export function GroupListPresenter({
  filteredGroups,
  groupsCount,
  searchQuery,
  sortMode,
  loading,
  deleting,
  hasDistrictOptions,
  districts,
  editorState,
  onSearchChange,
  onToggleSort,
  onStartCreating,
  onStartEditing,
  onDeleteGroup,
  districtNameFor,
}) {
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
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>

          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={onToggleSort}
          >
            정렬: {GROUP_SORT_MODES[sortMode]}
          </button>
        </div>

        <div className="admin-list-toolbar__cluster admin-list-toolbar__cluster--end">
          <span className="admin-directory-toolbar__count">총 {groupsCount}개</span>

          <div className="admin-list-toolbar__divider" aria-hidden="true" />

          <button
            className={`primary-button primary-button--small${
              hasDistrictOptions ? '' : ' primary-button--placeholder'
            }`}
            type="button"
            onClick={onStartCreating}
            disabled={!hasDistrictOptions}
          >
            새 그룹
          </button>
        </div>
      </div>

      <div className="admin-flat-page__workspace">
        {groupsCount === 0 && !loading ? (
          <EmptyState
            title={hasDistrictOptions ? '등록된 그룹이 없습니다.' : '지역연합이 먼저 필요합니다.'}
            description={
              hasDistrictOptions
                ? '새 그룹을 만들고 같은 모달 안에서 연락처와 모임 정보를 이어서 등록해 주세요.'
                : '그룹은 지역연합을 기준으로 등록하므로, 먼저 지역연합을 만들어 주세요.'
            }
          />
        ) : filteredGroups.length === 0 && !loading ? (
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
                    onClick={() => onStartEditing(group.id)}
                  >
                    수정
                  </button>
                  <button
                    className="ghost-button ghost-button--danger ghost-button--small"
                    type="button"
                    onClick={() => onDeleteGroup(group)}
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
    </div>
  )
}
