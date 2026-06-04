package org.aakorea.core.aaservice.api.office;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.core.common.response.ApiResponse;
import org.aakorea.core.aaservice.application.DistrictOfficeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/office")
@RequiredArgsConstructor
public class DistrictOfficeController {

    private final DistrictOfficeService districtOfficeService;

    @PreAuthorize("hasAuthority('PERM_district.manage')")
    @GetMapping("/districts")
    public ApiResponse<List<DistrictOfficeService.DistrictData>> getDistricts() {
        return ApiResponse.success(districtOfficeService.getDistricts());
    }

    @PreAuthorize("hasAuthority('PERM_district.manage')")
    @PostMapping("/districts")
    public ResponseEntity<ApiResponse<DistrictOfficeService.DistrictData>> createDistrict(
            @Valid @RequestBody DistrictRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                districtOfficeService.createDistrict(request.name())));
    }

    @PreAuthorize("hasAuthority('PERM_district.manage')")
    @PutMapping("/districts/{id}")
    public ApiResponse<DistrictOfficeService.DistrictData> updateDistrict(
            @PathVariable Long id,
            @Valid @RequestBody DistrictRequest request
    ) {
        return ApiResponse.success(districtOfficeService.updateDistrict(id, request.name()));
    }

    @PreAuthorize("hasAuthority('PERM_district.manage')")
    @DeleteMapping("/districts/{id}")
    public ResponseEntity<Void> deleteDistrict(@PathVariable Long id) {
        districtOfficeService.deleteDistrict(id);
        return ResponseEntity.noContent().build();
    }

    public record DistrictRequest(
            @NotBlank(message = "name is required") String name
    ) {
    }
}
