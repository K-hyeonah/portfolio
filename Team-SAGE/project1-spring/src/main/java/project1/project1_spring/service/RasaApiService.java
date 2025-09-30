package project1.project1_spring.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class RasaApiService {

    // Rasa 서버의 주소 (rasa run --enable-api 명령어로 실행된 서버 주소)
    private final WebClient webClient = WebClient.create("http://localhost:5005");

    /**
     * Rasa 챗봇에 메시지를 보내고 응답을 받는 메서드
     * @param sender 사용자 ID
     * @param message 사용자가 입력한 메시지
     * @return 챗봇의 응답 리스트
     */
    public List<Map<String, Object>> sendMessage(String sender, String message) {
        // Rasa API에 보낼 요청 바디를 생성
        Map<String, String> requestBody = Map.of(
                "sender", sender,
                "message", message
        );

        // WebClient를 사용하여 POST 요청을 보냄
        return webClient.post()
                .uri("/webhooks/rest/webhook") // Rasa의 기본 webhook 엔드포인트
                .body(BodyInserters.fromValue(requestBody))
                .retrieve()
                .bodyToMono(List.class)
                .block(); // 비동기 호출을 블록킹하여 동기적으로 결과를 받음
    }
}
