package io.step5.aakorea.service.admin;

import io.step5.aakorea.domain.GSR;
import io.step5.aakorea.dto.admin.AdminGsrDto;
import io.step5.aakorea.dto.admin.AdminGsrListResponseDto;
import io.step5.aakorea.dto.admin.AdminGsrRequest;
import io.step5.aakorea.repository.GSRRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminGsrService {

    private final GSRRepository gsrRepository;

    public AdminGsrListResponseDto getGsrs() {
        List<AdminGsrDto> gsrs = gsrRepository.findAll().stream()
                .map(this::toDto)
                .sorted(Comparator.comparing(AdminGsrDto::nickname, String.CASE_INSENSITIVE_ORDER))
                .toList();

        return new AdminGsrListResponseDto(gsrs, gsrs.size());
    }

    @Transactional
    public AdminGsrDto createGsr(AdminGsrRequest request) {
        validateEmailDuplication(normalizeNullableText(request.email()), null);

        GSR gsr = new GSR();
        apply(gsr, request);

        return toDto(gsrRepository.save(gsr));
    }

    @Transactional
    public AdminGsrDto updateGsr(Long gsrId, AdminGsrRequest request) {
        GSR gsr = gsrRepository.findById(gsrId)
                .orElseThrow(() -> new AdminGsrNotFoundException(gsrId));

        validateEmailDuplication(normalizeNullableText(request.email()), gsrId);
        apply(gsr, request);

        return toDto(gsr);
    }

    @Transactional
    public void deleteGsr(Long gsrId) {
        GSR gsr = gsrRepository.findById(gsrId)
                .orElseThrow(() -> new AdminGsrNotFoundException(gsrId));

        gsrRepository.delete(gsr);
    }

    private void validateEmailDuplication(String email, Long currentGsrId) {
        if (email == null) return;

        gsrRepository.findByEmail(email)
                .filter(existing -> !existing.getId().equals(currentGsrId))
                .ifPresent(existing -> {
                    throw new GsrEmailAlreadyExistsException(email);
                });
    }

    private void apply(GSR gsr, AdminGsrRequest request) {
        gsr.setNickname(normalizeText(request.nickname()));
        gsr.setPhone(normalizeNullableText(request.phone()));
        gsr.setEmail(normalizeNullableText(request.email()));
        gsr.setMailingAddress(normalizeNullableText(request.mailingAddress()));
    }

    private String normalizeText(String text) {
        return text == null ? "" : text.trim().replaceAll("\\s+", " ");
    }

    private String normalizeNullableText(String text) {
        if (text == null) return null;

        String normalized = text.trim().replaceAll("\\s+", " ");
        return normalized.isEmpty() ? null : normalized;
    }

    private AdminGsrDto toDto(GSR gsr) {
        return new AdminGsrDto(
                gsr.getId(),
                gsr.getNickname(),
                gsr.getPhone(),
                gsr.getMailingAddress(),
                gsr.getEmail(),
                gsr.getGroups().size()
        );
    }
}
