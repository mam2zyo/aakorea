<!-- docs/runbooks/production/nginx-production-setup.md -->

# Production Nginx 설정 가이드 (AWS Lightsail)

이 문서는 AWS Lightsail 운영 환경에서 Nginx를 고도화하여 보안과 성능을 최적화하는 방법을 설명합니다.

---

## 1. 기본 설정 (Reverse Proxy)

백엔드 API 서버(Spring Boot)를 외부로 노출하기 위한 기본 프록시 설정입니다.

`/etc/nginx/sites-available/aakorea-prod`:
```nginx
server {
    listen 80;
    server_name api.aakorea.org;

    # 보안 헤더 추가
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    location / {
        proxy_pass http://localhost:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # 실제 IP 전달
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 정적 파일 서빙이 필요한 경우 (Vercel 미사용 시)
    # location /static/ {
    #     alias /home/ubuntu/aakorea-main/frontend/aakorea-main/dist/;
    #     expires 30d;
    #     add_header Cache-Control "public, no-transform";
    # }
}
```

---

## 2. SSL/TLS 설정 (Certbot)

운영 환경에서는 반드시 HTTPS를 적용해야 합니다.

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.aakorea.org
```

Certbot이 자동으로 설정을 업데이트하며, 아래와 같은 보안 설정이 추가됩니다.
- HTTP to HTTPS 리다이렉트
- TLS v1.2, v1.3 활성화
- 선호 암호화 방식(Ciphers) 설정

---

## 3. 성능 최적화

### Gzip 압축
응답 속도를 높이기 위해 Gzip 압축을 활성화합니다.
`/etc/nginx/nginx.conf` (`http` 블록 내부):

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### 타임아웃 설정
```nginx
client_body_timeout 12;
client_header_timeout 12;
keepalive_timeout 15;
send_timeout 10;
```

---

## 4. 모니터링 및 로그 관리

### 실시간 로그 확인
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 로그 순환 (Logrotate)
이미 기본적으로 설정되어 있으나, 용량 관리가 필요한 경우 `/etc/logrotate.d/nginx`를 확인합니다.

---

## 5. 점검 체크리스트
- [ ] `nginx -t`로 설정 파일 문법 확인
- [ ] SSL 인증서 만료일 확인 (`certbot certificates`)
- [ ] 외부 브라우저에서 `https://api.aakorea.org` 정상 접속 확인
- [ ] API 호출 시 `X-Forwarded-For` 헤더가 백엔드에 전달되는지 확인
