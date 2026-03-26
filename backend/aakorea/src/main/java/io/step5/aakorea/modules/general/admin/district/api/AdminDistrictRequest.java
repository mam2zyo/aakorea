package io.step5.aakorea.modules.general.admin.district.api;

import io.step5.aakorea.modules.general.admin.district.domain.District;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminDistrictRequest(
        @NotBlank(message = "筌왖??肉????已?? ?袁⑸땾??낅빍??")
        @Size(max = 100, message = "筌왖??肉????已?? 100????꾨릭嚥???낆젾??곻폒?紐꾩뒄.")
        String name
) {
}

