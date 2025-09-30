package project1.project1_spring.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository; // LocalDate 사용을 위해 import

import project1.project1_spring.domain.FacilityDetail;

@Repository
public class FacilityDetailRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public FacilityDetailRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<FacilityDetail> findById(Long id) {
        // 상세 정보 조회를 위한 SQL 쿼리
        // 중요: 아래 컬럼명들은 실제 데이터베이스 테이블의 컬럼명과 정확히 일치해야 합니다.
        // 예시 컬럼명: 기관번호, 기관명, 주소, 정원, 현원, 대기인원, 이용가능여부, 전화번호,
        //             본인부담금, 프로그램운영, 교통편, 주차시설, 인력현황, 홈페이지,
        //             평가일자, 평점, 총점, 설립일자, 대표사진, 추천
        String sql = "SELECT " +
                "기관번호, 기관명, 주소, 정원, 현원, 대기인원, 이용가능여부, 전화번호, " +
                "본인부담금, 프로그램운영, 교통편, 주차시설, 인력현황, 홈페이지, " +
                "평가일자, 평점, 총점, 설립일자, 대표사진, 추천 " +
                "FROM facility_info WHERE 기관번호 = ?"; // facility_info 테이블에서 조회

        return jdbcTemplate.queryForObject(sql, new Object[]{id}, new FacilityDetailRowMapper());
    }






    public List<FacilityDetail> findAllById(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }

        // 동적으로 IN 절에 들어갈 '?' 개수를 만듭니다.
        String inSql = String.join(",", java.util.Collections.nCopies(ids.size(), "?"));

        String sql = "SELECT " +
                "기관번호, 기관명, 주소, 정원, 현원, 대기인원, 이용가능여부, 전화번호, " +
                "본인부담금, 프로그램운영, 교통편, 주차시설, 인력현황, 홈페이지, " +
                "평가일자, 평점, 총점, 설립일자, 대표사진, 추천 " +
                "FROM facility_info WHERE 기관번호 IN (" + inSql + ")";

        // ids.toArray()를 사용하여 List<Long>을 Object[]로 변환합니다.
        return jdbcTemplate.query(sql, ids.toArray(), new SimpleFacilityDetailRowMapper());
    }

    private static class SimpleFacilityDetailRowMapper implements RowMapper<FacilityDetail> {
        @Override
        public FacilityDetail mapRow(ResultSet rs, int rowNum) throws SQLException {
            FacilityDetail detail = new FacilityDetail();
            try {
                detail.setId(rs.getLong("기관번호"));
                detail.setName(rs.getString("기관명"));
                detail.setAddress(rs.getString("주소"));
                detail.setCapacity(rs.getString("정원"));
                detail.setCurrentOccupancy(rs.getString("현원"));
                detail.setWaitingList(rs.getString("대기인원"));
                detail.setAvailability(rs.getString("이용가능여부"));
                detail.setPhone(rs.getString("전화번호"));
                detail.setSelfPay(rs.getString("본인부담금"));
                detail.setProgramOperation(rs.getString("프로그램운영"));
                detail.setTransportation(rs.getString("교통편"));
                detail.setParkingFacility(rs.getString("주차시설"));
                detail.setStaffStatus(rs.getString("인력현황"));
                detail.setHomepage(rs.getString("홈페이지"));

                if (rs.getDate("평가일자") != null) {
                    detail.setEvaluationDate(rs.getDate("평가일자").toLocalDate());
                }
                if (rs.getDate("설립일자") != null) {
                    detail.setEstablishDate(rs.getDate("설립일자").toLocalDate());
                }

                detail.setRating(rs.getString("평점"));
                detail.setTotalScore(rs.getObject("총점", Double.class));
                detail.setMainImage(rs.getString("대표사진"));
                detail.setRecommendation(rs.getString("추천"));
            } catch (SQLException e) {
                System.err.println("Error mapping FacilityDetail row: " + e.getMessage());
                throw e;
            }
            return detail;
        }
    }









    // FacilityDetail 객체를 ResultSet으로부터 매핑하는 내부 클래스 (RowMapper)
    private static class FacilityDetailRowMapper implements RowMapper<Optional<FacilityDetail>> {
        @Override
        public Optional<FacilityDetail> mapRow(ResultSet rs, int rowNum) throws SQLException {
            FacilityDetail detail = new FacilityDetail();
            try {
                detail.setId(rs.getLong("기관번호"));
                detail.setName(rs.getString("기관명"));
                detail.setAddress(rs.getString("주소"));
                detail.setCapacity(rs.getObject("정원", String.class)); // Integer 타입으로 가져오기
                detail.setCurrentOccupancy(rs.getObject("현원", String.class));
                detail.setWaitingList(rs.getObject("대기인원", String.class));
                detail.setAvailability(rs.getString("이용가능여부"));
                detail.setPhone(rs.getString("전화번호"));
                detail.setSelfPay(rs.getString("본인부담금"));
                detail.setProgramOperation(rs.getString("프로그램운영"));
                detail.setTransportation(rs.getString("교통편"));
                detail.setParkingFacility(rs.getString("주차시설"));
                detail.setStaffStatus(rs.getString("인력현황"));
                detail.setHomepage(rs.getString("홈페이지"));

                // 날짜 컬럼 처리 (DB 타입이 DATE라면 getDate, VARCHAR라면 getString 후 파싱)
                if (rs.getDate("평가일자") != null) {
                    detail.setEvaluationDate(rs.getDate("평가일자").toLocalDate());
                }
                if (rs.getDate("설립일자") != null) {
                    detail.setEstablishDate(rs.getDate("설립일자").toLocalDate());
                }

                detail.setRating(rs.getString("평점"));
                detail.setTotalScore(rs.getObject("총점", Double.class));
                detail.setMainImage(rs.getString("대표사진")); // DB 컬럼명에 따라 변경
                detail.setRecommendation(rs.getString("추천"));

                return Optional.of(detail);
            } catch (SQLException e) {
                // 특정 컬럼이 없거나 타입 불일치 등 예외 처리
                System.err.println("Error mapping FacilityDetail row: " + e.getMessage());
                return Optional.empty(); // 매핑 실패 시 빈 Optional 반환
            }
        }
    }
}