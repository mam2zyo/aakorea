package io.step5.aakorea.repository;

import io.step5.aakorea.domain.MeetingPlace;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 모임 장소 기본 CRUD.
 *
 * 현재는 Group / Meeting을 통해 접근하는 경우가 대부분이지만,
 * 장소 정보 수정/교체를 위해 기본 Repository는 두는 편이 낫다.
 */
public interface MeetingPlaceRepository extends JpaRepository<MeetingPlace, Long> {
}