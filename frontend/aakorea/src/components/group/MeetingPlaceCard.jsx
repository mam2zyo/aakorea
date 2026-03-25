import { formatAddress } from "../../utils/format";

export default function MeetingPlaceCard({ title, place }) {
  return (
    <section className="aa-card p-5">
      <h2 className="text-xl font-semibold aa-heading">{title}</h2>

      {!place ? (
        <p className="mt-3 text-sm aa-copy">장소 정보가 없습니다.</p>
      ) : (
        <div className="mt-4 space-y-3 text-sm aa-copy">
          <div className="aa-card-soft p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] aa-eyebrow">
              주소
            </div>
            <div className="mt-2 font-medium aa-heading">
              {formatAddress(place)}
            </div>
          </div>

          {place.guide ? (
            <div className="aa-card-soft p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] aa-eyebrow">
                안내
              </div>
              <div className="mt-2 aa-copy">{place.guide}</div>
            </div>
          ) : null}

          {place.latitude != null && place.longitude != null ? (
            <div className="aa-card-soft p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] aa-eyebrow">
                좌표
              </div>
              <div className="mt-2 font-medium aa-heading">
                {place.latitude}, {place.longitude}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
