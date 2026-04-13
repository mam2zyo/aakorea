import { EmptyState, PageSection } from '../ui'
import { ContentPageViewPage } from '../pages/ContentPageViewPage'
import { HomePage } from '../pages/HomePage'
import { MeetingFocusPreviewPage } from '../pages/MeetingFocusPreviewPage'
import { MeetingSearchPage } from '../pages/MeetingSearchPage'
import { NoticePage } from '../pages/NoticePage'

export function renderPublicPage({
  onError,
  onNavigate,
  route,
}) {
  switch (route.name) {
    case 'home':
      return <HomePage onNavigate={onNavigate} />
    case 'meetings':
      return (
        <MeetingSearchPage
          groupId={route.groupId}
          meetingId={route.meetingId}
          onError={onError}
          onNavigate={onNavigate}
        />
      )
    case 'meeting-focus-preview':
      return <MeetingFocusPreviewPage onNavigate={onNavigate} />
    case 'notices':
      return (
        <NoticePage
          noticeId={route.noticeId}
          onError={onError}
          onNavigate={onNavigate}
        />
      )
    case 'content-page':
      return (
        <ContentPageViewPage
          onError={onError}
          onNavigate={onNavigate}
          pageKey={route.pageKey}
        />
      )
    default:
      return (
        <PageSection
          label="Not Found"
          title="요청한 화면을 찾지 못했습니다."
          description="입력한 주소를 다시 확인해 주세요."
        >
          <EmptyState
            title="존재하지 않는 경로입니다."
            description="홈으로 다시 이동해 계속 탐색해 주세요."
          />
          <div className="button-row">
            <button
              className="ghost-button"
              type="button"
              onClick={() => onNavigate('/')}
            >
              공개 홈으로 이동
            </button>
          </div>
        </PageSection>
      )
  }
}
