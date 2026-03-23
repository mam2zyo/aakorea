import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import {
  formatAddress,
  formatDayOfWeek,
  formatMeetingStatus,
  formatMeetingType,
  formatTime,
} from "../../utils/format";

export default function MeetingCard({ meeting }) {
  return (
    <Link
      to={`/groups/${meeting.groupId}`}
      className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {meeting.groupName}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {formatDayOfWeek(meeting.dayOfWeek)} ·{" "}
            {formatTime(meeting.startTime)}
          </p>
        </div>

        <StatusBadge status={meeting.status}>
          {formatMeetingStatus(meeting.status)}
        </StatusBadge>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-700">
        <div>
          <span className="mr-2 text-slate-500">형태</span>
          <span>{formatMeetingType(meeting.meetingType)}</span>
        </div>

        <div>
          <span className="mr-2 text-slate-500">장소</span>
          <span>{formatAddress(meeting.meetingPlace)}</span>
        </div>

        {meeting.meetingPlace?.guide ? (
          <div>
            <span className="mr-2 text-slate-500">안내</span>
            <span>{meeting.meetingPlace.guide}</span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
