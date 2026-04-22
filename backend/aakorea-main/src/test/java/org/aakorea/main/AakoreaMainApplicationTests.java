package org.aakorea.main;

import org.aakorea.main.attachment.application.AttachmentService;
import org.aakorea.main.content.application.ContentAdminService;
import org.aakorea.main.content.application.PublicContentQueryService;
import org.aakorea.main.group.application.GroupAdminService;
import org.aakorea.main.group.application.MeetingAdminService;
import org.aakorea.main.group.application.PublicMeetingQueryService;
import org.aakorea.main.generalservice.application.DistrictAdminService;
import org.aakorea.main.auth.application.AuthService;
import org.aakorea.main.auth.application.OfficePermissionService;
import org.aakorea.main.auth.infrastructure.AdminUserPermissionGrantRepository;
import org.aakorea.main.auth.infrastructure.AdminUserRepository;
import org.aakorea.main.theme.application.PublicThemeService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
@ActiveProfiles("test")
class AakoreaMainApplicationTests {

    @MockitoBean
    private DistrictAdminService districtAdminService;

    @MockitoBean
    private GroupAdminService groupAdminService;

    @MockitoBean
    private MeetingAdminService meetingAdminService;

    @MockitoBean
    private PublicMeetingQueryService publicMeetingQueryService;

    @MockitoBean
    private ContentAdminService contentAdminService;

    @MockitoBean
    private PublicContentQueryService publicContentQueryService;

    @MockitoBean
    private PublicThemeService publicThemeService;

    @MockitoBean
    private AttachmentService attachmentService;

    @MockitoBean
    private AdminUserRepository adminUserRepository;

    @MockitoBean
    private AdminUserPermissionGrantRepository adminUserPermissionGrantRepository;

    @MockitoBean
    private OfficePermissionService officePermissionService;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @Test
    void contextLoads() {
    }
}
