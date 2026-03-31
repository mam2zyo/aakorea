package org.aakorea.main;

import org.aakorea.main.group.application.GroupAdminService;
import org.aakorea.main.group.application.MeetingAdminService;
import org.aakorea.main.group.application.PublicMeetingQueryService;
import org.aakorea.main.organization.application.DistrictAdminService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
class AakoreaMainApplicationTests {

    @MockitoBean
    private DistrictAdminService districtAdminService;

    @MockitoBean
    private GroupAdminService groupAdminService;

    @MockitoBean
    private MeetingAdminService meetingAdminService;

    @MockitoBean
    private PublicMeetingQueryService publicMeetingQueryService;

    @Test
    void contextLoads() {
    }
}
