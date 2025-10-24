// 문의/신고 접수 페이지 JavaScript

// 전역 변수: 현재 선택된 reporter type
let currentReporterType = 'ALL';

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 사이드바 활성 상태 설정
    const allNavLinks = document.querySelectorAll('.nav-link');
    allNavLinks.forEach(link => link.classList.remove('active'));
    
    const sidebarType = document.body.dataset.sidebarType || 'admin';
    const inquiryReportPath = sidebarType === 'admin' ? '/admin/inquiry-report' : '/company/inquiry-report';
    const inquiryReportLink = document.querySelector('a[href="' + inquiryReportPath + '"]');
    if (inquiryReportLink) {
        inquiryReportLink.classList.add('active');
    }
    
    // 문의/신고 내역 로드
    loadAdminInquiries();
});

// Reporter Type 필터 함수
function filterByReporterType(type) {
    currentReporterType = type;
    
    // 버튼 활성화 상태 변경
    document.querySelectorAll('.reporter-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.reporter-type-btn[data-type="${type}"]`).classList.add('active');
    
    // 목록 다시 로드
    loadAdminInquiries();
}

// 관리자용 - 모든 문의/신고 내역 로드
function loadAdminInquiries() {
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    
    let url = '/admin/api/inquiry-reports';
    const params = new URLSearchParams();
    
    if (statusFilter) {
        params.append('status', statusFilter);
    }
    
    if (currentReporterType && currentReporterType !== 'ALL') {
        params.append('reporterType', currentReporterType);
    }
    
    if (params.toString()) {
        url += '?' + params.toString();
    }
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('데이터 로드 실패');
            }
            return response.json();
        })
        .then(data => {
            console.log('문의/신고 내역 로드:', data);
            displayReports(data);
        })
        .catch(error => {
            console.error('오류:', error);
            document.getElementById('reportList').innerHTML = '<div style="padding:40px; text-align:center; color:#999;">데이터를 불러올 수 없습니다.</div>';
        });
}

// 문의/신고 목록 표시
function displayReports(reports) {
    const reportList = document.getElementById('reportList');
    const totalCount = document.getElementById('totalCount');
    
    totalCount.textContent = reports.length;
    
    if (!reports || reports.length === 0) {
        reportList.innerHTML = '<div style="padding:60px; text-align:center; color:#999;"><i class="fas fa-inbox" style="font-size:48px; display:block; margin-bottom:16px;"></i><p>문의/신고 내역이 없습니다.</p></div>';
        return;
    }
    
    let html = '';
    reports.forEach(report => {
        const statusText = getStatusText(report.status);
        const statusClass = getStatusClass(report.status);
        
        const reporterTypeText = report.reporterType === 'COMPANY' ? '업체' : '사용자';
        const reporterTypeBadge = report.reporterType === 'COMPANY' ? 
            '<span style="background:#f39c12; color:white; padding:4px 8px; border-radius:4px; font-size:12px; margin-right:8px;"><i class="fas fa-building"></i> 업체</span>' : 
            '<span style="background:#3498db; color:white; padding:4px 8px; border-radius:4px; font-size:12px; margin-right:8px;"><i class="fas fa-user"></i> 사용자</span>';
        
        html += `
            <div class="report-item" data-id="${report.inquiryId}" data-status="${report.status}" data-reporter-type="${report.reporterType}">
                <div class="report-item-header">
                    <div class="report-item-info">
                        <div class="report-item-title">
                            ${reporterTypeBadge}
                            ${escapeHtml(report.subject || '제목 없음')}
                        </div>
                        <div class="report-item-meta">
                            <span>${reporterTypeText} ID: ${report.reporterType === 'COMPANY' ? report.reporterCompanyId || '-' : report.reporterSocialId || '-'}</span>
                            ${report.orderId ? `<span>주문번호: ${report.orderId}</span>` : ''}
                        </div>
                    </div>
                    <div class="report-item-status">
                        <span class="report-status-badge ${statusClass}">${statusText}</span>
                    </div>
                </div>
                <div class="report-item-content">
                    <div class="report-item-description">${escapeHtml(report.content || '')}</div>
                </div>
                <div class="report-item-footer">
                    <div class="report-item-actions">
                        <button class="report-action-btn primary" onclick="viewDetail(${report.inquiryId})">상세보기</button>
                    </div>
                    <div class="report-item-date">${formatDate(report.createdAt)}</div>
                </div>
            </div>
        `;
    });
    
    reportList.innerHTML = html;
}

// 상태 텍스트 변환
function getStatusText(status) {
    const statusMap = {
        'OPEN': '대기중',
        'ANSWERED': '답변완료',
        'CLOSED': '종료'
    };
    return statusMap[status] || status;
}

// 상태 클래스 변환
function getStatusClass(status) {
    const classMap = {
        'OPEN': 'pending',
        'ANSWERED': 'resolved',
        'CLOSED': 'rejected'
    };
    return classMap[status] || 'pending';
}

// HTML 이스케이프
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 날짜 포맷팅
function formatDate(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 상세보기
function viewDetail(id) {
    window.location.href = '/admin/inquiry-report/detail/' + id;
}


// 상태 업데이트
function updateStatus(id, newStatus, successMessage) {
    fetch(`/admin/api/inquiry-reports/${id}/status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(successMessage);
            loadAdminInquiries(); // 목록 새로고침
        } else {
            alert('오류: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('상태 변경에 실패했습니다.');
    });
}
