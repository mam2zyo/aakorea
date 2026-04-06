package org.aakorea.main.group.infrastructure;

import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.aakorea.main.group.application.MeetingAddressGeocoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
@Slf4j
public class KakaoMeetingAddressGeocoder implements MeetingAddressGeocoder {

    private final RestClient restClient;
    private final String restApiKey;

    public KakaoMeetingAddressGeocoder(
            RestClient.Builder restClientBuilder,
            @Value("${AAKOREA_KAKAO_REST_API_KEY:}") String restApiKey
    ) {
        this.restClient = restClientBuilder
                .baseUrl("https://dapi.kakao.com")
                .build();
        this.restApiKey = restApiKey == null ? "" : restApiKey.trim();
    }

    @Override
    public Coordinates resolveCoordinates(String locationAddress) {
        if (locationAddress == null || locationAddress.isBlank()) {
            return null;
        }

        if (restApiKey.isBlank()) {
            throw new IllegalStateException("AAKOREA_KAKAO_REST_API_KEY is missing");
        }

        try {
            KakaoAddressSearchResponse response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v2/local/search/address.json")
                            .queryParam("query", locationAddress)
                            .build())
                    .header(HttpHeaders.AUTHORIZATION, "KakaoAK " + restApiKey)
                    .retrieve()
                    .body(KakaoAddressSearchResponse.class);

            if (response == null || response.documents() == null || response.documents().isEmpty()) {
                log.info("Kakao geocoding returned no documents for address={}", locationAddress);
                return null;
            }

            KakaoAddressDocument document = response.documents().getFirst();
            return new Coordinates(
                    Double.parseDouble(document.y()),
                    Double.parseDouble(document.x()));
        } catch (NumberFormatException | RestClientException exception) {
            throw new IllegalStateException("Failed to geocode address with Kakao Local API", exception);
        }
    }

    private record KakaoAddressSearchResponse(
            List<KakaoAddressDocument> documents
    ) {
    }

    private record KakaoAddressDocument(
            String x,
            String y
    ) {
    }
}
