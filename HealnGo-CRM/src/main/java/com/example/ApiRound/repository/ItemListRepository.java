package com.example.ApiRound.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.ApiRound.entity.ItemList;

@Repository
public interface ItemListRepository extends JpaRepository<ItemList, Long> {

    /** 지역 + 세부지역 + 카테고리 검색 (부분일치 허용, 파라미터 null/빈문자면 미적용) */
    @Query("""
        SELECT i FROM ItemList i
        LEFT JOIN i.ownerCompany c
        WHERE (:region IS NULL OR :region = '' OR i.region LIKE CONCAT('%', :region, '%') OR i.address LIKE CONCAT('%', :region, '%'))
          AND (:subRegion IS NULL OR :subRegion = '' OR i.subregion LIKE CONCAT('%', :subRegion, '%') OR i.address LIKE CONCAT('%', :subRegion, '%'))
          AND (:category IS NULL OR :category = '' OR i.category LIKE CONCAT('%', :category, '%'))
          AND (i.ownerCompany IS NULL OR (c.isActive = true AND c.approvalStatus = 'APPROVED'))
        """)
    Page<ItemList> findByRegionAndSubregionAndCategory(
            @Param("region") String region,
            @Param("subRegion") String subRegion,
            @Param("category") String category,
            Pageable pageable);

    /** 카테고리만 검색 (null/빈문자면 전체) */
    @Query("""
        SELECT i FROM ItemList i
        LEFT JOIN i.ownerCompany c
        WHERE (:category IS NULL OR :category = '' OR i.category LIKE CONCAT('%', :category, '%'))
          AND (i.ownerCompany IS NULL OR (c.isActive = true AND c.approvalStatus = 'APPROVED'))
        """)
    Page<ItemList> findByCategory(@Param("category") String category, Pageable pageable);

    /** 카운트들 */
    @Query("""
        SELECT COUNT(i) FROM ItemList i
        LEFT JOIN i.ownerCompany c
        WHERE (:region IS NULL OR :region = '' OR i.region LIKE CONCAT('%', :region, '%') OR i.address LIKE CONCAT('%', :region, '%'))
          AND (:subRegion IS NULL OR :subRegion = '' OR i.subregion LIKE CONCAT('%', :subRegion, '%') OR i.address LIKE CONCAT('%', :subRegion, '%'))
          AND (:category IS NULL OR :category = '' OR i.category LIKE CONCAT('%', :category, '%'))
          AND (i.ownerCompany IS NULL OR (c.isActive = true AND c.approvalStatus = 'APPROVED'))
        """)
    long countByRegionAndSubregionAndCategory(
            @Param("region") String region,
            @Param("subRegion") String subRegion,
            @Param("category") String category);

    @Query("""
        SELECT COUNT(i) FROM ItemList i
        LEFT JOIN i.ownerCompany c
        WHERE (:category IS NULL OR :category = '' OR i.category LIKE CONCAT('%', :category, '%'))
          AND (i.ownerCompany IS NULL OR (c.isActive = true AND c.approvalStatus = 'APPROVED'))
        """)
    long countByCategory(@Param("category") String category);

    /** 카테고리 목록 */
    @Query("SELECT DISTINCT i.category FROM ItemList i WHERE i.category IS NOT NULL")
    List<String> findAllCategories();

    /** 승인 시 대표 지점 존재 여부 체크 */
    Optional<ItemList> findFirstByOwnerCompany_CompanyIdOrderByIdAsc(Integer companyId);

    /** 회사의 모든 지점 가져와야 할 때(선택 사항) */
    List<ItemList> findByOwnerCompany_CompanyId(Integer companyId);

    /** 대표 지점 INSERT (없을 때) - region/subregion까지 저장하도록 확장 */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query(value = """
        INSERT INTO item_list
            (name, region, subregion, address, phone, homepage, category, created_at, updated_at, owner_company_id)
        VALUES
            (:name, :region, :subregion, :address, :phone, :homepage, :category, NOW(6), NOW(6), :ownerCompanyId)
        """, nativeQuery = true)
    int insertRepresentativeIfAbsent(@Param("ownerCompanyId") Integer ownerCompanyId,
                                     @Param("name") String name,
                                     @Param("region") String region,
                                     @Param("subregion") String subregion,
                                     @Param("address") String address,
                                     @Param("phone") String phone,
                                     @Param("homepage") String homepage,
                                     @Param("category") String category);

    /** 업체의 모든 리뷰 조회 (booking_id로 조회) */
    @Query(value = """
        SELECT ur.review_id, ur.user_id, ur.item_id, ur.booking_id, ur.rating, ur.title, ur.content, 
               ur.image_mime, ur.is_public, ur.created_at, ur.updated_at, il.name as item_name, su.name as user_name
        FROM user_review ur
        JOIN reservations r ON ur.booking_id = r.id
        LEFT JOIN item_list il ON ur.item_id = il.id
        LEFT JOIN social_users su ON ur.user_id = su.user_id
        WHERE r.company_id = :companyId AND ur.is_public = true
        ORDER BY ur.created_at DESC
        """, nativeQuery = true)
    List<Object[]> findReviewsByCompanyId(@Param("companyId") Integer companyId);
    
}
