<!-- docs/runbooks/README.md -->

# Runbooks

## 이 문서의 역할

이 디렉터리는 AAKorea Main의 로컬 실행, 환경 변수, 배포, 재시작처럼
**실행 순서가 중요한 운영 절차 문서**를 모은다.

---

## 이 문서에 포함하지 않는 내용

- 제품 범위와 사용자 흐름은 `docs/current/` 문서를 따른다
- 도메인 의미와 필드는 `docs/current/domain/` 문서를 따른다
- API 계약은 `docs/current/api/` 문서를 따른다

---

## 현재 runbook

1. `LOCAL_DEVELOPMENT.md`
2. `NGINX_TERMUX_DEPLOYMENT.md`

처음 실행 환경을 잡을 때는 `LOCAL_DEVELOPMENT.md`부터 읽고,
정적 서빙 또는 Termux 배포가 필요할 때 `NGINX_TERMUX_DEPLOYMENT.md`로 이어서 본다.

---

## 문서별 책임

- `LOCAL_DEVELOPMENT.md`
  로컬 PostgreSQL, 백엔드 `local` 프로필, Vite dev server, 프론트 env를 정리한다.

- `NGINX_TERMUX_DEPLOYMENT.md`
  Ubuntu `nginx` 정적 서빙, 백엔드 `nginx` 프로필, Termux 배포 스크립트와 재시작 절차를 정리한다.

---

## 운영 원칙

- 루트 `README.md`와 프론트 `README.md`는 빠른 시작만 유지한다
- 자세한 환경 변수와 운영 절차는 `runbooks/`를 단일 기준으로 삼는다
- import, backfill, theme publish 같은 절차 문서도 필요해지면 같은 디렉터리에 추가한다
