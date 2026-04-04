package org.aakorea.main.group.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.verify;

import java.util.List;
import org.aakorea.main.generalservice.domain.District;
import org.aakorea.main.generalservice.infrastructure.DistrictRepository;
import org.aakorea.main.group.domain.Group;
import org.aakorea.main.group.domain.GroupContact;
import org.aakorea.main.group.domain.Meeting;
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
    void normalizeHtmlGroupsRowsBySameNameOnlyAndBuildsPhoneNotice() {
        MeetingImportAdminService.NormalizedMeetingImport normalizedImport = meetingImportAdminService.normalizeHtml("""
                <html><body>
                  <div id="areajunla" class="boxtable">
                    <div class="areaname_wrap"><div class="areaname">광주/전라</div></div>
                    <table><tbody>
                      <tr>
                        <td>월</td><td>19:00</td><td>빛고을</td>
                        <td>광주 서구 풍서우로 224, 광주 다사랑병원 1층 세미나실</td>
                        <td>벽진동</td><td>010-4801-2332, 서</td><td>●</td>
                      </tr>
                      <tr>
                        <td>수</td><td>19:00</td><td>빛고을</td>
                        <td>광주 서구 풍서우로 224, 광주 다사랑병원 1층 세미나실 (송정공원역 4번 출구)</td>
                        <td>벽진동</td><td>010-9420-4470, 최</td><td>◐</td>
                      </tr>
                      <tr>
                        <td>수</td><td>19:30</td><td>성남정직</td>
                        <td>광주 서구 풍서우로 224, 광주 다사랑병원 1층 세미나실</td>
                        <td>벽진동</td><td>010-9420-4470, 최</td><td>○</td>
                      </tr>
                    </tbody></table>
                  </div>
                  <!--
                  <div id="areajunla-old" class="boxtable">
                    <div class="areaname">광주/전라</div>
                    <table><tbody>
                      <tr>
                        <td>금</td><td>21:00</td><td>숨김행</td>
                        <td>광주 서구 풍서우로 224, 광주 다사랑병원 1층 세미나실</td>
                        <td>벽진동</td><td>010-0000-0000, 김</td><td>○</td>
                      </tr>
                    </tbody></table>
                  </div>
                  -->
                </body></html>
                """);

        assertThat(normalizedImport.sourceMeetingCount()).isEqualTo(3);
        assertThat(normalizedImport.groups()).hasSize(2);

        MeetingImportAdminService.NormalizedImportGroup bitgoeul = normalizedImport.groups().stream()
                .filter(group -> group.name().equals("빛고을"))
                .findFirst()
                .orElseThrow();

        assertThat(bitgoeul.phone()).isEqualTo("010-4801-2332");
        assertThat(bitgoeul.notice()).isEqualTo("송정공원역 4번 출구");
        assertThat(bitgoeul.meetings()).hasSize(2);
        assertThat(bitgoeul.meetings().getFirst().type()).isEqualTo("CLOSED");
        assertThat(bitgoeul.meetings().get(1).contactPhoneOverride()).isEqualTo("010-9420-4470");
    }

    @Test
    void applyImportCreatesDistrictGroupContactAndMeeting() {
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

        MeetingImportAdminService.NormalizedMeetingImport normalizedImport = meetingImportAdminService.normalizeHtml("""
                <html><body>
                  <div id="areajunla" class="boxtable">
                    <div class="areaname_wrap"><div class="areaname">광주/전라</div></div>
                    <table><tbody>
                      <tr>
                        <td>목</td><td>19:00</td><td>다락방</td>
                        <td>광주 광산구 상무대로 309-1, 황금마트 3층 (송정공원역 4번 출구)</td>
                        <td>신촌동</td><td>010-3912-1256, 박</td><td>◐</td>
                      </tr>
                    </tbody></table>
                  </div>
                </body></html>
                """);

        MeetingImportAdminService.ImportApplyResult result = meetingImportAdminService.applyImport(normalizedImport);

        assertThat(result.createdDistrictCount()).isEqualTo(1);
        assertThat(result.createdGroupCount()).isEqualTo(1);
        assertThat(result.createdGroupContactCount()).isEqualTo(1);
        assertThat(result.createdMeetingCount()).isEqualTo(1);
        assertThat(result.createdDistrictNames()).containsExactly("호남연합");

        ArgumentCaptor<Group> groupCaptor = ArgumentCaptor.forClass(Group.class);
        verify(groupRepository).save(groupCaptor.capture());
        assertThat(groupCaptor.getValue().getName()).isEqualTo("다락방");
        assertThat(groupCaptor.getValue().getNotice()).isEqualTo("송정공원역 4번 출구");

        ArgumentCaptor<Meeting> meetingCaptor = ArgumentCaptor.forClass(Meeting.class);
        verify(meetingRepository).save(meetingCaptor.capture());
        assertThat(meetingCaptor.getValue().getLocationAddress()).isEqualTo("광주 광산구 상무대로 309-1");
        assertThat(meetingCaptor.getValue().getLocationDetail()).isEqualTo("황금마트 3층");
        assertThat(meetingCaptor.getValue().getType().name()).isEqualTo("NOTFIXED");
    }

    @Test
    void applyImportSavesMeetingContactPhoneOverride() {
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

        MeetingImportAdminService.NormalizedMeetingImport normalizedImport = new MeetingImportAdminService.NormalizedMeetingImport(
                1,
                List.of(),
                List.of(new MeetingImportAdminService.NormalizedImportGroup(
                        "호남연합",
                        "빛고을",
                        "010-4801-2332",
                        null,
                        List.of(new MeetingImportAdminService.NormalizedImportMeeting(
                                "WEDNESDAY",
                                "19:00",
                                "NOTFIXED",
                                "GWANGJU",
                                "광주 서구 풍서우로 224",
                                "광주 다사랑병원 1층 세미나실",
                                "010-9420-4470",
                                false,
                                true)))));

        meetingImportAdminService.applyImport(normalizedImport);

        ArgumentCaptor<Meeting> meetingCaptor = ArgumentCaptor.forClass(Meeting.class);
        verify(meetingRepository).save(meetingCaptor.capture());
        assertThat(meetingCaptor.getValue().getContactPhoneOverride()).isEqualTo("010-9420-4470");
    }

    @Test
    void normalizeHtmlInfersProvinceFromLocalityWhenPrefixIsMissing() {
        MeetingImportAdminService.NormalizedMeetingImport normalizedImport = meetingImportAdminService.normalizeHtml("""
                <html><body>
                  <div id="areabusan" class="boxtable">
                    <div class="areaname_wrap"><div class="areaname">부산/경남</div></div>
                    <table><tbody>
                      <tr>
                        <td>월</td><td>19:30</td><td>김해디딤돌</td>
                        <td>김해시 가락로 49번길 14, 2층 (구)수화당한약방</td>
                        <td>서상동</td><td>010-9159-9303, 김</td><td>●</td>
                      </tr>
                    </tbody></table>
                  </div>
                </body></html>
                """);

        MeetingImportAdminService.NormalizedImportMeeting meeting = normalizedImport.groups().getFirst().meetings().getFirst();
        assertThat(normalizedImport.groups().getFirst().districtName()).isEqualTo("부경연합");
        assertThat(meeting.province()).isEqualTo("GYEONGNAM");
        assertThat(meeting.locationAddress()).isEqualTo("김해시 가락로 49번길 14");
        assertThat(meeting.locationDetail()).isEqualTo("2층 수화당한약방");
    }

    @Test
    void normalizeHtmlKeepsCommentedFlatTableRowsAsInactiveMeetings() {
        MeetingImportAdminService.NormalizedMeetingImport normalizedImport = meetingImportAdminService.normalizeHtml("""
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>요일</th><th>시간</th><th>그룹명</th><th>장소</th><th>연락처</th><th>종류</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>화</td><td>19:00</td><td>다락방</td>
                      <td>광주 광산구 상무대로 309-1, 황금마트 3층 (송정공원역 4번 출구)</td>
                      <td>010-3912-1256</td><td>&#9675;</td>
                    </tr>
                    <!-- <tr>
                      <td></td><td>20:00</td><td>다락방</td>
                      <td>광주 광산구 상무대로 309-1, 황금마트 3층</td>
                      <td>010-3912-1256</td><td>&#9679;</td>
                    </tr> -->
                  </tbody>
                </table>
                """);

        assertThat(normalizedImport.sourceMeetingCount()).isEqualTo(2);
        assertThat(normalizedImport.groups()).hasSize(1);
        assertThat(normalizedImport.groups().getFirst().meetings()).hasSize(2);
        assertThat(normalizedImport.groups().getFirst().meetings())
                .extracting(MeetingImportAdminService.NormalizedImportMeeting::active)
                .containsExactly(true, false);
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
