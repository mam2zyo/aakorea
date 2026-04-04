package org.aakorea.main.shared;

import java.util.Arrays;
import java.util.Locale;

public enum Province {
    SEOUL("seoul", "서울특별시", "서울"),
    BUSAN("busan", "부산광역시", "부산"),
    DAEGU("daegu", "대구광역시", "대구"),
    INCHEON("incheon", "인천광역시", "인천"),
    GWANGJU("gwangju", "광주광역시", "광주"),
    DAEJEON("daejeon", "대전광역시", "대전"),
    ULSAN("ulsan", "울산광역시", "울산"),
    SEJONG("sejong", "세종특별자치시", "세종"),
    GYEONGGI("gyeonggi", "경기도", "경기"),
    GANGWON("gangwon", "강원특별자치도", "강원도", "강원"),
    CHUNGBUK("chungbuk", "충청북도", "충북"),
    CHUNGNAM("chungnam", "충청남도", "충남"),
    JEONBUK("jeonbuk", "전북특별자치도", "전라북도", "전북"),
    JEONNAM("jeonnam", "전라남도", "전남"),
    GYEONGBUK("gyeongbuk", "경상북도", "경북"),
    GYEONGNAM("gyeongnam", "경상남도", "경남"),
    JEJU("jeju", "제주특별자치도", "제주도", "제주");

    private final String code;
    private final String[] addressPrefixes;

    Province(String code, String... addressPrefixes) {
        this.code = code;
        this.addressPrefixes = addressPrefixes;
    }

    public String getCode() {
        return code;
    }

    public static Province fromCode(String code) {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("province code is blank");
        }

        String normalizedCode = code.trim().toLowerCase(Locale.ROOT);

        return Arrays.stream(values())
                .filter(province -> province.code.equals(normalizedCode))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("province code is invalid"));
    }

    public static Province fromAddress(String address) {
        if (address == null || address.isBlank()) {
            throw new IllegalArgumentException("province address is blank");
        }

        String normalizedAddress = address.trim();

        return Arrays.stream(values())
                .filter(province -> province.matchesAddressPrefix(normalizedAddress))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("province address is invalid"));
    }

    private boolean matchesAddressPrefix(String address) {
        return Arrays.stream(addressPrefixes)
                .anyMatch(address::startsWith);
    }
}
