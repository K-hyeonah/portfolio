// 문의/신고 상세 페이지 JavaScript

// 페이지 로드 시 사이드바 활성 상태 설정
document.addEventListener('DOMContentLoaded', function() {
    // 모든 nav-link에서 active 클래스 제거
    const allNavLinks = document.querySelectorAll('.nav-link');
    allNavLinks.forEach(link => link.classList.remove('active'));
    
    // 문의/신고 접수 링크에 active 클래스 추가
    const sidebarType = document.body.dataset.sidebarType || 'admin';
    const inquiryReportPath = sidebarType === 'admin' ? '/admin/inquiry-report' : '/company/inquiry-report';
    const inquiryReportLink = document.querySelector('a[href="' + inquiryReportPath + '"]');
    if (inquiryReportLink) {
        inquiryReportLink.classList.add('active');
    }
});

// 목록으로 돌아가기
function goBack() {
    const sidebarType = document.body.dataset.sidebarType || 'admin';
    const listPath = sidebarType === 'admin' ? '/admin/inquiry-report' : '/company/inquiry-report';
    window.location.href = listPath;
}

// 상태 변경
function changeStatus(status) {
    const statusText = {
        'ANSWERED': '답변완료',
        'CLOSED': '종료'
    };
    
    if (confirm(`이 문의/신고를 "${statusText[status]}" 상태로 변경하시겠습니까?`)) {
        const reportId = document.getElementById('detailId').value || document.getElementById('detailId').textContent;
        
        fetch(`/admin/api/inquiry-reports/${reportId}/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: status })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // UI 업데이트
                const statusBadge = document.getElementById('detailStatusBadge');
                statusBadge.textContent = statusText[status];
                statusBadge.className = 'detail-status-badge ' + getStatusClass(status);
                
                alert(`상태가 "${statusText[status]}"로 변경되었습니다.`);
            } else {
                alert('오류: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('상태 변경에 실패했습니다.');
        });
    }
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

// 임시저장
function saveDraft() {
    const responseText = document.getElementById('responseText').value;
    
    if (!responseText.trim()) {
        alert('답변 내용을 입력해주세요.');
        return;
    }
    
    // 로컬스토리지에 임시저장
    const reportId = document.getElementById('detailId').textContent;
    localStorage.setItem(`draft_${reportId}`, responseText);
    
    alert('임시저장되었습니다.');
}

// 답변 전송
function sendResponse() {
    const responseText = document.getElementById('responseText').value;
    
    if (!responseText.trim()) {
        alert('답변 내용을 입력해주세요.');
        return;
    }
    
    if (confirm('답변을 전송하시겠습니까? 사용자에게 답변이 전달됩니다.')) {
        const reportId = document.getElementById('detailId').value || document.getElementById('detailId').textContent;
        
        fetch(`/admin/api/inquiry-reports/${reportId}/reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reply: responseText })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('답변이 전송되었습니다.');
                // 페이지 새로고침하여 최신 상태 표시
                loadInquiryDetail(reportId);
            } else {
                alert('오류: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('답변 전송에 실패했습니다.');
        });
    }
}

// 문의/신고 상세 정보 로드
function loadInquiryDetail(inquiryId) {
    fetch(`/admin/api/inquiry-reports/${inquiryId}`)
        .then(response => response.json())
        .then(inquiry => {
            displayInquiryDetail(inquiry);
        })
        .catch(error => {
            console.error('Error loading inquiry detail:', error);
            alert('문의/신고 정보를 불러오는데 실패했습니다.');
        });
}

// 문의/신고 상세 정보 표시
function displayInquiryDetail(inquiry) {
    const statusText = {
        'OPEN': '확인중',
        'ANSWERED': '답변완료',
        'CLOSED': '종료'
    }[inquiry.status] || inquiry.status;
    
    const statusClass = {
        'OPEN': 'pending',
        'ANSWERED': 'resolved',
        'CLOSED': 'rejected'
    }[inquiry.status] || 'pending';
    
    const hasAnswer = inquiry.adminAnswer && inquiry.adminAnswer.trim() !== '';
    
    const detailContent = document.getElementById('inquiryDetailContent');
    if (!detailContent) return;
    
    detailContent.innerHTML = `
        <div class="detail-info-section">
            <div class="detail-info-header">
                <div>
                    <h3 class="detail-info-title">${escapeHtml(inquiry.subject || '제목 없음')}</h3>
                    <div class="detail-info-meta">
                        <span>ID: ${inquiry.inquiryId}</span>
                        <span>접수일: ${formatDateTime(inquiry.createdAt)}</span>
                        ${inquiry.answeredAt ? `<span>답변일: ${formatDateTime(inquiry.answeredAt)}</span>` : ''}
                    </div>
                </div>
                <div class="detail-status-section">
                    <span id="detailStatusBadge" class="detail-status-badge ${statusClass}">${statusText}</span>
                </div>
            </div>
            
            <div class="detail-content-section">
                <div class="detail-content-label">문의/신고 내용</div>
                <div class="detail-content-text">${escapeHtml(inquiry.content || '')}</div>
            </div>
            
            <div class="detail-actions">
                <button class="detail-action-btn success" onclick="changeStatus('ANSWERED')" ${hasAnswer ? 'disabled' : ''}>
                    <i class="fas fa-check"></i> ${hasAnswer ? '답변완료됨' : '답변완료 처리'}
                </button>
                <button class="detail-action-btn danger" onclick="changeStatus('CLOSED')">
                    <i class="fas fa-times"></i> 종료
                </button>
            </div>
        </div>
        
        <div class="detail-response-section">
            <div class="detail-response-header">
                <h3 class="detail-response-title">답변 작성</h3>
                <p style="font-size:13px; color:#6c757d; margin:0;">사용자에게 전달할 답변을 작성해주세요.</p>
            </div>
            
            ${hasAnswer ? `
                <div class="detail-existing-response">
                    <div class="detail-existing-response-header">
                        <div class="detail-existing-response-title">작성한 답변</div>
                        <div class="detail-existing-response-date">${formatDateTime(inquiry.answeredAt)}</div>
                    </div>
                    <div class="detail-existing-response-content">${escapeHtml(inquiry.adminAnswer)}</div>
                </div>
            ` : ''}
            
            <div class="detail-response-form">
                <label class="detail-response-label" for="responseText">답변 내용 ${hasAnswer ? '(작성됨)' : ''}</label>
                <textarea class="detail-response-textarea" 
                          id="responseText" 
                          placeholder="사용자에게 전달할 답변을 작성해주세요..."
                          ${hasAnswer ? 'disabled' : ''}>${hasAnswer ? inquiry.adminAnswer : ''}</textarea>
            </div>
            <div class="detail-response-actions">
                <button class="detail-response-btn primary" 
                        onclick="sendResponse()"
                        ${hasAnswer ? 'disabled' : ''}>
                    <i class="fas fa-paper-plane"></i> ${hasAnswer ? '전송 완료' : '답변 전송'}
                </button>
            </div>
        </div>
        
        <input type="hidden" id="detailId" value="${inquiry.inquiryId}">
    `;
}

// 날짜 포맷팅
function formatDateTime(dateTimeString) {
    if (!dateTimeString) return '-';
    try {
        const date = new Date(dateTimeString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    } catch (e) {
        return dateTimeString;
    }
}

// HTML 이스케이프
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
