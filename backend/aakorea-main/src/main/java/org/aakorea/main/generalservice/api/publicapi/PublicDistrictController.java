package org.aakorea.main.generalservice.api.publicapi;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.response.ApiResponse;
import org.aakorea.main.generalservice.infrastructure.DistrictRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/districts")
@RequiredArgsConstructor
public class PublicDistrictController {

    private final DistrictRepository districtRepository;

    @GetMapping
    public ApiResponse<List<PublicDistrictResponse>> getDistricts() {
        return ApiResponse.success(districtRepository.findAllByOrderByIdAsc().stream()
                .map(district -> new PublicDistrictResponse(district.getId(), district.getName()))
                .toList());
    }
}
