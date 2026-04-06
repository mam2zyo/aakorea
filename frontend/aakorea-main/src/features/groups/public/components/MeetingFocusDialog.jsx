import { EmptyState } from '../../../../components/ui'
import {
  DAY_OF_WEEK_OPTIONS,
  MEETING_TYPE_OPTIONS,
} from '../../../../lib/options'
import { lookupLabel } from '../../../../lib/view'
import {
  buildMeetingsPath,
  hasGroupNotice,
  readGroupNotice,
} from '../utils'

export function MeetingFocusDialog({
  detailLoading,
  filters,
  groupDetails,
  missingGroup,
  onClose,
  onNavigate,
  selectedMeeting,
}) {
  const contactPhone = selectedMeeting?.contactPhone || groupDetails?.contactPhone || ''
  const hasNotice = Boolean(hasGroupNotice(groupDetails))

  return (
    <div
      className="meeting-focus-overlay"
      role="presentation"
      onClick={onClose}
    >
      <section
        aria-labelledby="meeting-focus-title"
        aria-modal="true"
        className="meeting-focus-dialog"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="meeting-focus-dialog__header">
          <div className="meeting-focus-dialog__identity">
            <div className="meeting-focus-dialog__titleline">
              <h2 id="meeting-focus-title">{groupDetails?.name ?? '모임 안내'}</h2>
              <p className="meeting-focus-dialog__district">
                {groupDetails?.district?.name || '지역연합 정보 없음'}
              </p>
            </div>
          </div>

          <button
            aria-label="모달 닫기"
            className="meeting-focus-dialog__close"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div className="meeting-focus-dialog__body">
          {detailLoading ? (
            <div className="meeting-focus-state">Group 안내를 불러오는 중입니다...</div>
          ) : null}

          {missingGroup ? (
            <EmptyState
              title="요청한 Group을 찾지 못했습니다."
              description="비공개 처리되었거나 더 이상 공개 중인 모임이 없을 수 있습니다."
            />
          ) : null}

          {groupDetails && selectedMeeting ? (
            <div className="meeting-focus-sheet">
              {hasNotice ? (
                <section className="meeting-focus-section meeting-focus-section--notice">
                  <p className="meeting-focus-section__label">공지</p>
                  <div className="meeting-focus-notice">
                    <p className="meeting-focus-notice__body">{readGroupNotice(groupDetails)}</p>
                  </div>
                </section>
              ) : null}

              <section className="meeting-focus-section meeting-focus-section--meeting-info">
                <p className="meeting-focus-section__label">모임 일정</p>
                <div className="meeting-focus-list">
                  {groupDetails.meetings.map((meeting) => (
                    <button
                      key={meeting.id}
                      className={`meeting-focus-list__item${
                        selectedMeeting.id === meeting.id ? ' meeting-focus-list__item--selected' : ''
                      }`}
                      type="button"
                      onClick={() => onNavigate(buildMeetingsPath(filters, groupDetails.id, meeting.id))}
                    >
                      <strong>
                        {lookupLabel(DAY_OF_WEEK_OPTIONS, meeting.dayOfWeek)} {meeting.startTime}
                      </strong>
                      <span
                        className={`meeting-focus-type-badge meeting-focus-type-badge--${meeting.type.toLowerCase()}`}
                      >
                        {lookupLabel(MEETING_TYPE_OPTIONS, meeting.type)}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="meeting-focus-location-block">
                  <p className="meeting-focus-location-block__label">모임 장소</p>
                  <strong className="meeting-focus-location-block__title">
                    {selectedMeeting.locationDetail || '상세 위치 미정'}
                  </strong>
                  <p className="meeting-focus-location-block__address">
                    {selectedMeeting.locationAddress || '공개 주소 없음'}
                  </p>
                </div>

                <div className="meeting-focus-map">
                  <div className="meeting-focus-map__pin" aria-hidden="true" />
                  <div className="meeting-focus-map__copy meeting-focus-location-card meeting-focus-location-card--overlay">
                    <strong className="meeting-focus-location-card__title">
                      {selectedMeeting.locationDetail || '선택한 모임 위치'}
                    </strong>
                    <p className="meeting-focus-location-card__address">
                      {selectedMeeting.locationAddress || '지도 API 연동 시 이 위치가 이 영역에 표시됩니다.'}
                    </p>
                  </div>
                </div>

                {contactPhone ? (
                  <div className="meeting-focus-contact-block">
                    <p className="meeting-focus-contact-block__label">연락처</p>
                    <strong className="meeting-focus-contact-block__value">{contactPhone}</strong>
                  </div>
                ) : null}
              </section>
            </div>
          ) : null}
        </div>

        {contactPhone ? (
          <footer className="meeting-focus-dialog__footer">
            <a
              aria-label={`전화하기 ${contactPhone}`}
              className="meeting-focus-contact__fab"
              href={`tel:${contactPhone}`}
            >
              <svg
                aria-hidden="true"
                className="meeting-focus-contact__fab-icon"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6.62 10.79a15.06 15.06 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.32.56 3.57.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.06 21 3 13.94 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.19 2.45.56 3.57a1 1 0 0 1-.24 1.02z"
                  fill="currentColor"
                />
              </svg>
              <span className="meeting-focus-sr-only">전화하기</span>
            </a>
          </footer>
        ) : null}
      </section>
    </div>
  )
}
