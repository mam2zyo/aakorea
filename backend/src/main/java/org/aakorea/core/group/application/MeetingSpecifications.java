package org.aakorea.core.group.application;

import java.time.DayOfWeek;
import java.util.List;
import org.aakorea.core.group.domain.Meeting;
import org.aakorea.core.group.domain.MeetingType;
import org.aakorea.core.shared.Province;
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
        return (root, query, criteriaBuilder) -> criteriaBuilder.isNotNull(root.get("location").get("point"));
    }

    public static Specification<Meeting> isWithinDistance(org.locationtech.jts.geom.Point refPoint, double radiusKm) {
        return (root, query, criteriaBuilder) -> {
            // Convert km to meters for ST_DWithin (when used with geography)
            // Or use ST_DWithin with geometry and cast
            return criteriaBuilder.isTrue(
                    criteriaBuilder.function("ST_DWithin", Boolean.class,
                            root.get("location").get("point"),
                            criteriaBuilder.literal(refPoint),
                            criteriaBuilder.literal(radiusKm * 1000.0),
                            criteriaBuilder.literal(true) // useSpheroid
                    )
            );
        };
    }
}
