package org.aakorea.main.storage.api.admin;

import org.aakorea.main.storage.application.StorageService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/assets")
public class AdminAssetController {

    private final StorageService storageService;

    public AdminAssetController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AssetUploadResponse handleFileUpload(@RequestParam("file") MultipartFile file) {
        String url = storageService.store(file);
        return new AssetUploadResponse(url);
    }
}
