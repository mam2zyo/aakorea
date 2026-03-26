import { formatAddress } from "../../shared/basic-format";

export default function BasicMeetingPlaceCard({ title, place }) {
  return (
    <section className="aa-card p-6">
      <p className="aa-eyebrow">Meeting Place</p>
      <h2 className="mt-3 text-2xl font-semibold aa-heading">{title}</h2>

      {!place ? (
        <p className="mt-4 text-sm aa-copy">등록된 장소 정보가 없습니다.</p>
      ) : (
        <div className="mt-5 space-y-3 text-sm aa-copy">
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
              <div className="mt-2">{place.guide}</div>
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
