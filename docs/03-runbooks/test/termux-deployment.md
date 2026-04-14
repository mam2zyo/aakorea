# Termux Test Server Deployment

이 문서는 Termux 환경에서의 테스트 서버 배포, 운영 및 콘텐츠 관리 체계를 가이드한다.

---

## 1. 서버 정보 (Termux)

- **사용자**: `u0_a312`
- **홈 디렉토리**: `/data/data/com.termux/files/home`
- **로컬 IP**: `172.30.1.81`
- **SSH 포트**: `8022` (기본값)

## 2. 디렉토리 구조 (3-Tier Storage)

서비스 데이터와 애플리케이션 코드를 분리하여 관리한다.

### 2.1 애플리케이션 (App)
- `~/aakorea/backend/`: 백엔드 실행 파일 및 PID 파일
- `~/aakorea/frontend/`: 프론트엔드 정적 빌드 파일 (`dist/*`)

### 2.2 고정 데이터 (Content Data)
- **`~/aakorea/contents/`**: 어드민에서 업로드한 **안내 페이지 HTML** 파일들이 저장되는 곳. (사이트의 뼈대)

### 2.3 휘발성/미디어 데이터 (Upload Assets)
- **`~/aakorea/uploads/`**: 이미지, 일반 첨부파일 등 수시로 업로드/삭제되는 미디어 자산 저장소.

### 2.4 시스템 (System)
- `~/aakorea/log/`: 애플리케이션 로그 (`application.log`)
- `~/aakorea/scripts/`: 서버 관리용 스크립트 (`restart-backend.sh`)
- `~/aakorea/config/`: 설정 파일 및 환경 변수 (`aakorea-termux.env`)

--- 

## 3. 배포 및 관리

### 3.1 배포 실행
로컬 개발 환경에서 다음 스크립트를 실행한다. 신규 디렉토리 생성 및 환경 변수가 자동으로 설정된다.

```bash
./deploy/scripts/deploy-to-termux.sh termux@172.30.1.81
```

### 4.2 서버 관리 스크립트
서버 내부에서 다음 명령어로 서비스를 관리한다.

```bash
# 상태 확인
~/aakorea/scripts/restart-backend.sh status

# 재시작 (환경 변수 반영)
~/aakorea/scripts/restart-backend.sh restart
```

---

## 4. 주요 설정 (환경 변수)

`~/aakorea/config/aakorea-termux.env` 또는 실행 시 주입되는 변수:
- `AAKOREA_CONTENT_ROOT`: 콘텐츠 저장 경로 (기본: `~/aakorea/contents`)
- `AAKOREA_STORAGE_ROOT`: 업로드 파일 경로 (기본: `~/aakorea/uploads`)
- `AAKOREA_DB_URL`: PostgreSQL 접속 정보
