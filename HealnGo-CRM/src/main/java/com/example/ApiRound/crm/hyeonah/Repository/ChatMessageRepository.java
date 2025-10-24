package com.example.ApiRound.crm.hyeonah.Repository;

import com.example.ApiRound.crm.hyeonah.entity.ChatMessage;
import com.example.ApiRound.crm.hyeonah.entity.ChatThread;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    Page<ChatMessage> findByThreadOrderByCreatedAtDesc (ChatThread thread, Pageable pageable);
}
