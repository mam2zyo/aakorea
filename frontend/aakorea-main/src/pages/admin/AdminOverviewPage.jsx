import { AdminPageHeader } from '../../components/ui'
import { MeetingImportPanel } from '../../features/groups/admin/components/MeetingImportPanel'

export function AdminOverviewPage({ onError, onSuccess }) {
  return (
    <div className="admin-flat-page">
      <AdminPageHeader
        title="운영현황"
        description="상시 운영 기능과 분리해서, 테스트나 데이터 검증 때만 쓰는 도구를 이 화면에 모아 둡니다."
      />

      <MeetingImportPanel
        onError={onError}
        onSuccess={onSuccess}
      />
    </div>
  )
}
