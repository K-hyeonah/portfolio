// 이벤트/프로모션 신청 관리 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeTable();
    setupRejectFormHandler();
    setupEditFormHandler();
    setupModalCloseEvents();
});

// 이벤트 리스너 초기화
function initializeEventListeners() {
    // 검색 입력 엔터키 이벤트
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchEvents();
            }
        });
    }
}

// 반려 폼 제출 핸들러
function setupRejectFormHandler() {
    const rejectForm = document.getElementById('rejectForm');
    if (rejectForm) {
        rejectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processReject();
        });
    }
}

// 수정 폼 제출 핸들러
function setupEditFormHandler() {
    const editForm = document.getElementById('editEventForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processEditEvent();
        });
    }
}

// 모달 외부 클릭 이벤트
function setupModalCloseEvents() {
    window.addEventListener('click', function(event) {
        const rejectModal = document.getElementById('rejectModal');
        const editModal = document.getElementById('editEventModal');
        const detailModal = document.getElementById('eventDetailModal');
        
        if (event.target === rejectModal) {
            closeRejectModal();
        }
        if (event.target === editModal) {
            closeEditEventModal();
        }
        if (event.target === detailModal) {
            closeEventDetailModal();
        }
    });
}

// 테이블 초기화
function initializeTable() {
    // 체크박스 이벤트 설정
    setupCheckboxEvents();
}

// 체크박스 이벤트 설정
function setupCheckboxEvents() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const eventCheckboxes = document.querySelectorAll('.event-checkbox');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            eventCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateBulkActions();
        });
    }
    
    eventCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectAllCheckbox();
            updateBulkActions();
        });
    });
}

// 전체 선택 체크박스 업데이트
function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const eventCheckboxes = document.querySelectorAll('.event-checkbox');
    const checkedCount = document.querySelectorAll('.event-checkbox:checked').length;
    
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = checkedCount === eventCheckboxes.length;
        selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < eventCheckboxes.length;
    }
}

// 일괄 작업 버튼 상태 업데이트
function updateBulkActions() {
    const checkedCount = document.querySelectorAll('.event-checkbox:checked').length;
    const bulkButtons = document.querySelectorAll('.table-actions .btn:not(.btn-secondary)');
    
    bulkButtons.forEach(button => {
        button.disabled = checkedCount === 0;
        button.style.opacity = checkedCount === 0 ? '0.5' : '1';
    });
}

// 전체 선택 토글
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = !selectAllCheckbox.checked;
        selectAllCheckbox.dispatchEvent(new Event('change'));
    }
}

// 이벤트 검색
function searchEvents() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const eventRows = document.querySelectorAll('.event-row');
    
    eventRows.forEach(row => {
        const companyName = row.querySelector('.company-name').textContent.toLowerCase();
        const eventName = row.querySelector('.event-name').textContent.toLowerCase();
        
        if (companyName.includes(searchInput) || eventName.includes(searchInput)) {
            row.style.display = '';
    } else {
            row.style.display = 'none';
        }
    });
}

// 이벤트 필터링
function filterEvents() {
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    const eventRows = document.querySelectorAll('.event-row');
    
    eventRows.forEach(row => {
        const status = row.getAttribute('data-status');
        const type = row.getAttribute('data-type');
        
        let showStatus = !statusFilter || status === statusFilter;
        let showType = !typeFilter || type === typeFilter;
        
        // 날짜 필터링은 실제 데이터와 연동 필요
        
        if (showStatus && showType) {
            row.style.display = '';
    } else {
            row.style.display = 'none';
        }
    });
}

// 일괄 승인
function bulkApprove() {
    const checkedBoxes = document.querySelectorAll('.event-checkbox:checked');
    const eventIds = Array.from(checkedBoxes).map(checkbox => checkbox.value);
    
    if (eventIds.length === 0) {
        alert('선택된 항목이 없습니다.');
        return;
    }
    
    if (confirm(`선택된 ${eventIds.length}건의 이벤트를 승인하시겠습니까?`)) {
        console.log('승인할 이벤트:', eventIds);
        alert(`${eventIds.length}건의 이벤트가 승인되었습니다.`);
        
        // 체크박스 초기화
        checkedBoxes.forEach(checkbox => checkbox.checked = false);
        updateSelectAllCheckbox();
        updateBulkActions();
    }
}

// 일괄 반려
function bulkReject() {
    const checkedBoxes = document.querySelectorAll('.event-checkbox:checked');
    const eventIds = Array.from(checkedBoxes).map(checkbox => checkbox.value);
    
    if (eventIds.length === 0) {
        alert('선택된 항목이 없습니다.');
        return;
    }
    
    const reason = prompt(`선택된 ${eventIds.length}건의 이벤트를 반려합니다.\n반려 사유를 입력하세요:`);
    
    if (reason) {
        console.log('반려할 이벤트:', eventIds, '사유:', reason);
        alert(`${eventIds.length}건의 이벤트가 반려되었습니다.`);
        
        // 체크박스 초기화
        checkedBoxes.forEach(checkbox => checkbox.checked = false);
        updateSelectAllCheckbox();
        updateBulkActions();
    }
}

// 페이지 이동
function goToPage(page) {
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.location.href = url.toString();
}

// 이벤트 상세 보기
function viewEventDetail(eventId) {
    console.log('이벤트 상세 보기:', eventId);
    
    // 이벤트 데이터 가져오기 (임시 데이터)
    const eventData = getEventData(eventId);
    
    // 상세 정보 HTML 생성
    const detailContent = document.getElementById('eventDetailContent');
    detailContent.innerHTML = `
        <div class="detail-section">
            <h3><i class="fas fa-info-circle"></i> 기본 정보</h3>
            <div class="detail-row">
                <label>신청 ID:</label>
                <span>${eventData.id}</span>
            </div>
            <div class="detail-row">
                <label>업체명:</label>
                <span><strong>${eventData.companyName}</strong></span>
            </div>
            <div class="detail-row">
                <label>이벤트명:</label>
                <span><strong>${eventData.eventName}</strong></span>
            </div>
            <div class="detail-row">
                <label>유형:</label>
                <span><span class="type-badge type-${eventData.type}">${getTypeText(eventData.type)}</span></span>
            </div>
            <div class="detail-row">
                <label>상태:</label>
                <span><span class="status-badge status-${eventData.status}">${getStatusText(eventData.status)}</span></span>
            </div>
        </div>
        
        <div class="detail-section">
            <h3><i class="fas fa-calendar-alt"></i> 기간 정보</h3>
            <div class="detail-row">
                <label>시작일:</label>
                <span>${eventData.startDate}</span>
            </div>
            <div class="detail-row">
                <label>종료일:</label>
                <span>${eventData.endDate}</span>
            </div>
            <div class="detail-row">
                <label>진행 기간:</label>
                <span>${calculateDuration(eventData.startDate, eventData.endDate)}일</span>
            </div>
            <div class="detail-row">
                <label>신청일:</label>
                <span>${eventData.applyDate}</span>
            </div>
        </div>
        
        <div class="detail-section">
            <h3><i class="fas fa-file-alt"></i> 상세 내용</h3>
            <div class="detail-row">
                <label>할인율/혜택:</label>
                <span>${eventData.discount || '20% 할인'}</span>
            </div>
            <div class="detail-row">
                <label>설명:</label>
                <span>${eventData.description || '상세 설명 없음'}</span>
            </div>
            ${eventData.rejectReason ? `
                <div class="detail-highlight">
                    <strong>반려 사유:</strong><br>
                    ${eventData.rejectReason}
                </div>
            ` : ''}
        </div>
        
        <div class="detail-section">
            <h3><i class="fas fa-chart-line"></i> 통계 정보</h3>
            <div class="detail-row">
                <label>조회수:</label>
                <span>${eventData.views || 0}회</span>
            </div>
            <div class="detail-row">
                <label>참여자 수:</label>
                <span>${eventData.participants || 0}명</span>
            </div>
        </div>
    `;
    
    // 모달 열기
    document.getElementById('eventDetailModal').style.display = 'block';
}

// 상세 모달 닫기
function closeEventDetailModal() {
    document.getElementById('eventDetailModal').style.display = 'none';
}

// 이벤트 데이터 가져오기 (임시)
function getEventData(eventId) {
    const eventDataMap = {
        '1': {
            id: 'E001',
            companyName: '힝거피부과',
            eventName: '가을맞이 레이저 토닝 할인',
            type: 'event',
            status: 'pending',
            startDate: '2024-10-15',
            endDate: '2024-10-31',
            applyDate: '2024-10-09',
            discount: '30% 할인',
            description: '가을 맞이 특별 이벤트로 레이저 토닝 시술을 30% 할인된 가격에 제공합니다.',
            views: 245,
            participants: 0
        },
        '2': {
            id: 'E002',
            companyName: '뷰티클리닉',
            eventName: '신규 고객 50% 할인',
            type: 'promotion',
            status: 'approved',
            startDate: '2024-10-01',
            endDate: '2024-10-30',
            applyDate: '2024-09-28',
            discount: '50% 할인',
            description: '첫 방문 고객에게 모든 시술 50% 할인 혜택을 제공합니다.',
            views: 892,
            participants: 67
        }
    };
    
    return eventDataMap[eventId] || eventDataMap['1'];
}

// 유형 텍스트 변환
function getTypeText(type) {
    const typeMap = {
        'event': '이벤트',
        'promotion': '프로모션',
        'discount': '할인'
    };
    return typeMap[type] || type;
}

// 상태 텍스트 변환
function getStatusText(status) {
    const statusMap = {
        'pending': '대기중',
        'approved': '승인',
        'rejected': '반려',
        'active': '진행중',
        'completed': '완료'
    };
    return statusMap[status] || status;
}

// 기간 계산
function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff + 1;
}

// 이벤트 승인
function approveEvent(eventId) {
    if (confirm('이 이벤트를 승인하시겠습니까?')) {
        console.log('이벤트 승인:', eventId);
        
        // 상태 업데이트
        const row = document.querySelector(`.event-checkbox[value="${eventId}"]`).closest('.event-row');
        const statusBadge = row.querySelector('.status-badge');
        statusBadge.textContent = '승인';
        statusBadge.className = 'status-badge status-approved';
        row.setAttribute('data-status', 'approved');
        
        // 버튼 업데이트
        const actionButtons = row.querySelector('.action-buttons');
        const approveBtn = actionButtons.querySelector('.btn-success');
        const rejectBtn = actionButtons.querySelector('.btn-danger');
        if (approveBtn) approveBtn.remove();
        if (rejectBtn) rejectBtn.remove();
        
        alert('이벤트가 승인되었습니다.');
    }
}

// 이벤트 반려 - 모달 열기
function rejectEvent(eventId) {
    const modal = document.getElementById('rejectModal');
    const eventIdInput = document.getElementById('rejectEventId');
    const form = document.getElementById('rejectForm');
    
    // 폼 초기화
    form.reset();
    
    // 이벤트 ID 설정
    eventIdInput.value = eventId;
    
    // 모달 열기
    modal.style.display = 'block';
}

// 반려 모달 닫기
function closeRejectModal() {
    const modal = document.getElementById('rejectModal');
    modal.style.display = 'none';
}

// 반려 처리
function processReject() {
    const eventId = document.getElementById('rejectEventId').value;
    const reason = document.getElementById('rejectReason').value;
    const notifyCompany = document.getElementById('notifyCompany').checked;
    
    if (!reason.trim()) {
        alert('반려 사유를 입력하세요.');
        return;
    }
    
    console.log('이벤트 반려:', eventId, '사유:', reason, '알림 전송:', notifyCompany);
    
    // 상태 업데이트
    const row = document.querySelector(`.event-checkbox[value="${eventId}"]`).closest('.event-row');
    const statusBadge = row.querySelector('.status-badge');
    statusBadge.textContent = '반려';
    statusBadge.className = 'status-badge status-rejected';
    row.setAttribute('data-status', 'rejected');
    
    // 버튼 업데이트
    const actionButtons = row.querySelector('.action-buttons');
    const approveBtn = actionButtons.querySelector('.btn-success');
    const rejectBtn = actionButtons.querySelector('.btn-danger');
    if (approveBtn) approveBtn.remove();
    if (rejectBtn) rejectBtn.remove();
    
    // 모달 닫기
    closeRejectModal();
    
    alert(notifyCompany ? '이벤트가 반려되었으며 업체에 알림이 전송되었습니다.' : '이벤트가 반려되었습니다.');
}

// 이벤트 수정
function editEvent(eventId) {
    console.log('이벤트 수정:', eventId);
    
    // 이벤트 데이터 가져오기
    const eventData = getEventData(eventId);
    
    // 폼에 데이터 채우기
    document.getElementById('editEventId').value = eventId;
    document.getElementById('editEventName').value = eventData.eventName;
    document.getElementById('editEventType').value = eventData.type;
    document.getElementById('editStartDate').value = eventData.startDate;
    document.getElementById('editEndDate').value = eventData.endDate;
    document.getElementById('editEventDescription').value = eventData.description || '';
    
    // 모달 열기
    document.getElementById('editEventModal').style.display = 'block';
}

// 수정 모달 닫기
function closeEditEventModal() {
    document.getElementById('editEventModal').style.display = 'none';
}

// 이벤트 수정 처리
function processEditEvent() {
    const eventId = document.getElementById('editEventId').value;
    const eventName = document.getElementById('editEventName').value;
    const eventType = document.getElementById('editEventType').value;
    const startDate = document.getElementById('editStartDate').value;
    const endDate = document.getElementById('editEndDate').value;
    const description = document.getElementById('editEventDescription').value;
    
    console.log('이벤트 수정:', { eventId, eventName, eventType, startDate, endDate, description });
    
    // 실제로는 서버에 수정 요청 전송
    
    // 테이블 업데이트
    const row = document.querySelector(`.event-checkbox[value="${eventId}"]`).closest('.event-row');
    row.querySelector('.event-name').textContent = eventName;
    row.querySelector('.event-period .date').textContent = `${startDate} ~ ${endDate}`;
    
    const typeBadge = row.querySelector('.type-badge');
    typeBadge.textContent = getTypeText(eventType);
    typeBadge.className = `type-badge type-${eventType}`;
    
    closeEditEventModal();
    alert('이벤트가 수정되었습니다.');
}

// 이벤트 종료
function endEvent(eventId) {
    if (confirm('이 이벤트를 종료하시겠습니까?')) {
        console.log('이벤트 종료:', eventId);
        
        // 상태 업데이트
        const row = document.querySelector(`.event-checkbox[value="${eventId}"]`).closest('.event-row');
        const statusBadge = row.querySelector('.status-badge');
        statusBadge.textContent = '완료';
        statusBadge.className = 'status-badge status-completed';
        row.setAttribute('data-status', 'completed');
        
        alert('이벤트가 종료되었습니다.');
    }
}

// 이벤트 삭제
function deleteEvent(eventId) {
    if (confirm('이 이벤트를 삭제하시겠습니까?')) {
        console.log('이벤트 삭제:', eventId);
        
        const row = document.querySelector(`.event-checkbox[value="${eventId}"]`).closest('.event-row');
        row.style.opacity = '0';
        row.style.transform = 'scale(0.8)';
        row.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            row.remove();
            alert('이벤트가 삭제되었습니다.');
        }, 300);
    }
}

// 예약 상세 보기
function viewReservation(reservationId) {
    // 실제로는 서버에서 예약 상세 정보를 가져와야 함
    console.log('View reservation:', reservationId);
    
    // 모달에 예약 정보 로드
    loadReservationDetail(reservationId);
    
    // 모달 표시
    const modal = document.getElementById('reservationDetailModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// 예약 상세 정보 로드
function loadReservationDetail(reservationId) {
    const content = document.getElementById('reservationDetailContent');
    if (!content) return;
    
    // 임시 예약 정보 (실제로는 서버에서 가져와야 함)
    const reservationInfo = {
        id: reservationId,
        userName: '김고객',
        userPhone: '010-1234-5678',
        companyName: '서울병원',
        companyPhone: '02-1234-5678',
        service: '진료',
        date: '2024-01-25',
        time: '14:00',
        status: '예약',
        amount: 50000,
        paymentMethod: '카드결제',
        notes: '첫 방문 고객입니다.',
        createdAt: '2024-01-20 10:30',
        updatedAt: '2024-01-20 10:30'
    };
    
    content.innerHTML = `
        <div class="reservation-detail">
            <div class="detail-row">
                <label>예약 ID:</label>
                <span>${reservationInfo.id}</span>
            </div>
            <div class="detail-row">
                <label>고객명:</label>
                <span>${reservationInfo.userName}</span>
            </div>
            <div class="detail-row">
                <label>고객 연락처:</label>
                <span>${reservationInfo.userPhone}</span>
            </div>
            <div class="detail-row">
                <label>업체명:</label>
                <span>${reservationInfo.companyName}</span>
            </div>
            <div class="detail-row">
                <label>업체 연락처:</label>
                <span>${reservationInfo.companyPhone}</span>
            </div>
            <div class="detail-row">
                <label>서비스:</label>
                <span>${reservationInfo.service}</span>
            </div>
            <div class="detail-row">
                <label>예약일시:</label>
                <span>${reservationInfo.date} ${reservationInfo.time}</span>
            </div>
            <div class="detail-row">
                <label>상태:</label>
                <span class="status-badge status-${reservationInfo.status === '완료' ? 'completed' : reservationInfo.status === '예약' ? 'reserved' : 'cancelled'}">${reservationInfo.status}</span>
            </div>
            <div class="detail-row">
                <label>금액:</label>
                <span>${reservationInfo.amount.toLocaleString()}원</span>
            </div>
            <div class="detail-row">
                <label>결제방법:</label>
                <span>${reservationInfo.paymentMethod}</span>
            </div>
            <div class="detail-row">
                <label>특이사항:</label>
                <span>${reservationInfo.notes}</span>
            </div>
            <div class="detail-row">
                <label>예약일시:</label>
                <span>${reservationInfo.createdAt}</span>
            </div>
            <div class="detail-row">
                <label>수정일시:</label>
                <span>${reservationInfo.updatedAt}</span>
            </div>
        </div>
    `;
}

// 예약 수정
function editReservation(reservationId) {
    console.log('Edit reservation:', reservationId);
    // 실제로는 예약 수정 페이지로 이동하거나 모달을 표시해야 함
    showNotification('예약 수정 기능은 준비 중입니다.', 'info');
}

// 예약 확정
function confirmReservation(reservationId) {
    if (confirm('이 예약을 확정하시겠습니까?')) {
        // 실제로는 서버에 요청을 보내야 함
        console.log('Confirm reservation:', reservationId);
        showNotification('예약이 확정되었습니다.', 'success');
        
        // 테이블에서 상태 업데이트
        updateReservationStatus(reservationId, '확정');
    }
}

// 예약 취소
function cancelReservation(reservationId) {
    if (confirm('이 예약을 취소하시겠습니까?')) {
        // 실제로는 서버에 요청을 보내야 함
        console.log('Cancel reservation:', reservationId);
        showNotification('예약이 취소되었습니다.', 'success');
        
        // 테이블에서 상태 업데이트
        updateReservationStatus(reservationId, '취소');
    }
}

// 예약 상태 업데이트
function updateReservationStatus(reservationId, status) {
    const reservationRow = document.querySelector(`tr[data-reservation-id="${reservationId}"]`);
    if (reservationRow) {
        const statusBadge = reservationRow.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.textContent = status;
            statusBadge.className = `status-badge status-${status === '완료' ? 'completed' : status === '예약' ? 'reserved' : status === '확정' ? 'confirmed' : 'cancelled'}`;
        }
        
        // 액션 버튼 업데이트
        const actionButtons = reservationRow.querySelector('.action-buttons');
        if (actionButtons) {
            // 기존 버튼들 제거
            const confirmBtn = actionButtons.querySelector('.btn-success');
            const cancelBtn = actionButtons.querySelector('.btn-danger');
            if (confirmBtn) confirmBtn.remove();
            if (cancelBtn) cancelBtn.remove();
            
            // 새로운 상태에 따른 버튼 추가
            if (status === '확정') {
                const completeBtn = document.createElement('button');
                completeBtn.className = 'btn btn-sm btn-success';
                completeBtn.innerHTML = '<i class="fas fa-check-double"></i>';
                completeBtn.onclick = () => completeReservation(reservationId);
                actionButtons.appendChild(completeBtn);
            }
        }
    }
}

// 예약 완료 처리
function completeReservation(reservationId) {
    if (confirm('이 예약을 완료 처리하시겠습니까?')) {
        // 실제로는 서버에 요청을 보내야 함
        console.log('Complete reservation:', reservationId);
        showNotification('예약이 완료 처리되었습니다.', 'success');
        
        // 테이블에서 상태 업데이트
        updateReservationStatus(reservationId, '완료');
    }
}

// 모달 닫기
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// 모달 외부 클릭 시 닫기
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// 알림 표시
function showNotification(message, type = 'info') {
    // 알림 요소 생성
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // 스타일 추가
    const bgColor = type === 'success' ? '#d4edda' : type === 'warning' ? '#fff3cd' : '#d1ecf1';
    const textColor = type === 'success' ? '#155724' : type === 'warning' ? '#856404' : '#0c5460';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: ${textColor};
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    // 알림 내용 스타일
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
    `;
    
    // 닫기 버튼 스타일
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        cursor: pointer;
        color: inherit;
        padding: 0;
        margin-left: 10px;
    `;
    
    // 애니메이션 스타일 추가
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 알림 추가
    document.body.appendChild(notification);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

