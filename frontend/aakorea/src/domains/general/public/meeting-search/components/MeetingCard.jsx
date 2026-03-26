import { Link } from "react-router-dom";
import StatusBadge from "../../../../../../shared/ui/StatusBadge";
import {
  formatAddress,
  formatDayOfWeek,
  formatMeetingStatus,
  formatMeetingType,
  formatNoticeType,
  formatTime,
} from "../../../../../../shared/lib/format";

export default function MeetingCard({ meeting }) {
  return (
    <Link
      to={`/groups/${meeting.groupId}`}
      className="aa-card block p-5 transition hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold aa-heading">
            {meeting.groupName}
          </h3>
          <p className="mt-1 text-sm aa-copy">
            {formatDayOfWeek(meeting.dayOfWeek)} ·{" "}
            {formatTime(meeting.startTime)}
          </p>
        </div>

        <StatusBadge status={meeting.status}>
          {formatMeetingStatus(meeting.status)}
        </StatusBadge>
      </div>

      <div className="mt-4 grid gap-2 text-sm aa-copy">
        <div>
          <span className="mr-2">형태</span>
          <span className="font-medium aa-heading">
            {formatMeetingType(meeting.meetingType)}
          </span>
        </div>

        <div>
          <span className="mr-2">장소</span>
          <span className="font-medium aa-heading">
            {formatAddress(meeting.meetingPlace)}
          </span>
        </div>

        {meeting.meetingPlace?.guide ? (
          <div>
            <span className="mr-2">안내</span>
            <span>{meeting.meetingPlace.guide}</span>
          </div>
        ) : null}
      </div>

      {meeting.highlightNotice ? (
        <div className="aa-note mt-4 px-3 py-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="aa-chip aa-chip-warm text-[11px]">
              {formatNoticeType(meeting.highlightNotice.type)}
            </span>
            <span className="font-semibold aa-heading">
              {meeting.highlightNotice.title}
            </span>
          </div>
          {meeting.highlightNotice.content ? (
            <p className="mt-2 aa-copy">
              {meeting.highlightNotice.content}
            </p>
          ) : null}
        </div>
      ) : null}
    </Link>
  );
}
