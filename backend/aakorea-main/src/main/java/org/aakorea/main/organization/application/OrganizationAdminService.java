package org.aakorea.main.organization.application;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.organization.domain.District;
import org.aakorea.main.organization.domain.Group;
import org.aakorea.main.organization.domain.GroupContact;
import org.aakorea.main.organization.infrastructure.DistrictRepository;
import org.aakorea.main.organization.infrastructure.GroupContactRepository;
import org.aakorea.main.organization.infrastructure.GroupRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrganizationAdminService {

    private final DistrictRepository districtRepository;
    private final GroupRepository groupRepository;
    private final GroupContactRepository groupContactRepository;

    public List<DistrictData> getDistricts() {
        return districtRepository.findAllByOrderByIdAsc().stream()
                .map(this::toDistrictData)
                .toList();
    }

    @Transactional
    public DistrictData createDistrict(String name, boolean active) {
        District district = districtRepository.save(new District(normalize(name), active));
        return toDistrictData(district);
    }

    @Transactional
    public DistrictData updateDistrict(Long id, String name, boolean active) {
        District district = getDistrict(id);
        district.update(normalize(name), active);
        return toDistrictData(district);
    }

    public List<GroupData> getGroups(Long districtId, Boolean active) {
        List<Group> groups;

        if (districtId != null && active != null) {
            groups = groupRepository.findAllByDistrict_IdAndActiveOrderByIdAsc(districtId, active);
        } else if (districtId != null) {
            groups = groupRepository.findAllByDistrict_IdOrderByIdAsc(districtId);
        } else if (active != null) {
            groups = groupRepository.findAllByActiveOrderByIdAsc(active);
        } else {
            groups = groupRepository.findAllByOrderByIdAsc();
        }

        return groups.stream()
                .map(this::toGroupData)
                .toList();
    }

    @Transactional
    public GroupData createGroup(Long districtId, String name, boolean active) {
        District district = getDistrict(districtId);
        Group group = groupRepository.save(new Group(district, normalize(name), active));
        return toGroupData(group);
    }

    @Transactional
    public GroupData updateGroup(Long id, Long districtId, String name, boolean active) {
        Group group = getGroup(id);
        District district = getDistrict(districtId);
        group.update(district, normalize(name), active);
        return toGroupData(group);
    }

    public List<GroupContactData> getGroupContacts(Long groupId, Boolean active) {
        List<GroupContact> groupContacts;

        if (groupId != null && active != null) {
            groupContacts = groupContactRepository.findAllByGroup_IdAndActiveOrderByIdAsc(groupId, active);
        } else if (groupId != null) {
            groupContacts = groupContactRepository.findAllByGroup_IdOrderByIdAsc(groupId);
        } else if (active != null) {
            groupContacts = groupContactRepository.findAllByActiveOrderByIdAsc(active);
        } else {
            groupContacts = groupContactRepository.findAllByOrderByIdAsc();
        }

        return groupContacts.stream()
                .map(this::toGroupContactData)
                .toList();
    }

    @Transactional
    public GroupContactData createGroupContact(Long groupId, String phone, boolean active) {
        Group group = getGroup(groupId);
        GroupContact groupContact = groupContactRepository.save(new GroupContact(group, normalize(phone), active));
        return toGroupContactData(groupContact);
    }

    @Transactional
    public GroupContactData updateGroupContact(Long id, String phone, boolean active) {
        GroupContact groupContact = getGroupContact(id);
        groupContact.update(normalize(phone), active);
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

    private DistrictData toDistrictData(District district) {
        return new DistrictData(district.getId(), district.getName(), district.isActive());
    }

    private GroupData toGroupData(Group group) {
        return new GroupData(group.getId(), group.getDistrict().getId(), group.getName(), group.isActive());
    }

    private GroupContactData toGroupContactData(GroupContact groupContact) {
        return new GroupContactData(
                groupContact.getId(),
                groupContact.getGroup().getId(),
                groupContact.getPhone(),
                groupContact.isActive());
    }

    private String normalize(String value) {
        return value.trim();
    }

    public record DistrictData(Long id, String name, boolean active) {
    }

    public record GroupData(Long id, Long districtId, String name, boolean active) {
    }

    public record GroupContactData(Long id, Long groupId, String phone, boolean active) {
    }
}
