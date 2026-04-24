# 컴포넌트 인벤토리 — 현재 사용 중인 전체 클래스명

> 이 문서는 `src/features/`, `src/layouts/` 에서 사용되는 모든 CSS 클래스명의 완전한 목록이다.
> 새 CSS 시스템 구현 시 이 목록을 체크리스트로 활용한다.

## 레이아웃 (shell.css 담당)

| 클래스 | 위치 | 설명 |
|--------|------|------|
| `office-theme` | `App.tsx` | 최상위 테마 래퍼 |
| `office-shell` | `MainLayout.tsx` | flex 컨테이너 (사이드바 + 메인) |
| `office-sidebar` | `MainLayout.tsx` | 왼쪽 사이드바 |
| `office-sidebar__brand` | `MainLayout.tsx` | 브랜드 영역 |
| `office-sidebar__nav` | `MainLayout.tsx` | 네비게이션 컨테이너 |
| `office-sidebar__utility` | `MainLayout.tsx` | 하단 유틸리티 (계정 설정 등) |
| `office-nav-group` | `MainLayout.tsx` | 네비게이션 항목 그룹 |
| `office-nav-divider` | `MainLayout.tsx` | 그룹 구분선 |
| `office-nav-list` | `MainLayout.tsx` | 네비게이션 링크 목록 |
| `office-nav-link` | `MainLayout.tsx` | 네비게이션 링크 |
| `office-nav-link--active` | `MainLayout.tsx` | 활성 링크 |
| `office-nav-link--disabled` | `MainLayout.tsx` | 비활성(준비 중) 링크 |
| `office-nav-link__label` | `MainLayout.tsx` | 링크 레이블 |
| `office-nav-link__status` | `MainLayout.tsx` | "준비 중" 뱃지 |
| `office-main` | `MainLayout.tsx` | 메인 컨텐츠 영역 |
| `office-main__bar` | `MainLayout.tsx` | 상단 헤더 바 |
| `office-main__heading` | `MainLayout.tsx` | eyebrow + h1 |
| `office-main__actions` | `MainLayout.tsx` | 상단 우측 액션 (사용자명, 로그아웃) |
| `office-main__content` | `MainLayout.tsx` | 스크롤 영역 |
| `page-stack` | `MainLayout.tsx` | 페이지 컨텐츠 스택 컨테이너 |
| `brand-button` | `MainLayout.tsx` | 사이드바 브랜드 버튼 |
| `eyebrow` | `MainLayout.tsx` 외 | 소문자 대문자 레이블 |
| `office-surface` | `App.tsx` 외 | 전체화면 서피스 래퍼 |
| `office-flat-page` | 여러 페이지 | 평탄한 페이지 레이아웃 |
| `office-flat-page__workspace` | 여러 페이지 | 페이지 작업 영역 |

---

## 버튼 (surface.css 담당)

| 클래스 | 설명 |
|--------|------|
| `primary-button` | 주요 액션 버튼 (배경색 있음) |
| `primary-button--small` | 작은 primary 버튼 |
| `ghost-button` | 보조 버튼 (테두리만) |
| `ghost-button--small` | 작은 ghost 버튼 |
| `ghost-button--danger` | 삭제 등 위험 액션 버튼 |
| `button-row` | 버튼 그룹 (flex row, justify-end) |
| `button-row--compact` | 버튼 간격 좁게 |

---

## 폼 / 입력 (surface.css 담당)

| 클래스 | 설명 |
|--------|------|
| `office-input` | 기본 input |
| `field-grid` | 필드 그리드 레이아웃 |
| `field__label` | 입력 레이블 |
| `field__error` | 에러 메시지 |
| `field__description` | 필드 설명 |
| `office-form-note` | 폼 안내 문구 |
| `section-note` | 섹션 안내 문구 |
| `section-note--success` | 성공 상태 섹션 노트 |

---

## 테이블 (surface.css 담당)

| 클래스 | 설명 |
|--------|------|
| `office-table` | 테이블 컨테이너 |
| `office-table--group` | 그룹 목록 테이블 변형 |
| `office-table--content` | 컨텐츠 테이블 변형 |
| `office-table--audit-log` | 감사 로그 테이블 변형 |
| `office-table__header` | 테이블 헤더 행 |
| `office-table__heading` | 헤더 셀 레이블 |
| `office-table__row` | 일반 데이터 행 |
| `office-table__row--static` | 호버 없는 정적 행 |
| `office-table__cell` | 일반 셀 |
| `office-table__cell--index` | 번호 셀 |
| `office-table__cell--primary` | 주요 정보 셀 |
| `office-table__cell--action` | 단일 액션 셀 |
| `office-table__cell--actions` | 복수 액션 셀 |
| `office-table__action-cluster` | 액션 버튼 묶음 |

---

## 툴바 (surface.css 담당)

| 클래스 | 설명 |
|--------|------|
| `office-list-toolbar` | 목록 위 툴바 (검색 + 버튼) |
| `office-list-toolbar__cluster` | 툴바 내 클러스터 |
| `office-list-toolbar__cluster--start` | 왼쪽 클러스터 |
| `office-list-toolbar__cluster--end` | 오른쪽 클러스터 |
| `office-list-toolbar__search` | 검색 입력 컨테이너 |
| `office-list-toolbar__divider` | 수직 구분선 |
| `office-directory-toolbar__count` | 항목 수 레이블 |

---

## 패널 / 카드 (surface.css 담당)

| 클래스 | 설명 |
|--------|------|
| `panel` | 기본 패널 (border + bg) |
| `editor-card` | 에디터 내 카드 (패널 변형) |
| `section-header` | 섹션 제목 + 액션 헤더 |
| `detail-grid` | key-value 상세 그리드 |
| `entity-list` | 엔티티 목록 |
| `entity-item` | 개별 엔티티 항목 |
| `entity-item__body` | 엔티티 본문 |
| `entity-item__meta` | 엔티티 메타 정보 |
| `content-note` | 구분선 포함 노트 영역 |
| `office-ops-panel` | 운영 도구 패널 |
| `office-ops-panel__body` | 패널 본문 |
| `office-ops-panel__summary` | 패널 요약 |
| `office-ops-panel__result-item` | 결과 항목 |

---

## 오버레이 / 모달 (surface.css 담당)

| 클래스 | 설명 |
|--------|------|
| `office-overlay` | 전체 오버레이 배경 |
| `office-overlay--nested` | 중첩 오버레이 |
| `office-overlay__dialog` | 다이얼로그 컨테이너 |
| `office-overlay__dialog--submodal` | 더 넓은 서브모달 변형 |
| `office-overlay__header` | 다이얼로그 헤더 |
| `office-overlay__heading` | 헤더 제목 영역 |

---

## 유틸리티 (base.css 담당)

| 클래스 | 설명 |
|--------|------|
| `timestamp-stack` | 날짜/시간 2단 표시 |
| `timestamp-stack__date` | 날짜 행 |
| `timestamp-stack__time` | 시간 행 |
| `status-pill` | 상태 뱃지 |
| `status-pill--create` | 생성 상태 (초록) |
| `status-pill--update` | 수정 상태 (파랑) |
| `status-pill--delete` | 삭제 상태 (빨강) |

---

## 그룹 피처 전용 (group.css 담당)

### 그룹 모달

| 클래스 | 설명 |
|--------|------|
| `office-group-modal__header` | 모달 헤더 |
| `office-group-modal__header--submodal` | 서브모달 헤더 |
| `office-group-modal__body` | 모달 본문 스크롤 영역 |

### 그룹 생성 위저드

| 클래스 | 설명 |
|--------|------|
| `office-group-wizard` | 위저드 컨테이너 |
| `office-group-wizard__progress` | "2/3 단계" 등 진행 표시 |
| `office-group-wizard__form` | 위저드 폼 |
| `office-group-wizard__grid` | 2열 그리드 |
| `office-group-wizard__grid--intro` | 도입부 그리드 (비대칭) |
| `office-group-wizard__grid--meeting-meta` | 모임 메타 3열 그리드 |
| `office-group-wizard__field` | 필드 래퍼 |
| `office-group-wizard__field--wide` | 전체 너비 필드 |
| `office-group-wizard__field--compact` | 좁은 필드 |
| `office-group-wizard__section` | 위저드 섹션 (border-top 구분) |
| `office-group-wizard__section--mailing` | 우편 연락처 섹션 |
| `office-group-wizard__section--meetings` | 모임 섹션 |
| `office-group-wizard__section-head` | 섹션 헤더 (제목 + 설명) |
| `office-group-wizard__section-title` | 섹션 제목 |
| `office-group-wizard__postcode` | 우편번호 + 검색 버튼 레이아웃 |
| `office-group-wizard__address-row` | 주소 행 레이아웃 |
| `office-group-wizard__actions` | 이전/다음 버튼 행 |
| `office-group-wizard__actions--split` | 양쪽 정렬 액션 |
| `office-group-wizard__meeting-list` | 모임 목록 |
| `office-group-wizard__meeting-item` | 모임 항목 |
| `office-group-wizard__meeting-summary` | 모임 요약 정보 |
| `office-group-wizard__meeting-location` | 모임 장소명 |
| `office-group-wizard__meeting-address` | 모임 주소 |
| `office-group-wizard__meeting-contact` | 모임 연락처 |
| `office-group-wizard__meeting-actions` | 모임 수정/삭제 버튼 |
| `office-group-wizard__meeting-add` | 모임 추가 버튼 |
| `office-group-wizard__meeting-empty` | 모임 없을 때 빈 상태 |

### 그룹 편집 시트

| 클래스 | 설명 |
|--------|------|
| `office-group-edit-sheet` | 편집 시트 컨테이너 |
| `office-group-edit-sheet__header` | 시트 헤더 |
| `office-group-edit-sheet__title` | 그룹명 대제목 |
| `office-group-edit-sheet__header-actions` | 헤더 내 버튼들 |
| `office-group-edit-sheet__rows` | 행 목록 |
| `office-group-edit-sheet__rowline` | label + control 한 행 |
| `office-group-edit-sheet__rowlabel` | 행 레이블 |
| `office-group-edit-sheet__rowcontrol` | 행 입력 영역 |
| `office-group-edit-sheet__rowcontrol--compact` | 좁은 컨트롤 (max 220px) |
| `office-group-edit-sheet__rowcontrol--wide` | 전체 너비 컨트롤 |
| `office-group-edit-sheet__rowvalue` | 읽기 전용 값 표시 |
| `office-group-edit-sheet__section` | 카드 섹션 |
| `office-group-edit-sheet__section--meetings` | 모임 섹션 |
| `office-group-edit-sheet__section-head` | 섹션 헤더 |
| `office-group-edit-sheet__section-actions` | 섹션 액션 버튼 |
| `office-group-edit-sheet__meeting-list` | 모임 목록 |
| `office-group-edit-sheet__meeting-item` | 모임 항목 |
| `office-group-edit-sheet__meeting-summary` | 모임 요약 |
| `office-group-edit-sheet__meeting-meta-actions` | 모임 메타 액션 |
| `office-group-edit-sheet__status-toggle` | 활성/비활성 토글 영역 |
| `office-group-edit-sheet__status-label` | 토글 레이블 |
| `office-group-edit-sheet__switch-track` | 토글 스위치 트랙 |
| `office-group-edit-sheet__switch-thumb` | 토글 스위치 thumb |

### 주소 검색

| 클래스 | 설명 |
|--------|------|
| `address-search-dialog` | 주소 검색 다이얼로그 |
| `address-search-dialog__body` | 다이얼로그 본문 |
| `address-search-field__value` | 주소 입력 필드 |
| `address-search-field__value--disabled` | 읽기 전용 주소 필드 |
| `address-search-field__action` | 주소 검색 버튼 |

### 우편 연락처 카드

| 클래스 | 설명 |
|--------|------|
| `postal-contact-card` | 우편 연락처 카드 컨테이너 |
| `postal-contact-card__grid` | 카드 내 그리드 |
| `postal-contact-card__meta` | 주소/우편번호 메타 행 |

---

## 계정 / 테마 설정

| 클래스 | 설명 |
|--------|------|
| `theme-choice-list` | 테마 선택 버튼 그리드 |
| `theme-choice-meta` | 테마 설명 메타 |

---

## 감사 로그

| 클래스 | 설명 |
|--------|------|
| `audit-detail-content` | 감사 로그 상세 내용 |

---

## 총계

| 카테고리 | 클래스 수 |
|---------|----------|
| 레이아웃 (shell) | 25 |
| 버튼 | 8 |
| 폼/입력 | 8 |
| 테이블 | 12 |
| 툴바 | 7 |
| 패널/카드 | 12 |
| 오버레이/모달 | 7 |
| 유틸리티 | 8 |
| 그룹 피처 | ~55 |
| 계정/테마 | 2 |
| 감사 | 1 |
| **합계** | **~145** |
