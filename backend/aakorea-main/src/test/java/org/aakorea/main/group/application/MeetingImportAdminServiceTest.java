package org.aakorea.main.group.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.verify;

import java.time.DayOfWeek;
import java.util.List;
import org.aakorea.main.generalservice.domain.District;
import org.aakorea.main.generalservice.infrastructure.DistrictRepository;
import org.aakorea.main.group.domain.Group;
import org.aakorea.main.group.domain.GroupContact;
import org.aakorea.main.group.domain.Meeting;
import org.aakorea.main.group.domain.MeetingType;
import org.aakorea.main.group.infrastructure.GroupContactRepository;
import org.aakorea.main.group.infrastructure.GroupRepository;
import org.aakorea.main.group.infrastructure.MeetingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class MeetingImportAdminServiceTest {

    @Mock
    private DistrictRepository districtRepository;

    @Mock
    private GroupRepository groupRepository;

    @Mock
    private GroupContactRepository groupContactRepository;

    @Mock
    private MeetingRepository meetingRepository;

    @InjectMocks
    private MeetingImportAdminService meetingImportAdminService;

    @Test
    void applyHtmlCreatesDistrictGroupContactAndMeeting() {
        given(districtRepository.findAllByOrderByIdAsc()).willReturn(List.of());
        given(groupRepository.findAllByOrderByIdAsc()).willReturn(List.of());
        given(groupContactRepository.findAllByOrderByIdAsc()).willReturn(List.of());
        given(meetingRepository.findAllByGroup_IdOrderByIdAsc(10L)).willReturn(List.of());
        given(districtRepository.save(any(District.class))).willAnswer(invocation -> {
            District district = invocation.getArgument(0);
            ReflectionTestUtils.setField(district, "id", 1L);
            return district;
        });
        given(groupRepository.save(any(Group.class))).willAnswer(invocation -> {
            Group group = invocation.getArgument(0);
            ReflectionTestUtils.setField(group, "id", 10L);
            return group;
        });
        given(groupContactRepository.save(any(GroupContact.class))).willAnswer(invocation -> invocation.getArgument(0));
        given(meetingRepository.save(any(Meeting.class))).willAnswer(invocation -> invocation.getArgument(0));

        String html = """
                <html><body>
                  <table><tbody>
                    <tr>
                      <td>목</td><td>19:00</td><td>다락방</td>
                      <td>황금마트 3층</td><td>광주 광산구 상무대로 309-1</td>
                      <td>010-3912-1256</td><td>호남연합</td><td>송정공원역 4번 출구</td><td>◐</td>
                    </tr>
                  </tbody></table>
                </body></html>
                """;

        MeetingImportAdminService.ImportApplyResult result = meetingImportAdminService.applyHtml(html);

        assertThat(result.createdDistrictCount()).isEqualTo(1);
        assertThat(result.createdGroupCount()).isEqualTo(1);
        assertThat(result.createdGroupContactCount()).isEqualTo(1);
        assertThat(result.createdMeetingCount()).isEqualTo(1);
        assertThat(result.createdDistrictNames()).containsExactly("호남연합");

        ArgumentCaptor<Group> groupCaptor = ArgumentCaptor.forClass(Group.class);
        verify(groupRepository).save(groupCaptor.capture());
        assertThat(groupCaptor.getValue().getName()).isEqualTo("다락방");
        assertThat(groupCaptor.getValue().getNotice()).isEqualTo("송정공원역 4번 출구");

        ArgumentCaptor<GroupContact> contactCaptor = ArgumentCaptor.forClass(GroupContact.class);
        verify(groupContactRepository).save(contactCaptor.capture());
        assertThat(contactCaptor.getValue().getPhone()).isEqualTo("010-3912-1256");

        ArgumentCaptor<Meeting> meetingCaptor = ArgumentCaptor.forClass(Meeting.class);
        verify(meetingRepository).save(meetingCaptor.capture());
        assertThat(meetingCaptor.getValue().getLocationAddress()).isEqualTo("광주 광산구 상무대로 309-1");
        assertThat(meetingCaptor.getValue().getLocationDetail()).isEqualTo("황금마트 3층");
        assertThat(meetingCaptor.getValue().getDayOfWeek()).isEqualTo(DayOfWeek.THURSDAY);
        assertThat(meetingCaptor.getValue().getType()).isEqualTo(MeetingType.NOTFIXED);
        assertThat(meetingCaptor.getValue().getContactPhoneOverride()).isNull();
    }

    @Test
    void applyHtmlMergesNoticeAndOverridesPhoneForMultipleRows() {
        given(districtRepository.findAllByOrderByIdAsc()).willReturn(List.of());
        given(groupRepository.findAllByOrderByIdAsc()).willReturn(List.of());
        given(groupContactRepository.findAllByOrderByIdAsc()).willReturn(List.of());
        given(meetingRepository.findAllByGroup_IdOrderByIdAsc(10L)).willReturn(List.of());
        given(districtRepository.save(any(District.class))).willAnswer(invocation -> {
            District district = invocation.getArgument(0);
            ReflectionTestUtils.setField(district, "id", 1L);
            return district;
        });
        given(groupRepository.save(any(Group.class))).willAnswer(invocation -> {
            Group group = invocation.getArgument(0);
            ReflectionTestUtils.setField(group, "id", 10L);
            return group;
        });
        given(groupContactRepository.save(any(GroupContact.class))).willAnswer(invocation -> invocation.getArgument(0));
        given(meetingRepository.save(any(Meeting.class))).willAnswer(invocation -> invocation.getArgument(0));

        String html = """
                <html><body>
                  <table><tbody>
                    <tr>
                      <td>월</td><td>19:00</td><td>빛고을</td>
                      <td>세미나실</td><td>광주 서구 풍서우로 224</td>
                      <td>010-4801-2332</td><td>호남연합</td><td>A</td><td>●</td>
                    </tr>
                    <tr>
                      <td>수</td><td>19:00</td><td>빛고을</td>
                      <td>세미나실</td><td>광주 서구 풍서우로 224</td>
                      <td>010-9420-4470</td><td>호남연합</td><td>B</td><td>◐</td>
                    </tr>
                  </tbody></table>
                </body></html>
                """;

        MeetingImportAdminService.ImportApplyResult result = meetingImportAdminService.applyHtml(html);

        ArgumentCaptor<Group> groupCaptor = ArgumentCaptor.forClass(Group.class);
        verify(groupRepository).save(groupCaptor.capture());
        assertThat(groupCaptor.getValue().getNotice()).isEqualTo("A\nB");
        
        verify(meetingRepository, org.mockito.Mockito.times(2)).save(any(Meeting.class));
    }

    @Test
    void resetImportDataDeletesMeetingGroupAndDistrictDataInOrder() {
        given(meetingRepository.count()).willReturn(270L);
        given(groupContactRepository.count()).willReturn(207L);
        given(groupRepository.count()).willReturn(207L);
        given(districtRepository.count()).willReturn(11L);

        MeetingImportAdminService.ImportResetResult result = meetingImportAdminService.resetImportData();

        assertThat(result.deletedMeetingCount()).isEqualTo(270L);
        assertThat(result.deletedGroupContactCount()).isEqualTo(207L);
        assertThat(result.deletedGroupCount()).isEqualTo(207L);
        assertThat(result.deletedDistrictCount()).isEqualTo(11L);

        InOrder inOrder = inOrder(meetingRepository, groupContactRepository, groupRepository, districtRepository);
        inOrder.verify(meetingRepository).deleteAllInBatch();
        inOrder.verify(groupContactRepository).deleteAllInBatch();
        inOrder.verify(groupRepository).deleteAllInBatch();
        inOrder.verify(districtRepository).deleteAllInBatch();
    }
}
