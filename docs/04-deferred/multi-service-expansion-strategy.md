<!-- docs/01-current/architecture/multi-service-expansion-strategy.md -->

# 다중 서비스 확장 및 통합 인증(SSO) 전략

이 문서는 AAKorea 프로젝트가 차후 `store.aakorea.org`(도서 판매), `heart.aakorea.org`(정기구독 관리) 등 다양한 서브도메인 기반 서비스로 확장될 때를 대비한 아키텍처 가이드라인을 제시합니다.

---

## 1. 통합 인증 전략 (Single Sign-On, SSO)

여러 서비스가 흩어져 있어도 사용자는 한 번의 로그인으로 모든 서비스를 이용할 수 있어야 합니다.

### 1.1 공통 도메인 쿠키 (Root Domain Cookie)
현재의 세션 기반 인증을 유지하면서 SSO를 구현하기 위해, 세션 쿠키의 `Domain` 속성을 루트 도메인으로 설정합니다.

- **Cookie Domain**: `.aakorea.org` (앞에 점을 붙여 모든 서브도메인 허용)
- **효과**: 사용자가 `aakorea.org`에서 로그인하면, 브라우저가 `store.aakorea.org`나 `heart.aakorea.org`로 요청을 보낼 때도 동일한 세션 쿠키를 함께 전송합니다.

### 1.2 백엔드 세션 공유 (Spring Session)
백엔드 서버가 여러 대가 되거나 서비스별로 분리될 경우, 메모리 기반 세션 대신 **Redis** 등을 사용한 외부 세션 저장소를 활용하여 세션 정보를 공유합니다.

### 1.3 중앙 집중형 인증 서버 (Identity Provider, auth.aakorea.org)
서비스가 완전히 독립된 프로젝트로 분리될 경우, 인증 로직을 `auth.aakorea.org`와 같은 별도의 서버로 추출하여 운영하는 방안입니다.
- **장점**: 모든 서비스의 유저 관리 로직을 한 곳에서 제어 가능, 보안 패치 및 정책 변경이 용이.
- **구현 방식**: 다른 서비스들(`store`, `heart`)이 메인 인증 서버와 세션 저장소를 공유하거나, OAuth2/OIDC 표준 규격을 사용하여 인증을 위임합니다.

---

## 2. 프론트엔드 확장 및 모노레포(Monorepo) 전략

다양한 서비스의 프론트엔드 코드를 효율적으로 관리하기 위해 모노레포 구조로 전환합니다.

### 2.1 디렉토리 구조 제안
```text
frontend/
├─ apps/
│  ├─ main/        # 공개 사이트 (Next.js)
│  ├─ admin/       # 관리자 콘솔 (Vite/React)
│  ├─ store/       # 도서 판매 서비스 (Next.js)
│  └─ heart/       # 정기구독 관리 서비스 (Next.js)
├─ packages/
│  ├─ ui/          # 공통 컴포넌트 라이브러리 (Shared UI)
│  ├─ utils/       # 공통 유틸리티 함수
│  └─ types/       # 공통 API 타입 정의
└─ package.json    # PNPM Workspaces 또는 Turborepo 설정
```

### 2.2 장점
- **코드 재사용**: 로그인 폼, 네비게이션 바 등을 한 곳에서 관리하여 모든 서비스에 동일한 UI/UX 적용.
- **일관된 배포**: Vercel은 모노레포 내의 개별 앱을 각각 독립적인 도메인으로 배포하는 기능을 기본 지원합니다.

---

## 3. 멀티 레포지토리(Multi-repo) 전략 (대안)

저장소의 복잡도를 낮추기 위해 각 서비스를 별도의 저장소로 관리하는 방식입니다.

### 3.1 구조 제안
- `aakorea-main`: 메인 서비스 (Next.js)
- `aakorea-admin`: 관리자 콘솔 (Vite)
- `aakorea-store`: 도서 판매 (Next.js)
- `aakorea-heart`: 구독 관리 (Next.js)

### 3.2 코드 및 디자인 자산 공유
저장소가 분리될 경우 코드 공유가 어려워지는 단점이 있으므로 아래 방안을 검토합니다.
- **디자인 시스템**: 공통 CSS나 UI 가이드를 문서화하고, 가급적 TailwindCSS 같은 유틸리티 기반 프레임워크를 써서 일관성 유지.
- **Private NPM / Git Submodule**: 공통 로직이나 타입을 라이브러리 형태로 분리하여 각 레포지토리에서 의존성으로 추가.

---

## 3. 백엔드 및 데이터베이스 공유 전략

### 3.1 공통 유저 데이터베이스
각 서비스의 기능(도서 판매, 구독 관리)은 물리적으로 분리된 DB를 쓸 수 있지만, **사용자 정보(User/Auth)**는 하나의 공유 데이터베이스 또는 중앙화된 인증 서비스(Auth Service)를 통해 관리합니다.

### 3.2 API 게이트웨이 (Nginx)
운영 환경의 Nginx가 게이트웨이 역할을 하여 서브도메인별로 요청을 적절한 서버로 라우팅합니다.

```nginx
# 예시: 서브도메인별 라우팅
server {
    server_name store.aakorea.org;
    location / { proxy_pass http://next-store-app; }
}
server {
    server_name heart.aakorea.org;
    location / { proxy_pass http://next-heart-app; }
}
```

---

## 4. 보안 및 CORS 정책

모든 서브도메인이 백엔드 API를 신뢰할 수 있도록 CORS 설정을 화이트리스트 방식으로 관리합니다.

- **Allowed Origins**: `https://*.aakorea.org`, `https://*.maumtalk.win` (테스트용)
- **CORS Credentials**: 세션 쿠키 공유를 위해 반드시 `true`로 설정.

---

## 5. 단계별 실행 로드맵

1. **준비 단계**: 현재 배포 중인 도메인 브랜딩 확정 (`aakorea.org` vs `maumtalk.win`).
2. **SSO 적용**: 백엔드 세션 쿠키 설정을 루트 도메인으로 변경하여 도메인 간 인증 공유 테스트.
3. **모노레포 전환**: 현재의 `frontend/`를 `apps/main`과 `apps/admin`으로 분리하고 공통 패키지 추출.
4. **서비스 추가**: `apps/store` 등을 생성하여 독립적인 개발 및 배포 시작.

---

## 6. 결론

지금 당장 모든 것을 구축할 필요는 없지만, **"공유 세션 기반의 통합 인증"**과 상황에 맞는 **"저장소 전략(모노레포 vs 멀티레포)"**을 염두에 두고 개발을 진행하면 향후 서비스 확장에 따른 기술적 부채를 최소화할 수 있습니다. 특히 복잡도가 높아질 경우 인증 로직을 `auth.aakorea.org`로 분리하는 것이 관리 측면에서 유리합니다.
