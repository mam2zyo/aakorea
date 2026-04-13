package org.aakorea.main.group.application;

import java.time.DayOfWeek;
import java.util.List;
import org.aakorea.main.group.domain.Meeting;
import org.aakorea.main.group.domain.MeetingType;
import org.aakorea.main.shared.Province;
import org.springframework.data.jpa.domain.Specification;

public final class MeetingSpecifications {

    private MeetingSpecifications() {
    }

    public static Specification<Meeting> active() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get("active"));
    }

    public static Specification<Meeting> hasProvinceIn(List<Province> provinces) {
        return (root, query, criteriaBuilder) -> root.get("location").get("province").in(provinces);
    }

    public static Specification<Meeting> hasDayOfWeek(DayOfWeek dayOfWeek) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("dayOfWeek"), dayOfWeek);
    }

    public static Specification<Meeting> hasType(MeetingType type) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("type"), type);
    }

    public static Specification<Meeting> hasDistrictId(Long districtId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("group").get("district").get("id"), districtId);
    }

    public static Specification<Meeting> hasKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();
        }
        String pattern = "%" + keyword.trim() + "%";
        return (root, query, criteriaBuilder) -> criteriaBuilder.or(
                criteriaBuilder.like(root.get("group").get("name"), pattern),
                criteriaBuilder.like(root.get("location").get("detail"), pattern));
    }

    public static Specification<Meeting> hasCoordinates() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.and(
                criteriaBuilder.isNotNull(root.get("location").get("latitude")),
                criteriaBuilder.isNotNull(root.get("location").get("longitude")));
    }
}
