package com.example.ApiRound.crm.hyeonah.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ChatController {

    @GetMapping("/chat")
    public String chat() {
        return "crm/chat";
    }
}
