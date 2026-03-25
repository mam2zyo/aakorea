import BasicStatusBadge from "../../shared/BasicStatusBadge";
import {
  formatAddress,
  formatDayOfWeek,
  formatMeetingStatus,
  formatMeetingType,
  formatTime,
} from "../../shared/basic-format";

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

export default function BasicMeetingScheduleList({ meetings }) {
  const sortedMeetings = [...(meetings || [])].sort(sortMeetings);

  return (
    <section className="aa-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="aa-eyebrow">Schedule</p>
          <h2 className="mt-2 text-2xl font-semibold aa-heading">정기 모임 일정</h2>
        </div>
        <span className="aa-chip">총 {sortedMeetings.length}개</span>
      </div>

      {!sortedMeetings.length ? (
        <p className="mt-4 text-sm aa-copy">등록된 정기 모임이 없습니다.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {sortedMeetings.map((meeting) => (
            <article key={meeting.meetingId} className="aa-card-soft p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold aa-heading">
                    {formatDayOfWeek(meeting.dayOfWeek)} /{" "}
                    {formatTime(meeting.startTime)}
                  </h3>
                  <p className="mt-1 text-sm aa-copy">
                    {formatMeetingType(meeting.meetingType)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {meeting.placeOverridden ? (
                    <span className="aa-chip aa-chip-warm">개별 장소</span>
                  ) : null}
                  <BasicStatusBadge status={meeting.status}>
                    {formatMeetingStatus(meeting.status)}
                  </BasicStatusBadge>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm aa-copy">
                <div>
                  <span className="font-semibold aa-heading">장소</span>
                  <span className="ml-2">
                    {formatAddress(meeting.meetingPlace)}
                  </span>
                </div>
                {meeting.meetingPlace?.guide ? (
                  <div>
                    <span className="font-semibold aa-heading">안내</span>
                    <span className="ml-2">{meeting.meetingPlace.guide}</span>
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
