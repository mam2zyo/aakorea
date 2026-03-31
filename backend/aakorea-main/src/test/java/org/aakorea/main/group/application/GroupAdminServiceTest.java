package org.aakorea.main.group.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

import java.util.Optional;
import org.aakorea.main.group.domain.Group;
import org.aakorea.main.group.domain.GroupContact;
import org.aakorea.main.group.infrastructure.GroupContactRepository;
import org.aakorea.main.group.infrastructure.GroupRepository;
import org.aakorea.main.organization.domain.District;
import org.aakorea.main.organization.infrastructure.DistrictRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class GroupAdminServiceTest {

    @Mock
    private DistrictRepository districtRepository;

    @Mock
    private GroupRepository groupRepository;

    @Mock
    private GroupContactRepository groupContactRepository;

    @InjectMocks
    private GroupAdminService groupAdminService;

    @Test
    void createGroupThrowsWhenDistrictDoesNotExist() {
        given(districtRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> groupAdminService.createGroup(99L, "강남그룹"))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(exception -> {
                    ResponseStatusException responseStatusException = (ResponseStatusException) exception;
                    assertThat(responseStatusException.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                    assertThat(responseStatusException.getReason()).isEqualTo("district not found");
                });
    }

    @Test
    void updateGroupChangesDistrictAndFields() {
        District oldDistrict = new District("서울");
        District newDistrict = new District("부산");
        Group group = new Group(oldDistrict, "기존그룹");
        ReflectionTestUtils.setField(oldDistrict, "id", 1L);
        ReflectionTestUtils.setField(newDistrict, "id", 2L);
        ReflectionTestUtils.setField(group, "id", 7L);

        given(groupRepository.findById(7L)).willReturn(Optional.of(group));
        given(districtRepository.findById(2L)).willReturn(Optional.of(newDistrict));

        GroupAdminService.GroupData result = groupAdminService.updateGroup(7L, 2L, "  새그룹  ");

        assertThat(group.getDistrict()).isEqualTo(newDistrict);
        assertThat(group.getName()).isEqualTo("새그룹");
        assertThat(result.districtId()).isEqualTo(newDistrict.getId());
        assertThat(result.name()).isEqualTo("새그룹");
    }

    @Test
    void createGroupContactThrowsWhenGroupDoesNotExist() {
        given(groupRepository.findById(13L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> groupAdminService.createGroupContact(13L, "02-1234-5678"))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(exception -> {
                    ResponseStatusException responseStatusException = (ResponseStatusException) exception;
                    assertThat(responseStatusException.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                    assertThat(responseStatusException.getReason()).isEqualTo("group not found");
                });
    }

    @Test
    void updateGroupContactUpdatesPhone() {
        District district = new District("서울");
        Group group = new Group(district, "강남그룹");
        GroupContact groupContact = new GroupContact(group, "02-1111-2222");

        given(groupContactRepository.findById(5L)).willReturn(Optional.of(groupContact));

        GroupAdminService.GroupContactData result =
                groupAdminService.updateGroupContact(5L, " 02-9876-5432 ");

        assertThat(groupContact.getPhone()).isEqualTo("02-9876-5432");
        assertThat(result.phone()).isEqualTo("02-9876-5432");
    }
}
