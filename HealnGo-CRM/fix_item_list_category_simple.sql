-- ======================================================================
-- item_list 카테고리 수정 (간단 버전)
-- ======================================================================

-- 1. 현재 문제 확인
SELECT 
    i.id,
    i.name,
    i.category AS 'item_카테고리',
    c.company_id,
    c.company_name,
    c.category AS 'company_카테고리'
FROM item_list i
INNER JOIN company_user c ON i.owner_company_id = c.company_id
WHERE i.category = '의료서비스' OR i.category != c.category
ORDER BY i.id;

-- 2. 모든 잘못된 카테고리를 company_user의 카테고리로 수정
UPDATE item_list i
INNER JOIN company_user c ON i.owner_company_id = c.company_id
SET i.category = c.category
WHERE i.owner_company_id IS NOT NULL
  AND c.category IS NOT NULL
  AND i.category != c.category;

-- 3. 수정 결과 확인
SELECT 
    i.id,
    i.name,
    i.category AS 'item_카테고리',
    c.company_id,
    c.company_name,
    c.category AS 'company_카테고리'
FROM item_list i
INNER JOIN company_user c ON i.owner_company_id = c.company_id
WHERE i.owner_company_id IN (5, 6)
ORDER BY i.id;

-- ======================================================================
-- 또는 특정 업체만 수정하려면:
-- ======================================================================

-- YoyoDental (company_id = 5)
-- UPDATE item_list SET category = '치과' WHERE id = 65748;

-- 밍밍이네마사지샵 (company_id = 6)
-- UPDATE item_list SET category = '마사지' WHERE id = 65749;

