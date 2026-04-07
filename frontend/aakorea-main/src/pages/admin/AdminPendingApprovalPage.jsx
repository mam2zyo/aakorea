import { EmptyState, PageSection } from '../../admin/ui'

export function AdminPendingApprovalPage({ onLogout, session }) {
  return (
    <PageSection
      label="Approval Pending"
      title="승인 대기 중입니다."
      description="등록은 완료되었지만 아직 GSO 업무 승인과 권한 부여가 끝나지 않았습니다."
    >
      <EmptyState
        title={`${session.displayName ?? session.email ?? '등록된 계정'} 계정이 승인 대기 상태입니다.`}
        description="승인과 업무 권한 설정이 완료되면 등록한 이메일로 안내할 예정입니다. 승인 전까지는 office 업무 메뉴 대신 이 안내 화면만 표시됩니다."
      />

      <div className="button-row button-row--compact">
        <button
          className="ghost-button"
          type="button"
          onClick={() => void onLogout('/admin/login')}
        >
          로그아웃
        </button>
      </div>
    </PageSection>
  )
}
