package org.aakorea.main.group.application;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.error.FieldValidationException;
import org.aakorea.main.generalservice.domain.District;
import org.aakorea.main.generalservice.infrastructure.DistrictRepository;
import org.aakorea.main.group.domain.Group;
import org.aakorea.main.group.domain.GroupContact;
import org.aakorea.main.group.infrastructure.GroupContactRepository;
import org.aakorea.main.group.infrastructure.GroupRepository;
import org.aakorea.main.group.infrastructure.MeetingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GroupAdminService {

    private final DistrictRepository districtRepository;
    private final GroupRepository groupRepository;
    private final GroupContactRepository groupContactRepository;
    private final MeetingRepository meetingRepository;

    public List<GroupData> getGroups(Long districtId) {
        List<Group> groups = districtId != null
                ? groupRepository.findAllByDistrict_IdOrderByIdAsc(districtId)
                : groupRepository.findAllByOrderByIdAsc();

        return groups.stream()
                .map(this::toGroupData)
                .toList();
    }

    @Transactional
    public GroupData createGroup(
            Long districtId,
            String name,
            String locationName,
            String locationAddress,
            String introduction,
            String notice,
            String changeSummary
    ) {
        District district = getDistrict(districtId);
        String normalizedLocationName = GroupFieldSupport.optionalText(locationName);
        String normalizedLocationAddress = GroupFieldSupport.optionalText(locationAddress);
        GroupFieldSupport.validateBaseLocation(normalizedLocationName, normalizedLocationAddress);

        Group group = groupRepository.save(new Group(
                district,
                GroupFieldSupport.requireName(name),
                normalizedLocationName,
                normalizedLocationAddress,
                GroupFieldSupport.optionalText(introduction),
                GroupFieldSupport.optionalText(notice),
                GroupFieldSupport.optionalText(changeSummary)));
        return toGroupData(group);
    }

    @Transactional
    public GroupData updateGroup(
            Long id,
            Long districtId,
            String name,
            String locationName,
            String locationAddress,
            String introduction,
            String notice,
            String changeSummary
    ) {
        Group group = getGroup(id);
        District district = getDistrict(districtId);
        String normalizedLocationName = GroupFieldSupport.optionalText(locationName);
        String normalizedLocationAddress = GroupFieldSupport.optionalText(locationAddress);
        GroupFieldSupport.validateBaseLocation(normalizedLocationName, normalizedLocationAddress);

        group.update(
                district,
                GroupFieldSupport.requireName(name),
                normalizedLocationName,
                normalizedLocationAddress,
                GroupFieldSupport.optionalText(introduction),
                GroupFieldSupport.optionalText(notice),
                GroupFieldSupport.optionalText(changeSummary));
        return toGroupData(group);
    }

    @Transactional
    public void deleteGroup(Long id) {
        Group group = getGroup(id);

        if (groupContactRepository.existsByGroup_Id(id) || meetingRepository.existsByGroup_Id(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "연락처 또는 모임이 연결된 Group은 삭제할 수 없습니다.");
        }

        groupRepository.delete(group);
    }

    public List<GroupContactData> getGroupContacts(Long groupId) {
        List<GroupContact> groupContacts = groupId != null
                ? groupContactRepository.findAllByGroup_IdOrderByIdAsc(groupId)
                : groupContactRepository.findAllByOrderByIdAsc();

        return groupContacts.stream()
                .map(this::toGroupContactData)
                .toList();
    }

    @Transactional
    public GroupContactData createGroupContact(Long groupId, String phone) {
        Group group = getGroup(groupId);
        GroupContact groupContact = groupContactRepository.save(new GroupContact(group, requirePhone(phone)));
        return toGroupContactData(groupContact);
    }

    @Transactional
    public GroupContactData updateGroupContact(Long id, String phone) {
        GroupContact groupContact = getGroupContact(id);
        groupContact.update(requirePhone(phone));
        return toGroupContactData(groupContact);
    }

    private District getDistrict(Long districtId) {
        return districtRepository.findById(districtId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "district not found"));
    }

    private Group getGroup(Long groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "group not found"));
    }

    private GroupContact getGroupContact(Long groupContactId) {
        return groupContactRepository.findById(groupContactId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "group contact not found"));
    }

    private GroupData toGroupData(Group group) {
        return new GroupData(
                group.getId(),
                group.getDistrict().getId(),
                group.getName(),
                group.getLocationName(),
                group.getLocationAddress(),
                group.getIntroduction(),
                group.getNotice(),
                group.getChangeSummary());
    }

    private GroupContactData toGroupContactData(GroupContact groupContact) {
        return new GroupContactData(
                groupContact.getId(),
                groupContact.getGroup().getId(),
                groupContact.getPhone());
    }

    private String requirePhone(String value) {
        if (value == null || value.isBlank()) {
            throw FieldValidationException.badRequest("phone", "phone is required");
        }

        return value.trim();
    }

    public record GroupData(
            Long id,
            Long districtId,
            String name,
            String locationName,
            String locationAddress,
            String introduction,
            String notice,
            String changeSummary
    ) {
    }

    public record GroupContactData(Long id, Long groupId, String phone) {
    }
}
