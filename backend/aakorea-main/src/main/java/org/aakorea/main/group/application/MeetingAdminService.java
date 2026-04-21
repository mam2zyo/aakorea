package org.aakorea.main.group.application;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.error.FieldValidationException;
import org.aakorea.main.group.domain.Group;
import org.aakorea.main.group.domain.Meeting;
import org.aakorea.main.group.infrastructure.GroupRepository;
import org.aakorea.main.group.infrastructure.MeetingRepository;
import org.aakorea.main.common.audit.ChangeLogService;
import org.aakorea.main.shared.Location;
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
public class MeetingAdminService {

    private final MeetingRepository meetingRepository;
    private final GroupRepository groupRepository;
    private final MeetingAddressGeocoder meetingAddressGeocoder;
    private final ChangeLogService changeLogService;
    private final MeetingMapper meetingMapper;

    public List<MeetingMapper.MeetingData> getMeetings(Long groupId, String province, Boolean active) {
        Province normalizedProvince = MeetingFieldSupport.optionalProvince(province);

        Specification<Meeting> specification = (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();

        if (groupId != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("group").get("id"), groupId));
        }
        if (normalizedProvince != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("location").get("province"), normalizedProvince));
        }
        if (active != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("active"), active));
        }

        List<Meeting> meetings = meetingRepository.findAll(specification, Sort.by(Sort.Direction.ASC, "id"));
        return meetingMapper.toMeetingDataList(meetings);
    }

    @Transactional
    public MeetingMapper.MeetingData createMeeting(MeetingCommand command) {
        Group group = getGroup(command.groupId());
        Meeting meeting = meetingRepository.save(Meeting.create(
                group,
                buildLocation(
                        command.locationDetail(),
                        command.locationAddress(),
                        command.latitude(),
                        command.longitude()),
                command.dayOfWeek(),
                command.startTime(),
                command.type(),
                command.contactPhoneOverride(),
                command.active()));
        
        changeLogService.logCreate(meeting, meeting.getId());

        return meetingMapper.toMeetingData(meeting);
    }

    @Transactional
    public MeetingMapper.MeetingData updateMeeting(Long id, MeetingCommand command) {
        Meeting meeting = getMeeting(id);
        
        // Snapshot old state
        Meeting.MeetingSnapshot oldState = meeting.snapshot();

        Group group = getGroup(command.groupId());
        meeting.update(
                group,
                buildLocation(
                        command.locationDetail(),
                        command.locationAddress(),
                        command.latitude(),
                        command.longitude()),
                command.dayOfWeek(),
                command.startTime(),
                command.type(),
                command.contactPhoneOverride(),
                command.active());

        changeLogService.logUpdate(oldState, meeting, id);

        return meetingMapper.toMeetingData(meeting);
    }

    @Transactional
    public void deleteMeeting(Long id) {
        Meeting meeting = getMeeting(id);
        meetingRepository.delete(meeting);
        changeLogService.logDelete(Meeting.class, id, meeting.getGroup().getName());
    }

    @Transactional
    public CoordinateBackfillResult backfillMissingCoordinates(boolean dryRun) {
        List<Meeting> candidates = meetingRepository.findMeetingsMissingCoordinates();
        Map<String, Optional<MeetingAddressGeocoder.GeocodedAddress>> geocodingCache = new HashMap<>();
        List<CoordinateBackfillItem> items = new ArrayList<>();
        int resolvedCount = 0;
        int updatedCount = 0;
        int failedCount = 0;

        for (Meeting meeting : candidates) {
            String locationAddress = meeting.getLocationAddress();
            Optional<MeetingAddressGeocoder.GeocodedAddress> geocodedOptional = geocodingCache.computeIfAbsent(
                    locationAddress,
                    this::resolveCoordinatesForBackfill);

            if (geocodedOptional.isEmpty()) {
                failedCount++;
                items.add(new CoordinateBackfillItem(
                        meeting.getId(),
                        meeting.getGroup().getId(),
                        meeting.getGroup().getName(),
                        locationAddress,
                        null,
                        null,
                        CoordinateBackfillStatus.FAILED,
                        "locationAddress cannot determine coordinates"));
                continue;
            }

            resolvedCount++;
            MeetingAddressGeocoder.GeocodedAddress geocodedAddress = geocodedOptional.get();

            if (!dryRun) {
                meeting.updateLocation(new Location(
                        meeting.getLocationDetail(),
                        geocodedAddress.normalizedAddress(),
                        geocodedAddress.latitude(),
                        geocodedAddress.longitude()));
                updatedCount++;
            }

            items.add(new CoordinateBackfillItem(
                    meeting.getId(),
                    meeting.getGroup().getId(),
                    meeting.getGroup().getName(),
                    locationAddress,
                    geocodedAddress.latitude(),
                    geocodedAddress.longitude(),
                    dryRun ? CoordinateBackfillStatus.READY : CoordinateBackfillStatus.UPDATED,
                    dryRun ? "coordinates resolved" : "coordinates updated"));
        }

        return new CoordinateBackfillResult(
                dryRun,
                candidates.size(),
                resolvedCount,
                updatedCount,
                failedCount,
                items);
    }

    private Meeting getMeeting(Long id) {
        return meetingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "meeting not found"));
    }

    private Group getGroup(Long groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "group not found"));
    }

    private Location buildLocation(
            String locationDetail,
            String locationAddress,
            Double latitude,
            Double longitude
    ) {
        if (latitude != null && longitude != null) {
            return new Location(locationDetail, locationAddress, latitude, longitude);
        }

        // Validate basic location first through Location VO
        // Use dummy coordinates for initial validation to avoid triggering coordinate-related errors
        new Location(locationDetail, locationAddress, 0.0, 0.0);

        MeetingAddressGeocoder.GeocodedAddress geocodedAddress = resolveCoordinates(locationAddress, latitude, longitude);

        return new Location(
                locationDetail,
                geocodedAddress.normalizedAddress(),
                geocodedAddress.latitude(),
                geocodedAddress.longitude());
    }

    private MeetingAddressGeocoder.GeocodedAddress resolveCoordinates(
            String locationAddress,
            Double latitude,
            Double longitude
    ) {
        if (latitude != null && longitude != null) {
            return new MeetingAddressGeocoder.GeocodedAddress(latitude, longitude, locationAddress);
        }
        
        // At this point, if one is present, both should be present but are not.
        // However, we want Location VO to handle this validation, so we throw specifically if both are null (geocode).
        if (latitude != null || longitude != null) {
            // This case will be handled by new Location(...) in buildLocation before calling this, 
            // but just in case, we return what we have to let Location's constructor fail.
            return new MeetingAddressGeocoder.GeocodedAddress(latitude, longitude, locationAddress);
        }

        try {
            MeetingAddressGeocoder.GeocodedAddress geocodedAddress = meetingAddressGeocoder.resolveCoordinates(locationAddress);
            if (geocodedAddress == null || geocodedAddress.latitude() == null || geocodedAddress.longitude() == null) {
                throw FieldValidationException.badRequest(
                        "locationAddress",
                        "locationAddress cannot determine coordinates");
            }
            return geocodedAddress;
        } catch (IllegalStateException exception) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "address geocoding is unavailable", exception);
        }
    }

    private Optional<MeetingAddressGeocoder.GeocodedAddress> resolveCoordinatesForBackfill(String locationAddress) {
        try {
            MeetingAddressGeocoder.GeocodedAddress geocodedAddress = meetingAddressGeocoder.resolveCoordinates(locationAddress);
            if (geocodedAddress == null || geocodedAddress.latitude() == null || geocodedAddress.longitude() == null) {
                return Optional.empty();
            }
            return Optional.of(geocodedAddress);
        } catch (IllegalStateException exception) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "address geocoding is unavailable", exception);
        }
    }

    public record CoordinateBackfillResult(
            boolean dryRun,
            int totalCandidateCount,
            int resolvedCount,
            int updatedCount,
            int failedCount,
            List<CoordinateBackfillItem> items
    ) {
    }

    public record CoordinateBackfillItem(
            Long meetingId,
            Long groupId,
            String groupName,
            String locationAddress,
            Double latitude,
            Double longitude,
            CoordinateBackfillStatus status,
            String message
    ) {
    }

    public enum CoordinateBackfillStatus {
        READY,
        UPDATED,
        FAILED
    }
}
