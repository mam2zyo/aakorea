<!-- docs/current/domain/PublicThemeSetting.md -->

# PublicThemeSetting

## 이 문서의 역할

이 문서는 `PublicThemeSetting`의 현재 모델 의미와 필드를 정리한다.

이 문서에 포함하지 않는 내용:

- 운영 콘솔 개인 테마 preference
- API 요청 / 응답 JSON 상세
- 프론트 스타일 구현 상세

---

## 현재 모델 의미

`PublicThemeSetting`은 공개 사이트의 시각 테마 상태를 관리하는 운영 지원 도메인이다.

현재 해석:

- 공개 사이트는 항상 하나의 active theme를 가진다
- 운영자는 draft를 저장한 뒤 publish / rollback 한다
- 현재 theme는 코드에 포함된 preset id만 지원한다

---

## 현재 핵심 필드

- `id`
- `activeThemeId`
- `draftThemeId`
- `previousThemeId`
- `publishedAt`
- `updatedAt`

### 필드 메모

- 지원 theme id는 현재 `classic`, `harbor`, `breeze`다
- 지원하지 않는 저장값은 `classic`으로 정규화한다

---

## 현재 규칙

- 설정 레코드가 없으면 기본 theme 기준으로 최초 생성한다
- draft 저장은 `draftThemeId`, `updatedAt`을 바꾼다
- 게시 시 `draftThemeId`가 `activeThemeId`가 되고, 기존 active는 `previousThemeId`로 밀린다
- 롤백 시 `previousThemeId`가 없으면 충돌로 본다

---

## 공개 흐름에서의 의미

- 공개 프론트는 `GET /api/public/theme`로 active theme id를 동기화한다
- 필요하면 `themePreview` query param으로 게시 전 preview를 유지한다

---

## 운영 흐름에서의 의미

- `/admin/public-theme` 화면에서 draft 저장, 공개 홈 미리보기, 게시, 롤백을 수행한다

---

## 관계

- 현재는 공개 사이트 전체에 적용되는 단일 설정 레코드처럼 사용한다

---

## 제외 / 보류

이 모델은 아래를 포함하지 않는다.

- 운영 콘솔 개인 테마 preference
- 자유 편집형 테마 에디터
- 사용자별 / 페이지별 테마 정책

운영 콘솔 개인 테마는 현재 브라우저 localStorage 상태다.

---

## 관련 API 문서

- API 상세 스펙은 Swagger UI의 Public Theme / Admin Theme 영역을 참고하십시오.
