-- click_logs 테이블 업데이트 (안전 버전)
-- 이미 컬럼이 있으면 건너뛰기

-- 1. item_id 컬럼 추가 시도
-- 이미 있으면 에러 발생하지만 계속 진행
SET @sql1 = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE click_logs ADD COLUMN item_id BIGINT NULL COMMENT ''클릭된 아이템 ID'' AFTER company_id;',
        'SELECT ''item_id 컬럼이 이미 존재합니다'' AS message;'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'click_logs'
      AND COLUMN_NAME = 'item_id'
);
PREPARE stmt1 FROM @sql1;
EXECUTE stmt1;
DEALLOCATE PREPARE stmt1;

-- 2. user_id 컬럼 추가 시도
SET @sql2 = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE click_logs ADD COLUMN user_id INT NULL COMMENT ''클릭한 사용자 ID'' AFTER item_id;',
        'SELECT ''user_id 컬럼이 이미 존재합니다'' AS message;'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'click_logs'
      AND COLUMN_NAME = 'user_id'
);
PREPARE stmt2 FROM @sql2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- 3. 인덱스 추가 (이미 있으면 에러 발생 가능하지만 무시)
-- idx_company_id_clicked_at
SET @sql3 = (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE INDEX idx_company_id_clicked_at ON click_logs(company_id, clicked_at);',
        'SELECT ''idx_company_id_clicked_at 인덱스가 이미 존재합니다'' AS message;'
    )
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'click_logs'
      AND INDEX_NAME = 'idx_company_id_clicked_at'
);
PREPARE stmt3 FROM @sql3;
EXECUTE stmt3;
DEALLOCATE PREPARE stmt3;

-- idx_item_id
SET @sql4 = (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE INDEX idx_item_id ON click_logs(item_id);',
        'SELECT ''idx_item_id 인덱스가 이미 존재합니다'' AS message;'
    )
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'click_logs'
      AND INDEX_NAME = 'idx_item_id'
);
PREPARE stmt4 FROM @sql4;
EXECUTE stmt4;
DEALLOCATE PREPARE stmt4;

-- idx_user_id
SET @sql5 = (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE INDEX idx_user_id ON click_logs(user_id);',
        'SELECT ''idx_user_id 인덱스가 이미 존재합니다'' AS message;'
    )
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'click_logs'
      AND INDEX_NAME = 'idx_user_id'
);
PREPARE stmt5 FROM @sql5;
EXECUTE stmt5;
DEALLOCATE PREPARE stmt5;

SELECT '✅ click_logs 테이블 업데이트 완료!' AS result;

