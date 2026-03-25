package io.step5.aakorea.modules.service.group.application;

import io.step5.aakorea.modules.basic.group.application.GroupNotFoundException;
import io.step5.aakorea.modules.service.district.application.DistrictNotFoundException;
import io.step5.aakorea.modules.service.district.domain.District;
import io.step5.aakorea.modules.service.district.infrastructure.DistrictRepository;
import io.step5.aakorea.modules.service.group.api.AdminGroupDto;
import io.step5.aakorea.modules.service.group.api.AdminGroupListResponseDto;
import io.step5.aakorea.modules.service.group.api.AdminGroupRequest;
import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.group.infrastructure.GroupRepository;
import io.step5.aakorea.modules.service.gsr.application.AdminGsrNotFoundException;
import io.step5.aakorea.modules.service.gsr.domain.GSR;
import io.step5.aakorea.modules.service.gsr.infrastructure.GSRRepository;
import io.step5.aakorea.modules.service.meeting.domain.Meeting;
import io.step5.aakorea.modules.service.meeting.domain.MeetingPlace;
import io.step5.aakorea.modules.shared.region.domain.Province;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminGroupService {

    private final GroupRepository groupRepository;
    private final DistrictRepository districtRepository;
    private final GSRRepository gsrRepository;
    private final GroupChangeLogService groupChangeLogService;

    public AdminGroupListResponseDto getGroups() {
        List<AdminGroupDto> groups = groupRepository.findAll().stream()
                .map(this::toDto)
                .sorted(Comparator.comparing(AdminGroupDto::name, String.CASE_INSENSITIVE_ORDER))
                .toList();

        return new AdminGroupListResponseDto(groups, groups.size());
    }

    @Transactional
    public AdminGroupDto createGroup(AdminGroupRequest request) {
        Group group = new Group();
        MeetingPlace meetingPlace = new MeetingPlace();

        apply(group, meetingPlace, request);
        group.setMeetingPlace(meetingPlace);

        return toDto(groupRepository.save(group));
    }

    @Transactional
    public AdminGroupDto updateGroup(Long groupId, AdminGroupRequest request) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new AdminGroupNotFoundException(groupId));
        GroupSnapshot before = GroupSnapshot.from(group);

        apply(group, group.getMeetingPlace(), request);
        GroupSnapshot after = GroupSnapshot.from(group);

        if (!before.equals(after)) {
            groupChangeLogService.record(
                    group,
                    "그룹 기본 정보가 업데이트되었습니다.",
                    buildGroupChangeDetail(before, after)
            );
        }

        return toDto(group);
    }

    @Transactional
    public void deleteGroup(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new AdminGroupNotFoundException(groupId));

        groupRepository.delete(group);
    }

    private void apply(Group group, MeetingPlace meetingPlace, AdminGroupRequest request) {
        group.setName(normalizeText(request.name()));
        group.setStartDate(request.startDate());
        group.setProvince(request.province());
        group.setDistrict(resolveDistrict(request.districtId()));
        group.setGsr(resolveGsr(request.gsrId()));
        group.setContactAddress(normalizeNullableText(request.contactAddress()));
        group.setContactEmail(normalizeNullableText(request.contactEmail()));
        group.setContactPhone(normalizeNullableText(request.contactPhone()));

        meetingPlace.setRoadAddress(normalizeText(request.meetingRoadAddress()));
        meetingPlace.setDetailAddress(normalizeText(request.meetingDetailAddress()));
        meetingPlace.setGuide(normalizeNullableText(request.meetingGuide()));
        meetingPlace.setLatitude(request.meetingLatitude() != null ? request.meetingLatitude() : 0.0);
        meetingPlace.setLongitude(request.meetingLongitude() != null ? request.meetingLongitude() : 0.0);
    }

    private District resolveDistrict(Long districtId) {
        if (districtId == null) {
            return null;
        }

        return districtRepository.findById(districtId)
                .orElseThrow(() -> new DistrictNotFoundException(districtId));
    }

    private GSR resolveGsr(Long gsrId) {
        if (gsrId == null) {
            return null;
        }

        return gsrRepository.findById(gsrId)
                .orElseThrow(() -> new AdminGsrNotFoundException(gsrId));
    }

    private String normalizeText(String text) {
        return text == null ? "" : text.trim().replaceAll("\\s+", " ");
    }

    private String normalizeNullableText(String text) {
        if (text == null) {
            return null;
        }

        String normalized = text.trim().replaceAll("\\s+", " ");
        return normalized.isEmpty() ? null : normalized;
    }

    private AdminGroupDto toDto(Group group) {
        return new AdminGroupDto(
                group.getId(),
                group.getName(),
                group.getStartDate(),
                group.getProvince().name(),
                group.getDistrict() != null ? group.getDistrict().getId() : null,
                group.getDistrict() != null ? group.getDistrict().getName() : null,
                group.getGsr() != null ? group.getGsr().getId() : null,
                group.getGsr() != null ? group.getGsr().getNickname() : null,
                group.getContactAddress(),
                group.getContactEmail(),
                group.getContactPhone(),
                group.getMeetingPlace().getRoadAddress(),
                group.getMeetingPlace().getDetailAddress(),
                group.getMeetingPlace().getGuide(),
                group.getMeetingPlace().getLatitude(),
                group.getMeetingPlace().getLongitude(),
                group.getMeetings().size()
        );
    }

    private String buildGroupChangeDetail(GroupSnapshot before, GroupSnapshot after) {
        List<String> lines = new ArrayList<>();
        appendChange(lines, "그룹명", before.name(), after.name());
        appendChange(lines, "시작일", before.startDate(), after.startDate());
        appendChange(lines, "시/도", before.province(), after.province());
        appendChange(lines, "지역연합", before.districtName(), after.districtName());
        appendChange(lines, "GSR", before.gsrNickname(), after.gsrNickname());
        appendChange(lines, "연락 주소", before.contactAddress(), after.contactAddress());
        appendChange(lines, "이메일", before.contactEmail(), after.contactEmail());
        appendChange(lines, "전화번호", before.contactPhone(), after.contactPhone());
        appendChange(lines, "기본 모임 도로명주소", before.meetingRoadAddress(), after.meetingRoadAddress());
        appendChange(lines, "기본 모임 상세주소", before.meetingDetailAddress(), after.meetingDetailAddress());
        appendChange(lines, "기본 모임 안내", before.meetingGuide(), after.meetingGuide());
        appendChange(lines, "위도", before.meetingLatitude(), after.meetingLatitude());
        appendChange(lines, "경도", before.meetingLongitude(), after.meetingLongitude());
        return String.join("\n", lines);
    }

    private void appendChange(List<String> lines, String label, Object before, Object after) {
        if (Objects.equals(before, after)) {
            return;
        }

        lines.add("- " + label + ": " + formatValue(before) + " -> " + formatValue(after));
    }

    private String formatValue(Object value) {
        if (value == null) {
            return "-";
        }

        if (value instanceof String stringValue) {
            return stringValue.isBlank() ? "-" : stringValue;
        }

        return String.valueOf(value);
    }

    private record GroupSnapshot(
            String name,
            LocalDate startDate,
            Province province,
            String districtName,
            String gsrNickname,
            String contactAddress,
            String contactEmail,
            String contactPhone,
            String meetingRoadAddress,
            String meetingDetailAddress,
            String meetingGuide,
            Double meetingLatitude,
            Double meetingLongitude
    ) {
        private static GroupSnapshot from(Group group) {
            MeetingPlace meetingPlace = group.getMeetingPlace();
            return new GroupSnapshot(
                    group.getName(),
                    group.getStartDate(),
                    group.getProvince(),
                    group.getDistrict() != null ? group.getDistrict().getName() : null,
                    group.getGsr() != null ? group.getGsr().getNickname() : null,
                    group.getContactAddress(),
                    group.getContactEmail(),
                    group.getContactPhone(),
                    meetingPlace != null ? meetingPlace.getRoadAddress() : null,
                    meetingPlace != null ? meetingPlace.getDetailAddress() : null,
                    meetingPlace != null ? meetingPlace.getGuide() : null,
                    meetingPlace != null ? meetingPlace.getLatitude() : null,
                    meetingPlace != null ? meetingPlace.getLongitude() : null
            );
        }
    }
}

