package io.step5.aakorea.modules.service.district.application;

import io.step5.aakorea.modules.service.district.api.AdminDistrictDto;
import io.step5.aakorea.modules.service.district.api.AdminDistrictListResponseDto;
import io.step5.aakorea.modules.service.district.api.AdminDistrictRequest;
import io.step5.aakorea.modules.service.district.domain.District;
import io.step5.aakorea.modules.service.district.infrastructure.DistrictRepository;
import io.step5.aakorea.modules.service.group.domain.Group;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminDistrictService {

    private final DistrictRepository districtRepository;

    public AdminDistrictListResponseDto getDistricts() {
        List<AdminDistrictDto> districts = districtRepository.findAll().stream()
                .map(this::toDto)
                .sorted(Comparator.comparing(AdminDistrictDto::name, String.CASE_INSENSITIVE_ORDER))
                .toList();

        return new AdminDistrictListResponseDto(districts, districts.size());
    }

    @Transactional
    public AdminDistrictDto createDistrict(AdminDistrictRequest request) {
        String normalizedName = normalizeName(request.name());
        validateDuplicateName(normalizedName, null);

        District district = new District();
        district.setName(normalizedName);

        return toDto(districtRepository.save(district));
    }

    @Transactional
    public AdminDistrictDto updateDistrict(Long districtId, AdminDistrictRequest request) {
        District district = districtRepository.findById(districtId)
                .orElseThrow(() -> new DistrictNotFoundException(districtId));

        String normalizedName = normalizeName(request.name());
        validateDuplicateName(normalizedName, districtId);

        district.setName(normalizedName);
        return toDto(district);
    }

    @Transactional
    public void deleteDistrict(Long districtId) {
        District district = districtRepository.findById(districtId)
                .orElseThrow(() -> new DistrictNotFoundException(districtId));

        long groupCount = district.getGroups().size();
        if (groupCount > 0) {
            throw new DistrictDeleteConflictException(district.getName(), groupCount);
        }

        districtRepository.delete(district);
    }

    private void validateDuplicateName(String normalizedName, Long currentDistrictId) {
        districtRepository.findByName(normalizedName)
                .filter(existing -> !existing.getId().equals(currentDistrictId))
                .ifPresent(existing -> {
                    throw new DistrictNameAlreadyExistsException(normalizedName);
                });
    }

    private String normalizeName(String name) {
        return name == null ? "" : name.trim().replaceAll("\\s+", " ");
    }

    private AdminDistrictDto toDto(District district) {
        return new AdminDistrictDto(
                district.getId(),
                district.getName(),
                district.getGroups().size()
        );
    }
}

