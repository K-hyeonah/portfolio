package project1.project1_spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project1.project1_spring.entity.Notice;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    // JpaRepository 기본 메서드 제공 (save, findById, findAll 등)
    
    // 최신 공지사항 조회
    @Query("SELECT n FROM Notice n ORDER BY n.createdAt DESC")
    List<Notice> findTopByOrderByCreatedAtDesc(@Param("limit") int limit);
    
    // ID 기준 내림차순 정렬
    @Query("SELECT n FROM Notice n ORDER BY n.id DESC")
    List<Notice> findAllByOrderByIdDesc();
    
    // 생성일 기준 내림차순 정렬 (최신순)
    @Query("SELECT n FROM Notice n ORDER BY n.createdAt DESC")
    List<Notice> findAllByOrderByCreatedAtDesc();
    
    // 페이징 처리
    @Query("SELECT n FROM Notice n ORDER BY n.createdAt DESC")
    List<Notice> findPaginated(@Param("pageSize") int pageSize, @Param("offset") int offset);
    
    // 전체 게시글 수 조회
    @Query("SELECT COUNT(n) FROM Notice n")
    int getTotalCount();
}