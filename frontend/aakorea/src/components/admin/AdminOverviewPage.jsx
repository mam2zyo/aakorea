import { Link } from 'react-router-dom'
import AdminLayout from './AdminLayout'

const cards = [
  {
    title: '지역연합 관리',
    description: '지역연합 단위를 등록하고 그룹 배치 전에 조직 구조를 정리합니다.',
    actionLabel: '바로 가기',
    to: '/admin/districts',
    enabled: true,
  },
  {
    title: '그룹 관리',
    description: '그룹 기본 정보와 기본 모임 장소를 등록하고 관리합니다.',
    actionLabel: '바로 가기',
    to: '/admin/groups',
    enabled: true,
  },
  {
    title: 'GSR 관리',
    description: '그룹 봉사자(GSR) 연락처를 CRUD로 관리합니다.',
    actionLabel: '바로 가기',
    to: '/admin/gsrs',
    enabled: true,
  },
  {
    title: '운영자 관리',
    description: '권한 분리와 감사 로그 기능을 고려한 운영 메뉴를 확장할 수 있습니다.',
    actionLabel: '준비 중',
    to: '/admin/users',
    enabled: false,
  },
]

export default function AdminOverviewPage() {
  return (
    <AdminLayout
      title="관리자 페이지"
      description="향후 그룹 관리, 운영자 관리 등 기능이 추가될 수 있도록 관리자 전용 내비게이션과 작업 영역을 분리했습니다. 현재는 지역연합, 그룹, GSR 관리 기능을 제공합니다."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
            {card.enabled ? (
              <Link
                to={card.to}
                className="mt-4 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
              >
                {card.actionLabel}
              </Link>
            ) : (
              <span className="mt-4 inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-400">
                {card.actionLabel}
              </span>
            )}
          </article>
        ))}
      </div>
    </AdminLayout>
  )
}
