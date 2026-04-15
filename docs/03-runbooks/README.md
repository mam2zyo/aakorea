<!-- docs/runbooks/README.md -->

# Runbooks

이 디렉터리는 AAKorea Main의 로컬 실행, 환경 변수, 배포, 재시작처럼
**실행 순서가 중요한 운영 절차 문서**를 모은다.

---

## 디렉토리 구조

운영 환경에 따라 문서를 분류하여 관리한다.

### 1. [Local](./local/)
로컬 개발 환경 구축 및 개발 가이드
- `local-development.md`: 개발 환경 셋업, DB 연결, Vite 실행 가이드
- `java-null-safety-guide.md`: Java 코드 품질 및 널 안정성 가이드
- `nginx-local-setup.md`: WSL/로컬 Nginx 리버스 프록시 및 정적 서빙(스태이징) 가이드

### 2. [Test](./test/)
테스트 서버 배포 및 네트워크 설정
- `termux-deployment.md`: Termux (안드로이드) 환경 테스트 서버 구축 및 Wi-Fi keepalive 테스트 가이드 (권장)
- `nginx-termux-deployment.md`: Termux Nginx 정적 서빙 및 API 프록시 상세 가이드
- `cloudflare-tunnel.md`: Cloudflare Tunnel을 이용한 외부 노출 설정 가이드

### 3. [Production](./production/)
운영 서버 관리 및 인프라 변경 절차
- `admin-subdomain-change.md`: 어드민 서브도메인 변경 및 Nginx/SSL 설정 절차
- `vercel-migration.md`: 프론트엔드 Vercel 마이그레이션 절차 및 설정
- `aws-lightsail.md`: AWS Lightsail 운영 서버 환경 구축 및 배포 가이드
- `nginx-production-setup.md`: 운영 환경 Nginx 최적화 및 보안 설정 가이드

---

## 운영 원칙

- 루트 `README.md`와 프론트 `README.md`는 빠른 시작만 유지한다
- 자세한 환경 변수와 운영 절차는 `runbooks/`를 단일 기준으로 삼는다
- import, backfill, theme publish 같은 절차 문서도 필요해지면 성격에 맞는 디렉터리에 추가한다
