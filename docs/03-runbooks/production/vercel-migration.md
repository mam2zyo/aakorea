<!-- docs/runbooks/production/vercel-migration.md -->

# 프론트엔드 Vercel 마이그레이션 가이드

이 문서는 현재 Nginx에서 서빙 중인 React(Vite) 프론트엔드를 Vercel로 이전할 때 필요한 설정과 절차를 정리합니다.

---

## 1. 마이그레이션 이점
- **Global Edge Network**: 전 세계 어디서나 빠른 응답 속도.
- **자동 배포**: Git Push 시 자동 빌드 및 미리보기(Preview) 배포 제공.
- **이미지 최적화**: Vercel Image Optimization 기본 지원.
- **관리 대시보드**: 빌드 로그, 에러 모니터링, 성능 분석(Analytics) 용이.

---

## 2. Vercel 프로젝트 설정

Vercel 대시보드에서 프로젝트를 생성할 때 아래와 같이 설정합니다.

### 기본 설정
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend/aakorea-main`
- **Build Command**: `npm run build` 또는 `vite build`
- **Output Directory**: `dist` (Vite 기본값)

### 환경 변수 (Environment Variables)
Vercel 설정 메뉴에서 다음 변수를 추가합니다.
- `VITE_API_BASE_URL`: 백엔드 API 서버 주소 (예: `https://api.aakorea.org`)
  - *참고: Vite는 배포 시점에 환경 변수를 주입하므로, 백엔드 주소가 확정되어야 합니다.*

---

## 3. 백엔드(Spring Boot) 대응 설정

프론트엔드 도메인이 Vercel로 변경되면(`*.vercel.app` 또는 새 커스텀 도메인), 백엔드에서 CORS 허용 설정을 업데이트해야 합니다.

### `application.yml` 수정
```yaml
app:
  cors:
    allowed-origins:
      - https://aakorea.org
      - https://www.aakorea.org
      - https://your-app-name.vercel.app  # Vercel 미리보기 도메인
      - https://office.aakorea.org          # (분리된 경우) 어드민 도메인
```

---

## 4. 도메인 연결 (Production)

마이그레이션 당일, 네임서버 또는 DNS 레코드를 업데이트합니다.

1. **Vercel Domains**: Vercel 프로젝트 설정에서 `aakorea.org` 추가.
2. **DNS 레코드 설정**:
   - `A` 레코드: `@` → `76.76.21.21`
   - `CNAME` 레코드: `www` → `cname.vercel-dns.com`

---

## 5. 단계별 체크리스트

- [ ] Vercel 프로젝트 연결 및 `frontend/aakorea-main` 경로 정상 인식 확인
- [ ] Vercel 빌드 성공 여부 확인 (`npm install` 시 의존성 충돌 주의)
- [ ] `VITE_API_BASE_URL` 환경 변수 설정
- [ ] 백엔드 `application.yml`에 Vercel 도메인 CORS 추가 및 배포
- [ ] (권장) Staging 도메인에서 API 통신 테스트 (CORS, 인증 쿠키 등)
- [ ] DNS 최종 전환 및 SSL 인증서 발급 확인

---

## 6. 주의사항

- **쿠키 기반 인증**: 만약 백엔드와 프론트엔드의 도메인이 다를 경우 (예: `aakorea.org` vs `api-server.com`), `SameSite=None; Secure` 설정이 필요할 수 있습니다. 가급적 같은 도메인 아래 서브도메인을 사용하는 것을 권장합니다 (예: `aakorea.org`, `api.aakorea.org`).
- **서버 사이드 렌더링(SSR)**: 현재 프로젝트는 CSR(Client Side Rendering) 기반이므로 Vercel의 `Static Output`으로 충분합니다.
