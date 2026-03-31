package org.aakorea.main.organization.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import java.util.Optional;
import org.aakorea.main.organization.domain.District;
import org.aakorea.main.organization.domain.Group;
import org.aakorea.main.organization.domain.GroupContact;
import org.aakorea.main.organization.infrastructure.DistrictRepository;
import org.aakorea.main.organization.infrastructure.GroupContactRepository;
import org.aakorea.main.organization.infrastructure.GroupRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class OrganizationAdminServiceTest {

    @Mock
    private DistrictRepository districtRepository;

    @Mock
    private GroupRepository groupRepository;

    @Mock
    private GroupContactRepository groupContactRepository;

    @InjectMocks
    private OrganizationAdminService organizationAdminService;

    @Test
    void createDistrictTrimsNameBeforeSaving() {
        given(districtRepository.save(org.mockito.ArgumentMatchers.any(District.class)))
                .willAnswer(invocation -> invocation.getArgument(0));

        OrganizationAdminService.DistrictData result = organizationAdminService.createDistrict("  서울  ", true);

        ArgumentCaptor<District> captor = ArgumentCaptor.forClass(District.class);
        verify(districtRepository).save(captor.capture());
        assertThat(captor.getValue().getName()).isEqualTo("서울");
        assertThat(result.name()).isEqualTo("서울");
        assertThat(result.active()).isTrue();
    }

    @Test
    void createGroupThrowsWhenDistrictDoesNotExist() {
        given(districtRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> organizationAdminService.createGroup(99L, "강남그룹", true))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(exception -> {
                    ResponseStatusException responseStatusException = (ResponseStatusException) exception;
                    assertThat(responseStatusException.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                    assertThat(responseStatusException.getReason()).isEqualTo("district not found");
                });
    }

    @Test
    void updateGroupChangesDistrictAndFields() {
        District oldDistrict = new District("서울", true);
        District newDistrict = new District("부산", true);
        Group group = new Group(oldDistrict, "기존그룹", true);
        ReflectionTestUtils.setField(oldDistrict, "id", 1L);
        ReflectionTestUtils.setField(newDistrict, "id", 2L);
        ReflectionTestUtils.setField(group, "id", 7L);

        given(groupRepository.findById(7L)).willReturn(Optional.of(group));
        given(districtRepository.findById(2L)).willReturn(Optional.of(newDistrict));

        OrganizationAdminService.GroupData result = organizationAdminService.updateGroup(7L, 2L, "  새그룹  ", false);

        assertThat(group.getDistrict()).isEqualTo(newDistrict);
        assertThat(group.getName()).isEqualTo("새그룹");
        assertThat(group.isActive()).isFalse();
        assertThat(result.districtId()).isEqualTo(newDistrict.getId());
        assertThat(result.name()).isEqualTo("새그룹");
        assertThat(result.active()).isFalse();
    }

    @Test
    void createGroupContactThrowsWhenGroupDoesNotExist() {
        given(groupRepository.findById(13L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> organizationAdminService.createGroupContact(13L, "02-1234-5678", true))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(exception -> {
                    ResponseStatusException responseStatusException = (ResponseStatusException) exception;
                    assertThat(responseStatusException.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                    assertThat(responseStatusException.getReason()).isEqualTo("group not found");
                });
    }

    @Test
    void updateGroupContactUpdatesPhoneAndActive() {
        District district = new District("서울", true);
        Group group = new Group(district, "강남그룹", true);
        GroupContact groupContact = new GroupContact(group, "02-1111-2222", true);

        given(groupContactRepository.findById(5L)).willReturn(Optional.of(groupContact));

        OrganizationAdminService.GroupContactData result =
                organizationAdminService.updateGroupContact(5L, " 02-9876-5432 ", false);

        assertThat(groupContact.getPhone()).isEqualTo("02-9876-5432");
        assertThat(groupContact.isActive()).isFalse();
        assertThat(result.phone()).isEqualTo("02-9876-5432");
        assertThat(result.active()).isFalse();
    }
}
