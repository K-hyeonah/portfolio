-- click_logs 테이블에 item_id와 user_id 컬럼 추가
-- MySQL 8.0 호환 버전

-- item_id 추가 (어떤 아이템이 클릭되었는지)
ALTER TABLE click_logs 
ADD COLUMN item_id BIGINT NULL COMMENT '클릭된 아이템 ID' 
AFTER company_id;

-- user_id 추가 (누가 클릭했는지)
ALTER TABLE click_logs 
ADD COLUMN user_id INT NULL COMMENT '클릭한 사용자 ID' 
AFTER item_id;

-- 인덱스 추가 (성능 향상)
CREATE INDEX idx_company_id_clicked_at ON click_logs(company_id, clicked_at);
CREATE INDEX idx_item_id ON click_logs(item_id);
CREATE INDEX idx_user_id ON click_logs(user_id);

