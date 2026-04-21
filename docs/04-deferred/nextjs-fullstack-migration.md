<!-- docs/04-deferred/nextjs-fullstack-migration.md -->

# Next.js Full-stack 전환 고려 사항

이 문서는 현재의 **Spring Boot(백엔드) + React(프론트엔드)** 구조에서 **Next.js Full-stack** 구조로의 전환 가능성을 검토하고, 그 이유와 전략을 기록합니다.

---

## 1. 전환 배경 (Rationale)

### 1.1 서버 운영 비용 절감
- **현재**: AWS Lightsail 인스턴스 유지 비용(월 $5~$10 이상) 및 Nginx, SSL 직접 관리 비용 발생.
- **전환 후**: Vercel의 서버리스 인프라와 관리형 DB(Neon, Supabase 등)를 조합하여 **인프라 비용을 거의 0원에 가깝게 절감** 가능.

### 2.2 기술 스택의 통합 및 간소화
- 프론트엔드와 백엔드를 **TypeScript**라는 하나의 언어로 통합하여 개발 효율성 증대.
- 도메인 분리 및 API 타입 동기화 과정에서 발생하는 오버헤드 감소.

---

## 2. 기술 비교 분석

| 항목 | 현재 (Spring Boot + React) | 전환 시 (Next.js Full-stack) |
| :--- | :--- | :--- |
| **언어** | Java / TypeScript | TypeScript (Unified) |
| **인증** | Spring Security | NextAuth.js / Clerk |
| **자료 접근** | JPA / Hibernate | Prisma / Drizzle ORM |
| **인프라** | AWS Lightsail (관리형 인스턴스) | Vercel (Serverless / Managed) |
| **배포 방식** | GitHub Actions + SSH | Vercel Git Integration (Native) |

---

## 3. 학습 곡선 및 브릿지 (Learning Bridge)

Java/Spring 개발자가 TypeScript/Next.js로 전환할 때의 핵심 매핑 개념입니다.

- **Controller → API Routes / Server Actions**: HTTP 요청을 처리하는 입구가 Next.js 내부로 통합됩니다.
- **Service → Server-side Logic**: 비즈니스 로직은 서버 환경에서 실행되는 함수(Async functions)로 구현됩니다.
- **JPA Entity → Prisma Model**: 데이터베이스 스키마 정의 방식이 매우 유사하며(ORM), 강력한 타입 세이프티를 제공합니다.
- **DTO → TS Identity/Interface**: 객체 간 데이터 전달을 위한 인터페이스 정의가 자바와 유사한 문법을 가집니다.

---

## 4. 단계적 마이그레이션 전략 (Phased Approach)

한 번에 모든 것을 바꾸기보다는 점진적인 전환을 권장합니다.

1. **1단계 (탐색)**: 단순 조회 기능(예: 공지사항 목록)을 Next.js의 `Server Components`에서 직접 DB를 조회하도록 구현.
2. **2단계 (공존)**: 신규 기능은 Next.js로 개발하고, 기존 복잡한 로직은 Spring Boot API를 호출하여 처리.
3. **3단계 (완전 통합)**: Spring Boot의 보안 로직과 비즈니스 로직을 하나씩 TypeScript로 이식하고 최종적으로 AWS 서버를 중단.

---

## 5. 결론 및 향후 계획

현재는 Spring Boot 기반의 견고한 구조를 유지하되, **운영 비용 최적화**와 **개발 생산성 향상**이 최우선 순위가 될 때 이 문서를 바탕으로 전환 여부를 최종 결정합니다.

**참고 사항:**
- 전환 시 기존 Java 코드의 비즈니스 로직을 TypeScript로 재작성해야 하는 **매몰 비용(Sunk Cost)**이 발생함.
- 개발 파트너(AI Assistant)가 TypeScript 구현 및 "Spring to TS 번역" 과정을 적극 서포트할 수 있음.
