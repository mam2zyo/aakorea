<!-- docs/runbooks/production/aws-lightsail.md -->

# AWS Lightsail 운영 서버 설정 가이드

이 문서는 AWS Lightsail 인스턴스를 사용하여 백엔드 API 서버와 데이터베이스를 구축하고 운영하는 절차를 설명합니다.

---

## 1. 인스턴스 생성 및 네트워크 설정

### 인스턴스 생성
- **Platform**: `Linux/Unix`
- **OS**: `Ubuntu 22.04 LTS` 또는 최신 버전
- **Instance Plan**: 프로젝트 규모에 맞춰 선택 (최소 2GB RAM 권장)

### 고정 IP(Static IP) 할당
- `Networking` 탭에서 `Create static IP`를 선택하여 인스턴스에 할당합니다. 서버 재시작 시에도 IP가 변하지 않도록 합니다.

### 방화벽(Firewall) 설정
Lightsail 관리 콘솔의 `Networking` 탭에서 아래 포트를 개방합니다.
- `SSH (22)`
- `HTTP (80)`
- `HTTPS (443)`
- (선택 사항) `Custom (8081)`: 직접 API 접근이 필요한 경우 (Nginx 사용 시 불필요)

---

## 2. 서버 환경 구축

### 패키지 업데이트
```bash
sudo apt update && sudo apt upgrade -y
```

### JDK 21 설치
```bash
sudo apt install openjdk-21-jdk -y
java -version
```

### PostgreSQL 설치 및 설정
```bash
sudo apt install postgresql postgresql-contrib -y

# 데이터베이스 및 사용자 생성
sudo -u postgres psql
# > CREATE DATABASE aakorea_main;
# > CREATE USER aakorea_admin WITH PASSWORD '여기에_비밀번호_입력';
# > GRANT ALL PRIVILEGES ON DATABASE aakorea_main TO aakorea_admin;
# > \q
```

---

## 3. 애플리케이션 배포

### 프로젝트 클론 및 빌드
```bash
git clone https://github.com/your-repo/aakorea-main.git
cd aakorea-main/backend/aakorea-main
./gradlew build -x test
```

### 시스템 서비스 등록 (Systemd)
애플리케이션이 백그라운드에서 실행되고 서버 재부팅 시 자동 시작되도록 설정합니다.

`sudo nano /etc/systemd/system/aakorea.service`:
```ini
[Unit]
Description=AAKorea Main Backend Service
After=network.target

[Service]
User=ubuntu
Group=ubuntu
WorkingDirectory=/home/ubuntu/aakorea-main/backend/aakorea-main
ExecStart=/usr/bin/java -jar build/libs/aakorea-main-0.0.1-SNAPSHOT.jar \
  --spring.profiles.active=prod \
  --AAKOREA_DB_URL=jdbc:postgresql://localhost:5432/aakorea_main \
  --AAKOREA_DB_USERNAME=aakorea_admin \
  --AAKOREA_DB_PASSWORD=여기에_비밀번호_입력
SuccessExitStatus=143
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable aakorea
sudo systemctl start aakorea
```

---

## 4. Nginx 및 SSL(HTTPS) 설정

### Nginx 설치 및 리버스 프록시 설정
```bash
sudo apt install nginx -y
```

`/etc/nginx/sites-available/aakorea`:
```nginx
server {
    listen 80;
    server_name api.aakorea.org;

    location / {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/aakorea /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Certbot을 이용한 SSL 인증서 발급
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.aakorea.org
```

---

## 5. 관리 및 모니터링

### 로그 확인
```bash
journalctl -u aakorea -f
```

### DB 백업 (Cron 추천)
```bash
pg_dump aakorea_main > backup_$(date +%Y%m%d).sql
```

---

## 6. 주의사항
- **비밀번호 관리**: 모든 비밀번호와 민감한 환경 변수는 별도의 `.env` 파일이나 시스템 환경 변수로 관리하고, Git에 노출되지 않도록 주의합니다.
- **백업**: Lightsail의 `Snapshots` 기능을 사용하여 정기적으로 서버 전체 이미지를 백업하는 것을 권장합니다.
