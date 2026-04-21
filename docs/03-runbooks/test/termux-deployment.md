# Termux Test Server Deployment

이 문서는 Termux 환경에서의 테스트 서버 배포, 운영 및 콘텐츠 관리 체계를 가이드한다.

---

## 1. 서버 정보 (Termux)

- **사용자**: `u0_a312`
- **홈 디렉토리**: `/data/data/com.termux/files/home`
- **로컬 IP**: `192.168.50.211`
- **네트워크**: 공유기 DHCP 예약으로 `192.168.50.211` 고정
- **기본 게이트웨이**: `192.168.50.1`
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
로컬 개발 환경에서 다음 스크립트를 실행한다. 현재 배포 스크립트는 기본값으로 `u0_a312@192.168.50.211:8022` 를 사용하므로, 같은 테스트 서버를 계속 쓴다면 인자 없이 실행해도 된다.

```bash
./deploy/scripts/deploy-to-termux.sh
```

필요하면 아래처럼 명시적으로 덮어쓸 수 있다.

```bash
TERMUX_TARGET=u0_a312@192.168.50.211 TERMUX_SSH_PORT=8022 ./deploy/scripts/deploy-to-termux.sh
./deploy/scripts/deploy-to-termux.sh ssh.maumtalk.win --skip-build
```

### 3.2 서버 관리 스크립트
서버 내부에서 다음 명령어로 서비스를 관리한다.

```bash
# 상태 확인
~/aakorea/scripts/restart-backend.sh status

# 재시작 (환경 변수 반영)
~/aakorea/scripts/restart-backend.sh restart
```

### 3.3 Wi-Fi keepalive 테스트 절차

Termux 기반 테스트 서버에서 Wi-Fi 유휴 상태로 인한 응답 지연이 의심될 때는 `restart-backend.sh` 의 선택형 keepalive 기능을 사용해 공유기와 주기적으로 통신하도록 설정할 수 있다.

#### 1) 실제 운영 환경 파일 수정

예시 파일이 아니라 실제 운영 파일인 `~/aakorea/config/aakorea-termux.env` 를 수정한다.

```bash
nano ~/aakorea/config/aakorea-termux.env
```

아래 값을 추가하거나 수정한다.

```env
WIFI_KEEPALIVE_ENABLED=1
WIFI_KEEPALIVE_TARGET=192.168.50.1
WIFI_KEEPALIVE_INTERVAL=30
```

설명:
- `WIFI_KEEPALIVE_ENABLED=1`: keepalive 활성화
- `WIFI_KEEPALIVE_TARGET=192.168.50.1`: 현재 테스트 환경의 공유기 IP
- `WIFI_KEEPALIVE_INTERVAL=30`: 30초마다 `ping`

다른 네트워크에서 테스트할 때는 `WIFI_KEEPALIVE_TARGET=auto` 로 바꾸거나 해당 공유기 주소를 직접 넣는다.

#### 2) 백엔드 재배포 또는 재시작

스크립트를 수정한 뒤 테스트 서버에 배포한다.

```bash
cd /home/mam2z/apps/aakorea-main
./deploy/scripts/deploy-to-termux.sh --backend-only
```

이미 JAR 이 준비되어 있고 스크립트 반영만 빨리 확인하려면:

```bash
./deploy/scripts/deploy-to-termux.sh --backend-only --skip-build
```

원격 서버에서 직접 재시작만 해도 된다.

```bash
~/aakorea/scripts/restart-backend.sh restart
```

#### 3) 상태 확인

원격 접속 후 상태를 확인한다.

```bash
ssh -p 8022 u0_a312@192.168.50.211
~/aakorea/scripts/restart-backend.sh status
```

정상이면 아래 두 상태가 모두 보여야 한다.
- 백엔드 실행 중
- Wi-Fi keepalive 실행 중

#### 4) keepalive 프로세스 확인

```bash
cat ~/aakorea/backend/wifi-keepalive.pid
ps -ef | grep "ping -i 30 192.168.50.1" | grep -v grep
```

#### 5) 애플리케이션 로그 확인

```bash
tail -n 50 ~/aakorea/log/application.log
```

#### 6) 원복 방법

효과가 없거나 부작용이 있으면 환경 파일에서 아래처럼 바꾸고 다시 재시작한다.

```env
WIFI_KEEPALIVE_ENABLED=0
```

```bash
~/aakorea/scripts/restart-backend.sh restart
```

---

## 4. 주요 설정 (환경 변수)

`~/aakorea/config/aakorea-termux.env` 또는 실행 시 주입되는 변수:
- `AAKOREA_CONTENT_ROOT`: 콘텐츠 저장 경로 (기본: `~/aakorea/contents`)
- `AAKOREA_STORAGE_ROOT`: 업로드 파일 경로 (기본: `~/aakorea/uploads`)
- `AAKOREA_DB_URL`: PostgreSQL 접속 정보
- `WIFI_KEEPALIVE_ENABLED`: 공유기 keepalive 사용 여부
- `WIFI_KEEPALIVE_TARGET`: keepalive 대상 IP 또는 `auto`
- `WIFI_KEEPALIVE_INTERVAL`: ping 간격(초)
