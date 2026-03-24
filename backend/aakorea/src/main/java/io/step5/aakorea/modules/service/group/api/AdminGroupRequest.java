package io.step5.aakorea.modules.service.group.api;

import io.step5.aakorea.modules.service.district.domain.District;
import io.step5.aakorea.modules.service.group.domain.Group;
import io.step5.aakorea.modules.service.gsr.domain.GSR;
import io.step5.aakorea.modules.service.meeting.domain.Meeting;
import io.step5.aakorea.modules.shared.region.domain.Province;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record AdminGroupRequest(
        @NotBlank(message = "域밸챶竊???已?? ?袁⑸땾??낅빍??")
        @Size(max = 100, message = "域밸챶竊???已?? 100????꾨릭嚥???낆젾??곻폒?紐꾩뒄.")
        String name,

        LocalDate startDate,

        @NotNull(message = "??깆젟?닌딅열(?????? ?袁⑸땾??낅빍??")
        Province province,

        Long districtId,

        Long gsrId,

        @Size(max = 255, message = "?怨뺤뵭筌?雅뚯눘???255????꾨릭嚥???낆젾??곻폒?紐꾩뒄.")
        String contactAddress,

        @Size(max = 255, message = "?怨뺤뵭筌???李??? 255????꾨릭嚥???낆젾??곻폒?紐꾩뒄.")
        String contactEmail,

        @Size(max = 50, message = "?怨뺤뵭筌??袁れ넅甕곕뜇???50????꾨릭嚥???낆젾??곻폒?紐꾩뒄.")
        String contactPhone,

        @NotBlank(message = "疫꿸퀡??筌뤴뫁???關???袁⑥쨮筌뤿굞竊???뮉 ?袁⑸땾??낅빍??")
        @Size(max = 255, message = "?袁⑥쨮筌뤿굞竊???뮉 255????꾨릭嚥???낆젾??곻폒?紐꾩뒄.")
        String meetingRoadAddress,

        @NotBlank(message = "疫꿸퀡??筌뤴뫁???關???怨멸쉭雅뚯눘????袁⑸땾??낅빍??")
        @Size(max = 255, message = "?怨멸쉭雅뚯눘???255????꾨릭嚥???낆젾??곻폒?紐꾩뒄.")
        String meetingDetailAddress,

        @Size(max = 500, message = "?關????덇땀?얜챷? 500????꾨릭嚥???낆젾??곻폒?紐꾩뒄.")
        String meetingGuide,

        @DecimalMin(value = "-90.0", message = "?袁⑤즲??-90 ??곴맒??곷선????몃빍??")
        @DecimalMax(value = "90.0", message = "?袁⑤즲??90 ??꾨릭??鍮???몃빍??")
        Double meetingLatitude,

        @DecimalMin(value = "-180.0", message = "野껋럥猷??-180 ??곴맒??곷선????몃빍??")
        @DecimalMax(value = "180.0", message = "野껋럥猷??180 ??꾨릭??鍮???몃빍??")
        Double meetingLongitude
) {
}

