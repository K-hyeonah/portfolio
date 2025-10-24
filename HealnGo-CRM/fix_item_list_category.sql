-- ======================================================================
-- item_list 테이블의 카테고리를 company_user의 카테고리와 동기화
-- ======================================================================
-- 
-- 문제: 의료서비스 등록 시 item_list.category가 "의료서비스"로 고정되어 저장됨
-- 해결: company_user.category 값으로 업데이트
--
-- 실행 시기: 
--   1. 기존 데이터 수정용 (1회 실행)
--   2. 주기적으로 실행하여 동기화 (선택사항)
-- ======================================================================

-- 1단계: 현재 상태 확인
SELECT 
    i.id,
    i.name,
    i.category AS item_category,
    i.owner_company_id,
    c.company_name,
    c.category AS company_category,
    c.approval_status
FROM item_list i
LEFT JOIN company_user c ON i.owner_company_id = c.company_id
WHERE i.owner_company_id IS NOT NULL
  AND (i.category = '의료서비스' OR i.category IS NULL OR i.category != c.category)
ORDER BY i.id;

-- 2단계: 카테고리 동기화 (owner_company_id가 있는 경우만)
UPDATE item_list i
INNER JOIN company_user c ON i.owner_company_id = c.company_id
SET i.category = c.category
WHERE i.owner_company_id IS NOT NULL
  AND c.category IS NOT NULL
  AND (i.category = '의료서비스' OR i.category IS NULL OR i.category != c.category);

-- 3단계: 결과 확인
SELECT 
    i.id,
    i.name,
    i.category AS item_category,
    i.owner_company_id,
    c.company_name,
    c.category AS company_category,
    c.approval_status
FROM item_list i
LEFT JOIN company_user c ON i.owner_company_id = c.company_id
WHERE i.owner_company_id IS NOT NULL
ORDER BY i.id DESC
LIMIT 20;

-- ======================================================================
-- 참고: 특정 업체만 수정하려면 아래 쿼리 사용
-- ======================================================================

-- YoyoDental (company_id = 5)의 카테고리 수정
UPDATE item_list i
INNER JOIN company_user c ON i.owner_company_id = c.company_id
SET i.category = c.category
WHERE i.owner_company_id = 5;

-- 밍밍이네마사지샵 (company_id = 6)의 카테고리 수정
UPDATE item_list i
INNER JOIN company_user c ON i.owner_company_id = c.company_id
SET i.category = c.category
WHERE i.owner_company_id = 6;

-- ======================================================================
-- 주기적 동기화용 프로시저 (선택사항)
-- ======================================================================

DELIMITER $$

DROP PROCEDURE IF EXISTS sync_item_list_categories$$

CREATE PROCEDURE sync_item_list_categories()
BEGIN
    -- owner_company_id가 있는 모든 item의 카테고리를 company의 카테고리와 동기화
    UPDATE item_list i
    INNER JOIN company_user c ON i.owner_company_id = c.company_id
    SET i.category = c.category,
        i.updated_at = NOW()
    WHERE i.owner_company_id IS NOT NULL
      AND c.category IS NOT NULL
      AND i.category != c.category;
    
    -- 영향받은 행 수 반환
    SELECT ROW_COUNT() AS updated_rows;
END$$

DELIMITER ;

-- 프로시저 실행 예시:
-- CALL sync_item_list_categories();

