<!-- docs/runbooks/test/cloudflare-tunnel.md -->

# Cloudflare Tunnel 설정 가이드

이 문서는 외부 공인 IP가 없거나 포트 포워딩이 불가능한 환경(예: Termux, 사내망)에서 Cloudflare Tunnel을 사용하여 로컬 서버를 안전하게 외부에 노출하는 방법을 설명합니다.

---

## 1. 사전 준비

- Cloudflare 계정
- Cloudflare에 연결된 도메인 (예: `aakorea.org`)
- Termux 또는 Linux 환경

---

## 2. Cloudflared 설치

### Termux (권장)
```bash
pkg update
pkg install cloudflared
```

### Ubuntu/Linux
```bash
# 최신 버전 다운로드 및 설치
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb
```

---

## 3. 터널 인증 및 생성

### SSH/Terminal 로그린
```bash
cloudflared tunnel login
```
- 터미널에 출력된 URL을 브라우저에 복사하여 접속한 뒤, 사용할 도메인을 선택하여 인증합니다.

### 터널 생성
```bash
cloudflared tunnel create <터널-이름>
# 예: cloudflared tunnel create termux-test
```
- 생성 후 발급된 **Tunnel ID**와 **Credentials JSON 파일 경로**를 기록해 둡니다.

---

## 4. 터널 설정 (config.yml)

`~/.cloudflared/config.yml` 파일을 생성하고 아래 내용을 작성합니다.

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /data/data/com.termux/files/home/.cloudflared/<TUNNEL_ID>.json

ingress:
  # 어드민 콘솔 (예: office-test.aakorea.org -> 8080)
  - hostname: office-test.aakorea.org
    service: http://localhost:8080
  
  # 프론트엔드 (예: test.aakorea.org -> 5173)
  - hostname: test.aakorea.org
    service: http://localhost:5173

  # 백엔드 API (예: api-test.aakorea.org -> 8081)
  - hostname: api-test.aakorea.org
    service: http://localhost:8081

  # Catch-all: 404
  - service: http_status:404
```

---

## 5. DNS 라우팅 설정

생성한 터널과 도메인을 연결합니다.

```bash
cloudflared tunnel route dns <터널-이름> office-test.aakorea.org
cloudflared tunnel route dns <터널-이름> test.aakorea.org
cloudflared tunnel route dns <터널-이름> api-test.aakorea.org
```

---

## 6. 터널 실행

### 포그라운드 실행 (테스트용)
```bash
cloudflared tunnel run <터널-이름>
```

### 백그라운드 실행 (Termux)
Termux에서는 `termux-services`를 사용하거나 `nohup`을 사용합니다.

```bash
nohup cloudflared tunnel run <터널-이름> > ~/cloudflared.log 2>&1 &
```

---

## 7. 주의사항

- **CORS 설정**: `api-test.aakorea.org`로 접속할 경우 백엔드(Spring Boot)의 CORS 허용 목록에 `https://test.aakorea.org`가 포함되어 있어야 합니다.
- **SSL/TLS**: Cloudflare Tunnel은 자동으로 SSL을 적용해 줍니다. 따라서 내부 서비스는 `http`로 실행해도 외부에서는 `https`로 안전하게 접속됩니다.
