package project1.project1_spring.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import project1.project1_spring.service.RasaApiService;

@RestController
public class ChatbotRestController {

    private final RasaApiService rasaApiService;

    public ChatbotRestController(RasaApiService rasaApiService) {
        this.rasaApiService = rasaApiService;
    }

    @PostMapping("/chat")
    public List<Map<String, Object>> chat(@RequestBody Map<String, String> payload) {
        String sender = payload.get("sender");
        String message = payload.get("message");

        // Rasa API 서비스로 메시지 전달
        return rasaApiService.sendMessage(sender, message);
    }
}
