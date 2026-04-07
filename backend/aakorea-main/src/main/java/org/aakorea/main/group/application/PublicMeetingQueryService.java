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

    private static final int MAX_NEARBY_MEETING_COUNT = 20;
    private static final int DEFAULT_NEARBY_RADIUS_KM = 5;
    private static final int MAX_NEARBY_RADIUS_KM = 50;
    private static final double EARTH_RADIUS_KM = 6371.0088;

    private final MeetingRepository meetingRepository;
    private final GroupRepository groupRepository;
    private final GroupContactRepository groupContactRepository;

    public List<PublicMeetingSummary> getMeetings(
            String province,
            String dayOfWeek,
            Double latitude,
            Double longitude,
            Integer radiusKm
    ) {
        Double normalizedLatitude = MeetingFieldSupport.optionalLatitude(latitude);
        Double normalizedLongitude = MeetingFieldSupport.optionalLongitude(longitude);
        DayOfWeek normalizedDayOfWeek = MeetingFieldSupport.optionalDayOfWeek(dayOfWeek);

        if (normalizedLatitude != null || normalizedLongitude != null) {
            MeetingFieldSupport.validateCoordinates(normalizedLatitude, normalizedLongitude);
            return getNearbyMeetings(normalizedLatitude, normalizedLongitude, normalizedDayOfWeek, normalizeRadiusKm(radiusKm));
        }

        Province normalizedProvince = MeetingFieldSupport.requireProvince(province);

        Specification<Meeting> specification = (root, query, criteriaBuilder) -> criteriaBuilder.and(
                criteriaBuilder.isTrue(root.get("active")),
                criteriaBuilder.equal(root.get("location").get("province"), normalizedProvince));

        if (normalizedDayOfWeek != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("dayOfWeek"), normalizedDayOfWeek));
        }

        return meetingRepository.findAll(specification, Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(meeting -> toSummary(meeting, null))
                .toList();
    }

    public PublicMeetingDetail getMeeting(Long id) {
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "meeting not found"));

        if (!meeting.isActive()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "meeting not found");
        }

        String representativeContactPhone = findRepresentativeContactPhone(meeting.getGroup().getId());

        return new PublicMeetingDetail(
                meeting.getId(),
                meeting.getGroup().getId(),
                meeting.getGroup().getName(),
                toDistrictData(meeting.getGroup()),
                resolveMeetingContactPhone(meeting, representativeContactPhone),
                meeting.getProvince().getCode(),
                meeting.getDayOfWeek(),
                MeetingFieldSupport.formatTime(meeting.getStartTime()),
                meeting.getType(),
                meeting.getLocationDetail(),
                meeting.getLocationAddress(),
                meeting.getLatitude(),
                meeting.getLongitude(),
                getActiveGroupMeetings(meeting.getGroup().getId(), representativeContactPhone));
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
            Double distanceKm
    ) {
    }

    public record PublicMeetingDetail(
            Long id,
            Long groupId,
            String groupName,
            DistrictData district,
            String contactPhone,
            String province,
            DayOfWeek dayOfWeek,
            String startTime,
            MeetingType type,
            String locationDetail,
            String locationAddress,
            Double latitude,
            Double longitude,
            List<GroupMeetingData> groupMeetings
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
