<!-- docs/runbooks/local/nginx-local-setup.md -->

# Local (WSL) Nginx 설정 가이드

이 문서는 WSL(Windows Subsystem for Linux) 환경에서 Nginx를 사용하여 로컬 개발 환경을 실제 운영 환경과 유사하게 구축하는 방법을 설명합니다.

---

## 1. 설치 (WSL Ubuntu 기준)

```bash
sudo apt update
sudo apt install nginx -y
```

---

## 2. 도메인 매핑 (Host File)

로컬에서 `aakorea.local` 같은 도메인을 사용하려면 Windows와 WSL 양쪽에 호스트 설정을 추가해야 합니다.

### Windows (관리자 권한으로 실행)
`C:\Windows\System32\drivers\etc\hosts`:
```text
127.0.0.1 aakorea.local
127.0.0.1 api.aakorea.local
```

### WSL
`/etc/hosts`:
```text
127.0.0.1 aakorea.local
127.0.0.1 api.aakorea.local
```

---

## 3. Nginx 설정 (Reverse Proxy)

`/etc/nginx/sites-available/aakorea-local`:
```nginx
server {
    listen 80;
    server_name aakorea.local;

    # 프론트엔드 (Vite Dev Server 또는 Static dist)
    location / {
        # 개발 시: Vite Server
        proxy_pass http://localhost:5173;
        
        # 빌드 테스트 시: static root 사용 가능
        # root /home/mam2z/apps/aakorea-main/frontend/aakorea-main/dist;
        # index index.html;
        # try_files $uri $uri/ /index.html;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 백엔드 API 프록시
    location /api/ {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/aakorea-local /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 4. 로컬 정적 서빙 및 스태이징 테스트

Vite 개발 서버 대신 빌드된 결과물(`dist/`)을 Nginx가 직접 서빙하도록 설정하여 운영 환경과 유사한 테스트를 수행할 수 있습니다.

### 4.1 프론트엔드 빌드
```bash
cd frontend/aakorea-main
npm run build
```

### 4.2 Nginx 설정 변경
`aakorea-local` 파일의 `location /` 블럭을 아래와 같이 수정합니다.

```nginx
location / {
    root /home/mam2z/apps/aakorea-main/frontend/aakorea-main/dist;
    index index.html;
    try_files $uri $uri/ /index.html;

    location /admin {
        try_files $uri $uri/ /admin.html;
    }
}
```

### 4.3 백엔드 실행 (nginx 프로필)
Nginx 프록시를 사용할 때는 백엔드를 `nginx` 프로필로 실행하는 것이 좋습니다.

```bash
# 환경 변수 준비
cp deploy/env/nginx.env.example ~/aakorea-nginx.env
nano ~/aakorea-nginx.env  # 실제 DB 정보 입력

# 실행
cd backend/aakorea-main
set -a
source ~/aakorea-nginx.env
set +a
SPRING_PROFILES_ACTIVE=nginx ./gradlew bootRun
```

---

## 5. HTTPS (선택 사항)

로컬에서 HTTPS를 테스트하려면 `mkcert`를 사용하는 것이 좋습니다.

1. `mkcert` 설치 및 인증서 생성.
2. Nginx 설정에 `ssl_certificate` 및 `ssl_certificate_key` 추가.

---

## 6. 주의사항
- **경로 설정**: `root` 경로의 `/home/mam2z/` 부분은 실제 프로젝트 위치에 맞게 수정해야 합니다.
- WSL2에서 `localhost` 포트 포워딩이 제대로 동작하지 않을 경우 Windows CMD에서 `wsl --shutdown` 후 재시작해 보세요.
- 백엔드의 CORS 설정에 `http://aakorea.local`이 포함되어야 합니다.
