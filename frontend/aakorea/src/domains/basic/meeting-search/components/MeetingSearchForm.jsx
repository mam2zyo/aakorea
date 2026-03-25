import {
  DAY_OF_WEEKS,
  PROVINCES,
} from "../../../../shared/lib/aa-reference";

export default function MeetingSearchForm({
  filters,
  onChange,
  onSubmit,
  onReset,
  onUseToday,
  loading,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="aa-card grid gap-4 p-5 md:grid-cols-[1fr_1fr_auto]"
    >
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
          {PROVINCES.map((province) => (
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
          {DAY_OF_WEEKS.map((day) => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end">
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
          <button
            type="button"
            onClick={onUseToday}
            disabled={loading}
            className="aa-button-secondary w-full disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
          >
            오늘 요일
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={loading}
            className="aa-button-secondary w-full disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
          >
            초기화
          </button>
          <button
            type="submit"
            disabled={loading}
            className="aa-button-primary w-full disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
          >
            {loading ? "조회 중..." : "조회"}
          </button>
        </div>
      </div>
    </form>
  );
}
