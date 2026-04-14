<!-- docs/03-runbooks/java-null-safety-guide.md -->

# 자바 널 안정성(Java Null Safety) 가이드

이 문서는 프로젝트 내의 'Null type safety' 관련 이슈를 이해하고, 향후 코드의 안정성을 높이기 위한 전략을 설명합니다.

---

## 1. 개요
현재 프로젝트에서는 스프링 프레임워크 6+ 버전을 사용하고 있으며, 이는 JSR-305 어노테이션을 통해 API 수준에서 널 안정성을 보장하려 합니다. VS 코드(Eclipse JDT 엔진)는 이를 매우 엄격하게 해석하여, 잠재적으로 널이 될 수 있는 객체(External Libraries, JDK 등에서 오는 값)를 `@NonNull`이 기대되는 곳에 사용할 때 경고를 발생시킵니다.

## 2. 주요 경고 발생 사례
- **Unchecked conversion**: 외부 라이브러리에서 가져온 값이 `@NonNull` 파라미터나 변수에 할당될 때 발생합니다.
- **Missing non-null annotation**: 상속받은 메서드가 상위 클래스에서 `@NonNull`로 정의되어 있는데, 하위 클래스에서 이를 명시하지 않을 때 발생합니다.

## 3. 권장 해결 전략 (추후 보강 시)

### A. 명시적 Assert 사용
값이 널이 아님을 보수적으로 검증하여 IDE에게 인지시킵니다.
```java
// URI를 생성할 때 널이 아님을 보장
URI uri = file.toUri();
Assert.notNull(uri, "URI must not be null");
Resource resource = new UrlResource(uri);
```

### B. Optional 활용
반환값이 없을 수 있는 경우 `null` 대신 `Optional<T>`을 반환하도록 설계합니다.
```java
public Optional<Attachment> findById(Long id) {
    return attachmentRepository.findById(id);
}
```

### C. 패키지 기본 정책 설정
각 패키지의 `package-info.java`에 다음을 추가하여 기본적으로 모든 API가 `@NonNull`임을 선언할 수 있습니다.
```java
@org.springframework.lang.NonNullApi
@org.springframework.lang.NonNullFields
package org.aakorea.main.domain;
```

---

## 4. 에디터 설정 (VS 코드)
현재 프로젝트의 쾌적한 개발 환경을 위해 `.vscode/settings.json`에서 엄격한 널 분석 모드를 비활성화해 두었습니다.

```json
{
    "java.compile.nullAnalysis.mode": "disabled"
}
```

이 설정은 실제 빌드 결과에는 영향을 주지 않으며, 에디터 상의 과도한 경고 메시지만을 숨겨주는 역할을 합니다. 나중에 널 안정성 작업을 진행할 때 이를 다시 `automatic`으로 돌려서 검토할 수 있습니다.
