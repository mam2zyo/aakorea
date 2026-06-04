package org.aakorea.core.aaservice.application;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aakorea.core.common.error.FieldValidationException;
import org.aakorea.core.aaservice.domain.District;
import org.aakorea.core.common.audit.ChangeLogService;
import org.aakorea.core.aaservice.infrastructure.DistrictRepository;
import org.aakorea.core.group.infrastructure.GroupRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DistrictOfficeService {

    private final DistrictRepository districtRepository;
    private final GroupRepository groupRepository;
    private final ChangeLogService changeLogService;

    public List<DistrictData> getDistricts() {
        return districtRepository.findAllByOrderByIdAsc().stream()
                .map(this::toDistrictData)
                .toList();
    }

    @Transactional
    public DistrictData createDistrict(String name) {
        String normalizedName = normalize(name);
        ensureUniqueDistrictName(normalizedName, null);

        District district = districtRepository.save(new District(normalizedName));
        changeLogService.logCreate(district, district.getId());
        return toDistrictData(district);
    }

    @Transactional
    public DistrictData updateDistrict(Long id, String name) {
        District district = getDistrict(id);
        
        // Create a copy for diffing
        District oldState = new District(district.getName());
        
        String normalizedName = normalize(name);
        ensureUniqueDistrictName(normalizedName, id);

        district.update(normalizedName);
        
        changeLogService.logUpdate(oldState, district, id);
        
        return toDistrictData(district);
    }

    @Transactional
    public void deleteDistrict(Long id) {
        District district = getDistrict(id);

        if (groupRepository.existsByDistrict_Id(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "연결된 Group이 있는 지역연합은 삭제할 수 없습니다.");
        }

        districtRepository.delete(district);
        changeLogService.logDelete(District.class, id, district.getName());
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

    private void ensureUniqueDistrictName(String name, Long currentId) {
        boolean exists = currentId == null
                ? districtRepository.existsByName(name)
                : districtRepository.existsByNameAndIdNot(name, currentId);

        if (exists) {
            throw FieldValidationException.conflict("name", "district name already exists");
        }
    }

    public record DistrictData(Long id, String name) {
    }
}
