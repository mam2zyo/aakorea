package io.step5.aakorea.modules.shared.region.domain;

public enum Province {
    SEOUL("Seoul"),
    BUSAN("Busan"),
    DAEGU("Daegu"),
    INCHEON("Incheon"),
    GWANGJU("Gwangju"),
    DAEJEON("Daejeon"),
    ULSAN("Ulsan"),
    SEJONG("Sejong"),
    GYEONGGI("Gyeonggi"),
    GANGWON("Gangwon"),
    CHUNGBUK("Chungbuk"),
    CHUNGNAM("Chungnam"),
    JEONBUK("Jeonbuk"),
    JEONNAM("Jeonnam"),
    GYEONGBUK("Gyeongbuk"),
    GYEONGNAM("Gyeongnam"),
    JEJU("Jeju");

    private final String koreanName;

    Province(String koreanName) {
        this.koreanName = koreanName;
    }

    public String getKoreanName() {
        return koreanName;
    }
}