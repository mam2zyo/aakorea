import { formatDateTime, formatNoticeType } from "../../utils/format";

export default function NoticeList({ notices }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">공지</h2>

      {!notices?.length ? (
        <p className="mt-3 text-sm text-slate-500">
          현재 노출 중인 공지가 없습니다.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {notices.map((notice) => (
            <article
              key={notice.id}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  {notice.title}
                </h3>
                <span className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-700">
                  {formatNoticeType(notice.type)}
                </span>
              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                {notice.content}
              </p>

              <div className="mt-3 text-xs text-slate-500">
                생성일 {formatDateTime(notice.createdAt)}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
