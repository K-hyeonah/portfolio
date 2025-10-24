-- ========================================
-- reservations 테이블에 service_id 컬럼 추가
-- ========================================

-- 1. reservations 테이블에 service_id 컬럼 추가
ALTER TABLE reservations 
ADD COLUMN service_id BIGINT NULL AFTER total_amount;

-- 2. 기존 데이터에 대한 처리: 각 예약의 company_id를 기반으로 해당 업체의 첫 번째 service를 찾아 설정
UPDATE reservations r
SET r.service_id = (
    SELECT MIN(ms.service_id) 
    FROM medical_service ms
    INNER JOIN item_list il ON il.id = ms.item_id
    WHERE il.owner_company_id = r.company_id
)
WHERE r.id > 0 AND r.service_id IS NULL;

-- 3. reservations 인덱스 추가
CREATE INDEX idx_reservations_service_id ON reservations(service_id);

-- ========================================
-- user_review 테이블에 service_id 컬럼 추가
-- ========================================

-- 4. user_review 테이블에 service_id 컬럼 추가
ALTER TABLE user_review
ADD COLUMN service_id BIGINT NULL AFTER item_id;

-- 5. 기존 리뷰 데이터에 대한 처리: booking_id로 예약을 찾아 service_id 설정
UPDATE user_review ur
INNER JOIN reservations r ON r.id = ur.booking_id
SET ur.service_id = r.service_id
WHERE ur.review_id > 0 AND ur.service_id IS NULL AND r.service_id IS NOT NULL;

-- 6. user_review 인덱스 추가
CREATE INDEX idx_user_review_service_id ON user_review(service_id);

SELECT 'service_id 컬럼이 성공적으로 추가되었습니다!' AS result;

