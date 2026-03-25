import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMeetings } from "./api";
import BasicMeetingSearchForm from "./components/BasicMeetingSearchForm";
import BasicMeetingCard from "./components/BasicMeetingCard";
import {
  formatDayOfWeek,
  formatProvince,
  getTodayDayOfWeekValue,
} from "../shared/basic-format";

const initialFilters = {
  province: "SEOUL",
  dayOfWeek: getTodayDayOfWeekValue(),
};

const firstVisitLinks = [
  { label: "처음 오신 분께", to: "/welcome" },
  { label: "첫 모임 가이드", to: "/guide" },
  { label: "FAQ", to: "/faq" },
];

export default function BasicMeetingSearchPage() {
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
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_320px]">
        <article className="aa-hero px-6 py-8 lg:px-8 lg:py-10">
          <div className="relative z-[1] max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/72">
              Find A.A. Meetings
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white lg:text-5xl">
              가까운 A.A. 모임을
              <br />
              차분하게 찾아보세요
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/84">
              지역과 요일을 기준으로 현재 운영 중인 정기 모임을 확인할 수
              있습니다. 참석 전에는 장소 변경이나 공지 사항이 없는지 그룹
              상세에서 최신 정보를 다시 확인해 주세요.
            </p>
          </div>
        </article>

        <aside className="aa-card p-6">
          <span className="aa-chip">First Visit</span>
          <h2 className="mt-4 text-2xl font-semibold aa-heading">
            처음 참석이라면
          </h2>
          <p className="mt-3 text-sm leading-7 aa-copy">
            공개 모임 여부와 장소 안내를 먼저 확인하고, 부담이 적은 일정부터
            시작해 보세요.
          </p>
          <div className="aa-resource-list mt-5">
            {firstVisitLinks.map((item) => (
              <Link key={item.to} to={item.to} className="aa-resource-link">
                <span className="font-medium">{item.label}</span>
                <span className="text-xs aa-copy">이동</span>
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <BasicMeetingSearchForm
        filters={filters}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onReset={handleReset}
        onUseToday={handleUseToday}
        loading={loading}
      />

      <div className="aa-note px-4 py-4 text-sm leading-7 aa-copy">
        비공개 모임에 참석 가능한지 확실하지 않다면, 먼저 공개 모임을
        찾아보거나 그룹 상세의 공지와 안내를 확인해 주세요.
      </div>

      {error ? (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="space-y-4">
        <div className="aa-card p-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {data ? (
              <>
                <span className="aa-chip">{formatProvince(data.province)}</span>
                <span className="aa-chip">{formatDayOfWeek(data.dayOfWeek)}</span>
                <span className="font-semibold aa-heading">
                  총 {data.count}개 모임
                </span>
              </>
            ) : (
              <span className="aa-copy">검색 결과를 불러오는 중입니다.</span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="aa-empty-state p-6 text-sm aa-copy">
            모임 정보를 불러오는 중입니다.
          </div>
        ) : data?.meetings?.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {data.meetings.map((meeting) => (
              <BasicMeetingCard key={meeting.meetingId} meeting={meeting} />
            ))}
          </div>
        ) : (
          <div className="aa-empty-state p-6 text-sm aa-copy">
            조건에 맞는 모임이 없습니다. 다른 지역이나 요일로 다시 검색해
            주세요.
          </div>
        )}
      </section>
    </div>
  );
}
