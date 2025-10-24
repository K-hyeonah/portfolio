package com.example.ApiRound.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ApiRound.crm.minggzz.AdminStatusRequest;
import com.example.ApiRound.dto.InquirySubmitRequest;
import com.example.ApiRound.entity.UserInquiry;
import com.example.ApiRound.entity.UserInquiry.Status;
import com.example.ApiRound.repository.UserInquiryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserInquiryService {

    private final UserInquiryRepository userInquiryRepository;

    /** 사용자 문의 접수 */
    @Transactional
    public Integer submit(InquirySubmitRequest req, Integer userId) {
        System.out.println("===== UserInquiryService.submit 시작 =====");
        System.out.println("userId: " + userId);
        System.out.println("subject: " + req.getSubject());
        System.out.println("content: " + req.getContent());
        
        UserInquiry entity = UserInquiry.builder()
                .reporterId(userId)
                .reporterSocialId(userId)  // social_users의 user_id
                .reporterType(UserInquiry.ReporterType.SOCIAL)
                .target(UserInquiry.Target.ADMIN)
                .subject(req.getSubject())
                .content(req.getContent())
                .status(Status.OPEN)
                .createdAt(LocalDateTime.now())
                .build();

        System.out.println("Entity 생성 완료, DB 저장 시작...");
        
        // TODO: 첨부 저장이 필요하다면 req.getAttachment() 처리 로직 추가

        UserInquiry saved = userInquiryRepository.save(entity);
        
        System.out.println("DB 저장 완료! inquiry_id: " + saved.getInquiryId());
        
        return saved.getInquiryId();
    }
    
    /** 업체 요청 접수 */
    @Transactional
    public Integer submitCompanyRequest(InquirySubmitRequest req, Integer companyId) {
        System.out.println("===== UserInquiryService.submitCompanyRequest 시작 =====");
        System.out.println("companyId: " + companyId);
        System.out.println("subject: " + req.getSubject());
        System.out.println("content: " + req.getContent());
        System.out.println("requestType: " + req.getRequestType());
        System.out.println("priority: " + req.getPriority());
        
        // requestType 문자열을 enum으로 변환
        UserInquiry.RequestType requestType = null;
        if (req.getRequestType() != null) {
            try {
                requestType = UserInquiry.RequestType.valueOf(req.getRequestType().toUpperCase());
            } catch (Exception e) {
                requestType = UserInquiry.RequestType.OTHER;
            }
        }
        
        // priority 문자열을 enum으로 변환
        UserInquiry.Priority priority = UserInquiry.Priority.NORMAL;
        if (req.getPriority() != null) {
            try {
                priority = UserInquiry.Priority.valueOf(req.getPriority().toUpperCase());
            } catch (Exception e) {
                priority = UserInquiry.Priority.NORMAL;
            }
        }
        
        UserInquiry entity = UserInquiry.builder()
                .reporterId(companyId)
                .reporterCompanyId(companyId)  // company_user의 company_id
                .reporterType(UserInquiry.ReporterType.COMPANY)
                .target(UserInquiry.Target.ADMIN)
                .subject(req.getSubject())
                .content(req.getContent())
                .targetUrl(req.getTargetUrl())
                .requestType(requestType)
                .priority(priority)
                .status(Status.OPEN)
                .createdAt(LocalDateTime.now())
                .build();

        System.out.println("Entity 생성 완료, DB 저장 시작...");

        UserInquiry saved = userInquiryRepository.save(entity);
        
        System.out.println("DB 저장 완료! inquiry_id: " + saved.getInquiryId());
        
        return saved.getInquiryId();
    }
    
    /** (업체) 내 요청 조회 */
    @Transactional(readOnly = true)
    public List<UserInquiry> getCompanyPagedList(Integer companyId, int page, int size) {
        System.out.println("===== UserInquiryService.getCompanyPagedList 시작 =====");
        System.out.println("companyId: " + companyId);
        System.out.println("page: " + page + ", size: " + size);
        
        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), Math.max(size, 1),
                Sort.by(Sort.Direction.DESC, "createdAt"));

        // reporterCompanyId와 reporterType이 COMPANY인 것만 조회
        Page<UserInquiry> inquiryPage = userInquiryRepository.findByReporterCompanyIdAndReporterType(
            companyId, UserInquiry.ReporterType.COMPANY, pageable);
        List<UserInquiry> inquiries = inquiryPage.getContent();
        
        // 만약 조회되지 않았다면 reporterId로도 시도
        if (inquiries.isEmpty()) {
            System.out.println("reporterCompanyId로 조회 실패, reporterId로 재시도");
            // 직접 쿼리로 조회
            inquiries = userInquiryRepository.findAll().stream()
                .filter(inquiry -> inquiry.getReporterId() != null && 
                                 inquiry.getReporterId().equals(companyId) && 
                                 inquiry.getReporterType() == UserInquiry.ReporterType.COMPANY)
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(java.util.stream.Collectors.toList());
        }
        
        System.out.println("조회된 문의 수: " + inquiries.size());
        for (UserInquiry inquiry : inquiries) {
            System.out.println("문의 ID: " + inquiry.getInquiryId() + ", 제목: " + inquiry.getSubject() + 
                             ", reporterCompanyId: " + inquiry.getReporterCompanyId() + 
                             ", reporterType: " + inquiry.getReporterType());
        }
        
        return inquiries;
    }

    /** (사용자) 내 문의 페이징 조회 */
    @Transactional(readOnly = true)
    public Page<UserInquiry> getMyPagedList(Integer userId, int page, int size) {
        System.out.println("===== UserInquiryService.getMyPagedList 호출 =====");
        System.out.println("userId: " + userId);
        System.out.println("page: " + page + ", size: " + size);
        
        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), Math.max(size, 1),
                Sort.by(Sort.Direction.DESC, "createdAt"));

        // reporterSocialId로 조회
        Page<UserInquiry> result = userInquiryRepository.findByReporterSocialId(userId, pageable);
        
        System.out.println("조회된 사용자 문의 수: " + result.getContent().size());
        for (UserInquiry inquiry : result.getContent()) {
            System.out.println("문의 ID: " + inquiry.getInquiryId() + 
                             ", 제목: " + inquiry.getSubject() + 
                             ", reporterSocialId: " + inquiry.getReporterSocialId() + 
                             ", status: " + inquiry.getStatus() + 
                             ", adminAnswer: " + (inquiry.getAdminAnswer() != null ? "있음" : "없음"));
        }
        
        return result;
    }

    /** (관리자) 목록 페이징 - 상태 필터 optional */
    @Transactional(readOnly = true)
    public Page<UserInquiry> getAdminPagedList(int page, int size, String statusFilter) {
        return getAdminPagedList(page, size, statusFilter, null);
    }
    
    /** (관리자) 목록 페이징 - 상태 및 reporter type 필터 optional */
    @Transactional(readOnly = true)
    public Page<UserInquiry> getAdminPagedList(int page, int size, String statusFilter, String reporterTypeFilter) {
        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), Math.max(size, 1),
                Sort.by(Sort.Direction.DESC, "createdAt"));

        // 필터가 없으면 전체 조회
        if ((statusFilter == null || statusFilter.isBlank()) && 
            (reporterTypeFilter == null || reporterTypeFilter.isBlank())) {
            return userInquiryRepository.findAll(pageable);
        }

        // 상태 필터만 있는 경우
        if ((statusFilter != null && !statusFilter.isBlank()) && 
            (reporterTypeFilter == null || reporterTypeFilter.isBlank())) {
            try {
                Status st = Status.valueOf(statusFilter.toUpperCase());
                return userInquiryRepository.findByStatus(st, pageable);
            } catch (Exception e) {
                return userInquiryRepository.findAll(pageable);
            }
        }
        
        // Reporter Type 필터만 있는 경우
        if ((reporterTypeFilter != null && !reporterTypeFilter.isBlank()) &&
            (statusFilter == null || statusFilter.isBlank())) {
            try {
                UserInquiry.ReporterType rt = UserInquiry.ReporterType.valueOf(reporterTypeFilter.toUpperCase());
                return userInquiryRepository.findByReporterType(rt, pageable);
            } catch (Exception e) {
                return userInquiryRepository.findAll(pageable);
            }
        }
        
        // 둘 다 있는 경우
        try {
            Status st = Status.valueOf(statusFilter.toUpperCase());
            UserInquiry.ReporterType rt = UserInquiry.ReporterType.valueOf(reporterTypeFilter.toUpperCase());
            return userInquiryRepository.findByStatusAndReporterType(st, rt, pageable);
        } catch (Exception e) {
            return userInquiryRepository.findAll(pageable);
        }
    }

    /** (관리자) 상태 변경 — (id, status, adminId) */
    @Transactional
    public void updateStatus(Integer inquiryId, String status, Integer adminId) {
        UserInquiry inquiry = userInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("문의가 존재하지 않습니다. id=" + inquiryId));

        Status newStatus;
        try {
            newStatus = Status.valueOf(status.toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("잘못된 상태 값: " + status);
        }

        inquiry.setStatus(newStatus);
        inquiry.setAnsweredBy(adminId);

        if (newStatus != Status.ANSWERED) {
            inquiry.setAnsweredAt(null);
        }

        userInquiryRepository.save(inquiry);
    }

    /** (관리자) 상태변경 DTO 버전 */
    @Transactional
    public void updateStatus(AdminStatusRequest req, Integer adminId) {
        updateStatus(req.getInquiryId(), req.getStatus(), adminId);
    }

    /** (관리자) 답변 등록 — (id, answer, adminId) */
    @Transactional
    public void answer(Integer inquiryId, String answer, Integer adminId) {
        answer(inquiryId, answer, adminId, null);
    }

    /** (관리자) 답변 등록 — (id, answer, adminId, assignedTo) */
    @Transactional
    public void answer(Integer inquiryId, String answer, Integer adminId, Integer assignedTo) {
        UserInquiry inq = userInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("문의가 존재하지 않습니다. id=" + inquiryId));

        inq.setAdminAnswer(answer);
        inq.setStatus(Status.ANSWERED);
        inq.setAnsweredAt(LocalDateTime.now());
        inq.setAnsweredBy(adminId);
        if (Objects.nonNull(assignedTo)) {
            inq.setAssignedTo(assignedTo);
        }

        userInquiryRepository.save(inq);
    }
}
