import { useState } from 'react'
import { EmptyState } from '../../../../ui'
import {
  DAY_OF_WEEK_OPTIONS,
  MEETING_TYPE_OPTIONS,
} from '@/shared/lib/options'
import { lookupLabel } from '@/shared/lib/view'
import kakaoMapIcon from '../assets/kakaomap100.png'
import tmapIcon from '../assets/tmap100.png'
import { KakaoMeetingMap } from './KakaoMeetingMap'
import {
  openKakaoMapWithFallback,
  buildKakaoMapUrl,
  buildMeetingsPath,
  buildTmapRouteUrl,
  hasGroupNotice,
  readGroupNotice,
} from '../utils'

export function MeetingFocusDialog({
  groupDetails,
  loading,
  missingGroup,
  onClose,
  onNavigate,
  selectedMeeting,
}) {
  const [kakaoFallbackOptions, setKakaoFallbackOptions] = useState(null)
  const activeMeetingId = selectedMeeting?.id ?? null
  const contactPhone = selectedMeeting?.contactPhone || groupDetails?.contactPhone || ''
  const hasNotice = Boolean(hasGroupNotice(groupDetails))
  const kakaoMapUrl = buildKakaoMapUrl(
    selectedMeeting?.locationDetail || groupDetails?.name,
    selectedMeeting?.latitude,
    selectedMeeting?.longitude,
  )
  const tmapRouteUrl = buildTmapRouteUrl(
    selectedMeeting?.locationDetail || groupDetails?.name,
    selectedMeeting?.latitude,
    selectedMeeting?.longitude,
  )

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
          {loading ? (
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
                      onClick={() => onNavigate(buildMeetingsPath(groupDetails.id, meeting.id))}
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
                  {kakaoMapUrl || tmapRouteUrl ? (
                    <div className="meeting-focus-location-actions">
                      {kakaoMapUrl ? (
                        <a
                          aria-label="카카오맵에서 위치 보기"
                          className="meeting-focus-location-action"
                          href={kakaoMapUrl}
                          onClick={(event) => openKakaoMapWithFallback(
                            event,
                            selectedMeeting?.latitude,
                            selectedMeeting?.longitude,
                            (fallbackOptions) => setKakaoFallbackOptions({
                              ...fallbackOptions,
                              meetingId: activeMeetingId,
                            }),
                          )}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <img
                            alt=""
                            aria-hidden="true"
                            className="meeting-focus-location-action__icon"
                            src={kakaoMapIcon}
                          />
                        </a>
                      ) : null}
                      {tmapRouteUrl ? (
                        <a
                          aria-label="티맵으로 길안내 열기"
                          className="meeting-focus-location-action"
                          href={tmapRouteUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <img
                            alt=""
                            aria-hidden="true"
                            className="meeting-focus-location-action__icon"
                            src={tmapIcon}
                          />
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                  {kakaoFallbackOptions?.meetingId === activeMeetingId ? (
                    <div className="meeting-focus-location-fallback" role="alert">
                      <p className="meeting-focus-location-fallback__title">
                        카카오맵이 설치되지 않았습니다.
                      </p>
                      <div className="button-row button-row--compact meeting-focus-location-fallback__actions">
                        {kakaoFallbackOptions.mobileWebUrl ? (
                          <a
                            className="ghost-button ghost-button--small"
                            href={kakaoFallbackOptions.mobileWebUrl}
                            onClick={() => setKakaoFallbackOptions(null)}
                            rel="noreferrer"
                            target="_blank"
                          >
                            웹에서 보기
                          </a>
                        ) : null}
                        {kakaoFallbackOptions.installUrl ? (
                          <a
                            className="primary-button primary-button--small"
                            href={kakaoFallbackOptions.installUrl}
                            onClick={() => setKakaoFallbackOptions(null)}
                            rel="noreferrer"
                            target="_blank"
                          >
                            앱 설치
                          </a>
                        ) : null}
                        <button
                          className="ghost-button ghost-button--small"
                          type="button"
                          onClick={() => setKakaoFallbackOptions(null)}
                        >
                          닫기
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>

                <KakaoMeetingMap
                  key={selectedMeeting.id}
                  latitude={selectedMeeting.latitude}
                  longitude={selectedMeeting.longitude}
                />

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
