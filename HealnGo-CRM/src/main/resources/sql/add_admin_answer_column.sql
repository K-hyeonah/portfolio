-- user_inquiry 테이블에 admin_answer 컬럼 추가
ALTER TABLE user_inquiry 
ADD COLUMN admin_answer TEXT NULL COMMENT '관리자 답변' AFTER content;
