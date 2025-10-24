package com.example.ApiRound.crm.hyeonah.Controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.ApiRound.crm.hyeonah.Service.ChatAppService;
import com.example.ApiRound.crm.hyeonah.dto.ChatMessageDto;
import com.example.ApiRound.crm.hyeonah.dto.SenderRole;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatAppService chatAppService;

    /**
     * 실시간 메시지 전송
     * /app/chat.send로 메시지가 오면 처리
     */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageDto messageDto) {
        try {
            // 메시지 저장
            ChatMessageDto savedMessage = chatAppService.sendMessage(
                    messageDto.getThreadId(),
                    messageDto.getSenderRole(),
                    messageDto.getSenderUserId(),
                    messageDto.getSenderCompanyId(),
                    messageDto.getBody(),
                    null,
                    null
            );

            // 스레드별로 실시간 전송
            String destination = "/topic/chat/thread/" + messageDto.getThreadId();
            messagingTemplate.convertAndSend(destination, savedMessage);

        } catch (Exception e) {
            // 에러 발생 시 에러 메시지 전송
            String errorDestination = "/queue/chat/error/" + messageDto.getThreadId();
            messagingTemplate.convertAndSend(errorDestination, "메시지 전송에 실패했습니다.");
        }
    }
}
