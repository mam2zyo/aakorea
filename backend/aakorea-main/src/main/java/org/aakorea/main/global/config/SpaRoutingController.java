package org.aakorea.main.global.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaRoutingController {

    /**
     * Forwards all requests starting with /admin (that are not file requests or API calls)
     * to the admin.html entry point.
     */
    /**
     * Forwards all requests starting with /admin to the admin.html entry point.
     * In Spring Boot 3 +, '**' must be at the end.
     */
    @GetMapping({
            "/admin",
            "/admin/**"
    })
    public String admin() {
        return "forward:/admin.html";
    }

    /**
     * Forwards all other non-file, non-API requests to the default index.html (Public site).
     */
    @GetMapping({
            "/**"
    })
    public String publicSite() {
        return "forward:/index.html";
    }
}
