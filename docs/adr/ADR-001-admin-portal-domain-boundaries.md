# ADR-001: 관리자 포털과 도메인 소유권 분리

상태: Accepted  
작성일: 2026-03-26

## 맥락

관리자 화면은 모두 운영자가 사용한다는 이유로 `general.admin(service)` 아래에 몰릴 위험이 있었다.
하지만 현재 도메인 명세에서는 앱 도메인을 `user`, `general`, `store`, `heart`로 나누고, 관리자 표면은 `general.admin(service)`, `store.admin`, `heart.admin`이 각각 소유한다.

이 구분이 흐려지면 다음 문제가 생긴다.

- `general.admin(service)`가 운영자 화면을 다 모아둔 잡동사니 도메인이 된다.
- 권한 분리가 느슨해진다.
- 향후 `store.aakorea.org`, `heart.aakorea.org` 같은 분리 가능성과 어긋난다.

## 결정

`admin`은 접근 표면이고, 앱 도메인 소유권은 `general.admin(service)`, `store.admin`, `heart.admin`에 그대로 둔다.

권장 구조:

- `/admin/service/*`
- `/admin/store/*`
- `/admin/heart/*`

즉 하나의 관리자 포털 안에 여러 앱 도메인 운영 영역이 존재할 수 있지만, 주문과 구독 운영은 `general.admin(service)`의 하위 기능이 아니다.

## 결과

좋은 점:

- 앱 도메인 소유권과 UI 소유권이 일치한다.
- 권한 정책을 앱 도메인별로 분리하기 쉽다.
- 앱 도메인별 테스트와 배포 분리 가능성을 유지한다.

감수할 점:

- 운영 포털의 공통 UI와 도메인별 책임을 함께 설계해야 한다.
- 관리자 홈과 도메인 운영 영역의 구분을 명확히 해야 한다.

## 후속

- `AUTH_ACCESS_MODEL.md`는 이 결정을 기준으로 접근 제어를 정의한다.
- `API_BOUNDARIES.md`는 `/api/admin/service/*`, `/api/admin/store/*`, `/api/admin/heart/*` 경계를 따른다.
