import { formatDateTime, formatNoticeType } from "../../utils/format";

export default function NoticeList({ notices }) {
  return (
    <section className="aa-card p-5">
      <h2 className="text-xl font-semibold aa-heading">공지</h2>

      {!notices?.length ? (
        <p className="mt-3 text-sm aa-copy">
          현재 노출 중인 공지가 없습니다.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {notices.map((notice) => (
            <article key={notice.id} className="aa-card-soft p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold aa-heading">
                  {notice.title}
                </h3>
                <span className="aa-chip aa-chip-warm text-xs">
                  {formatNoticeType(notice.type)}
                </span>
              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm aa-copy">
                {notice.content}
              </p>

              <div className="mt-3 text-xs aa-copy">
                생성일 {formatDateTime(notice.createdAt)}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
