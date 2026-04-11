package org.aakorea.main.group.application;

import java.time.DayOfWeek;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.group.domain.Group;
import org.aakorea.main.group.domain.Meeting;
import org.aakorea.main.group.domain.MeetingType;
import org.aakorea.main.group.infrastructure.GroupContactRepository;
import org.aakorea.main.group.infrastructure.GroupRepository;
import org.aakorea.main.group.infrastructure.MeetingRepository;
import org.aakorea.main.shared.Province;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicMeetingQueryService {

    private static final int MAX_NEARBY_MEETING_COUNT = 500;
    private static final int DEFAULT_NEARBY_RADIUS_KM = 100;
    private static final int MAX_NEARBY_RADIUS_KM = 100;
    private static final double EARTH_RADIUS_KM = 6371.0088;

    private final MeetingRepository meetingRepository;
    private final GroupRepository groupRepository;
    private final GroupContactRepository groupContactRepository;

    public List<PublicMeetingSummary> getMeetings(
            List<String> province,
            String dayOfWeek,
            MeetingType type,
            Long districtId,
            String keyword,
            Double latitude,
            Double longitude,
            Integer radiusKm
    ) {
        Double normalizedLatitude = MeetingFieldSupport.optionalLatitude(latitude);
        Double normalizedLongitude = MeetingFieldSupport.optionalLongitude(longitude);
        DayOfWeek normalizedDayOfWeek = MeetingFieldSupport.optionalDayOfWeek(dayOfWeek);

        if (normalizedLatitude != null || normalizedLongitude != null) {
            MeetingFieldSupport.validateCoordinates(normalizedLatitude, normalizedLongitude);
            return getNearbyMeetings(normalizedLatitude, normalizedLongitude, normalizedDayOfWeek, type, districtId, keyword, normalizeRadiusKm(radiusKm));
        }

        boolean isAllProvinces = province != null && province.contains("all");
        Specification<Meeting> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.isTrue(root.get("active"));

        if (!isAllProvinces) {
            List<Province> normalizedProvinces = MeetingFieldSupport.requireProvinces(province);
            specification = specification.and((root, query, criteriaBuilder) ->
                    root.get("location").get("province").in(normalizedProvinces));
        }

        if (normalizedDayOfWeek != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("dayOfWeek"), normalizedDayOfWeek));
        }

        if (type != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("type"), type));
        }

        if (districtId != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("group").get("district").get("id"), districtId));
        }

        if (keyword != null && !keyword.isBlank()) {
            String pattern = "%" + keyword.trim() + "%";
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.or(
                            criteriaBuilder.like(root.get("group").get("name"), pattern),
                            criteriaBuilder.like(root.get("location").get("detail"), pattern)));
        }

        return meetingRepository.findAll(specification).stream()
                .sorted(Comparator
                        .comparingInt((Meeting m) -> m.getDayOfWeek().getValue())
                        .thenComparing(Meeting::getStartTime)
                        .thenComparing(Meeting::getId))
                .map(meeting -> toSummary(meeting, null))
                .toList();
    }


    public PublicGroupDetail getGroup(Long id) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "group not found"));

        String representativeContactPhone = findRepresentativeContactPhone(id);
        List<GroupMeetingData> activeMeetings = getActiveGroupMeetings(id, representativeContactPhone);
        if (activeMeetings.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "group not found");
        }

        return new PublicGroupDetail(
                group.getId(),
                group.getName(),
                toDistrictData(group),
                representativeContactPhone,
                group.getNotice(),
                activeMeetings);
    }

    private List<PublicMeetingSummary> getNearbyMeetings(
            Double latitude,
            Double longitude,
            DayOfWeek dayOfWeek,
            MeetingType type,
            Long districtId,
            String keyword,
            int radiusKm
    ) {
        Specification<Meeting> specification = (root, query, criteriaBuilder) -> criteriaBuilder.and(
                criteriaBuilder.isTrue(root.get("active")),
                criteriaBuilder.isNotNull(root.get("location").get("latitude")),
                criteriaBuilder.isNotNull(root.get("location").get("longitude")));

        if (dayOfWeek != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("dayOfWeek"), dayOfWeek));
        }

        if (type != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("type"), type));
        }

        if (districtId != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("group").get("district").get("id"), districtId));
        }

        if (keyword != null && !keyword.isBlank()) {
            String pattern = "%" + keyword.trim() + "%";
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.or(
                            criteriaBuilder.like(root.get("group").get("name"), pattern),
                            criteriaBuilder.like(root.get("location").get("detail"), pattern)));
        }

        return meetingRepository.findAll(specification, Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(meeting -> new NearbyMeeting(meeting, calculateDistanceKm(
                        latitude,
                        longitude,
                        meeting.getLatitude(),
                        meeting.getLongitude())))
                .filter(item -> item.distanceKm() <= radiusKm)
                .sorted(Comparator
                        .comparingDouble(NearbyMeeting::distanceKm)
                        .thenComparing(item -> item.meeting().getDayOfWeek().getValue())
                        .thenComparing(item -> item.meeting().getStartTime())
                        .thenComparing(item -> item.meeting().getId()))
                .limit(MAX_NEARBY_MEETING_COUNT)
                .map(item -> toSummary(item.meeting(), item.distanceKm()))
                .toList();
    }

    private PublicMeetingSummary toSummary(Meeting meeting, Double distanceKm) {
        return new PublicMeetingSummary(
                meeting.getId(),
                meeting.getGroup().getId(),
                meeting.getGroup().getName(),
                meeting.getProvince().getCode(),
                meeting.getDayOfWeek(),
                MeetingFieldSupport.formatTime(meeting.getStartTime()),
                meeting.getType(),
                meeting.getLocationDetail(),
                meeting.getLocationAddress(),
                meeting.getLatitude(),
                meeting.getLongitude(),
                meeting.getGroup().getDistrict().getId(),
                distanceKm == null ? null : roundDistanceKm(distanceKm));
    }

    private DistrictData toDistrictData(Group group) {
        return new DistrictData(group.getDistrict().getId(), group.getDistrict().getName());
    }

    private String findRepresentativeContactPhone(Long groupId) {
        return groupContactRepository.findFirstByGroup_IdOrderByIdAsc(groupId)
                .map(groupContact -> groupContact.getPhone())
                .orElse(null);
    }

    private List<GroupMeetingData> getActiveGroupMeetings(Long groupId, String representativeContactPhone) {
        return meetingRepository.findAllByGroup_IdAndActiveTrueOrderByIdAsc(groupId).stream()
                .sorted(Comparator
                        .comparingInt((Meeting item) -> item.getDayOfWeek().getValue())
                        .thenComparing(Meeting::getStartTime)
                        .thenComparing(Meeting::getId))
                .map(meeting -> toGroupMeetingData(meeting, representativeContactPhone))
                .toList();
    }

    private GroupMeetingData toGroupMeetingData(Meeting meeting, String representativeContactPhone) {
        return new GroupMeetingData(
                meeting.getId(),
                resolveMeetingContactPhone(meeting, representativeContactPhone),
                meeting.getProvince().getCode(),
                meeting.getDayOfWeek(),
                MeetingFieldSupport.formatTime(meeting.getStartTime()),
                meeting.getType(),
                meeting.getLocationDetail(),
                meeting.getLocationAddress(),
                meeting.getLatitude(),
                meeting.getLongitude());
    }

    private String resolveMeetingContactPhone(Meeting meeting, String representativeContactPhone) {
        return meeting.getContactPhoneOverride() != null
                ? meeting.getContactPhoneOverride()
                : representativeContactPhone;
    }

    private int normalizeRadiusKm(Integer radiusKm) {
        if (radiusKm == null) {
            return DEFAULT_NEARBY_RADIUS_KM;
        }

        if (radiusKm < 1 || radiusKm > MAX_NEARBY_RADIUS_KM) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "radiusKm is invalid");
        }

        return radiusKm;
    }

    private double calculateDistanceKm(
            double originLatitude,
            double originLongitude,
            double destinationLatitude,
            double destinationLongitude
    ) {
        double originLatitudeRadians = Math.toRadians(originLatitude);
        double destinationLatitudeRadians = Math.toRadians(destinationLatitude);
        double latitudeDelta = Math.toRadians(destinationLatitude - originLatitude);
        double longitudeDelta = Math.toRadians(destinationLongitude - originLongitude);

        double haversine = Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2)
                + Math.cos(originLatitudeRadians) * Math.cos(destinationLatitudeRadians)
                * Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2);
        double centralAngle = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

        return EARTH_RADIUS_KM * centralAngle;
    }

    private double roundDistanceKm(double distanceKm) {
        return Double.parseDouble(String.format(Locale.ROOT, "%.1f", distanceKm));
    }

    public record PublicMeetingSummary(
            Long id,
            Long groupId,
            String groupName,
            String province,
            DayOfWeek dayOfWeek,
            String startTime,
            MeetingType type,
            String locationDetail,
            String locationAddress,
            Double latitude,
            Double longitude,
            Long districtId,
            Double distanceKm
    ) {
    }


    public record PublicGroupDetail(
            Long id,
            String name,
            DistrictData district,
            String contactPhone,
            String notice,
            List<GroupMeetingData> meetings
    ) {
    }

    public record DistrictData(
            Long id,
            String name
    ) {
    }

    public record GroupMeetingData(
            Long id,
            String contactPhone,
            String province,
            DayOfWeek dayOfWeek,
            String startTime,
            MeetingType type,
            String locationDetail,
            String locationAddress,
            Double latitude,
            Double longitude
    ) {
    }

    private record NearbyMeeting(
            Meeting meeting,
            double distanceKm
    ) {
    }
}
