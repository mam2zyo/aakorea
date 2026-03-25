import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchGroupDetail } from "./api";
import BasicInfoRow from "./components/BasicInfoRow";
import BasicMeetingPlaceCard from "./components/BasicMeetingPlaceCard";
import BasicMeetingScheduleList from "./components/BasicMeetingScheduleList";
import BasicNoticeList from "./components/BasicNoticeList";
import BasicChangeLogList from "./components/BasicChangeLogList";
import { formatDate, formatProvince } from "../shared/basic-format";

export default function BasicGroupDetailPage() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGroup() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchGroupDetail(groupId);
        setGroup(result);
      } catch (err) {
        setError(err.message || "그룹 상세 조회 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    loadGroup();
  }, [groupId]);

  if (loading) {
    return (
      <div className="aa-empty-state p-6 text-sm aa-copy">
        그룹 정보를 불러오는 중입니다.
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link to="/meetings" className="text-sm aa-inline-link">
          모임 검색으로 돌아가기
        </Link>
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="space-y-4">
        <Link to="/meetings" className="text-sm aa-inline-link">
          모임 검색으로 돌아가기
        </Link>
        <div className="aa-empty-state p-6 text-sm aa-copy">
          그룹 정보를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <Link to="/meetings" className="inline-block text-sm aa-inline-link">
        모임 검색으로 돌아가기
      </Link>

      <section className="aa-hero px-6 py-8 lg:px-8 lg:py-10">
        <div className="relative z-[1] grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/72">
              Group Detail
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white lg:text-5xl">
              {group.groupName}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/84">
              장소, 정기 일정, 현재 공지, 최근 변경 이력을 한 화면에서 확인할
              수 있습니다. 참석 전에는 장소 안내와 공지 사항을 다시 살펴봐
              주세요.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="aa-tag">{formatProvince(group.province)}</span>
              {group.districtName ? (
                <span className="aa-tag">{group.districtName}</span>
              ) : null}
              <span className="aa-tag">시작일 {formatDate(group.startDate)}</span>
            </div>
          </div>

          <aside className="aa-hero-panel p-5">
            <h2 className="text-2xl font-semibold text-white">연락 및 확인</h2>
            <div className="mt-4 space-y-3 text-sm text-white/84">
              <div>
                <div className="font-semibold text-white">연락 주소</div>
                <div>{group.contactAddress || "-"}</div>
              </div>
              <div>
                <div className="font-semibold text-white">이메일</div>
                <div>{group.contactEmail || "-"}</div>
              </div>
              <div>
                <div className="font-semibold text-white">전화번호</div>
                <div>{group.contactPhone || "-"}</div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <article className="aa-card p-6">
            <div>
              <p className="aa-eyebrow">Overview</p>
              <h2 className="mt-2 text-2xl font-semibold aa-heading">
                그룹 기본 정보
              </h2>
            </div>
            <div className="mt-5">
              <BasicInfoRow label="시작일" value={formatDate(group.startDate)} />
              <BasicInfoRow
                label="지역"
                value={formatProvince(group.province)}
              />
              <BasicInfoRow label="지구/지부" value={group.districtName} />
              <BasicInfoRow label="연락 주소" value={group.contactAddress} />
              <BasicInfoRow label="이메일" value={group.contactEmail} />
              <BasicInfoRow label="전화번호" value={group.contactPhone} />
            </div>
          </article>

          <BasicMeetingPlaceCard
            title="기본 모임 장소"
            place={group.defaultMeetingPlace}
          />
        </div>

        <aside className="space-y-4">
          <section className="aa-card p-5">
            <h2 className="text-xl font-semibold aa-heading">처음 참석이라면</h2>
            <div className="aa-resource-list mt-4">
              <Link to="/guide" className="aa-resource-link">
                <span className="font-medium">첫 모임 가이드</span>
                <span className="text-xs aa-copy">보기</span>
              </Link>
              <Link to="/faq" className="aa-resource-link">
                <span className="font-medium">FAQ</span>
                <span className="text-xs aa-copy">보기</span>
              </Link>
              <Link to="/meetings" className="aa-resource-link">
                <span className="font-medium">다른 모임 다시 찾기</span>
                <span className="text-xs aa-copy">이동</span>
              </Link>
            </div>
          </section>

          <section className="aa-card-dark p-5">
            <span className="aa-tag w-fit">Before you go</span>
            <p className="mt-4 text-sm leading-7 text-white/82">
              참석 전에는 공지와 장소 안내를 다시 확인해 주세요. 임시 장소
              변경이나 휴무가 반영되어 있을 수 있습니다.
            </p>
          </section>
        </aside>
      </section>

      <BasicMeetingScheduleList meetings={group.meetings} />

      <div className="grid gap-6 xl:grid-cols-2">
        <BasicNoticeList notices={group.notices} />
        <BasicChangeLogList logs={group.recentChangeLogs} />
      </div>
    </div>
  );
}
