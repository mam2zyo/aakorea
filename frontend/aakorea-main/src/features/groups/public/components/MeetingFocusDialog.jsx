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
              <section className="meeting-focus-section meeting-focus-section--notice">
                <p className="meeting-focus-section__label">공지</p>
                <div className="meeting-focus-notice">
                  <p
                    className={`meeting-focus-notice__body${
                      hasGroupNotice(groupDetails) ? '' : ' meeting-focus-notice__body--muted'
                    }`}
                  >
                    {readGroupNotice(groupDetails)}
                  </p>
                </div>
              </section>

              <section className="meeting-focus-section meeting-focus-section--meeting-info">
                <p className="meeting-focus-section__label">모임 정보</p>
                <div className="meeting-focus-info-stack">
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
                        <span>{lookupLabel(MEETING_TYPE_OPTIONS, meeting.type)}</span>
                      </button>
                    ))}
                  </div>

                  <div className="meeting-focus-document">
                    <div className="meeting-focus-document__row">
                      <p className="meeting-focus-document__label">모임 장소 상세</p>
                      <div className="meeting-focus-document__value-group">
                        <strong className="meeting-focus-document__value">
                          {selectedMeeting.locationDetail || '상세 위치 미정'}
                        </strong>
                      </div>
                    </div>

                    <div className="meeting-focus-document__row">
                      <p className="meeting-focus-document__label">주소</p>
                      <div className="meeting-focus-document__value-group">
                        <p className="meeting-focus-document__value meeting-focus-document__value--muted">
                          {selectedMeeting.locationAddress || '공개 주소 없음'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="meeting-focus-section meeting-focus-section--map">
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
              </section>
            </div>
          ) : null}
        </div>

        {contactPhone ? (
          <footer className="meeting-focus-dialog__footer">
            <div className="meeting-focus-contact">
              <p className="meeting-focus-contact__label">연락처</p>
              <strong className="meeting-focus-contact__value">{contactPhone}</strong>
            </div>

            <a className="primary-button meeting-focus-contact__action" href={`tel:${contactPhone}`}>
              전화 걸기
            </a>
          </footer>
        ) : null}
      </section>
    </div>
  )
}
