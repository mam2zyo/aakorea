package org.aakorea.main.generalservice.application;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.generalservice.domain.District;
import org.aakorea.main.generalservice.infrastructure.DistrictRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DistrictAdminService {

    private final DistrictRepository districtRepository;

    public List<DistrictData> getDistricts() {
        return districtRepository.findAllByOrderByIdAsc().stream()
                .map(this::toDistrictData)
                .toList();
    }

    @Transactional
    public DistrictData createDistrict(String name) {
        District district = districtRepository.save(new District(normalize(name)));
        return toDistrictData(district);
    }

    @Transactional
    public DistrictData updateDistrict(Long id, String name) {
        District district = getDistrict(id);
        district.update(normalize(name));
        return toDistrictData(district);
    }

    private District getDistrict(Long districtId) {
        return districtRepository.findById(districtId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "district not found"));
    }

    private DistrictData toDistrictData(District district) {
        return new DistrictData(district.getId(), district.getName());
    }

    private String normalize(String value) {
        return value.trim();
    }

    public record DistrictData(Long id, String name) {
    }
}
