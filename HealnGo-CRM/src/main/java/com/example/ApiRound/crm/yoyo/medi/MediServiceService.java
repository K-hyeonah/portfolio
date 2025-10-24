package com.example.ApiRound.crm.yoyo.medi;

import com.example.ApiRound.entity.ItemList;
import com.example.ApiRound.crm.hyeonah.entity.CompanyUser;
import com.example.ApiRound.crm.hyeonah.Service.CompanyUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MediServiceService {

    private final MediServiceRepository mediServiceRepository;
    private final com.example.ApiRound.repository.ItemListRepository itemListRepository;
    private final CompanyUserService companyUserService;

    /** 전체 조회 */
    public List<MediServiceEntity> findAll() {
        return mediServiceRepository.findAll();
    }

    /** 단일 조회 */
    public MediServiceEntity findById(Long id) {
        return mediServiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("서비스를 찾을 수 없습니다. ID: " + id));
    }

    /** 등록 */
    @Transactional
    public MediServiceEntity create(Long itemId, MediServiceEntity entity) {
        ItemList item = itemListRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 Item ID: " + itemId));
        entity.setItem(item);
        return mediServiceRepository.save(entity);
    }

    /** 수정 */
    public MediServiceEntity update(Long id, MediServiceEntity updatedEntity) {
        log.info("====== MediServiceService.update 호출 ======");
        log.info("수정할 서비스 ID: {}", id);
        
        MediServiceEntity existing = findById(id);
        log.info("기존 데이터 - tags: '{}'", existing.getTags());
        
        existing.setName(updatedEntity.getName());
        existing.setDescription(updatedEntity.getDescription());
        existing.setStartDate(updatedEntity.getStartDate());
        existing.setEndDate(updatedEntity.getEndDate());
        existing.setGenderTarget(updatedEntity.getGenderTarget());
        
        log.info("💾 [태그 업데이트] 기존: '{}' → 새로운 값: '{}'", existing.getTags(), updatedEntity.getTags());
        existing.setTags(updatedEntity.getTags());
        
        existing.setTargetCountry(updatedEntity.getTargetCountry());
        existing.setServiceCategory(updatedEntity.getServiceCategory());
        existing.setPrice(updatedEntity.getPrice());
        existing.setVatIncluded(updatedEntity.getVatIncluded());
        existing.setCurrency(updatedEntity.getCurrency());
        existing.setDiscountRate(updatedEntity.getDiscountRate());
        existing.setIsRefundable(updatedEntity.getIsRefundable());
        
        MediServiceEntity saved = mediServiceRepository.save(existing);
        log.info("💾 [저장 후] tags: '{}'", saved.getTags());
        
        return saved;
    }

    /** 삭제 */
    public void delete(Long id) {
        mediServiceRepository.deleteById(id);
    }

    /** 회사별 의료 서비스 조회 */
    public List<MediServiceEntity> findByCompanyId(Integer companyId) {
        log.info("====== MediServiceService.findByCompanyId 호출 ======");
        log.info("조회할 companyId: {}", companyId);
        
        List<MediServiceEntity> result = mediServiceRepository.findActiveByCompanyIdWithFetch(companyId);
        
        log.info("Repository에서 조회된 결과 개수: {}", result.size());
        if (result.isEmpty()) {
            log.warn("⚠️ 해당 companyId({})로 조회된 의료 서비스가 없습니다!", companyId);
        } else {
            log.info("✅ 조회 성공! 서비스 목록:");
            for (MediServiceEntity entity : result) {
                log.info("  - ID: {}, 이름: {}, 가격: {}, Item ID: {}", 
                    entity.getServiceId(), 
                    entity.getName(), 
                    entity.getPrice(),
                    entity.getItem() != null ? entity.getItem().getId() : "null");
                if (entity.getItem() != null && entity.getItem().getOwnerCompany() != null) {
                    log.info("    -> 소유 회사 ID: {}, 회사명: {}", 
                        entity.getItem().getOwnerCompany().getCompanyId(),
                        entity.getItem().getOwnerCompany().getCompanyName());
                }
            }
        }
        
        return result;
    }

    /** 회사 ID로 의료 서비스 등록 */
    @Transactional
    public MediServiceEntity createByCompanyId(Integer companyId, MediServiceEntity entity) {
        log.info("====== MediServiceService.createByCompanyId 호출 ======");
        log.info("회사 ID: {}", companyId);
        
        // 회사 정보 조회
        CompanyUser company = companyUserService.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회사 ID: " + companyId));
        
        log.info("회사명: {}", company.getCompanyName());
        
        // 해당 회사의 item 찾기
        Optional<ItemList> itemOpt = itemListRepository.findFirstByOwnerCompany_CompanyIdOrderByIdAsc(companyId);
        
        ItemList item;
        if (itemOpt.isPresent()) {
            item = itemOpt.get();
            log.info("기존 item 사용: ID={}, 이름={}, 기존 카테고리={}", item.getId(), item.getName(), item.getCategory());
            
            // 기존 item의 카테고리가 "의료서비스"이거나 업체 카테고리와 다르면 업데이트
            String companyCategory = company.getCategory() != null ? company.getCategory() : "의료서비스";
            if ("의료서비스".equals(item.getCategory()) || !companyCategory.equals(item.getCategory())) {
                item.setCategory(companyCategory);
                item.setUpdatedAt(java.time.LocalDateTime.now());
                item = itemListRepository.save(item);
                log.info("기존 item 카테고리 업데이트: {} -> {}", item.getCategory(), companyCategory);
            }
        } else {
            // item이 없으면 새로 생성
            item = new ItemList();
            item.setName(company.getCompanyName() + " 서비스");
            item.setRegion("서울");
            item.setAddress(company.getAddress());
            item.setPhone(company.getPhone());
            // 업체의 카테고리를 사용 (없으면 "의료서비스"로 기본값)
            item.setCategory(company.getCategory() != null ? company.getCategory() : "의료서비스");
            item.setOwnerCompany(company);
            item.setCreatedAt(java.time.LocalDateTime.now());
            item.setUpdatedAt(java.time.LocalDateTime.now());
            item = itemListRepository.save(item);
            log.info("새로운 item 생성: ID={}, 이름={}, 카테고리={}", item.getId(), item.getName(), item.getCategory());
        }
        
        entity.setItem(item);
        
        log.info("💾 [저장 전] tags: '{}', serviceCategory: '{}'", entity.getTags(), entity.getServiceCategory());
        MediServiceEntity savedEntity = mediServiceRepository.save(entity);
        log.info("💾 [저장 후] tags: '{}', serviceCategory: '{}'", savedEntity.getTags(), savedEntity.getServiceCategory());
        
        log.info("의료 서비스 등록 완료: ID={}, 이름={}", savedEntity.getServiceId(), savedEntity.getName());
        return savedEntity;
    }

    @Transactional
    public MediServiceEntity updateService(Integer serviceId, MediServiceEntity updateData, Integer companyId) {
        try {
            log.info("====== MediServiceService.updateService 호출 ======");
            log.info("서비스 ID: {}, 회사 ID: {}", serviceId, companyId);
            
            // 기존 서비스 조회
            log.info("서비스 조회 시도 - ID: {}", serviceId.longValue());
            MediServiceEntity existingService = mediServiceRepository.findById(serviceId.longValue())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 서비스 ID: " + serviceId));
            
            log.info("기존 서비스 조회 성공 - 이름: {}", existingService.getName());
            log.info("기존 서비스의 item: {}", existingService.getItem());
            log.info("기존 서비스의 item의 ownerCompany: {}", existingService.getItem().getOwnerCompany());
            
            // 권한 확인 - 해당 회사의 서비스인지 체크
            Integer ownerCompanyId = existingService.getItem().getOwnerCompany().getCompanyId();
            log.info("소유 회사 ID: {}, 요청 회사 ID: {}", ownerCompanyId, companyId);
            
            if (!ownerCompanyId.equals(companyId)) {
                throw new SecurityException("해당 서비스를 수정할 권한이 없습니다.");
            }
            
            log.info("권한 확인 완료");
            
            // 데이터 업데이트
            if (updateData.getName() != null && !updateData.getName().isEmpty()) {
                log.info("이름 업데이트: {} -> {}", existingService.getName(), updateData.getName());
                existingService.setName(updateData.getName());
            }
            if (updateData.getStartDate() != null) {
                log.info("시작일 업데이트: {} -> {}", existingService.getStartDate(), updateData.getStartDate());
                existingService.setStartDate(updateData.getStartDate());
            }
            if (updateData.getEndDate() != null) {
                log.info("종료일 업데이트: {} -> {}", existingService.getEndDate(), updateData.getEndDate());
                existingService.setEndDate(updateData.getEndDate());
            }
            if (updateData.getPrice() != null) {
                log.info("가격 업데이트: {} -> {}", existingService.getPrice(), updateData.getPrice());
                existingService.setPrice(updateData.getPrice());
            }
            if (updateData.getGenderTarget() != null) {
                log.info("성별 타겟 업데이트: {} -> {}", existingService.getGenderTarget(), updateData.getGenderTarget());
                existingService.setGenderTarget(updateData.getGenderTarget());
            }
            if (updateData.getTargetCountry() != null) {
                log.info("대상 국가 업데이트: {} -> {}", existingService.getTargetCountry(), updateData.getTargetCountry());
                existingService.setTargetCountry(updateData.getTargetCountry());
            }
            if (updateData.getVatIncluded() != null) {
                log.info("VAT 포함 업데이트: {} -> {}", existingService.getVatIncluded(), updateData.getVatIncluded());
                existingService.setVatIncluded(updateData.getVatIncluded());
            }
            if (updateData.getIsRefundable() != null) {
                log.info("환불 가능 업데이트: {} -> {}", existingService.getIsRefundable(), updateData.getIsRefundable());
                existingService.setIsRefundable(updateData.getIsRefundable());
            }
            if (updateData.getTags() != null) {
                log.info("태그 업데이트: {} -> {}", existingService.getTags(), updateData.getTags());
                existingService.setTags(updateData.getTags());
            }
            
            log.info("저장 시도 중...");
            MediServiceEntity savedEntity = mediServiceRepository.save(existingService);
            
            log.info("의료 서비스 수정 완료: ID={}, 이름={}", savedEntity.getServiceId(), savedEntity.getName());
            return savedEntity;
            
        } catch (Exception e) {
            log.error("updateService에서 예외 발생: ", e);
            throw e;
        }
    }

    @Transactional
    public void softDeleteService(Long serviceId, Integer companyId) {
        log.info("====== MediServiceService.softDeleteService 호출 ======");
        log.info("서비스 ID: {}, 회사 ID: {}", serviceId, companyId);
        
        try {
            // 기존 서비스 조회
            MediServiceEntity existingService = mediServiceRepository.findById(serviceId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 서비스 ID: " + serviceId));
            
            log.info("기존 서비스 조회 성공 - 이름: {}", existingService.getName());
            
            // 권한 확인 - 해당 회사의 서비스인지 체크
            Integer ownerCompanyId = existingService.getItem().getOwnerCompany().getCompanyId();
            log.info("소유 회사 ID: {}, 요청 회사 ID: {}", ownerCompanyId, companyId);
            
            if (!ownerCompanyId.equals(companyId)) {
                throw new SecurityException("해당 서비스를 삭제할 권한이 없습니다.");
            }
            
            // 이미 삭제된 서비스인지 확인
            if (existingService.getDeletedAt() != null) {
                throw new IllegalArgumentException("이미 삭제된 서비스입니다.");
            }
            
            log.info("권한 확인 완료");
            
            // Soft-delete 처리
            existingService.setDeletedAt(java.time.LocalDateTime.now());
            mediServiceRepository.save(existingService);
            
            log.info("의료 서비스 soft-delete 완료: ID={}, 이름={}", existingService.getServiceId(), existingService.getName());
            
        } catch (Exception e) {
            log.error("softDeleteService에서 예외 발생: ", e);
            throw e;
        }
    }
}
