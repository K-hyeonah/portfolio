-- social_users 테이블에 status 컬럼 추가
-- 사용자 상태 관리 기능 (활성, 정지, 비활성화)

ALTER TABLE social_users 
ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE' AFTER is_deleted;

-- 기존 데이터에 기본값 설정
UPDATE social_users 
SET status = CASE 
    WHEN is_deleted = 1 THEN 'INACTIVE'
    ELSE 'ACTIVE'
END
WHERE status IS NULL;

-- 인덱스 추가 (필터링 성능 향상)
CREATE INDEX idx_social_users_status ON social_users(status, is_deleted);

-- 상태값 확인용 주석
-- 가능한 status 값:
-- 'ACTIVE' - 활성 (정상 사용)
-- 'SUSPENDED' - 정지 (일시 정지)
-- 'INACTIVE' - 비활성화 (삭제됨)

