<!-- docs/current/domain/Group.md -->

# Group

## 이 문서의 역할

이 문서는 `Group`의 현재 모델 의미와 필드를 정리한다.

이 문서에 포함하지 않는 내용:

- 제품 범위 판단
- 사용자 행동 흐름
- API 요청 / 응답 JSON 상세

---

## 현재 모델 의미

`Group`은 현재 시스템에서 **운영의 중심 단위**이자,
공개 화면에서 모임들을 묶는 **상위 문맥**이다.

현재 구현에서 `Group`은 아래 의미를 가진다.

- 운영자가 생성 / 수정 / 삭제하는 실질 관리 단위
- `Meeting`, `GroupContact`가 속하는 상위 단위
- 공개 모임 상세 모달에서 제목과 지역연합 문맥을 제공하는 단위

---

## 현재 핵심 필드

- `id`
- `districtId`
- `name`
- `notice`

### 필드 메모

- `name`은 필수다
- `notice`는 선택 필드다
- `notice`는 공백이면 `null`로 정규화한다
- `notice`는 최대 200자까지 허용한다

---

## 현재 규칙

- `Group`은 위치를 직접 가지지 않는다
- 실제 장소는 선택된 `Meeting` 기준으로 바뀐다
- 그룹 삭제 시 연결된 `Meeting`, `GroupContact`도 함께 삭제한다

---

## 공개 흐름에서의 의미

- 공개 상세는 `Group` 문맥 안에서 열린다
- 사용자는 그룹명, 지역연합, 그룹 공지를 함께 본다
- 다만 실제 장소와 일정은 `Meeting` 기준으로 움직인다

---

## 운영 흐름에서의 의미

- 현재 운영 UI의 메인 진입점은 그룹 목록이다
- 그룹 생성은 2단계 모달이다
- 그룹 수정은 읽기 중심 시트 + 섹션별 서브 모달 구조다

즉, 현재 운영 UX는 `Group`을 독립 엔티티보다
**대표 연락처와 모임 편집을 묶는 작업 단위**로 다룬다.

---

## 관계

- 하나의 `Group`은 하나의 `District`에 속한다
- 하나의 `Group`은 대표 `GroupContact` 1건을 가진다
- 하나의 `Group`은 여러 `Meeting`을 가진다

---

## 제외 / 보류

현재 핵심 필드로 채택하지 않는 정보:

- `locationDetail`
- `locationAddress`
- `introduction`
- `changeSummary`

---

## 관련 API 문서

- API 상세 스펙은 Swagger UI의 Admin Groups 및 Public Meetings 영역을 참고하십시오.
