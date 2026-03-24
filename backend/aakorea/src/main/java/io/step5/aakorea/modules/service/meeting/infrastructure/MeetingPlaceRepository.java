package io.step5.aakorea.modules.service.meeting.infrastructure;

import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.meeting.domain.Meeting;
import io.step5.aakorea.modules.service.meeting.domain.MeetingPlace;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 筌뤴뫁???關??疫꿸퀡??CRUD.
 *
 * ?袁⑹삺??Group / Meeting?????퉸 ?臾롫젏??롫뮉 野껋럩??첎? ???봔?브쑴?좑쭪?筌?
 * ?關???類ｋ궖 ??륁젟/?대Ŋ猿쒐몴??袁る퉸 疫꿸퀡??Repository???癒?뮉 ?紐꾩뵠 ??ル뼄.
 */
public interface MeetingPlaceRepository extends JpaRepository<MeetingPlace, Long> {
}
