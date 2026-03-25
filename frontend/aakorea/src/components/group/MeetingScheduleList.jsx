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
    <section className="aa-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold aa-heading">정기 모임 일정</h2>
        <span className="text-xs aa-copy">
          총 {sortedMeetings.length}건
        </span>
      </div>

      {!sortedMeetings.length ? (
        <p className="mt-3 text-sm aa-copy">등록된 정기 모임이 없습니다.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {sortedMeetings.map((meeting) => (
            <article key={meeting.meetingId} className="aa-card-soft p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold aa-heading">
                    {formatDayOfWeek(meeting.dayOfWeek)} ·{" "}
                    {formatTime(meeting.startTime)}
                  </h3>
                  <p className="mt-1 text-sm aa-copy">
                    {formatMeetingType(meeting.meetingType)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {meeting.placeOverridden ? (
                    <span className="aa-chip text-xs">
                      개별 장소
                    </span>
                  ) : null}
                  <StatusBadge status={meeting.status}>
                    {formatMeetingStatus(meeting.status)}
                  </StatusBadge>
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-sm aa-copy">
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
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
