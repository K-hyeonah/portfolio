package project1.project1_spring.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import project1.project1_spring.domain.Facility;

@Repository
public class FacilityRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public FacilityRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Facility> findAll() {
        String sql = "SELECT * FROM facility_info";
        return jdbcTemplate.query(sql, new FacilityRowMapper());
    }
    
    public Facility findByName(String name) {
        String sql = "SELECT 기관번호, 기관명, 주소, 전화번호, 대표사진 FROM facility_info WHERE 기관명 = ?";
        List<Facility> facilities = jdbcTemplate.query(sql, new FacilityRowMapper(), name);
        return facilities.isEmpty() ? null : facilities.get(0);
    }
    
    public Facility findById(Long id) {
        String sql = "SELECT 기관번호, 기관명, 주소, 전화번호, 대표사진 FROM facility_info WHERE 기관번호 = ?";
        List<Facility> facilities = jdbcTemplate.query(sql, new FacilityRowMapper(), id);
        return facilities.isEmpty() ? null : facilities.get(0);
    }


    public List<Facility> searchByRegionAndKeyword(String sido, String gugun, String dong, String keyword) {
        StringBuilder sql = new StringBuilder("SELECT * FROM facility_info WHERE 1=1");
        if (sido != null && !sido.isEmpty() && !"전체".equals(sido)) {
            sql.append(" AND 주소 LIKE '%").append(sido).append("%'");
        }
        if (gugun != null && !gugun.isEmpty() && !"전체".equals(gugun)) {
            sql.append(" AND 주소 LIKE '%").append(gugun).append("%'");
        }
        if (dong != null && !dong.isEmpty() && !"전체".equals(dong)) {
            sql.append(" AND 주소 LIKE '%").append(dong).append("%'");
        }
        if (keyword != null && !keyword.isEmpty()) {
            sql.append(" AND 기관명 LIKE '%").append(keyword).append("%'");
        }
        return jdbcTemplate.query(sql.toString(), new FacilityRowMapper());
    }

    private static class FacilityRowMapper implements RowMapper<Facility> {
        @Override
        public Facility mapRow(ResultSet rs, int rowNum) throws SQLException {
            Facility facility = new Facility();

            // 데이터베이스 컬럼을 Facility 객체 필드에 매핑
            facility.setId(rs.getLong("기관번호"));
            facility.setName(rs.getString("기관명"));
            facility.setAddress(rs.getString("주소"));
            facility.setCapacity(rs.getString("정원"));
            facility.setCurrent(rs.getString("현원"));
            facility.setWaiting(rs.getString("대기인원"));
            facility.setAvailability(rs.getString("이용가능여부"));
            facility.setPhone(rs.getString("전화번호"));
            facility.setSelfPay(rs.getString("본인부담금"));
            facility.setProgramOp(rs.getString("프로그램운영"));
            facility.setTransport(rs.getString("교통편"));
            facility.setParking(rs.getString("주차시설"));
            facility.setStaffStatus(rs.getString("인력현황"));
            facility.setHomepage(rs.getString("홈페이지"));
            facility.setEvaluationDate(rs.getString("평가일자"));
            facility.setScore(rs.getString("평점"));
            facility.setTotalScore(rs.getString("총점"));
            facility.setEstablishmentDate(rs.getString("설립일자"));
            facility.setMainPhoto(rs.getString("대표사진"));
            facility.setRecommendation(rs.getString("추천"));
            facility.setProgramArt(rs.getString("예술"));
            facility.setProgramLeisure(rs.getString("여가"));
            facility.setProgramDementia(rs.getString("치매"));
            facility.setProgramReligion(rs.getString("종교"));
            facility.setProgramCognition(rs.getString("인지"));
            facility.setProgramPhysical(rs.getString("신체활동"));
            facility.setProgramTherapy(rs.getString("치료"));
            facility.setProgramBeauty(rs.getString("미용"));
            facility.setProgramSpecial(rs.getString("특화"));
            facility.setProgramEtc(rs.getString("기타"));

            return facility;
        }
    }
}