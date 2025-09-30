package project1.project1_spring.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project1.project1_spring.entity.Faq;

import java.util.List;

@Repository
public interface FaqRepository extends JpaRepository<Faq, Long> {
    // 기본 CRUD 메서드 사용 가능
    
    // 최신 FAQ 조회
    @Query("SELECT f FROM Faq f ORDER BY f.createdAt DESC")
    List<Faq> findTopByOrderByCreatedAtDesc(@Param("limit") int limit);
    
    // ID 기준 내림차순 정렬
    @Query("SELECT f FROM Faq f ORDER BY f.id DESC")
    List<Faq> findAllByOrderByIdDesc();
    
    // 생성일 기준 내림차순 정렬 (최신순)
    @Query("SELECT f FROM Faq f ORDER BY f.createdAt DESC")
    List<Faq> findAllByOrderByCreatedAtDesc();
    
    // 페이징 처리
    @Query("SELECT f FROM Faq f ORDER BY f.createdAt DESC")
    List<Faq> findPaginated(@Param("pageSize") int pageSize, @Param("offset") int offset);
    
    // 전체 게시글 수 조회
    @Query("SELECT COUNT(f) FROM Faq f")
    int getTotalCount();
}