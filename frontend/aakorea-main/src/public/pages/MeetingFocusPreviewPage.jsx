import { useMemo, useState } from 'react'
import { PageSection } from '../../public/ui'
import { MeetingFocusDialog } from '../features/groups/components/components/MeetingFocusDialog'

const PREVIEW_FILTERS = {
  province: 'gyeonggi',
  dayOfWeek: '',
  searchMode: 'region',
}

const PREVIEW_GROUP_DETAILS = {
  id: 101,
  name: '럭키',
  district: {
    id: 12,
    name: '수도권남부연합',
  },
  contactPhone: '010-6322-5263',
  notice: '',
  meetings: [
    {
      id: 1001,
      dayOfWeek: 'MONDAY',
      startTime: '19:30',
      type: 'CLOSED',
      locationDetail: '자비교회 2층 201호',
      locationAddress: '경기도 수원시 팔달구 정조로 123',
      latitude: 37.280119,
      longitude: 127.015445,
      contactPhone: '010-6322-5263',
    },
    {
      id: 1002,
      dayOfWeek: 'THURSDAY',
      startTime: '19:30',
      type: 'OPEN',
      locationDetail: '자비교회 2층 201호',
      locationAddress: '경기도 수원시 팔달구 정조로 123',
      latitude: 37.280119,
      longitude: 127.015445,
      contactPhone: '010-6322-5263',
    },
  ],
}

export function MeetingFocusPreviewPage({ onNavigate }) {
  const [selectedMeetingId, setSelectedMeetingId] = useState(PREVIEW_GROUP_DETAILS.meetings[0].id)

  const selectedMeeting = useMemo(
    () =>
      PREVIEW_GROUP_DETAILS.meetings.find((meeting) => meeting.id === selectedMeetingId)
      ?? PREVIEW_GROUP_DETAILS.meetings[0],
    [selectedMeetingId],
  )

  function handlePreviewNavigate(targetPath) {
    const url = new URL(targetPath, window.location.origin)
    const nextMeetingId = Number(url.searchParams.get('meetingId'))

    if (Number.isFinite(nextMeetingId)) {
      setSelectedMeetingId(nextMeetingId)
    }
  }

  return (
    <>
      <PageSection
        label="UI Preview"
        title="공개 모임 상세 프리뷰"
        description="API 연결 없이 모바일 상세 모달 압축 레이아웃을 확인하는 내부 화면입니다."
      >
        <div className="button-row">
          <button
            className="ghost-button"
            type="button"
            onClick={() => onNavigate('/meetings')}
          >
            실제 모임 페이지로 이동
          </button>
        </div>
      </PageSection>

      <MeetingFocusDialog
        groupDetails={PREVIEW_GROUP_DETAILS}
        loading={false}
        missingGroup={false}
        onClose={() => onNavigate('/meetings')}
        onNavigate={handlePreviewNavigate}
        selectedMeeting={selectedMeeting}
      />
    </>
  )
}
