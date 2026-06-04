package org.aakorea.core.storage.api.office;

import org.aakorea.core.storage.application.StorageService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/office/assets")
public class AssetOfficeController {

    private final StorageService storageService;

    public AssetOfficeController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AssetUploadResponse handleFileUpload(@RequestParam("file") MultipartFile file) {
        String url = storageService.store(file);
        return new AssetUploadResponse(url);
    }
}
