package io.step5.aakorea.domain;

/**
 * 그룹 상세 페이지에 노출되는 공지 유형.
 *
 * GENERAL     : 상시/일반 안내
 * TEMP_CHANGE : 임시 장소/시간 변경 등
 * CLOSED_INFO : 특정 기간 휴무/운영 중단 안내
 */
public enum NoticeType {
    GENERAL,
    TEMP_CHANGE,
    CLOSED_INFO
}