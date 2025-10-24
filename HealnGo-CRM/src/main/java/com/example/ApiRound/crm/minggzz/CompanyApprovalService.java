// CompanyApprovalService.java (변경본)
package com.example.ApiRound.crm.minggzz;

import com.example.ApiRound.crm.hyeonah.Repository.CompanyUserRepository;
import com.example.ApiRound.crm.hyeonah.entity.CompanyUser;
import com.example.ApiRound.repository.ItemListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CompanyApprovalService {

    private final CompanyUserRepository companyUserRepository;
    private final ItemListRepository itemListRepository;

    @Transactional
    public void approve(Integer companyId, Long managerUserId) {
        CompanyUser cu = companyUserRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("업체가 없습니다. id=" + companyId));

        // 1) 상태
        cu.setApprovalStatus("APPROVED");
        cu.setApprovedAt(LocalDateTime.now());
        cu.setApprovedBy(managerUserId);
        cu.setRejectionReason(null);

        // 2) 대표 지점 없으면 생성
        itemListRepository.findFirstByOwnerCompany_CompanyIdOrderByIdAsc(companyId)
                .orElseGet(() -> {
                    String address   = safe(cu.getAddress());
                    String region    = extractRegion(address);
                    String subregion = extractSubRegion(address);
                    String category  = normalizeCategory(safe(cu.getCategory())); // ← 정규화

                    itemListRepository.insertRepresentativeIfAbsent(
                            cu.getCompanyId(),
                            safe(cu.getCompanyName()),
                            region,
                            subregion,
                            address,
                            safe(cu.getPhone()),
                            safe(cu.getWebsite()),
                            category
                    );
                    return null;
                });
    }

    @Transactional
    public void reject(Integer companyId, Long managerUserId, String reason) {
        CompanyUser cu = companyUserRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("업체가 없습니다. id=" + companyId));
        cu.setApprovalStatus("REJECTED");
        cu.setApprovedAt(LocalDateTime.now());
        cu.setApprovedBy(managerUserId);
        cu.setRejectionReason(reason);
    }

    // ---- 주소 파서 ----
    private static final Pattern REGION_PATTERN =
            Pattern.compile("^(서울|부산|대구|인천|광주|대전|울산|세종|제주|경기|강원|충북|충남|전북|전남|경북|경남)");
    private static final Pattern SUBREGION_PATTERN =
            Pattern.compile("(\\S+?(시|군|구))");

    private String extractRegion(String address) {
        if (address == null) return null;
        Matcher m = REGION_PATTERN.matcher(address.trim());
        return m.find() ? m.group(1) : null;
    }

    private String extractSubRegion(String address) {
        if (address == null) return null;
        String afterRegion = address.trim().replaceFirst(REGION_PATTERN.pattern(), "").trim();
        Matcher m = SUBREGION_PATTERN.matcher(afterRegion);
        return m.find() ? m.group(1) : null;
    }

    private String safe(String v) {
        return v == null ? null : v.trim();
    }

    /** 카테고리 정규화: 필터 값과 동일한 ‘표준’으로 저장 */
    private String normalizeCategory(String raw) {
        if (raw == null || raw.isBlank()) return null;
        String s = raw.trim().toLowerCase();
        // 피부과
        if (s.contains("skincare") || s.contains("dermatology") || s.contains("skin")) return "피부과";
        if (s.contains("피부")) return "피부과";
        // 성형외과
        if (s.contains("plastic")) return "성형외과";
        // 약국
        if (s.contains("pharm")) return "약국";
        // 그 외는 원문 유지
        return raw;
    }
}
