import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchGroupDetail } from "../api/groups";
import InfoRow from "../components/group/InfoRow";
import MeetingPlaceCard from "../components/group/MeetingPlaceCard";
import MeetingScheduleList from "../components/group/MeetingScheduleList";
import NoticeList from "../components/group/NoticeList";
import ChangeLogList from "../components/group/ChangeLogList";
import { formatDate, formatProvince } from "../utils/format";

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
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
          ← 목록으로 돌아가기
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
        <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
          ← 목록으로 돌아가기
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          그룹 정보를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
          ← 목록으로 돌아가기
        </Link>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {group.groupName}
          </h1>

          <div className="mt-4">
            <InfoRow label="시작일" value={formatDate(group.startDate)} />
            <InfoRow label="지역" value={formatProvince(group.province)} />
            <InfoRow label="연합" value={group.districtName} />
            <InfoRow label="연락 주소" value={group.contactAddress} />
            <InfoRow label="이메일" value={group.contactEmail} />
            <InfoRow label="전화번호" value={group.contactPhone} />
          </div>
        </section>
      </div>

      <MeetingPlaceCard
        title="기본 모임 장소"
        place={group.defaultMeetingPlace}
      />

      <MeetingScheduleList meetings={group.meetings} />

      <div className="grid gap-6 xl:grid-cols-2">
        <NoticeList notices={group.notices} />
        <ChangeLogList logs={group.recentChangeLogs} />
      </div>
    </div>
  );
}
