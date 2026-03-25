# A.A. KOREA 문서 허브

이 문서는 현재 저장소에서 어떤 문서를 언제 읽고, 어떤 문서를 업데이트해야 하는지 안내하는 문서 허브다.
문서가 늘어나도 루트 `README.md`가 과도하게 길어지지 않도록, 상세 문서 진입점은 이 파일에서 관리한다.

## 1. 권장 읽기 순서

1. 프로젝트 개요와 실행 방법은 `README.md`를 읽는다.
2. 제품 목표와 사용자 요구는 `REQUIREMENTS.md`를 읽는다.
3. 공통 아키텍처 원칙은 `DOMAIN_SPEC.md`를 읽는다.
4. 기능 구현 전에는 해당 도메인 상세 명세서를 읽는다.
5. 인증, 권한, API 경계 작업 전에는 `AUTH_ACCESS_MODEL.md`, `API_BOUNDARIES.md`를 함께 읽는다.
6. 우선순위와 릴리스 순서는 `ROADMAP.md`를 확인한다.
7. UI 구현 시에는 `AA_ORG_DESIGN_ANALYSIS.md`를 참고한다.
8. 구조적 결정의 이유는 `adr/` 아래 문서를 확인한다.

---

## 2. 현재 활성 문서

| 분류 | 문서 | 역할 | 업데이트 시점 |
| ---- | ---- | ---- | ------------- |
| 프로젝트 진입 | `README.md` | 프로젝트 개요, 실행 방법, 주요 문서 링크 | 실행 방법, 저장소 구성, 핵심 문서 구조가 바뀔 때 |
| 제품 요구 | `REQUIREMENTS.md` | 사용자 그룹, 요구사항, 시나리오, MVP 범위 | 사용자 요구나 우선순위가 바뀔 때 |
| 도메인 공통 | `DOMAIN_SPEC.md` | 공통 아키텍처 원칙, 데이터 소유권, 문서 인덱스 | 도메인 경계나 공통 규칙이 바뀔 때 |
| 도메인 상세 | `DOMAIN_SPEC_BASIC_SERVICE.md` | 공개 조회와 운영 쓰기 경계 | `basic`, `service` 책임이 바뀔 때 |
| 도메인 상세 | `DOMAIN_SPEC_MEMBER.md` | 인증, 계정 마스터, 주소록 계약 | `member` 책임이나 권한 모델이 바뀔 때 |
| 도메인 상세 | `DOMAIN_SPEC_STORE.md` | 주문, 재고, 배송 스냅샷 규칙 | `store` 거래 규칙이 바뀔 때 |
| 도메인 상세 | `DOMAIN_SPEC_HEART.md` | 구독, 발송, 만료, 아카이브 규칙 | `heart` 구독 규칙이 바뀔 때 |
| 구현 기준 | `AUTH_ACCESS_MODEL.md` | 인증, 계정 상태, 도메인별 권한 모델 | 로그인/권한 구현 전후 |
| 구현 기준 | `API_BOUNDARIES.md` | API 네임스페이스, DTO 경계, 프런트/백 경계 | 라우트와 DTO 구조를 구현하거나 바꿀 때 |
| 개발 순서 | `ROADMAP.md` | 단계별 우선순위와 릴리스 묶음 | 우선순위, 구현 상태, 기간 가정이 바뀔 때 |
| 디자인 참고 | `AA_ORG_DESIGN_ANALYSIS.md` | 퍼블릭 UI 톤과 패턴 참고 | 퍼블릭 디자인 방향이 크게 바뀔 때 |
| 결정 로그 | `adr/ADR-001-admin-portal-domain-boundaries.md` | 관리자 포털과 도메인 소유권 분리 결정 | 결정이 뒤집히거나 보완될 때 |
| 결정 로그 | `adr/ADR-002-frontend-domain-structure.md` | 프런트 도메인 구조 결정 | 구조가 다시 바뀔 때 |

---

## 3. 지금 빠져 있었던 문서 층위

현재 프로젝트에서 비어 있던 층위는 다음 세 가지였다.

- 문서 허브: 어떤 문서를 어디서부터 읽어야 하는지 알려주는 안내 문서
- 구현 기준 문서: 인증/권한, API 경계처럼 여러 도메인에 걸치는 횡단 관심사 문서
- 결정 로그: "왜 이렇게 결정했는가"를 남기는 ADR 성격 문서

이번 정리에서는 이 세 층위를 보강한다.

---

## 4. 권장 장기 구조

현재 저장소는 파일 수가 아직 많지 않으므로 물리적인 대이동보다 역할 정리가 우선이다.
다만 문서가 더 늘어나면 아래 구조로 묶는 것이 가장 관리하기 좋다.

```text
docs/
  README.md
  product/
    REQUIREMENTS.md
    ROADMAP.md
  domain/
    DOMAIN_SPEC.md
    DOMAIN_SPEC_BASIC_SERVICE.md
    DOMAIN_SPEC_MEMBER.md
    DOMAIN_SPEC_STORE.md
    DOMAIN_SPEC_HEART.md
  architecture/
    AUTH_ACCESS_MODEL.md
    API_BOUNDARIES.md
  design/
    AA_ORG_DESIGN_ANALYSIS.md
  adr/
    ADR-001-admin-portal-domain-boundaries.md
    ADR-002-frontend-domain-structure.md
```

지금 당장은 파일 이동 없이도 이 분류를 기준으로 문서 역할을 유지할 수 있다.

---

## 5. 문서 운영 원칙

- 요구사항이 바뀌면 `REQUIREMENTS.md`를 먼저 바꾼다.
- 도메인 책임이 바뀌면 `DOMAIN_SPEC.md`와 해당 도메인 상세 문서를 같이 바꾼다.
- 인증/권한이나 API 규칙이 바뀌면 구현 전에 기준 문서를 먼저 바꾼다.
- 일회성 검토 메모를 새로 만들기보다, 장기적으로 유지할 판단이면 `adr/`에 남긴다.
- 구현이 끝난 후 문서를 맞추는 방식보다, 구현 전에 문서 기준을 먼저 고정하는 방식을 기본으로 삼는다.
