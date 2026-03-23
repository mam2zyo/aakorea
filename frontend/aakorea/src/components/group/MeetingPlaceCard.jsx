import { formatAddress } from "../../utils/format";

export default function MeetingPlaceCard({ title, place }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>

      {!place ? (
        <p className="mt-3 text-sm text-slate-500">장소 정보가 없습니다.</p>
      ) : (
        <div className="mt-3 space-y-2 text-sm text-slate-700">
          <div>
            <span className="mr-2 text-slate-500">주소</span>
            <span>{formatAddress(place)}</span>
          </div>

          {place.guide ? (
            <div>
              <span className="mr-2 text-slate-500">안내</span>
              <span>{place.guide}</span>
            </div>
          ) : null}

          {place.latitude != null && place.longitude != null ? (
            <div>
              <span className="mr-2 text-slate-500">좌표</span>
              <span>
                {place.latitude}, {place.longitude}
              </span>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
