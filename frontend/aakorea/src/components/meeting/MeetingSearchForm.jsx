import { DAY_OF_WEEKS, PROVINCES } from "../../utils/constants";

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
      className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_auto]"
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          지역
        </label>
        <select
          name="province"
          value={filters.province}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-0 focus:border-slate-400"
        >
          {PROVINCES.map((province) => (
            <option key={province.value} value={province.value}>
              {province.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          요일
        </label>
        <select
          name="dayOfWeek"
          value={filters.dayOfWeek}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-0 focus:border-slate-400"
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
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 md:w-auto"
          >
            오늘 요일
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={loading}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 md:w-auto"
          >
            초기화
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 md:w-auto"
          >
            {loading ? "조회 중..." : "조회"}
          </button>
        </div>
      </div>
    </form>
  );
}
