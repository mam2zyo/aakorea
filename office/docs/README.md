# Office Admin Docs

이 디렉토리는 `office` 관리자 앱의 설계 문서를 담고 있다.

## 문서 목록

| 파일 | 내용 |
|------|------|
| [design-system-rebuild.md](./design-system-rebuild.md) | 디자인 시스템 재구성 계획 (Phase 1~6) |
| [component-inventory.md](./component-inventory.md) | 현재 사용 중인 전체 CSS 클래스명 인벤토리 |

## 빠른 요약

**현재 문제**: 리팩토링 시 JSX 클래스명 접두사를 `admin-` → `office-`로 바꿨는데, 해당 스타일 정의가 새 CSS에 없음 (~80% 누락)

**목표**: Pretendard + Inter 폰트, Zinc 팔레트 + Blue 액센트, 다크 퍼스트 어드민 디자인 시스템

**예상 기간**: 4~6일
