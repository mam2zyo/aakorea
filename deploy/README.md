# Deployment Guide (OCI ARM Instance)

이 디렉토리는 AAKorea 프로젝트를 OCI ARM 인스턴스(`ubuntu@134.185.125.64`)에 배포하기 위한 설정 및 스크립트를 포함하고 있습니다.

## Directory Structure

- `nginx/`: Nginx 서버 설정 파일
  - `aakorea-oci.conf`: OCI 배포용 통합 리버스 프록시, API 정적 파일 직접 서빙 및 관리자 화면 SPA 서빙 설정
  - `aakorea.conf`: 로컬 테스트용 Nginx 설정
- `scripts/`: 배포 및 관리용 쉘 스크립트
  - `deploy-to-oci.sh`: 로컬 빌드 후 OCI 서버 전송 및 무중단 재시작 통합 배포 스크립트
  - `restart-backend.sh`: OCI 서버 백엔드(Spring Boot) 재시작/관리 스크립트
  - `restart-web.sh`: OCI 서버 웹(SvelteKit) 재시작/관리 스크립트

## Service Components

1. **User Web (SvelteKit)**
   - 배포 방식: `adapter-node` 기반 SSR 서버
   - 실행 포트: `3000` (기본값)
   - SEO 및 초기 로딩 성능 최적화 적용

2. **Admin Office (React)**
   - 배포 방식: 정적 파일 빌드 (`npm run build`)
   - 접속 경로: `/office`
   - 주의사항: `office/vite.config.ts`의 `base` 설정이 `'/office/'`로 되어 있어야 함

3. **Backend API (Spring Boot)**
   - 실행 포트: `8081`
   - API 경로: `/api/*`
   - 프로필: `oci` (`application-oci.yml` 적용)

## Deployment Execution (Local to OCI)

로컬에서 아래 스크립트를 실행하여 OCI 서버로 배포를 수행합니다. (SSH Key 필요)

```bash
# 기본 OCI 타겟 및 키 파일(ssh-key-2026-05-28.key)을 사용하여 배포 실행
./deploy/scripts/deploy-to-oci.sh

# 특정 타겟 및 키 지정 시
./deploy/scripts/deploy-to-oci.sh ubuntu@134.185.125.64 /path/to/ssh-key.key
```

## OCI Nginx Application

전송된 Nginx 설정을 OCI 서버에 적용하려면 서버에 접속 후 다음 단계를 따르세요:

1. 설정 파일 링크 생성:
   ```bash
   sudo ln -sf /home/ubuntu/aakorea/config/aakorea-oci.conf /etc/nginx/sites-enabled/
   ```
2. Nginx 설정 테스트:
   ```bash
   sudo nginx -t
   ```
3. Nginx 재로드:
   ```bash
   sudo systemctl reload nginx
   ```
