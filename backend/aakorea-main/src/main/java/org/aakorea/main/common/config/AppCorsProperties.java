package org.aakorea.main.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;

@ConfigurationProperties(prefix = "app.cors")
public class AppCorsProperties {

    // 설정 파일에 값이 없을 때 사용할 기본 origin 목록.
    // 현재는 편의를 위해 기본값을 두고 있지만, 실제 운영에서는 프로필별 yml 또는 env로 덮어쓰는 편이 안전하다.
    private List<String> allowedOrigins = new ArrayList<>(List.of(
            "https://maumtalk.win",
            "https://www.maumtalk.win",
            "https://c3dffaf8.aakorea-frontend.pages.dev",
            "http://localhost",
            "http://127.0.0.1",
            "http://localhost:8080",
            "http://127.0.0.1:8080",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://172.30.1.16:8080"
    ));

    public List<String> getAllowedOrigins() {
        return allowedOrigins;
    }

    public void setAllowedOrigins(List<String> allowedOrigins) {
        // 외부 설정에서 목록 전체를 교체할 수 있게 새 리스트로 복사해 보관한다.
        this.allowedOrigins = allowedOrigins == null
                ? new ArrayList<>()
                : new ArrayList<>(allowedOrigins);
    }
}
