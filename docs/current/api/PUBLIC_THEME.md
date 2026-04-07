<!-- docs/current/api/PUBLIC_THEME.md -->

# API_PUBLIC_THEME

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 MVP에서
**공개 사이트 theme 조회와 운영 theme 관리 API 계약**을 정의한다.

이 문서가 답하는 질문:

- 공개 화면은 active theme를 어떻게 조회하는가?
- 운영자는 public theme draft / publish / rollback을 어떻게 수행하는가?
- 현재 지원하는 theme id와 동작 제약은 무엇인가?

공통 규약은 `COMMON.md`를 따른다.

---

## 현재 범위 요약

- 공개 화면은 `GET /api/public/theme`로 active theme id를 조회한다
- 운영 화면은 `GET /api/admin/public-theme`로 상태를 본다
- 운영자는 draft 저장, 게시, 직전 theme 롤백을 수행한다
- 현재 theme는 코드에 포함된 preset id만 지원한다

현재 지원 theme id:

- `classic`
- `harbor`
- `breeze`

비고:

- `admin/account`의 운영 콘솔 개인 theme preference는 브라우저 localStorage만 사용한다
- 이 문서는 **공개 사이트 theme** API만 다룬다

---

## 1. 공개 active theme 조회

### GET `/api/public/theme`

공개 화면이 현재 active theme id를 조회한다.

### Response 200

```json
{
  "data": {
    "activeThemeId": "classic"
  }
}
```

### 현재 규칙

- 서버에 저장된 theme id가 유효하지 않으면 기본값 `classic`으로 정규화한다
- 공개 프론트는 이 응답을 받아 document theme state를 동기화한다

---

## 2. 운영 theme 상태 조회

### GET `/api/admin/public-theme`

운영 화면에서 공개 사이트 theme 상태를 조회한다.

### Response 200

```json
{
  "data": {
    "activeThemeId": "classic",
    "draftThemeId": "harbor",
    "previousThemeId": "classic",
    "hasUnpublishedDraft": true,
    "publishedAt": "2026-04-07T10:00:00",
    "updatedAt": "2026-04-07T10:15:00"
  }
}
```

### 현재 규칙

- 설정 레코드가 없으면 기본 theme 기준으로 최초 생성한다
- `hasUnpublishedDraft`는 `activeThemeId !== draftThemeId`일 때 `true`다

---

## 3. 드래프트 theme 저장

### PUT `/api/admin/public-theme/draft`

운영자가 draft theme를 저장한다.

### Request Body

```json
{
  "themeId": "harbor"
}
```

### Response 200

```json
{
  "data": {
    "activeThemeId": "classic",
    "draftThemeId": "harbor",
    "previousThemeId": null,
    "hasUnpublishedDraft": true,
    "publishedAt": null,
    "updatedAt": "2026-04-07T10:15:00"
  }
}
```

### 기본 검증

- `themeId` 필수
- 지원하지 않는 theme id면 `400`

---

## 4. 드래프트 게시

### POST `/api/admin/public-theme/publish`

현재 draft theme를 active theme로 게시한다.

### Response 200

```json
{
  "data": {
    "activeThemeId": "harbor",
    "draftThemeId": "harbor",
    "previousThemeId": "classic",
    "hasUnpublishedDraft": false,
    "publishedAt": "2026-04-07T10:20:00",
    "updatedAt": "2026-04-07T10:20:00"
  }
}
```

### 현재 규칙

- unpublished draft가 없으면 현재 상태를 그대로 반환한다
- 게시 시 기존 active theme는 `previousThemeId`로 밀린다

---

## 5. 직전 theme로 롤백

### POST `/api/admin/public-theme/rollback`

직전 active theme로 롤백한다.

### Response 200

```json
{
  "data": {
    "activeThemeId": "classic",
    "draftThemeId": "classic",
    "previousThemeId": "harbor",
    "hasUnpublishedDraft": false,
    "publishedAt": "2026-04-07T10:25:00",
    "updatedAt": "2026-04-07T10:25:00"
  }
}
```

### 현재 규칙

- `previousThemeId`가 없으면 `409 Conflict`
- 롤백 후 `draftThemeId`도 같은 값으로 맞춘다

---

## 현재 프론트 사용 메모

- 공개 프론트는 active theme를 API에서 받고, 필요 시 `themePreview` query param으로 게시 전 미리보기를 유지한다
- 운영 `/admin/public-theme` 화면은 preset 선택, draft 저장, 공개 홈 미리보기, 게시, 롤백을 제공한다
