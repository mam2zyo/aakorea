<!-- docs/current/api/ADMIN_AUDIT_LOG.md -->

# ADMIN_AUDIT_LOG

## 이 문서의 역할

이 문서는 주요 도메인 개체(Group, District, Meeting, Notice 등)의 변경 이력을 조회하기 위한 운영용 API 계약을 정의한다.

이 문서에 포함하지 않는 내용:

- 인증 및 권한 공통 규칙 (`COMMON.md`, `AUTH.md` 참조)
- 개별 도메인 로직 상세 (`../domain/` 참조)

---

## 활동 로그 조회

운영자가 시스템 전반 또는 특정 개체의 변경 이력을 페이징하여 조회한다.

### Endpoint

- `GET /api/admin/audit-logs`

### Request Parameters

| Key | Type | Requirement | Description |
| :-- | :-- | :-- | :-- |
| `entityType` | String | Optional | 특정 개체 유형으로 필터링 (예: `Group`, `Notice`) |
| `entityId` | Long | Optional | 특정 개체 ID로 필터링 (entityType과 함께 사용 권장) |
| `page` | Integer | Optional | 페이지 번호 (0-based, 기본 0) |
| `size` | Integer | Optional | 페이지 크기 (기본 20) |
| `sort` | String | Optional | 정렬 기준 (기본 `createdAt,desc`) |

### Response Data

`ApiResponse<Page<AuditLogData>>` 형태를 반환한다.

#### `AuditLogData` 구조

| Key | Type | Description |
| :-- | :-- | :-- |
| `id` | Long | 로그 고유 ID |
| `entityType` | String | 변경된 개체의 유형 |
| `entityId` | Long | 변경된 개체의 고유 ID |
| `entityLabel` | String | **[신규]** 변경 당시 개체의 명칭 (그룹명, 제목 등) |
| `action` | Enum | 행위 (`CREATE`, `UPDATE`, `DELETE`) |
| `diff` | JSON String | 변경된 필드의 이전/이후 값 (하단 상세 참조) |
| `createdAt` | ISO-8601 | 행위 발생 일시 |
| `createdBy` | Long | 행위를 수행한 운영자 ID |
| `creatorEmail` | String | **[신규]** 행위를 수행한 운영자의 이메일 (username) |

---

## 변경 상세(`diff`) 포맷

`diff` 필드는 변경된 필드명을 키로 하는 JSON 객체이며, 각 필드는 다음 정보를 포함한다.

### 예시
```json
{
  "name": {
    "oldValue": "이전 이름",
    "newValue": "새 이름"
  },
  "location": {
    "oldValue": { "address": "...", "detail": "..." },
    "newValue": { "address": "...", "detail": "..." }
  }
}
```

- **예외 필터링**: `id`, `createdAt`, `updatedAt` 등의 시스템 필드는 `diff` 목록에서 제외된다.
- **객체 비교**: `Location`과 같은 값 객체는 내부 필드 값이 모두 동일하면 변경되지 않은 것으로 판단한다.

---

## 제약 사항

- **권한**: `PERM_audit.view` 권한을 가진 관리자만 조회 가능하다.
- **Meeting 통합**: `Meeting` 도메인의 변경사항은 상위 `Group` 엔티티 타입으로 통합되어 기록되며, `entityLabel`에 `[모임]` 접두어가 붙는다.
