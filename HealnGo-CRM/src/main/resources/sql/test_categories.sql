-- ITEM_LIST 테이블에서 카테고리별 데이터 조회 테스트

-- 성형외과 데이터 조회
SELECT * FROM ITEM_LIST WHERE category LIKE '%성형%';

-- 피부과 데이터 조회
SELECT * FROM ITEM_LIST WHERE category LIKE '%피부%';

-- 치과 데이터 조회
SELECT * FROM ITEM_LIST WHERE category LIKE '%치과%';

-- 약국 데이터 조회
SELECT * FROM ITEM_LIST WHERE category LIKE '%약국%';

-- 마사지 데이터 조회
SELECT * FROM ITEM_LIST WHERE category LIKE '%마사지%';

-- 한의원 데이터 조회
SELECT * FROM ITEM_LIST WHERE category LIKE '%한의원%';

-- 왁싱 데이터 조회
SELECT * FROM ITEM_LIST WHERE category LIKE '%왁싱%';

-- 전체 카테고리 분포 확인
SELECT category, COUNT(*) as count 
FROM ITEM_LIST 
GROUP BY category 
ORDER BY category;
