package org.aakorea.main.organization.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import java.util.Optional;
import org.aakorea.main.organization.domain.District;
import org.aakorea.main.organization.infrastructure.DistrictRepository;
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

    @InjectMocks
    private DistrictAdminService districtAdminService;

    @Test
    void createDistrictTrimsNameBeforeSaving() {
        given(districtRepository.save(org.mockito.ArgumentMatchers.any(District.class)))
                .willAnswer(invocation -> invocation.getArgument(0));

        DistrictAdminService.DistrictData result = districtAdminService.createDistrict("  서울  ");

        ArgumentCaptor<District> captor = ArgumentCaptor.forClass(District.class);
        verify(districtRepository).save(captor.capture());
        assertThat(captor.getValue().getName()).isEqualTo("서울");
        assertThat(result.name()).isEqualTo("서울");
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
}
