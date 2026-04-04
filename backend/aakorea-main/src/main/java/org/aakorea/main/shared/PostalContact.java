package org.aakorea.main.shared;

import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Embeddable
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PostalContact {

    private String recipient;

    private String postalCode;

    private String roadAddress;

    private String detailAddress;

    public PostalContact(
            String recipient,
            String postalCode,
            String roadAddress,
            String detailAddress
    ) {
        this.recipient = recipient;
        this.postalCode = postalCode;
        this.roadAddress = roadAddress;
        this.detailAddress = detailAddress;
    }

    public boolean isEmpty() {
        return recipient == null
                && postalCode == null
                && roadAddress == null
                && detailAddress == null;
    }
}
