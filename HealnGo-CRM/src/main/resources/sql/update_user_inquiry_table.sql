-- user_inquiry 테이블에 새로운 컬럼 추가

-- target_url 컬럼 추가
ALTER TABLE user_inquiry 
ADD COLUMN IF NOT EXISTS target_url VARCHAR(1000) NULL COMMENT '대상 URL' AFTER content;

-- attachment_path 컬럼 추가
ALTER TABLE user_inquiry 
ADD COLUMN IF NOT EXISTS attachment_path VARCHAR(1024) NULL COMMENT '첨부파일 경로' AFTER target_url;

-- priority 컬럼 추가
ALTER TABLE user_inquiry 
ADD COLUMN IF NOT EXISTS priority ENUM('NORMAL','URGENT') NOT NULL DEFAULT 'NORMAL' COMMENT '우선순위' AFTER attachment_path;

-- request_type 컬럼 추가 (admin_answer 이전에)
ALTER TABLE user_inquiry 
ADD COLUMN IF NOT EXISTS request_type ENUM('PROMOTION','CUSTOMER_REPORT','TECH_SUPPORT','SETTLEMENT','ACCOUNT','OTHER') NULL COMMENT '요청 유형' AFTER answered_by;

