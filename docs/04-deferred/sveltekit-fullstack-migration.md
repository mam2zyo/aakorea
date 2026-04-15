<!-- docs/04-deferred/sveltekit-fullstack-migration.md -->

# SvelteKit Full-stack 전환 가능성 분석 보고서 (Feasibility Report)

현재 운영 중인 **Spring Boot + React(Vite)** 아키텍처를 **SvelteKit Full-stack**으로 전환하는 것에 대한 기술적 가능성과 기대 효과, 도전 과제를 분석합니다.

---

## 1. 요약 (Executive Summary)

SvelteKit으로의 전환은 **기술적으로 100% 가능**하며, 특히 이전에 검토하신 [Next.js 전환 계획](./nextjs-fullstack-migration.md)과 비교했을 때 다음과 같은 차별점을 가집니다.

- **성능 및 경량화**: 가상 DOM이 없는 Svelte의 컴파일 방식은 더 빠른 실행 속도와 작은 번들 크기를 제공합니다.
- **저사양 기기 최적화**: CPU 사용량이 적고 메모리 효율이 높아, 저가형 모바일 기기에서도 부드러운 UX를 제공합니다.
- **개발 생산성**: boilerplate 코드가 매우 적고, Vite와의 시너지가 현재 React+Vite 환경보다 더 직접적입니다.
- **서버리스 최적화**: Vercel/Cloudflare 등 다양한 플랫폼으로의 배포가 어댑터 방식으로 매우 유연하게 지원됩니다.

---

## 2. 주요 기술 비교 (SvelteKit vs Next.js)

| 항목 | Next.js (기존 제안) | SvelteKit (신규 제안) | 비고 |
| :--- | :--- | :--- | :--- |
| **렌더링 방식** | SSR, SSG, ISR, RSC | SSR, SSG, CSR | SvelteKit은 더 단순한 구조 선호 |
| **상태 관리** | Context, Redux, Zustand | Svelte Stores (내장) | Svelte 내장 Store가 매우 강력함 |
| **API 디자인** | API Routes, Server Actions | Loaders, Form Actions | SvelteKit의 Action 방식이 매우 직관적 |
| **생태계** | 매우 방대함 | 성장 중 (충분한 수준) | React 라이브러리 미지원 (대체 필요) |
| **번들 크기** | 상대적으로 큼 (40KB+) | 매우 작음 (1~2KB+) | 저사양 기기/모바일에서 압도적 유리 |

---

## 3. 이전을 위한 핵심 체크리스트 (Technical Checklist)

### 3.1 프론트엔드 (React → Svelte)
- **라이브러리 대체**:
  - `lucide-react` → `lucide-svelte`
  - `@tiptap/react` → `@tiptap/svelte`
  - `react-kakao-postcode` → Svelte 전용 래퍼 또는 Vanilla JS 연동 필요.
- **컴포넌트 로직**: React의 `useEffect`, `useState` 기반 로직을 Svelte의 반응형 선언(`$:` 또는 Svelte 5의 Runes)으로 이관.

### 3.2 백엔드 (Spring Boot → SvelteKit Server)
- **ORM**: Prisma 또는 Drizzle ORM을 사용하여 기존 PostgreSQL/MySQL 스키마에 연결.
- **인증(Auth)**: Spring Security를 **Auth.js (SvelteKit Auth)**로 대체.
- **파일 스토리지**: 기존 AWS S3 또는 로컬 저장소 로직을 SvelteKit 서버 엔드포인트로 이관.

---

## 4. 단계적 전환 전략 (Migration Path)

1.  **Phase 1: Proof of Concept (PoC)**
    - 가장 간단한 기능(예: 공지사항 조회)을 SvelteKit으로 구현하여 Vercel에 배포 테스트.
2.  **Phase 2: Hybrid Strategy (BFF)**
    - 프론트엔드만 SvelteKit으로 먼저 전환하고, 백엔드는 기존 Spring Boot API를 그대로 호출 (Proxy 모드).
3.  **Phase 3: Logic Porting**
    - 도메인 로직을 하나씩 TypeScript로 이식하며 Spring Boot 의존성을 제거.

---

## 5. 결론 및 제언

SvelteKit은 **성능 최적화**와 **저사양 기기 지원**이 중요한 경우 최적의 선택입니다. 특히 현재 React+Vite 환경을 사용 중이므로 Vite 기반의 SvelteKit으로의 전환은 기술적 이질감이 적습니다.

**추천 시나리오:**
- **모바일 웹 비중이 높고 저사양 기기 사용자가 많은 경우**: **SvelteKit** 강력 추천.
- **기존 대형 React 라이브러리 생태계가 반드시 필요한 경우**: **Next.js**가 유리.

> [!NOTE]
> Svelte 5 (Runes) 기반으로 설계를 시작하면 장기적인 유지보수 측면에서 가장 유리합니다.
