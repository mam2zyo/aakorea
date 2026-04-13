import { AdminPageHeader } from '../../admin/ui'
import { MeetingCoordinateBackfillPanel } from '../../features/groups/admin/components/MeetingCoordinateBackfillPanel'
import { MeetingImportPanel } from '../../features/groups/admin/components/MeetingImportPanel'

export function AdminOverviewPage({ onError, onSuccess }) {
  return (
    <div className="admin-flat-page">
      <AdminPageHeader
        title="테스트 도구"
        description="상시 운영 기능과 분리해서, 정제 import나 좌표 보정처럼 임시 검증성 작업만 이 화면에 모아 둡니다."
      />

      <MeetingCoordinateBackfillPanel
        onError={onError}
        onSuccess={onSuccess}
      />

      <MeetingImportPanel
        onError={onError}
        onSuccess={onSuccess}
      />
    </div>
  )
}
