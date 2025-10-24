package com.example.ApiRound.crm.hyeonah.Repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ApiRound.crm.hyeonah.entity.ChatThread;

public interface ChatThreadRepository extends JpaRepository<ChatThread, Long> {
    Page<ChatThread> findByUserIdOrderByLastMsgAtDescThreadIdDesc(Integer userId, Pageable pageable);
    Page<ChatThread> findByCompanyIdOrderByLastMsgAtDescThreadIdDesc(Integer companyId, Pageable pageable);
    Page<ChatThread> findByCompanyIdAndStatusOrderByLastMsgAtDescThreadIdDesc(Integer companyId, String status, Pageable pageable);
    Optional<ChatThread> findFirstByUserIdAndCompanyIdAndItemId(Integer userId, Integer companyId, Long itemId);
    Optional<ChatThread> findFirstByUserIdAndCompanyId(Integer userId, Integer companyId);

}
