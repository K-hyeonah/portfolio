-- ======================================================================
-- 마케팅 메시지 발송 테이블 생성
-- ======================================================================

CREATE TABLE IF NOT EXISTS marketing_message (
    message_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '메시지 ID',
    company_id INT NOT NULL COMMENT '발송 업체 ID',
    
    -- 발송 대상
    target_segment VARCHAR(50) NOT NULL COMMENT '대상 세그먼트 (ALL, RECENT_30DAYS, VIP, INACTIVE, FIRST_TIME)',
    target_channel VARCHAR(20) NOT NULL DEFAULT 'PUSH' COMMENT '발송 채널 (PUSH, SMS, EMAIL)',
    
    -- 메시지 내용
    title VARCHAR(200) NOT NULL COMMENT '메시지 제목',
    content TEXT NOT NULL COMMENT '메시지 본문',
    link_url VARCHAR(1000) COMMENT '링크 URL',
    
    -- 발송 설정
    send_type VARCHAR(20) NOT NULL DEFAULT 'IMMEDIATE' COMMENT '발송 타입 (IMMEDIATE, SCHEDULED)',
    scheduled_at DATETIME COMMENT '예약 발송 시간',
    
    -- 발송 결과
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '상태 (PENDING, SENDING, SENT, FAILED)',
    sent_at DATETIME COMMENT '실제 발송 시간',
    target_count INT DEFAULT 0 COMMENT '대상 고객 수',
    success_count INT DEFAULT 0 COMMENT '성공 발송 수',
    fail_count INT DEFAULT 0 COMMENT '실패 발송 수',
    
    -- 관리자 승인 (옵션)
    approval_status VARCHAR(20) DEFAULT 'APPROVED' COMMENT '승인 상태 (PENDING, APPROVED, REJECTED)',
    approved_by INT COMMENT '승인자 ID',
    approved_at DATETIME COMMENT '승인 시간',
    reject_reason VARCHAR(500) COMMENT '반려 사유',
    
    -- 시간 정보
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
    
    -- 외래키
    FOREIGN KEY (company_id) REFERENCES company_user(company_id) ON DELETE CASCADE,
    
    -- 인덱스
    INDEX idx_company_id (company_id),
    INDEX idx_status (status),
    INDEX idx_scheduled_at (scheduled_at),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='마케팅 메시지 발송 이력';

-- ======================================================================
-- 샘플 데이터 (테스트용)
-- ======================================================================

-- company_id 1번 업체의 샘플 메시지
INSERT INTO marketing_message (
    company_id, target_segment, target_channel,
    title, content, link_url,
    send_type, status, sent_at,
    target_count, success_count, fail_count,
    approval_status
) VALUES 
(1, 'ALL', 'PUSH', 
 '신규 이벤트 안내', 
 '이번 주 특별 할인 이벤트가 시작됩니다! 지금 바로 확인하세요.',
 'https://healngo.com/event/1',
 'IMMEDIATE', 'SENT', NOW(),
 150, 148, 2,
 'APPROVED');

-- ======================================================================
-- 테이블 확인
-- ======================================================================

SELECT * FROM marketing_message ORDER BY created_at DESC LIMIT 10;

