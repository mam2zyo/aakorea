package io.step5.aakorea.controller.admin;

import io.step5.aakorea.dto.admin.AdminGsrDto;
import io.step5.aakorea.dto.admin.AdminGsrListResponseDto;
import io.step5.aakorea.dto.admin.AdminGsrRequest;
import io.step5.aakorea.service.admin.AdminGsrService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/gsrs")
public class AdminGsrController {

    private final AdminGsrService adminGsrService;

    @GetMapping
    public AdminGsrListResponseDto getGsrs() {
        return adminGsrService.getGsrs();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AdminGsrDto createGsr(@Valid @RequestBody AdminGsrRequest request) {
        return adminGsrService.createGsr(request);
    }

    @PutMapping("/{gsrId}")
    public AdminGsrDto updateGsr(
            @PathVariable Long gsrId,
            @Valid @RequestBody AdminGsrRequest request
    ) {
        return adminGsrService.updateGsr(gsrId, request);
    }

    @DeleteMapping("/{gsrId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGsr(@PathVariable Long gsrId) {
        adminGsrService.deleteGsr(gsrId);
    }
}
