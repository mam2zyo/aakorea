import { Link } from "react-router-dom";
import BasicStatusBadge from "../../shared/BasicStatusBadge";
import {
  formatAddress,
  formatDayOfWeek,
  formatMeetingStatus,
  formatMeetingType,
  formatNoticeType,
  formatTime,
} from "../../shared/basic-format";

export default function BasicMeetingCard({ meeting }) {
  return (
    <Link
      to={`/groups/${meeting.groupId}`}
      className="aa-card block p-5 transition hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="aa-eyebrow">{meeting.districtName || "Meeting"}</p>
          <h3 className="mt-2 text-xl font-semibold aa-heading">
            {meeting.groupName}
          </h3>
          <p className="mt-2 text-sm aa-copy">
            {formatDayOfWeek(meeting.dayOfWeek)} / {formatTime(meeting.startTime)}
          </p>
        </div>

        <BasicStatusBadge status={meeting.status}>
          {formatMeetingStatus(meeting.status)}
        </BasicStatusBadge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="aa-chip">{formatMeetingType(meeting.meetingType)}</span>
        {meeting.placeOverridden ? (
          <span className="aa-chip aa-chip-warm">개별 장소</span>
        ) : null}
      </div>

      <div className="mt-4 space-y-2 text-sm aa-copy">
        <div>
          <span className="font-semibold aa-heading">장소</span>
          <span className="ml-2">{formatAddress(meeting.meetingPlace)}</span>
        </div>
        {meeting.meetingPlace?.guide ? (
          <div>
            <span className="font-semibold aa-heading">안내</span>
            <span className="ml-2">{meeting.meetingPlace.guide}</span>
          </div>
        ) : null}
      </div>

      {meeting.highlightNotice ? (
        <div className="aa-note mt-4 px-4 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="aa-chip aa-chip-warm text-[11px]">
              {formatNoticeType(meeting.highlightNotice.type)}
            </span>
            <span className="font-semibold aa-heading">
              {meeting.highlightNotice.title}
            </span>
          </div>
          {meeting.highlightNotice.content ? (
            <p className="mt-2 text-sm aa-copy">
              {meeting.highlightNotice.content}
            </p>
          ) : null}
        </div>
      ) : null}
    </Link>
  );
}
