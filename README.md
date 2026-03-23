# A.A. KOREA 웹앱 리뉴얼 프로젝트

> "고통받는 알코올 중독자가 오늘 당장 참석할 수 있는 모임을 가장 쉽고 빠르게 찾도록 돕는다."

본 프로젝트는 기존 레거시 시스템(www.aakorea.org)의 파편화된 정보 구조를 개선하고, 최신 웹 기술 스택을 활용하여 **사용자 중심(User-Centric)의 직관적인 모임 검색 서비스**를 재구축하는 프로젝트입니다.

## Tech Stack

- **Backend:** Java 21, Spring Boot 3.5.x, Spring Data JPA
- **Database:** PostgreSQL 17
- **Frontend:** React, Tailwind CSS, Vite
- **Architecture:** 모듈러 모놀리스 (Modular Monolith) -> 향후 MSA 분리 예정

## 아키텍처 및 확장 전략

초기 개발 및 유지보수의 효율성을 위해 **모듈러 모놀리스(Modular Monolith)** 아키텍처를 채택했습니다.
단일 Spring Boot 애플리케이션 내에서 도메인(패키지)을 철저히 분리하여 개발하며, 향후 서비스 확장 시 서브도메인 단위로 쉽게 분리(MSA)할 수 있도록 설계했습니다.

- `basic`: 기존 웹사이트 내용 승계, 전국 모임 및 그룹 관리
- `store`: 도서 구매 시스템 (향후 `store.aakorea.org`로 분리 예정)
- `heart`: 월간지 구독 시스템 (향후 `heart.aakorea.org`로 분리 예정)

## 핵심 도메인 설계 (Entity & ERD)

A.A. 조직의 특수성과 한국형 지리 정보 검색의 편의성을 동시에 만족하기 위해 데이터를 세분화하여 설계했습니다.

### 1. 그룹(Group)과 모임(Meeting)의 분리 (1:N)

- 하나의 `Group`이 요일/시간별로 여러 개의 `Meeting`을 가질 수 있도록 분리하여, "요일별 검색" 시 중복 데이터가 발생하는 문제를 원천 차단했습니다.
- `MeetingType`을 Enum(`OPEN`, `CLOSED`, `MIX`)으로 세분화

### 2. A.A. 조직망(District)과 지리적 행정구역(Province)의 분리

- **초심자(Newcomers) 배려:** A.A. 내부 용어인 '지역연합(District, 예: 수도권 서부연합)' 대신, 대중적인 행정구역 Enum(`Province`, 예: 경기도, 서울특별시)을 `Group` 엔티티에 추가했습니다.
- 이를 통해 초심자는 자신이 거주하는 "시/도" 단위로 직관적인 검색이 가능하며, 기존 멤버들은 "지역연합" 단위로 행정 정보를 관리할 수 있는 투트랙(Two-track) 구조를 완성했습니다.

### 3. 공식 연락처와 개인 정보(GSR)의 분리

- 주기적으로 교체되는 봉사자(G.S.R)의 개인정보(Phone, Email)와, 변하지 않는 그룹의 공식 수신 주소를 분리했습니다.
- `GSR` 엔티티는 향후 각 그룹의 모임 정보를 직접 수정할 수 있는 **관리자 계정(User)**으로 확장될 예정입니다.

## 핵심 비즈니스 로직 (Core Features)

### 사용자 중심의 모임 검색 로직 (KISS 원칙)

사용자가 사이트에 접속했을 때 가장 필요한 정보는 **"오늘 당장 갈 수 있는 내 주변의 모임"**입니다.
복잡한 시/군/구 필터링으로 Depth를 늘리는 대신, 서버 단에서 **"특정 시/도의 특정 요일 모임을 시간순으로 정렬"**하여 즉시 반환하도록 쿼리를 최적화했습니다.

```java
// MeetingRepository.java
List<Meeting> findByGroup_ProvinceAndDayOfWeekOrderByStartTimeAsc(Province province, DayOfWeek dayOfWeek);
```

이를 통해 프론트엔드에서는 복잡한 가공 없이 직관적인 타임라인 형태의 모임 리스트를 렌더링할 수 있습니다.

## 새롭게 개편된 정보 구조 (IA)

기존의 관리자 편의적 메뉴를 사용자 목적에 따라 6개의 대메뉴로 통폐합했습니다.

1. **처음 오신 분들께 (Newcomers):** 자가진단 및 첫 모임 가이드
2. **A.A. 소개 (About A.A.):** 목적, 익명성, 전문가/가족을 위한 안내
3. **모임 찾기 (Find a Meeting) :** 오프라인/온라인 모임 통합 검색 (핵심 기능)
4. **소식 및 행사 (News & Events):** 통합 게시판 (공지, 라운드업)
5. **도서 및 자료실 (Literature):** 주요 도서 및 리플릿 제공
6. **멤버 공간 및 서비스 (For Members):** 봉사자 및 지역연합 관리 메뉴
