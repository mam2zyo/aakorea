import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchGroupDetail } from "./api";
import InfoRow from "./components/InfoRow";
import MeetingPlaceCard from "./components/MeetingPlaceCard";
import MeetingScheduleList from "./components/MeetingScheduleList";
import NoticeList from "./components/NoticeList";
import ChangeLogList from "./components/ChangeLogList";
import { formatDate, formatProvince } from "../../../shared/lib/format";

export default function GroupDetailPage() {
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
        불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link to="/meetings" className="text-sm aa-inline-link">
          ← 모임 검색으로 돌아가기
        </Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="space-y-4">
        <Link to="/meetings" className="text-sm aa-inline-link">
          ← 모임 검색으로 돌아가기
        </Link>
        <div className="aa-empty-state p-6 text-sm aa-copy">
          그룹 정보를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Link to="/meetings" className="text-sm aa-inline-link">
          ← 모임 검색으로 돌아가기
        </Link>

        <section className="aa-card p-6">
          <p className="aa-eyebrow">Group Detail</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight aa-heading">
            {group.groupName}
          </h1>
          <p className="mt-3 text-sm leading-6 aa-copy">
            정기 일정과 장소, 현재 노출 중인 공지, 최근 변경사항을 한 화면에서
            확인할 수 있습니다. 참석 전에는 장소 안내와 공지를 다시 한 번
            확인해 보세요.
          </p>

          <div className="mt-5">
            <InfoRow label="시작일" value={formatDate(group.startDate)} />
            <InfoRow label="지역" value={formatProvince(group.province)} />
            <InfoRow label="연합" value={group.districtName} />
            <InfoRow label="연락 주소" value={group.contactAddress} />
            <InfoRow label="이메일" value={group.contactEmail} />
            <InfoRow label="전화번호" value={group.contactPhone} />
          </div>
        </section>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <MeetingPlaceCard
          title="기본 모임 장소"
          place={group.defaultMeetingPlace}
        />
        <aside className="aa-card p-5">
          <p className="aa-eyebrow">First Visit</p>
          <h2 className="mt-2 text-xl font-semibold aa-heading">
            처음 참석하시나요?
          </h2>
          <p className="mt-3 text-sm leading-6 aa-copy">
            처음 방문이라면 모임에 가기 전 기본 안내와 FAQ를 먼저 읽어 두는
            것이 도움이 됩니다. 참석만으로 어떤 의무가 생기지는 않으며,
            편한 범위에서만 머물러도 괜찮습니다.
          </p>
          <div className="mt-4 space-y-3 text-sm">
            <Link to="/guide" className="aa-link-tile font-medium aa-heading">
              첫 참석 가이드 보기
            </Link>
            <Link to="/faq" className="aa-link-tile font-medium aa-heading">
              FAQ·자가진단 보기
            </Link>
            <Link to="/meetings" className="aa-link-tile font-medium aa-heading">
              다른 모임 다시 찾기
            </Link>
          </div>
        </aside>
      </section>

      <MeetingScheduleList meetings={group.meetings} />

      <div className="grid gap-6 xl:grid-cols-2">
        <NoticeList notices={group.notices} />
        <ChangeLogList logs={group.recentChangeLogs} />
      </div>
    </div>
  );
}
