import { formatDateTime } from "../../shared/basic-format";

export default function BasicChangeLogList({ logs }) {
  return (
    <section className="aa-card p-6">
      <div>
        <p className="aa-eyebrow">Recent Changes</p>
        <h2 className="mt-2 text-2xl font-semibold aa-heading">최근 변경 이력</h2>
      </div>

      {!logs?.length ? (
        <p className="mt-4 text-sm aa-copy">최근 변경 이력이 없습니다.</p>
      ) : (
        <div className="mt-5 space-y-3">
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
                {log.changedBy || "관리자"} / {formatDateTime(log.createdAt)}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
