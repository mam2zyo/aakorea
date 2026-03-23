import { formatDateTime } from "../../utils/format";

export default function ChangeLogList({ logs }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">최근 변경사항</h2>

      {!logs?.length ? (
        <p className="mt-3 text-sm text-slate-500">최근 변경사항이 없습니다.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {logs.map((log) => (
            <article
              key={log.id}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <h3 className="text-sm font-semibold text-slate-900">
                {log.summary}
              </h3>

              {log.detail ? (
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {log.detail}
                </p>
              ) : null}

              <div className="mt-3 text-xs text-slate-500">
                {log.changedBy || "관리자"} · {formatDateTime(log.createdAt)}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
