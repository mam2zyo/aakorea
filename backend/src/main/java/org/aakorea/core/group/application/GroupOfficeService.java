package org.aakorea.core.group.application;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.core.common.error.FieldValidationException;
import org.aakorea.core.aaservice.domain.District;
import org.aakorea.core.aaservice.infrastructure.DistrictRepository;
import org.aakorea.core.group.domain.Group;
import org.aakorea.core.group.domain.GroupContact;
import org.aakorea.core.group.infrastructure.GroupContactRepository;
import org.aakorea.core.group.infrastructure.GroupRepository;
import org.aakorea.core.group.infrastructure.MeetingRepository;
import org.aakorea.core.common.audit.ChangeLogService;
import org.aakorea.core.shared.PostalContact;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GroupOfficeService {

    private final DistrictRepository districtRepository;
    private final GroupRepository groupRepository;
    private final GroupContactRepository groupContactRepository;
    private final MeetingRepository meetingRepository;
    private final MeetingOfficeService meetingOfficeService;
    private final ChangeLogService changeLogService;

    @Transactional
    public Long createGroupComposite(GroupCompositeRequest request) {
        // 1. Create Group
        GroupData groupData = createGroup(request.districtId(), request.name(), request.notice());
        Long groupId = groupData.id();

        // 2. Create Contact (if provided)
        if (request.contact() != null) {
            createGroupContact(
                    groupId,
                    request.contact().phone(),
                    request.contact().email(),
                    request.contact().postalContact()
            );
        }

        // 3. Create Meetings (if provided)
        if (request.meetings() != null) {
            for (GroupCompositeRequest.MeetingCompositeRequest meetingRequest : request.meetings()) {
                meetingOfficeService.createMeeting(MeetingCommand.from(
                        groupId,
                        meetingRequest.locationDetail(),
                        meetingRequest.locationAddress(),
                        meetingRequest.latitude(),
                        meetingRequest.longitude(),
                        meetingRequest.contactPhoneOverride(),
                        meetingRequest.dayOfWeek(),
                        meetingRequest.startTime(),
                        meetingRequest.type(),
                        meetingRequest.active()
                ));
            }
        }

        return groupId;
    }

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
            String notice
    ) {
        District district = getDistrict(districtId);
        Group group = groupRepository.save(new Group(
                district,
                GroupFieldSupport.requireName(name),
                GroupFieldSupport.optionalNotice(notice)));
        changeLogService.logCreate(group, group.getId());
        return toGroupData(group);
    }

    @Transactional
    public GroupData updateGroup(
            Long id,
            Long districtId,
            String name,
            String notice
    ) {
        Group group = getGroup(id);
        
        // Snapshot old state for auditing
        Group oldState = new Group(group.getDistrict(), group.getName(), group.getNotice());

        District district = getDistrict(districtId);
        group.update(
                district,
                GroupFieldSupport.requireName(name),
                GroupFieldSupport.optionalNotice(notice));
        
        changeLogService.logUpdate(oldState, group, id);
        
        return toGroupData(group);
    }

    @Transactional
    public void deleteGroup(Long id) {
        Group group = getGroup(id);
        meetingRepository.deleteAllByGroup_Id(id);
        groupContactRepository.deleteAllByGroup_Id(id);
        groupRepository.delete(group);
        changeLogService.logDelete(Group.class, id, group.getName());
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
    public GroupContactData createGroupContact(
            Long groupId,
            String phone,
            String email,
            PostalContactInput postalContact
    ) {
        Group group = getGroup(groupId);
        if (groupContactRepository.existsByGroup_Id(groupId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "group contact already exists");
        }
        GroupContact groupContact = groupContactRepository.save(new GroupContact(
                group,
                requirePhone(phone),
                optionalText(email),
                toPostalContact(postalContact)));
        changeLogService.logCreate(groupContact, groupContact.getId());
        return toGroupContactData(groupContact);
    }

    @Transactional
    public GroupContactData updateGroupContact(
            Long id,
            String phone,
            String email,
            PostalContactInput postalContact
    ) {
        GroupContact groupContact = getGroupContact(id);
        
        // Snapshot old state
        GroupContact oldState = new GroupContact(
            groupContact.getGroup(),
            groupContact.getPhone(),
            groupContact.getEmail(),
            groupContact.getPostalContact()
        );

        groupContact.update(
                requirePhone(phone),
                optionalText(email),
                toPostalContact(postalContact));
        
        changeLogService.logUpdate(oldState, groupContact, id);
        
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
                group.getNotice());
    }

    private GroupContactData toGroupContactData(GroupContact groupContact) {
        return new GroupContactData(
                groupContact.getId(),
                groupContact.getGroup().getId(),
                groupContact.getPhone(),
                groupContact.getEmail(),
                toPostalContactData(groupContact.getPostalContact()));
    }

    private String requirePhone(String value) {
        if (value == null || value.isBlank()) {
            throw FieldValidationException.badRequest("phone", "phone is required");
        }

        return value.trim();
    }

    private String optionalText(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    private PostalContact toPostalContact(PostalContactInput postalContact) {
        if (postalContact == null) {
            return null;
        }

        PostalContact normalized = new PostalContact(
                optionalText(postalContact.recipient()),
                optionalText(postalContact.postalCode()),
                optionalText(postalContact.roadAddress()),
                optionalText(postalContact.detailAddress()));

        return normalized.isEmpty() ? null : normalized;
    }

    private PostalContactData toPostalContactData(PostalContact postalContact) {
        if (postalContact == null) {
            return null;
        }

        return new PostalContactData(
                postalContact.getRecipient(),
                postalContact.getPostalCode(),
                postalContact.getRoadAddress(),
                postalContact.getDetailAddress());
    }

    public record GroupData(
            Long id,
            Long districtId,
            String name,
            String notice
    ) {
    }

    public record GroupContactData(
            Long id,
            Long groupId,
            String phone,
            String email,
            PostalContactData postalContact
    ) {
    }

    public record PostalContactInput(
            String recipient,
            String postalCode,
            String roadAddress,
            String detailAddress
    ) {
    }

    public record PostalContactData(
            String recipient,
            String postalCode,
            String roadAddress,
            String detailAddress
    ) {
    }
}
