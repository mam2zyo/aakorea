package io.step5.aakorea.service.admin;

import io.step5.aakorea.domain.District;
import io.step5.aakorea.domain.GSR;
import io.step5.aakorea.domain.Group;
import io.step5.aakorea.domain.MeetingPlace;
import io.step5.aakorea.dto.admin.AdminGroupDto;
import io.step5.aakorea.dto.admin.AdminGroupListResponseDto;
import io.step5.aakorea.dto.admin.AdminGroupRequest;
import io.step5.aakorea.repository.DistrictRepository;
import io.step5.aakorea.repository.GSRRepository;
import io.step5.aakorea.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminGroupService {

    private final GroupRepository groupRepository;
    private final DistrictRepository districtRepository;
    private final GSRRepository gsrRepository;

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

        apply(group, group.getMeetingPlace(), request);

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
        meetingPlace.setLatitude(request.meetingLatitude());
        meetingPlace.setLongitude(request.meetingLongitude());
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
}
