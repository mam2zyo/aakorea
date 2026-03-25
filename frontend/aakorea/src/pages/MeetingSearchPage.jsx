import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMeetings } from "../api/meetings";
import MeetingSearchForm from "../components/meeting/MeetingSearchForm";
import MeetingCard from "../components/meeting/MeetingCard";
import {
  formatDayOfWeek,
  formatProvince,
  getTodayDayOfWeekValue,
} from "../utils/format";

const initialFilters = {
  province: "SEOUL",
  dayOfWeek: getTodayDayOfWeekValue(),
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

  function handleUseToday() {
    const nextFilters = {
      ...filters,
      dayOfWeek: getTodayDayOfWeekValue(),
    };

    setFilters(nextFilters);
    loadMeetings(nextFilters);
  }

  function handleReset() {
    setFilters(initialFilters);
    loadMeetings(initialFilters);
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_320px]">
        <article className="aa-card px-6 py-8 lg:px-8">
          <p className="aa-eyebrow">Find A.A. Meetings</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight aa-heading lg:text-4xl">
            가까운 A.A. 모임을 찾아보세요.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 aa-copy lg:text-base">
            지역과 요일을 기준으로 현재 운영 중인 정기 모임을 찾을 수
            있습니다. 장소 변경이나 휴무처럼 바로 확인이 필요한 공지는 검색
            결과와 그룹 상세에 함께 반영됩니다.
          </p>
        </article>

        <aside className="aa-card p-5">
          <p className="aa-eyebrow">First Visit</p>
          <h2 className="mt-2 text-xl font-semibold aa-heading">
            처음 참석이라면
          </h2>
          <p className="mt-3 text-sm leading-6 aa-copy">
            공개모임부터 확인하고, 참석 전에는 장소와 공지를 다시 확인해
            보세요.
          </p>
          <div className="mt-4 space-y-3 text-sm">
            <Link to="/welcome" className="aa-link-tile font-medium aa-heading">
              처음 오신 분들께
            </Link>
            <Link to="/guide" className="aa-link-tile font-medium aa-heading">
              첫 참석 가이드
            </Link>
            <Link to="/faq" className="aa-link-tile font-medium aa-heading">
              FAQ·자가진단
            </Link>
          </div>
        </aside>
      </section>

      <section className="aa-card p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="aa-eyebrow">Meeting Types</p>
            <h2 className="text-xl font-semibold aa-heading">
              어떤 모임을 먼저 보면 좋을까요?
            </h2>
          </div>
          <span className="text-sm aa-copy">
            모임 형태를 이해하면 처음 선택이 훨씬 쉬워집니다.
          </span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="aa-card-soft p-4 text-sm leading-6">
            <div className="font-semibold aa-heading">공개모임</div>
            <p className="mt-1 aa-copy">
              알코올중독자 본인이나 가족, 또는 중독 문제에 관심이 있는 누구나
              참석할 수 있는 공개모임
            </p>
          </div>
          <div className="aa-card-soft p-4 text-sm leading-6">
            <div className="font-semibold aa-heading">비공개모임</div>
            <p className="mt-1 aa-copy">
              술을 끊기를 바라는 알코올중독자 본인만 참석할 수 있는
              비공개모임
            </p>
          </div>
        </div>
      </section>

      <MeetingSearchForm
        filters={filters}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onReset={handleReset}
        onUseToday={handleUseToday}
        loading={loading}
      />

      <div className="aa-note px-4 py-4 text-sm leading-6 aa-copy">
        시간이나 거리 때문에 비공개모임만 참석이 가능하다면,
        참석 전에 봉사자에게 연락해 참석 가능 여부를 먼저 문의해 보세요.
        거절될 수 있지만, 한국에서는 이런 문의를 받으면 일시적으로
        공개모임으로 전환해 진행하는 경우도 많습니다.
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="space-y-4">
        <div className="aa-note flex flex-wrap items-center justify-between gap-2 px-4 py-3">
          <div className="text-sm aa-copy">
            {data ? (
              <>
                {formatProvince(data.province)} /{" "}
                {formatDayOfWeek(data.dayOfWeek)} / 총{" "}
                <span className="font-semibold aa-heading">{data.count}</span>건
              </>
            ) : (
              "조회 결과를 불러오는 중입니다."
            )}
          </div>
        </div>

        {loading ? (
          <div className="aa-empty-state p-6 text-sm aa-copy">불러오는 중...</div>
        ) : data?.meetings?.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {data.meetings.map((meeting) => (
              <MeetingCard key={meeting.meetingId} meeting={meeting} />
            ))}
          </div>
        ) : (
          <div className="aa-empty-state p-6 text-sm aa-copy">
            조건에 맞는 모임이 없습니다.
          </div>
        )}
      </section>
    </div>
  );
}
