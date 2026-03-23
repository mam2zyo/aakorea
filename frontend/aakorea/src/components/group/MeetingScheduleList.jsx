import StatusBadge from "../common/StatusBadge";
import {
  formatAddress,
  formatDayOfWeek,
  formatMeetingStatus,
  formatMeetingType,
  formatTime,
} from "../../utils/format";

function sortMeetings(a, b) {
  const dayOrder = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 7,
  };

  const dayDiff = (dayOrder[a.dayOfWeek] || 99) - (dayOrder[b.dayOfWeek] || 99);
  if (dayDiff !== 0) return dayDiff;

  return String(a.startTime || "").localeCompare(String(b.startTime || ""));
}

export default function MeetingScheduleList({ meetings }) {
  const sortedMeetings = [...(meetings || [])].sort(sortMeetings);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">정기 모임 일정</h2>
        <span className="text-xs text-slate-500">
          총 {sortedMeetings.length}건
        </span>
      </div>

      {!sortedMeetings.length ? (
        <p className="mt-3 text-sm text-slate-500">등록된 정기 모임이 없습니다.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {sortedMeetings.map((meeting) => (
            <article
              key={meeting.meetingId}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {formatDayOfWeek(meeting.dayOfWeek)} ·{" "}
                    {formatTime(meeting.startTime)}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatMeetingType(meeting.meetingType)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {meeting.placeOverridden ? (
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                      개별 장소
                    </span>
                  ) : null}
                  <StatusBadge status={meeting.status}>
                    {formatMeetingStatus(meeting.status)}
                  </StatusBadge>
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-slate-700">
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
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
