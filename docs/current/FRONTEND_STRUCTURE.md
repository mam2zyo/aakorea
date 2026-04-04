<!-- docs/current/FRONTEND_STRUCTURE.md -->

# FRONTEND_STRUCTURE

## 이 문서의 역할

이 문서는 AAKorea Main 프론트엔드의 **현재 구현 구조**를 정리한다.

이 문서가 답하는 질문:

- 공개 화면은 어떤 흐름으로 동작하는가?
- 관리자 화면은 어떤 구성으로 바뀌었는가?
- 최근 논의가 실제 프론트 구조에 어떻게 반영되었는가?

---

## 현재 공개 구조

### 핵심 라우트

- `/`
- `/content-pages/:key`
- `/notices`
- `/notices/:id`
- `/meetings`

### 모임 찾기 흐름

현재 공개 모임 상세는 별도 페이지가 아니라 **`/meetings` 안의 모달 흐름**으로 구현되어 있다.

사용 방식:

- `/meetings?province=seoul`
- `/meetings?province=seoul&groupId=20&meetingId=100`

즉,

- `province`, `dayOfWeek`는 검색 조건
- `groupId`, `meetingId`는 상세 모달 상태

### 공개 상세 모달 구조

모임 검색 결과를 클릭하면 같은 페이지 위에 모달이 열린다.

현재 모달 정보 구조:

1. 그룹명
2. 지역연합
3. 모임 리스트
4. 선택된 모임의 주소 / 장소명
5. 지도 자리(mock 또는 지도 영역)
6. 연락처 / 전화 걸기

핵심은 **그룹 문맥 안에서, 선택된 모임에 따라 장소가 바뀌는 구조**다.

---

## 현재 관리자 구조

### 핵심 라우트

- `/admin/login`
- `/admin/overview`
- `/admin/account`
- `/admin/districts`
- `/admin/groups`
- `/admin/groups/:id`
- `/admin/content-pages`
- `/admin/notices`

### 관리자 셸

관리자 사이드바 기준 표기는 `그룹 관리`로 통일했다.

향후 확장 슬롯:

- 온라인 모임 관리
- 제12단계 운동 관리

둘 다 현재는 placeholder다.

---

## 관리자 그룹 화면

최근 변경으로 그룹 관리는 **목록 중심 + 대형 모달** 구조로 정리되었다.

### 목록 화면

메인 진입점은 `/admin/groups`다.

현재 목록 컬럼 순서:

1. 번호
2. 그룹
3. 지역연합
4. 관리

각 행 액션:

- `수정`
- `삭제`

그룹 삭제는 목록에서 수행하며, 삭제 시 연결된 연락처와 모임도 함께 제거된다.

### 그룹 생성

그룹 생성은 2단계 큰 모달이다.

#### 1단계

- 그룹 이름
- 지역연합
- 연락처
- 이메일(mock, 비활성)
- 우편수신 정보(mock, 접힘/비활성)

#### 2단계

- 요일
- 시작 시간
- 모임 유형
- 장소명
- 지역
- 주소

현재 새 모임 생성 기본값은 `active=true`이며, 생성 단계에서는 상태 토글을 노출하지 않는다.

### 그룹 수정

그룹 수정은 문서형 카드 모달로 바뀌었다.

메인 모달은 읽기 중심이다.

섹션:

- 기본 정보
- 연락처
- 모임 정보

각 섹션은 카드처럼 구분되며, 메인 모달 안에서는 요약만 보여 준다.

#### 기본 정보 / 연락처

- 섹션 헤더의 `수정` 버튼으로 서브 모달을 연다
- 메인 화면에서는 입력 폼이 아니라 문서처럼 보이는 읽기 정보만 보여 준다

#### 모임 정보

- 메인 화면에서는 각 모임을 `요일 + 시간 + 장소명`만 보여 준다
- 각 모임 옆에 `수정`, `삭제` 버튼이 있다
- `새 모임 추가`는 별도 서브 모달로 열린다
- 실제 필드 수정은 서브 모달에서만 수행한다

#### 모임 수정 서브 모달

필드 순서:

1. 요일 / 시작 시간 / 모임 유형
2. 장소명 / 지역
3. 주소
4. 모임 상태 토글

모임 상태는 체크박스가 아니라 토글 버튼으로 표현되며,
오른쪽 텍스트로 `진행중 / 잠정 중단`을 표시한다.

---

## 현재 프론트 구조 판단

현재 프론트는 예전의 “작업공간” 개념보다 아래 방향에 더 가깝다.

- 공개: 목록 + 같은 페이지 모달
- 관리자: 목록 + 읽기 중심 편집 모달 + 서브 모달

이 구조의 장점:

- 사용자가 항상 원래 목록 문맥을 잃지 않는다
- 메인 편집 화면이 과한 폼처럼 보이지 않는다
- 수정 범위가 섹션별로 분리돼 직관성이 좋아진다

---

## 현재 남아 있는 프론트 메모

아래 항목은 구현 또는 논의가 끝났지만 아직 후속 작업이 남아 있다.

- 관리자 연락처의 `email`, `우편수신주소`는 아직 저장되지 않는다
- 주소 검색 API는 아직 붙지 않았다
- 지도는 현재 자리와 구조만 준비된 상태다
- `/meetings/{id}` 단건 상세 API는 남아 있지만, 현재 메인 공개 UI는 `/meetings` 모달 흐름을 사용한다

---

## 현재 주요 파일

- [frontend/aakorea-main/src/pages/admin/GroupListPage.jsx](/home/mam2z/apps/aakorea-main/frontend/aakorea-main/src/pages/admin/GroupListPage.jsx)
  그룹 목록, 생성 모달, 편집 모달, 서브 모달

- [frontend/aakorea-main/src/features/groups/public/MeetingSearchPage.jsx](/home/mam2z/apps/aakorea-main/frontend/aakorea-main/src/features/groups/public/MeetingSearchPage.jsx)
  공개 모임 검색과 상세 모달

- [frontend/aakorea-main/src/features/groups/admin/hooks/useGroupWorkspace.js](/home/mam2z/apps/aakorea-main/frontend/aakorea-main/src/features/groups/admin/hooks/useGroupWorkspace.js)
  그룹 편집용 상태/저장 로직

- [frontend/aakorea-main/src/app/routeDefinitions.js](/home/mam2z/apps/aakorea-main/frontend/aakorea-main/src/app/routeDefinitions.js)
  공개/운영 라우트 파싱

- [frontend/aakorea-main/src/layouts/AdminLayout.jsx](/home/mam2z/apps/aakorea-main/frontend/aakorea-main/src/layouts/AdminLayout.jsx)
  관리자 사이드바와 운영 셸
