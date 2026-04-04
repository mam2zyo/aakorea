<!-- docs/current/api/ADMIN_GROUPS.md -->

# API_ADMIN_GROUPS

## 이 문서의 역할

이 문서는 현재 구현된 운영 `Group`, `GroupContact` API 계약을 정리한다.

---

## 현재 구조 요약

- `Group`은 `id`, `districtId`, `name`, `notice`를 가진다
- 위치 정보는 `Meeting`이 가진다
- `introduction`, `changeSummary`는 현재 제외한다
- `GroupContact`는 현재 그룹당 1건만 허용한다
- 그룹 삭제 시 연결된 연락처와 모임도 함께 삭제한다

---

## 1. 그룹 목록 조회

### GET `/api/admin/groups`

#### Query Params

- `districtId` (optional)

#### Response 200

```json
{
  "data": [
    {
      "id": 20,
      "districtId": 1,
      "name": "강남그룹",
      "notice": "첫 방문자는 10분 전에 와 주세요."
    }
  ]
}
```

---

## 2. 그룹 생성

### POST `/api/admin/groups`

#### Request Body

```json
{
  "districtId": 1,
  "name": "강남그룹",
  "notice": "첫 방문자는 10분 전에 와 주세요."
}
```

#### Response 201

```json
{
  "data": {
    "id": 20,
    "districtId": 1,
    "name": "강남그룹",
    "notice": "첫 방문자는 10분 전에 와 주세요."
  }
}
```

#### 기본 검증

- `districtId` 필수
- `name` 필수
- `notice` 선택, 공백은 `null`로 정규화, 최대 200자
- 대상 `District`가 존재해야 한다

---

## 3. 그룹 수정

### PUT `/api/admin/groups/{id}`

#### Request Body

```json
{
  "districtId": 1,
  "name": "강남그룹",
  "notice": "첫 방문자는 10분 전에 와 주세요."
}
```

#### Response 200

```json
{
  "data": {
    "id": 20,
    "districtId": 1,
    "name": "강남그룹",
    "notice": "첫 방문자는 10분 전에 와 주세요."
  }
}
```

---

## 4. 그룹 삭제

### DELETE `/api/admin/groups/{id}`

#### Response 204

응답 본문 없음

#### 현재 구현 규칙

- 연결된 `Meeting`을 함께 삭제한다
- 연결된 `GroupContact`를 함께 삭제한다
- 대상이 없으면 `404`

즉, 현재는 `409`로 막는 방식이 아니라 **cascade delete 성격의 서비스 삭제**를 사용한다.

---

## 5. 연락처 목록 조회

### GET `/api/admin/group-contacts`

#### Query Params

- `groupId` (optional)

#### Response 200

```json
{
  "data": [
    {
      "id": 30,
      "groupId": 20,
      "phone": "02-1234-5678",
      "email": "group@example.org",
      "postalContact": {
        "recipient": "담당자",
        "postalCode": "06123",
        "roadAddress": "서울특별시 강남구 테헤란로 123",
        "detailAddress": "7층"
      }
    }
  ]
}
```

---

## 6. 연락처 생성

### POST `/api/admin/group-contacts`

#### Request Body

```json
{
  "groupId": 20,
  "phone": "02-1234-5678",
  "email": "group@example.org",
  "postalContact": {
    "recipient": "담당자",
    "postalCode": "06123",
    "roadAddress": "서울특별시 강남구 테헤란로 123",
    "detailAddress": "7층"
  }
}
```

#### Response 201

```json
{
  "data": {
    "id": 30,
    "groupId": 20,
    "phone": "02-1234-5678",
    "email": "group@example.org",
    "postalContact": {
      "recipient": "담당자",
      "postalCode": "06123",
      "roadAddress": "서울특별시 강남구 테헤란로 123",
      "detailAddress": "7층"
    }
  }
}
```

#### 현재 구현 규칙

- `groupId` 필수
- `phone` 필수
- `email` 선택
- `postalContact` 선택
- 대상 그룹이 존재해야 한다
- 같은 그룹에 연락처가 이미 있으면 `409 Conflict`

오류 이유:

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "group contact already exists"
  }
}
```

---

## 7. 연락처 수정

### PUT `/api/admin/group-contacts/{id}`

#### Request Body

```json
{
  "phone": "02-9876-5432",
  "email": "group@example.org",
  "postalContact": {
    "recipient": "담당자",
    "postalCode": "06123",
    "roadAddress": "서울특별시 강남구 테헤란로 123",
    "detailAddress": "7층"
  }
}
```

#### Response 200

```json
{
  "data": {
    "id": 30,
    "groupId": 20,
    "phone": "02-9876-5432",
    "email": "group@example.org",
    "postalContact": {
      "recipient": "담당자",
      "postalCode": "06123",
      "roadAddress": "서울특별시 강남구 테헤란로 123",
      "detailAddress": "7층"
    }
  }
}
```

---

## 현재 구현에 없는 것

- `DELETE /api/admin/group-contacts/{id}`
