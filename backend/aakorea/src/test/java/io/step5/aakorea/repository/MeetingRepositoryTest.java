package io.step5.aakorea.repository;

import io.step5.aakorea.domain.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@SpringBootTest
class MeetingRepositoryTest {

    @Autowired GroupRepository groupRepository;
    @Autowired MeetingRepository meetingRepository;

    @Test
    @Transactional
    @Rollback(false) // 💡 핵심! 테스트가 끝나도 롤백(취소)하지 말고 DB에 데이터를 남겨라!
    void 모임_생성_및_요일별_조회_테스트() {

        // 1. 가짜 그룹 데이터 만들기
        Group group = new Group();
        group.setName("희망 그룹");
        group.setStartDate(LocalDate.of(2010, 5, 1));
        group.setProvince(Province.GYEONGGI);

        // 스프링이 INSERT SQL을 알아서 날려줍니다.
        groupRepository.save(group);

        // 2. 가짜 모임 데이터 만들기 (매주 금요일 저녁 8시)
        Meeting meeting = new Meeting();
        meeting.setDayOfWeek(DayOfWeek.FRIDAY);
        meeting.setStartTime(LocalTime.of(20, 0)); // 20시 00분
        meeting.setMeetingType(MeetingType.OPEN);  // 공개 모임
        meeting.setStatus(MeetingStatus.ACTIVE);   // 활성 상태
        meeting.setGroup(group); // ⭐ 핵심: 이 모임은 '희망 그룹'의 모임이다! (관계 맺기)

        meetingRepository.save(meeting);

        // 3. 요일로 검색해보기 (우리가 아까 만든 마법의 메서드)
        List<Meeting> result = meetingRepository.findByGroup_ProvinceAndDayOfWeekOrderByStartTimeAsc(
                Province.GYEONGGI,
                DayOfWeek.FRIDAY
        );

        System.out.println("=====================================");
        System.out.println("검색된 경기도 금요일 모임 개수: " + result.size() + "개");
        if (!result.isEmpty()) {
            System.out.println("첫 번째 모임 그룹명: " + result.get(0).getGroup().getName());
            System.out.println("모임 시작 시간: " + result.get(0).getStartTime());
        }
        System.out.println("=====================================");
    }
}