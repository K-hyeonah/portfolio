package com.example.ApiRound.crm.hyeonah.Service;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ApiRound.crm.hyeonah.Repository.ChatMessageRepository;
import com.example.ApiRound.crm.hyeonah.Repository.ChatThreadRepository;
import com.example.ApiRound.crm.hyeonah.dto.ChatMessageDto;
import com.example.ApiRound.crm.hyeonah.dto.ChatThreadDto;
import com.example.ApiRound.crm.hyeonah.dto.SenderRole;
import com.example.ApiRound.crm.hyeonah.entity.ChatMessage;
import com.example.ApiRound.crm.hyeonah.entity.ChatThread;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatAppService {

    private final ChatThreadRepository threadRepo;
    private final ChatMessageRepository msgRepo;

    // 스레드 보장 (없으면 생성)
    @Transactional
    public Long ensureThread(Integer userId, Integer companyId, Long itemId, String title) {
        return threadRepo.findFirstByUserIdAndCompanyIdAndItemId(userId, companyId, itemId)
                .map(ChatThread::getThreadId)
                .orElseGet(() -> threadRepo.save(ChatThread.builder()
                        .userId(userId)
                        .companyId(companyId)
                        .itemId(itemId)
                        .title(title)
                        .muted(false)
                        .status("NEW")
                        .lastMsgAt(LocalDateTime.now())
                        .build()
                ).getThreadId());
    }

    // 사용자용 스레드 목록
    @Transactional(readOnly = true)
    public Page<ChatThreadDto> listThreadsForUser(Integer userId, int page, int size) {
        var p = threadRepo.findByUserIdOrderByLastMsgAtDescThreadIdDesc(userId, PageRequest.of(page - 1, size));
        return p.map(t -> ChatThreadDto.builder()
                .threadId(t.getThreadId())
                .userId(t.getUserId())
                .companyId(t.getCompanyId())
                .itemId(t.getItemId())
                .title(t.getTitle())
                .muted(t.isMuted())
                .status(t.getStatus())
                .lastMsgAt(t.getLastMsgAt())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build());
    }

    // 회사용 스레드 목록
    @Transactional(readOnly = true)
    public Page<ChatThreadDto> listThreadsForCompany(Integer companyId, int page, int size, String status) {
        Page<ChatThread> p;

        if (status != null && !status.isEmpty()) {
            // status 필터링이 있는 경우
            p = threadRepo.findByCompanyIdAndStatusOrderByLastMsgAtDescThreadIdDesc(
                    companyId, status, PageRequest.of(page - 1, size));
        } else {
            // 전체 조회
            p = threadRepo.findByCompanyIdOrderByLastMsgAtDescThreadIdDesc(
                    companyId, PageRequest.of(page - 1, size));
        }

        return p.map(t -> ChatThreadDto.builder()
                .threadId(t.getThreadId())
                .userId(t.getUserId())
                .companyId(t.getCompanyId())
                .itemId(t.getItemId())
                .title(t.getTitle())
                .muted(t.isMuted())
                .status(t.getStatus())
                .lastMsgAt(t.getLastMsgAt())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build());
    }

    // 메시지 목록
    @Transactional(readOnly = true)
    public Page<ChatMessageDto> listMessages(Long threadId, int page, int size) {
        var thread = threadRepo.findById(threadId).orElseThrow();
        var p = msgRepo.findByThreadOrderByCreatedAtDesc(thread, PageRequest.of(page - 1, size));
        return p.map(m -> ChatMessageDto.builder()
                .messageId(m.getMessageId())
                .threadId(thread.getThreadId())                 // ✅ Long
                .senderRole(m.getSenderRole())                  // ✅ enum SenderRole
                .senderUserId(m.getSenderUserId())
                .senderCompanyId(m.getSenderCompanyId())
                .body(m.getBody())
                // .attachmentBlob(null)  // 목록에선 보통 제외 (원하면 넣어도 됨)
                .attachmentMime(m.getAttachmentMime())
                .createdAt(m.getCreatedAt())
                .build());
    }

    // 메시지 전송
    @Transactional
    public ChatMessageDto sendMessage(Long  threadId, SenderRole role, Integer senderUserId,
                                      Integer senderCompanyId, String body, byte[] file, String mime) {

        var thread = threadRepo.getReferenceById(threadId);

        var saved = msgRepo.save(ChatMessage.builder()
                .thread(thread)
                .senderRole(role)
                .senderUserId(senderUserId)
                .senderCompanyId(senderCompanyId)
                .body(body)
                .attachmentBlob(file)
                .attachmentMime(mime)
                .build());

        // 마지막 메시지 시각 갱신
        thread.setLastMsgAt(LocalDateTime.now());

        // 첫 메시지 전송 시 상태를 IN_PROGRESS로 변경
        if ("NEW".equals(thread.getStatus())) {
            thread.setStatus("IN_PROGRESS");
        }

        return ChatMessageDto.builder()
                .messageId(saved.getMessageId())
                .threadId(threadId)
                .senderRole(saved.getSenderRole())
                .senderUserId(saved.getSenderUserId())
                .senderCompanyId(saved.getSenderCompanyId())
                .body(saved.getBody())
                // .attachmentBlob(saved.getAttachmentBlob()) // 필요 시 포함
                .attachmentMime(saved.getAttachmentMime())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    // 스레드 상태 업데이트
    @Transactional
    public boolean updateThreadStatus(Long threadId, String status) {
        try {
            return threadRepo.findById(threadId)
                    .map(thread -> {
                        thread.setStatus(status);
                        thread.setUpdatedAt(LocalDateTime.now());
                        threadRepo.save(thread);
                        return true;
                    })
                    .orElse(false);
        } catch (Exception e) {
            log.error("스레드 상태 업데이트 실패: threadId={}, status={}", threadId, status, e);
            return false;
        }
    }

    // 병원과의 새 스레드 생성
    @Transactional
    public ChatThreadDto createThread(Integer companyId, String title, Integer userId) {
        // 기존 스레드가 있는지 확인
        var existingThread = threadRepo.findFirstByUserIdAndCompanyId(userId, companyId);
        if (existingThread.isPresent()) {
            // 기존 스레드가 있으면 반환
            var thread = existingThread.get();
            return ChatThreadDto.builder()
                    .threadId(thread.getThreadId())
                    .userId(thread.getUserId())
                    .companyId(thread.getCompanyId())
                    .title(thread.getTitle())
                    .status(thread.getStatus())
                    .lastMsgAt(thread.getLastMsgAt())
                    .createdAt(thread.getCreatedAt())
                    .build();
        }

        // 새 스레드 생성
        var newThread = ChatThread.builder()
                .userId(userId)
                .companyId(companyId)
                .itemId(null) // 병원 상담은 itemId 없음
                .title(title)
                .muted(false)
                .status("NEW")
                .lastMsgAt(LocalDateTime.now())
                .build();

        var savedThread = threadRepo.save(newThread);

        return ChatThreadDto.builder()
                .threadId(savedThread.getThreadId())
                .userId(savedThread.getUserId())
                .companyId(savedThread.getCompanyId())
                .title(savedThread.getTitle())
                .status(savedThread.getStatus())
                .lastMsgAt(savedThread.getLastMsgAt())
                .createdAt(savedThread.getCreatedAt())
                .build();
    }

}
