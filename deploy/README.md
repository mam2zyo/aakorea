# Deployment Guide

이 디렉토리는 AAKorea 프로젝트의 새로운 배포 설정을 포함하고 있습니다.

## Directory Structure

- `nginx/`: Nginx 서버 설정 파일
  - `aakorea.conf`: 통합 리버스 프록시 및 정적 파일 서빙 설정

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

## Nginx Application

해당 설정을 실제 서버에 적용하려면 다음 단계를 따르세요:

1. 설정 파일 링크 생성:
   ```bash
   sudo ln -s /home/mam2z/project/aakorea/deploy/nginx/aakorea.conf /etc/nginx/sites-enabled/
   ```
2. Nginx 설정 테스트:
   ```bash
   sudo nginx -t
   ```
3. Nginx 재시작:
   ```bash
   sudo systemctl restart nginx
   ```
