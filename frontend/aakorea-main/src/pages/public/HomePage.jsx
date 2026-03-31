import { PageIntro, PageSection } from '../../components/ui'

export function HomePage({ onNavigate, session }) {
  return (
    <>
      <PageIntro
        eyebrow="AAKorea Main MVP"
        title="방문자 흐름과 운영 흐름을 분리해 더 자연스럽게 연결합니다."
        description="방문자는 지역 기준으로 모임을 찾고 연락처를 확인할 수 있고, 운영자는 District와 Group 중심 화면에서 공개 정보를 관리할 수 있습니다."
        actions={
          <>
            <button
              className="primary-button"
              type="button"
              onClick={() => onNavigate('/meetings')}
            >
              모임 찾기
            </button>
            <button
              className="ghost-button"
              type="button"
              onClick={() =>
                onNavigate(session.authenticated ? '/admin/groups' : '/admin/login')
              }
            >
              {session.authenticated ? '운영 화면 열기' : '운영 로그인'}
            </button>
          </>
        }
        aside={
          <div className="info-stack">
            <div className="info-card">
              <strong>현재 공개 핵심</strong>
              <p>지역 기준 모임 검색, 모임 상세 확인, 대표 연락처 확인</p>
            </div>
            <div className="info-card">
              <strong>현재 운영 핵심</strong>
              <p>District 분리 관리, Group 중심 편집, 연락처와 모임 동시 관리</p>
            </div>
          </div>
        }
      />

      <div className="feature-grid">
        <PageSection
          label="Visitor Flow"
          title="처음 방문한 사람도 바로 다음 행동으로 이어질 수 있게"
          description="공개 홈은 모든 정보를 한 화면에 몰아넣기보다, 서비스 이해와 모임 찾기라는 두 축을 짧고 분명하게 안내하는 관문 역할에 집중합니다."
        >
          <div className="bullet-stack">
            <div className="bullet-card">
              <strong>1. 서비스 목적 이해</strong>
              <p>AA가 어떤 도움을 주는지와 공개 사이트의 용도를 먼저 전달합니다.</p>
            </div>
            <div className="bullet-card">
              <strong>2. 모임 찾기로 이동</strong>
              <p>방문자는 별도 운영 정보에 방해받지 않고 바로 지역별 모임 탐색으로 이동합니다.</p>
            </div>
            <div className="bullet-card">
              <strong>3. 연락 가능한 지점 확인</strong>
              <p>모임 상세에서 공개 연락처를 보고 실제 연락 행동으로 이어질 수 있게 합니다.</p>
            </div>
          </div>
        </PageSection>

        <PageSection
          label="Admin Flow"
          title="운영 정보는 Group 작업공간에서 이어서 관리"
          description="운영자는 District를 별도로 관리하고, 실질 데이터 입력은 Group 작업공간에서 이어서 처리합니다."
        >
          <div className="bullet-stack">
            <div className="bullet-card">
              <strong>District는 독립 관리</strong>
              <p>조직 기준 단위는 지금 단순해 보여도 이후 확장에 대비해 별도 화면으로 유지합니다.</p>
            </div>
            <div className="bullet-card">
              <strong>Group이 관리의 중심</strong>
              <p>Group 편집 화면에서 연락처와 모임을 함께 다루어 실제 운영 흐름을 맞춥니다.</p>
            </div>
            <div className="bullet-card">
              <strong>미래 확장 준비</strong>
              <p>이 구조는 장기적으로 그룹 GSR가 자기 그룹 정보를 직접 수정하는 흐름으로 확장하기 쉽습니다.</p>
            </div>
          </div>
        </PageSection>
      </div>
    </>
  )
}
