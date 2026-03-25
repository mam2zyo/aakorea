import { formatDateTime } from "../../../../shared/lib/format";

export default function ChangeLogList({ logs }) {
  return (
    <section className="aa-card p-5">
      <h2 className="text-xl font-semibold aa-heading">최근 변경사항</h2>

      {!logs?.length ? (
        <p className="mt-3 text-sm aa-copy">최근 변경사항이 없습니다.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {logs.map((log) => (
            <article key={log.id} className="aa-card-soft p-4">
              <h3 className="text-sm font-semibold aa-heading">
                {log.summary}
              </h3>

              {log.detail ? (
                <p className="mt-2 whitespace-pre-wrap text-sm aa-copy">
                  {log.detail}
                </p>
              ) : null}

              <div className="mt-3 text-xs aa-copy">
                {log.changedBy || "관리자"} · {formatDateTime(log.createdAt)}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
