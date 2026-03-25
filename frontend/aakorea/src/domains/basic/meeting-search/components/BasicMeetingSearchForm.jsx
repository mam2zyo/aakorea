import {
  BASIC_DAY_OF_WEEKS,
  BASIC_PROVINCES,
} from "../../shared/basic-reference";

export default function BasicMeetingSearchForm({
  filters,
  onChange,
  onSubmit,
  onReset,
  onUseToday,
  loading,
}) {
  return (
    <form onSubmit={onSubmit} className="aa-card p-6 lg:p-7">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
        <div>
          <label className="mb-2 block text-sm font-medium aa-heading">
            지역
          </label>
          <select
            name="province"
            value={filters.province}
            onChange={onChange}
            className="aa-field"
          >
            {BASIC_PROVINCES.map((province) => (
              <option key={province.value} value={province.value}>
                {province.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium aa-heading">
            요일
          </label>
          <select
            name="dayOfWeek"
            value={filters.dayOfWeek}
            onChange={onChange}
            className="aa-field"
          >
            {BASIC_DAY_OF_WEEKS.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 lg:flex-row">
          <button
            type="button"
            onClick={onUseToday}
            disabled={loading}
            className="aa-button-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            오늘 기준
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={loading}
            className="aa-button-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            초기화
          </button>
          <button
            type="submit"
            disabled={loading}
            className="aa-button-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "조회 중..." : "검색"}
          </button>
        </div>
      </div>
    </form>
  );
}
