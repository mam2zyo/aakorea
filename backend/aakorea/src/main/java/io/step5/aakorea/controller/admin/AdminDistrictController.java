package io.step5.aakorea.controller.admin;

import io.step5.aakorea.dto.admin.AdminDistrictDto;
import io.step5.aakorea.dto.admin.AdminDistrictListResponseDto;
import io.step5.aakorea.dto.admin.AdminDistrictRequest;
import io.step5.aakorea.service.admin.AdminDistrictService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/districts")
public class AdminDistrictController {

    private final AdminDistrictService adminDistrictService;

    @GetMapping
    public AdminDistrictListResponseDto getDistricts() {
        return adminDistrictService.getDistricts();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AdminDistrictDto createDistrict(@Valid @RequestBody AdminDistrictRequest request) {
        return adminDistrictService.createDistrict(request);
    }

    @PutMapping("/{districtId}")
    public AdminDistrictDto updateDistrict(
            @PathVariable Long districtId,
            @Valid @RequestBody AdminDistrictRequest request
    ) {
        return adminDistrictService.updateDistrict(districtId, request);
    }

    @DeleteMapping("/{districtId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDistrict(@PathVariable Long districtId) {
        adminDistrictService.deleteDistrict(districtId);
    }
}
