import { useEffect, useState } from "react";
import { fetchMeetings } from "../api/meetings";
import MeetingSearchForm from "../components/meeting/MeetingSearchForm";
import MeetingCard from "../components/meeting/MeetingCard";
import { formatDayOfWeek, formatProvince } from "../utils/format";

const initialFilters = {
  province: "SEOUL",
  dayOfWeek: "MONDAY",
};

export default function MeetingSearchPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMeetings(nextFilters) {
    setLoading(true);
    setError("");

    try {
      const result = await fetchMeetings(nextFilters);
      setData(result);
    } catch (err) {
      setError(err.message || "모임 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMeetings(initialFilters);
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    loadMeetings(filters);
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          모임 검색
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          지역과 요일 기준으로 정기 모임을 조회합니다.
        </p>
      </section>

      <MeetingSearchForm
        filters={filters}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-slate-600">
            {data ? (
              <>
                {formatProvince(data.province)} /{" "}
                {formatDayOfWeek(data.dayOfWeek)} / 총{" "}
                <span className="font-semibold text-slate-900">
                  {data.count}
                </span>
                건
              </>
            ) : (
              "조회 결과를 불러오는 중입니다."
            )}
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            불러오는 중...
          </div>
        ) : data?.meetings?.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {data.meetings.map((meeting) => (
              <MeetingCard key={meeting.meetingId} meeting={meeting} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            조건에 맞는 모임이 없습니다.
          </div>
        )}
      </section>
    </div>
  );
}
