package org.aakorea.main;

import org.aakorea.main.content.application.ContentAdminService;
import org.aakorea.main.content.application.PublicContentQueryService;
import org.aakorea.main.group.application.GroupAdminService;
import org.aakorea.main.group.application.MeetingAdminService;
import org.aakorea.main.group.application.MeetingImportAdminService;
import org.aakorea.main.group.application.PublicMeetingQueryService;
import org.aakorea.main.generalservice.application.DistrictAdminService;
import org.aakorea.main.theme.application.PublicThemeService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
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
    private MeetingImportAdminService meetingImportAdminService;

    @MockitoBean
    private PublicMeetingQueryService publicMeetingQueryService;

    @MockitoBean
    private ContentAdminService contentAdminService;

    @MockitoBean
    private PublicContentQueryService publicContentQueryService;

    @MockitoBean
    private PublicThemeService publicThemeService;

    @Test
    void contextLoads() {
    }
}
