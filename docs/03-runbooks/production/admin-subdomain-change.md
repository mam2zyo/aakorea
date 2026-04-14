<!-- docs/03-runbooks/admin-subdomain-change.md -->

# 어드민 서브도메인 변경 가이드

이 문서는 어드민 접근 경로를 기존의 하위 경로(예: `/admin`)에서 전용 서브도메인(예: `office.aakorea.org`)으로 변경할 때 필요한 모든 설정 사항을 정리한다.

---

## 1. Nginx 설정 변경

현재 Nginx는 하나의 `server` 블록에서 `/admin` 경로를 구분하여 처리하고 있다. 서브도메인으로 분리하려면 `server` 블록을 분리하거나 `server_name` 설정을 수정해야 한다.

### 1.1 `server_name` 분리 (추천)
공개 사이트와 어드민 사이트를 별도의 서브도메인으로 운영할 경우의 설정 예시다.

```nginx
# 공개 사이트 설정 (www.aakorea.org)
server {
    listen 8080;
    server_name www.aakorea.org aakorea.org;

    root /home/mam2z/apps/aakorea-main/frontend/aakorea-main/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 프록시는 공통으로 사용 가능
    location /api/ {
        proxy_pass http://127.0.0.1:8081;
        # ... 기타 proxy_set_header 설정
    }
}

# 어드민 사이트 설정 (office.aakorea.org)
server {
    listen 8080;
    server_name office.aakorea.org;

    root /home/mam2z/apps/aakorea-main/frontend/aakorea-main/dist;
    index admin.html; # 어드민 전용 엔트리 포인트

    location / {
        try_files $uri $uri/ /admin.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8081;
        # ... 기타 proxy_set_header 설정
    }
}
```

> [!IMPORTANT]
> 수정 후 반드시 `sudo nginx -t`로 설정을 검증하고 `sudo systemctl reload nginx`를 수행해야 한다.

---

## 2. 백엔드(Spring Boot) 설정 변경

브라우저에서 새로운 서브도메인으로 API에 요청을 보낼 때, CORS(Cross-Origin Resource Sharing) 정책에 위배되지 않도록 허용 목록을 업데이트해야 한다.

### 2.1 `application-termux.yml` 수정
운영 환경 또는 Termux 프로파일 설정을 수정한다.

- **파일 경로**: `backend/aakorea-main/src/main/resources/application-termux.yml`

```yaml
app:
  cors:
    allowed-origins:
      - https://www.aakorea.org
      - https://aakorea.org
      - https://office.aakorea.org # 새로운 어드민 도메인 추가
```

> [!NOTE]
> `SecurityConfig.java`에서 `AppCorsProperties`를 통해 이 값을 읽어 CORS 설정을 적용한다. 설정을 바꾼 후 백엔드 서비스를 재시작해야 한다.

---

## 3. 외부 API 화이트리스트 및 연동 설정

도메인이 변경되면 외부 서비스 콘솔에서 **허용 도메인(Allowlist)**을 반드시 갱신해야 해당 기능이 정상 작동한다.

### 3.1 Kakao Developers (지도 및 우편번호 검색)
현재 `AddressSearchField.jsx`에서 `react-kakao-postcode`를 사용 중이므로 필수 설정이다.

- **대상 서비스**: Kakao Map API, Kakao Postcode
- **설정 위치**: [Kakao Developers 콘솔](https://developers.kakao.com/) > 내 애플리케이션 > 플랫폼 > 웹
- **조치 사항**:
    - `사이트 도메인` 목록에 `https://office.aakorea.org` 추가
    - (필요 시) `Redirect URI`에 새로운 도메인 기반 경로 추가

### 3.2 Tmap API (경로 및 위치 검색)
프론트엔드 환경 변수 `VITE_TMAP_APP_KEY`를 사용하는 연동 부문이다.

- **대상 서비스**: Tmap API
- **설정 위치**: [SK Open API 포털](https://openapi.sk.com/) > 마이페이지 > 앱 관리
- **조치 사항**: 
    - 해당 앱의 환경 설정에서 `Referer` (또는 허용 도메인) 목록에 `office.aakorea.org` 추가

### 3.3 기타 외부 연동 (소셜 로그인 등)
현재 어드민은 이메일/비밀번호 방식을 사용하나, 추후 Google/Kakao 로그인 등을 추가할 경우 아래 사항을 확인해야 한다.

- **OAuth2 Redirect URI**: 인증 완료 후 돌아올 주소를 `https://office.aakorea.org/api/login/oauth2/code/...` 형태로 각 개발자 센터에 등록해야 한다.
- **CORS 설정**: 백엔드의 `allowed-origins`뿐만 아니라 외부 서비스의 CORS 허용 도메인에도 등록이 필요할 수 있다.


---

## 4. 인프라 및 네트워크 설정

### 4.1 DNS 설정
- 도메인 관리 서비스(예: Cloudflare, AWS Route53 등)에서 `office.aakorea.org`에 대한 **A 레코드** 또는 **CNAME 레코드**를 서버 IP로 연결한다.

### 4.2 Cloudflare Tunnel (사용 시)
Cloudflare Tunnel을 통해 로컬 서버를 노출 중이라면, 터널 설정에 추가 호스트네임을 등록해야 한다.

```bash
# 예시 명령 (환경에 따라 다름)
cloudflared tunnel route dns <TUNNEL_NAME> office.aakorea.org
```

---

## 5. 프론트엔드 고려 사항

현재 프로젝트는 **MPA(Multi-Page Application)** 구조로 빌드 시 `index.html`과 `admin.html`이 생성된다.

- **상대 경로 사용**: 현재 API 요청이나 리소스 참조가 상대 경로(`/api/...`)로 작성되어 있다면, Nginx에서 프록시만 잘 설정해 주면 코드 수정 없이 동작한다.
- **절대 경로 확인**: 만약 코드 내에 `http://localhost:8080/admin` 처럼 하드코딩된 URL이 있다면, 이를 환경 변수나 상대 경로로 교체해야 한다.

---

## 체크리스트
- [ ] Nginx 설정 분리 및 재시작
- [ ] 백엔드 `allowed-origins` 업데이트 및 재시작
- [ ] DNS 레코드 등록 확인
- [ ] Kakao/Tmap 콘솔 도메인 등록
- [ ] 브라우저 개발자 도구(F12)에서 CORS 에러 발생 여부 확인
