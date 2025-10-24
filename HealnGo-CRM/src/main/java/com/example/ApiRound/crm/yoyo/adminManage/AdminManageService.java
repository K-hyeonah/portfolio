package com.example.ApiRound.crm.yoyo.adminManage;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ApiRound.crm.hyeonah.entity.CompanyUser;
import com.example.ApiRound.crm.hyeonah.review.UserReviewRepository;
import com.example.ApiRound.crm.yoyo.medi.MediServiceEntity;
import com.example.ApiRound.crm.yoyo.medi.MediServiceRepository;
import com.example.ApiRound.entity.ItemList;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminManageService {
    
    private final AdminManageRepository adminManageRepository;
    private final MediServiceRepository mediServiceRepository;
    private final UserReviewRepository userReviewRepository;
    
    /**
     * 업체 관리 통계 데이터 조회
     */
    public Map<String, Object> getCompanyStats() {
        log.info("====== AdminManageService.getCompanyStats 호출 ======");
        
        try {
            // 이번 달 시작일 계산
            LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            
            // 각 통계 데이터 조회
            long totalCompanies = adminManageRepository.countApprovedCompanies();
            long newThisMonth = adminManageRepository.countNewCompaniesThisMonth(startOfMonth);
            long reportsReceived = adminManageRepository.countReportedCompanies();
            long underSanction = adminManageRepository.countSuspendedCompanies();
            
            log.info("통계 데이터 조회 완료:");
            log.info("  - 전체 업체: {}", totalCompanies);
            log.info("  - 이번 달 신규: {}", newThisMonth);
            log.info("  - 신고 접수: {}", reportsReceived);
            log.info("  - 제재 중: {}", underSanction);
            
            // 결과 맵 생성
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalCompanies", totalCompanies);
            stats.put("newThisMonth", newThisMonth);
            stats.put("reportsReceived", reportsReceived);
            stats.put("underSanction", underSanction);
            
            return stats;
            
        } catch (Exception e) {
            log.error("통계 데이터 조회 중 오류 발생: ", e);
            
            // 오류 시 기본값 반환
            Map<String, Object> defaultStats = new HashMap<>();
            defaultStats.put("totalCompanies", 0L);
            defaultStats.put("newThisMonth", 0L);
            defaultStats.put("reportsReceived", 0L);
            defaultStats.put("underSanction", 0L);
            
            return defaultStats;
        }
    }
    
    /**
     * 승인된 업체 목록 조회
     */
    public List<ItemList> getApprovedCompanies() {
        log.info("====== AdminManageService.getApprovedCompanies 호출 ======");
        
        try {
            List<ItemList> companies = adminManageRepository.findApprovedCompanies();
            log.info("승인된 업체 목록 조회 완료: {}개", companies.size());
            
            // 각 업체 정보 로깅
            for (ItemList company : companies) {
                log.info("  - 업체 ID: {}, 이름: {}, 회사명: {}", 
                    company.getId(), 
                    company.getName(), 
                    company.getOwnerCompany() != null ? company.getOwnerCompany().getCompanyName() : "N/A");
            }
            
            return companies;
            
        } catch (Exception e) {
            log.error("업체 목록 조회 중 오류 발생: ", e);
            return List.of(); // 빈 리스트 반환
        }
    }
    
    /**
     * 업체명으로 검색
     */
    public List<ItemList> searchCompanies(String searchTerm) {
        log.info("====== AdminManageService.searchCompanies 호출 ======");
        log.info("검색어: {}", searchTerm);
        
        try {
            if (searchTerm == null || searchTerm.trim().isEmpty()) {
                return getApprovedCompanies();
            }
            
            List<ItemList> companies = adminManageRepository.searchCompaniesByName(searchTerm.trim());
            log.info("검색 결과: {}개 업체 발견", companies.size());
            
            return companies;
            
        } catch (Exception e) {
            log.error("업체 검색 중 오류 발생: ", e);
            return List.of(); // 빈 리스트 반환
        }
    }
    
    /**
     * 상태별 업체 조회
     */
    public List<ItemList> getCompaniesByStatus(String status) {
        log.info("====== AdminManageService.getCompaniesByStatus 호출 ======");
        log.info("상태: {}", status);
        
        try {
            // 먼저 ItemList가 있는 업체들 조회
            List<ItemList> companies = adminManageRepository.findCompaniesByStatus(status);
            log.info("ItemList가 있는 상태별 업체 조회 완료: {}개", companies.size());
            
            // PENDING 상태인 경우, ItemList가 없는 업체들도 조회
            if ("PENDING".equals(status)) {
                log.info("PENDING 상태 업체 중 ItemList가 없는 업체들 조회 시작");
                List<CompanyUser> pendingCompanies = adminManageRepository.findCompaniesByStatusOnly(status);
                log.info("CompanyUser만 있는 PENDING 업체 조회 완료: {}개", pendingCompanies.size());
                
                // 이미 ItemList가 있는 업체들의 companyId 수집
                Set<Integer> existingCompanyIds = companies.stream()
                    .map(item -> item.getOwnerCompany().getCompanyId())
                    .collect(Collectors.toSet());
                
                log.info("이미 ItemList가 있는 업체 IDs: {}", existingCompanyIds);
                
                // CompanyUser를 ItemList로 변환 (임시 ItemList 생성)
                for (CompanyUser company : pendingCompanies) {
                    // 이미 ItemList가 있는 업체는 제외
                    if (!existingCompanyIds.contains(company.getCompanyId())) {
                        ItemList tempItem = new ItemList();
                        tempItem.setOwnerCompany(company);
                        tempItem.setName(company.getCompanyName() + " (임시)");
                        tempItem.setCreatedAt(company.getCreatedAt());
                        companies.add(tempItem);
                        log.info("임시 ItemList 생성: {} (ID: {})", company.getCompanyName(), company.getCompanyId());
                    }
                }
            }
            
            log.info("최종 상태별 업체 조회 완료: {}개", companies.size());
            return companies;
            
        } catch (Exception e) {
            log.error("상태별 업체 조회 중 오류 발생: ", e);
            return List.of(); // 빈 리스트 반환
        }
    }
    
    /**
     * 업체 상세 정보 조회
     */
    public ItemList getCompanyById(Long companyId) {
        log.info("====== AdminManageService.getCompanyById 호출 ======");
        log.info("업체 ID: {}", companyId);
        
        try {
            ItemList company = adminManageRepository.findById(companyId).orElse(null);
            
            if (company != null) {
                log.info("업체 정보 조회 성공: {}", company.getName());
            } else {
                log.warn("업체를 찾을 수 없습니다: {}", companyId);
            }
            
            return company;
            
        } catch (Exception e) {
            log.error("업체 상세 조회 중 오류 발생: ", e);
            return null;
        }
    }
    
    /**
     * 업체별 의료 서비스 목록 조회 (관리자용 - 삭제된 것 포함)
     */
    public List<MediServiceEntity> getMedicalServicesByCompanyId(Integer companyId) {
        log.info("====== AdminManageService.getMedicalServicesByCompanyId 호출 ======");
        log.info("Company ID: {}", companyId);
        
        try {
            // 삭제된 서비스 포함 전체 조회 (관리자용)
            List<MediServiceEntity> services = mediServiceRepository.findAllByCompanyIdWithFetch(companyId);
            log.info("의료 서비스 조회 완료: {}개 (삭제된 것 포함)", services.size());
            
            // 각 서비스 정보 로깅
            int activeCount = 0;
            int deletedCount = 0;
            
            for (MediServiceEntity service : services) {
                boolean isDeleted = service.getDeletedAt() != null;
                String status = isDeleted ? "[삭제됨]" : "[활성]";
                
                log.info("  - {} 서비스 ID: {}, 이름: {}, 가격: {}", 
                    status,
                    service.getServiceId(), 
                    service.getName(), 
                    service.getPrice());
                
                if (isDeleted) {
                    deletedCount++;
                } else {
                    activeCount++;
                }
            }
            
            log.info("통계: 활성 {}개, 삭제됨 {}개, 전체 {}개", activeCount, deletedCount, services.size());
            
            return services;
            
        } catch (Exception e) {
            log.error("의료 서비스 조회 중 오류 발생: ", e);
            return List.of(); // 빈 리스트 반환
        }
    }
    
    /**
     * 업체 승인 처리
     */
    @Transactional
    public boolean approveCompany(Integer companyId) {
        log.info("====== AdminManageService.approveCompany 호출 ======");
        log.info("승인할 업체 ID: {}", companyId);
        
        try {
            // 승인 처리 실행
            int updatedRows = adminManageRepository.updateCompanyApprovalStatus(
                companyId, 
                "APPROVED", 
                LocalDateTime.now()
            );
            
            if (updatedRows > 0) {
                log.info("✅ 업체 승인 성공: {} (영향받은 행: {}개)", companyId, updatedRows);
                return true;
            } else {
                log.warn("⚠️ 업체 승인 실패: 업체를 찾을 수 없거나 이미 승인됨 - {}", companyId);
                return false;
            }
            
        } catch (Exception e) {
            log.error("❌ 업체 승인 중 오류 발생: ", e);
            return false;
        }
    }
    
    /**
     * 업체별 의료 서비스 개수 조회
     */
    public int getMedicalServiceCount(Integer companyId) {
        log.info("====== AdminManageService.getMedicalServiceCount 호출 ======");
        log.info("업체 ID: {}", companyId);
        
        try {
            // 활성 서비스만 카운트 (삭제되지 않은 것만)
            int count = mediServiceRepository.countActiveServicesByCompanyId(companyId);
            log.info("업체 {}의 활성 의료 서비스 개수: {}", companyId, count);
            return count;
            
        } catch (Exception e) {
            log.error("의료 서비스 개수 조회 중 오류 발생: ", e);
            return 0;
        }
    }
    
    /**
     * 업체 존재 여부 확인
     */
    public boolean checkCompanyExists(Integer companyId) {
        log.info("====== AdminManageService.checkCompanyExists 호출 ======");
        log.info("업체 ID: {}", companyId);
        
        try {
            boolean exists = adminManageRepository.existsByCompanyId(companyId);
            log.info("업체 존재 여부: {}", exists);
            return exists;
            
        } catch (Exception e) {
            log.error("업체 존재 여부 확인 중 오류 발생: ", e);
            return false;
        }
    }
    
    /**
     * 업체명 조회
     */
    public String getCompanyName(Integer companyId) {
        log.info("====== AdminManageService.getCompanyName 호출 ======");
        log.info("업체 ID: {}", companyId);
        
        try {
            String companyName = adminManageRepository.getCompanyNameById(companyId);
            log.info("업체명: {}", companyName);
            return companyName != null ? companyName : "업체명 없음";
            
        } catch (Exception e) {
            log.error("업체명 조회 중 오류 발생: ", e);
            return "업체명 조회 실패";
        }
    }
    
    /**
     * 업체별 리뷰 수 조회
     */
    public Long getReviewCountByCompanyId(Integer companyId) {
        log.info("====== AdminManageService.getReviewCountByCompanyId 호출 ======");
        log.info("업체 ID: {}", companyId);
        
        try {
            // UserReviewRepository의 findByCompanyId 메서드를 사용하여 리뷰 수 계산
            List<Object[]> reviews = userReviewRepository.findByCompanyId(companyId);
            Long reviewCount = (long) reviews.size();
            
            log.info("업체 {}의 리뷰 수: {}", companyId, reviewCount);
            return reviewCount;
            
        } catch (Exception e) {
            log.error("리뷰 수 조회 중 오류 발생: ", e);
            return 0L;
        }
    }
}
