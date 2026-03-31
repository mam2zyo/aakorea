package org.aakorea.main.organization.api.admin;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.response.ApiResponse;
import org.aakorea.main.organization.application.DistrictAdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class DistrictAdminController {

    private final DistrictAdminService districtAdminService;

    @GetMapping("/districts")
    public ApiResponse<List<DistrictAdminService.DistrictData>> getDistricts() {
        return ApiResponse.success(districtAdminService.getDistricts());
    }

    @PostMapping("/districts")
    public ResponseEntity<ApiResponse<DistrictAdminService.DistrictData>> createDistrict(
            @Valid @RequestBody DistrictRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                districtAdminService.createDistrict(request.name())));
    }

    @PutMapping("/districts/{id}")
    public ApiResponse<DistrictAdminService.DistrictData> updateDistrict(
            @PathVariable Long id,
            @Valid @RequestBody DistrictRequest request
    ) {
        return ApiResponse.success(districtAdminService.updateDistrict(id, request.name()));
    }

    public record DistrictRequest(
            @NotBlank(message = "name is required") String name
    ) {
    }
}
