package org.aakorea.main;

import org.junit.jupiter.api.Test;
import org.aakorea.main.meeting.application.MeetingAdminService;
import org.aakorea.main.meeting.application.PublicMeetingQueryService;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.aakorea.main.organization.application.OrganizationAdminService;

@SpringBootTest
class AakoreaMainApplicationTests {

    @MockitoBean
    private OrganizationAdminService organizationAdminService;

    @MockitoBean
    private MeetingAdminService meetingAdminService;

    @MockitoBean
    private PublicMeetingQueryService publicMeetingQueryService;

    @Test
    void contextLoads() {
    }
}
