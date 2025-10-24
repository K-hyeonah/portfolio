-- user_review 테이블의 FK 제약조건 수정
-- booking_id가 reservations.id를 참조하도록 변경

USE healngo;

-- 1. 기존 FK 제약조건 삭제
ALTER TABLE user_review 
DROP FOREIGN KEY user_review_ibfk_3;

-- 2. booking_id 컬럼 타입을 BIGINT로 변경 (reservations.id는 BIGINT)
ALTER TABLE user_review 
MODIFY COLUMN booking_id BIGINT;

-- 3. 새로운 FK 제약조건 추가 (reservations.id 참조)
ALTER TABLE user_review 
ADD CONSTRAINT fk_user_review_reservation 
FOREIGN KEY (booking_id) 
REFERENCES reservations(id) 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- 확인
SHOW CREATE TABLE user_review;

