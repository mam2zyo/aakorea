# PostGIS Setup Guide (Ubuntu 24.04)

이 문서는 개발 및 운영 환경(Ubuntu/Debian Linux)에서 위치 기반 검색 성능 향상을 위해 PostGIS를 설치하고 설정하는 과정을 설명합니다.

## 1. 사전 요구 사항
- Ubuntu 24.04 (Noble Numbat) 또는 동급 Linux 배포판
- PostgreSQL 18
- `aakorea_admin` 계정 및 `aakorea_main` 데이터베이스

## 2. PostGIS 패키지 설치
서버 또는 개발 환경 터미널에서 아래 명령어를 실행하여 PostGIS 패키지를 설치합니다.

```bash
sudo apt update
sudo apt install postgresql-18-postgis-3
```

## 3. 데이터베이스 확장 활성화
PostgreSQL에 접속하여 `postgis` 확장을 설치합니다.

```bash
# 슈퍼유저 권한으로 psql 접속
sudo -u postgres psql -d aakorea_main

# 확장 활성화
CREATE EXTENSION IF NOT EXISTS postgis;

# 설치 확인
SELECT postgis_full_version();
```

## 4. 데이터베이스 마이그레이션 및 인덱스 설정
애플리케이션 코드 수정 후, 기존의 위/경도 데이터를 공간 데이터(`Point`)로 변환하고 검색 성능을 위해 공간 인덱스를 생성해야 합니다.

```sql
-- 1. 공간 컬럼 추가 (위경도 4326 geometry)
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS location_point geometry(Point, 4326);

-- 2. 기존 데이터 이관 (X는 경도, Y는 위도)
UPDATE meetings 
SET location_point = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 3. 공간 인덱스 생성 (GIST)
CREATE INDEX IF NOT EXISTS idx_meetings_location_point ON meetings USING GIST (location_point);
```

## 5. 애플리케이션 설정
Spring Boot 애플리케이션의 `build.gradle`에 아래 의존성이 추가되어야 합니다.

```gradle
dependencies {
    implementation 'org.hibernate.orm:hibernate-spatial'
}
```

## 6. 문제 해결 (Troubleshooting)
### Peer authentication failed
명령어 실행 시 `Peer authentication failed` 에러가 발생하면, `sudo -u postgres`를 사용하여 실행하거나 `pg_hba.conf` 설정을 확인하세요.

### JTS Library Conflict
`hibernate-spatial`은 내부적으로 `org.locationtech.jts`를 사용합니다. 별도의 JTS 의존성이 중복 추가되지 않도록 주의하세요.
