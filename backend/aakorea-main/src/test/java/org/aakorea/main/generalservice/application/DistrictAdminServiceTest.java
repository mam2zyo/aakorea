package org.aakorea.main.generalservice.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import java.util.Optional;
import org.aakorea.main.common.error.FieldValidationException;
import org.aakorea.main.generalservice.domain.District;
import org.aakorea.main.generalservice.infrastructure.DistrictRepository;
import org.aakorea.main.group.infrastructure.GroupRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class DistrictAdminServiceTest {

    @Mock
    private DistrictRepository districtRepository;

    @Mock
    private GroupRepository groupRepository;

    @InjectMocks
    private DistrictAdminService districtAdminService;

    @Test
    void createDistrictTrimsNameBeforeSaving() {
        given(districtRepository.existsByName("서울")).willReturn(false);
        given(districtRepository.save(org.mockito.ArgumentMatchers.any(District.class)))
                .willAnswer(invocation -> invocation.getArgument(0));

        DistrictAdminService.DistrictData result = districtAdminService.createDistrict("  서울  ");

        ArgumentCaptor<District> captor = ArgumentCaptor.forClass(District.class);
        verify(districtRepository).save(captor.capture());
        assertThat(captor.getValue().getName()).isEqualTo("서울");
        assertThat(result.name()).isEqualTo("서울");
    }

    @Test
    void createDistrictThrowsConflictWhenNameAlreadyExists() {
        given(districtRepository.existsByName("서울")).willReturn(true);

        assertThatThrownBy(() -> districtAdminService.createDistrict(" 서울 "))
                .isInstanceOf(FieldValidationException.class)
                .satisfies(exception -> {
                    ResponseStatusException responseStatusException = (ResponseStatusException) exception;
                    assertThat(responseStatusException.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(responseStatusException.getReason()).isEqualTo("district name already exists");
                });
    }

    @Test
    void updateDistrictThrowsWhenDistrictDoesNotExist() {
        given(districtRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> districtAdminService.updateDistrict(99L, "서울"))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(exception -> {
                    ResponseStatusException responseStatusException = (ResponseStatusException) exception;
                    assertThat(responseStatusException.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                    assertThat(responseStatusException.getReason()).isEqualTo("district not found");
                });
    }

    @Test
    void updateDistrictThrowsConflictWhenNameAlreadyExistsOnAnotherDistrict() {
        District district = new District("강원");
        given(districtRepository.findById(10L)).willReturn(Optional.of(district));
        given(districtRepository.existsByNameAndIdNot("서울", 10L)).willReturn(true);

        assertThatThrownBy(() -> districtAdminService.updateDistrict(10L, " 서울 "))
                .isInstanceOf(FieldValidationException.class)
                .satisfies(exception -> {
                    ResponseStatusException responseStatusException = (ResponseStatusException) exception;
                    assertThat(responseStatusException.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(responseStatusException.getReason()).isEqualTo("district name already exists");
                });
    }

    @Test
    void deleteDistrictDeletesWhenNoLinkedGroupsExist() {
        District district = new District("서울");
        given(districtRepository.findById(10L)).willReturn(Optional.of(district));
        given(groupRepository.existsByDistrict_Id(10L)).willReturn(false);

        districtAdminService.deleteDistrict(10L);

        verify(districtRepository).delete(district);
    }

    @Test
    void deleteDistrictThrowsConflictWhenLinkedGroupsExist() {
        District district = new District("서울");
        given(districtRepository.findById(10L)).willReturn(Optional.of(district));
        given(groupRepository.existsByDistrict_Id(10L)).willReturn(true);

        assertThatThrownBy(() -> districtAdminService.deleteDistrict(10L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(exception -> {
                    ResponseStatusException responseStatusException = (ResponseStatusException) exception;
                    assertThat(responseStatusException.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(responseStatusException.getReason()).isEqualTo("연결된 Group이 있는 지역연합은 삭제할 수 없습니다.");
                });
    }
}
