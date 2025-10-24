// 업체 관리 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeTable();
});

/** ========== 초기화 ========== */
function initializeEventListeners() {
    // 검색 입력 엔터키 이벤트
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function initializeTable() {
    setupCheckboxEvents();
}

/** ========== 체크박스/일괄 처리 ========== */
function setupCheckboxEvents() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const companyCheckboxes = document.querySelectorAll('.company-checkbox');

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            companyCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateBulkActions();
        });
    }

    companyCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectAllCheckbox();
            updateBulkActions();
        });
    });
}

function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const companyCheckboxes = document.querySelectorAll('.company-checkbox');
    const checkedCount = document.querySelectorAll('.company-checkbox:checked').length;

    if (selectAllCheckbox) {
        selectAllCheckbox.checked = checkedCount === companyCheckboxes.length && checkedCount > 0;
        selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < companyCheckboxes.length;
    }
}

function updateBulkActions() {
    const checkedCount = document.querySelectorAll('.company-checkbox:checked').length;
    const bulkButtons = document.querySelectorAll('.table-actions .btn:not(.btn-secondary)');

    bulkButtons.forEach(button => {
        button.disabled = checkedCount === 0;
        button.style.opacity = checkedCount === 0 ? '0.5' : '1';
        button.style.pointerEvents = checkedCount === 0 ? 'none' : 'auto';
    });
}

/** ========== 검색/필터/페이지네이션 ========== */
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.trim() : '';

    const url = new URL(window.location);
    if (searchTerm) {
        url.searchParams.set('search', searchTerm);
    } else {
        url.searchParams.delete('search');
    }
    url.searchParams.set('page', '1'); // 검색 시 첫 페이지

    window.location.href = url.toString();
}

function applyFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchInput');

    const url = new URL(window.location);

    // 검색어
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    if (searchTerm) url.searchParams.set('search', searchTerm);
    else url.searchParams.delete('search');

    // 상태
    const status = statusFilter ? statusFilter.value : '';
    if (status) url.searchParams.set('status', status);
    else url.searchParams.delete('status');

    // 카테고리
    const category = categoryFilter ? categoryFilter.value : '';
    if (category) url.searchParams.set('category', category);
    else url.searchParams.delete('category');

    url.searchParams.set('page', '1'); // 첫 페이지

    window.location.href = url.toString();
}

function goToPage(page) {
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.location.href = url.toString();
}

/** ========== 전체 선택/일괄 작업 ========== */
function selectAll() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.dispatchEvent(new Event('change'));
    }
}

/** ✅ 서버 호출 유틸 */
async function apiApproveCompany(companyId) {
    const res = await fetch(`/api/admin/companies/${companyId}/approve`, {
        method: 'POST'
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || '승인 실패');
    }
}

async function apiRejectCompany(companyId, reason) {
    const params = new URLSearchParams();
    if (reason) params.set('reason', reason);
    const res = await fetch(`/api/admin/companies/${companyId}/reject?${params.toString()}`, {
        method: 'POST'
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || '거부 실패');
    }
}

/** 일괄 작업 */
async function bulkAction(action) {
    const checkedBoxes = document.querySelectorAll('.company-checkbox:checked');
    const companyIds = Array.from(checkedBoxes).map(checkbox => checkbox.value);

    if (companyIds.length === 0) {
        showNotification('선택된 업체가 없습니다.', 'warning');
        return;
    }

    let message = '';
    switch (action) {
        case 'approve':
            message = `선택된 ${companyIds.length}개 업체를 승인하시겠습니까?`;
            break;
        case 'reject':
            message = `선택된 ${companyIds.length}개 업체를 거부하시겠습니까?`;
            break;
        case 'suspend':
            message = `선택된 ${companyIds.length}개 업체를 정지하시겠습니까?`;
            break;
        default:
            showNotification('알 수 없는 작업입니다.', 'warning');
            return;
    }

    if (!confirm(message)) return;

    let rejectReason = '';
    if (action === 'reject') {
        rejectReason = prompt('거부 사유를 입력해주세요 (선택 사항):') || '';
    }

    // 버튼 비활성화(연속 클릭 방지)
    toggleGlobalActions(true);

    try {
        const results = await Promise.allSettled(companyIds.map(async (id) => {
            if (action === 'approve') {
                await apiApproveCompany(id);
                updateCompanyStatus(id, '승인완료');
            } else if (action === 'reject') {
                await apiRejectCompany(id, rejectReason);
                updateCompanyStatus(id, '승인거부');
            } else if (action === 'suspend') {
                // 서버 API 없으므로 클라이언트 표시만
                updateCompanyStatus(id, '정지');
            }
        }));

        const fulfilled = results.filter(r => r.status === 'fulfilled').length;
        const rejected = results.length - fulfilled;

        if (fulfilled > 0) {
            showNotification(`${fulfilled}개 업체에 대해 작업이 완료되었습니다.`, 'success');
        }
        if (rejected > 0) {
            showNotification(`${rejected}개 업체 작업 중 오류가 발생했습니다.`, 'warning');
            console.warn('일괄 작업 오류:', results.filter(r => r.status === 'rejected'));
        }

        // 체크박스 초기화
        checkedBoxes.forEach(cb => (cb.checked = false));
        updateSelectAllCheckbox();
        updateBulkActions();
    } catch (e) {
        console.error(e);
        showNotification('일괄 작업 중 오류가 발생했습니다.', 'warning');
    } finally {
        toggleGlobalActions(false);
    }
}

function toggleGlobalActions(disabled) {
    const actionable = document.querySelectorAll('.table-actions .btn');
    actionable.forEach(btn => {
        btn.disabled = disabled;
        btn.style.opacity = disabled ? '0.5' : '1';
        btn.style.pointerEvents = disabled ? 'none' : 'auto';
    });
}

/** ========== 단건 보기/승인/거부 ========== */
function viewCompany(companyId) {
    console.log('View company:', companyId);
    loadCompanyDetail(companyId);
    const modal = document.getElementById('companyDetailModal');
    if (modal) modal.style.display = 'block';
}

function loadCompanyDetail(companyId) {
    const content = document.getElementById('companyDetailContent');
    if (!content) return;

    // TODO: 실제 API 연동 필요
    const companyInfo = {
        id: companyId,
        name: '서울병원',
        owner: '김사업',
        phone: '010-1234-5678',
        email: 'seoul@hospital.com',
        address: '서울시 강남구 테헤란로 123',
        category: '병원',
        joinDate: '2024-01-15',
        status: '승인완료',
        businessNumber: '123-45-67890',
        description: '서울 강남구에 위치한 종합병원입니다.',
        totalReservations: 150,
        totalRevenue: 5000000
    };

    content.innerHTML = `
        <div class="company-detail">
            <div class="detail-row"><label>업체 ID:</label><span>${companyInfo.id}</span></div>
            <div class="detail-row"><label>업체명:</label><span>${companyInfo.name}</span></div>
            <div class="detail-row"><label>사업자명:</label><span>${companyInfo.owner}</span></div>
            <div class="detail-row"><label>연락처:</label><span>${companyInfo.phone}</span></div>
            <div class="detail-row"><label>이메일:</label><span>${companyInfo.email}</span></div>
            <div class="detail-row"><label>주소:</label><span>${companyInfo.address}</span></div>
            <div class="detail-row"><label>카테고리:</label><span class="category-badge">${companyInfo.category}</span></div>
            <div class="detail-row"><label>사업자등록번호:</label><span>${companyInfo.businessNumber}</span></div>
            <div class="detail-row"><label>등록일:</label><span>${companyInfo.joinDate}</span></div>
            <div class="detail-row"><label>상태:</label><span class="status-badge status-${companyInfo.status === '승인완료' ? 'approved' : (companyInfo.status === '승인대기' ? 'pending' : (companyInfo.status === '승인거부' ? 'rejected' : 'suspended'))}">${companyInfo.status}</span></div>
            <div class="detail-row"><label>설명:</label><span>${companyInfo.description}</span></div>
            <div class="detail-row"><label>총 예약 수:</label><span>${companyInfo.totalReservations}건</span></div>
            <div class="detail-row"><label>총 매출:</label><span>${companyInfo.totalRevenue.toLocaleString()}원</span></div>
        </div>
    `;
}

async function approveCompany(companyId) {
    if (!confirm('이 업체를 승인하시겠습니까?')) return;

    try {
        await apiApproveCompany(companyId);
        showNotification('업체가 승인되었습니다. (대표 지점 자동 생성 보장)', 'success');
        updateCompanyStatus(companyId, '승인완료');
    } catch (e) {
        console.error(e);
        showNotification('승인 중 오류가 발생했습니다.', 'warning');
    }
}

async function rejectCompany(companyId) {
    if (!confirm('이 업체를 거부하시겠습니까?')) return;

    const reason = prompt('거부 사유를 입력해주세요 (선택 사항):') || '';
    try {
        await apiRejectCompany(companyId, reason);
        showNotification('업체가 거부되었습니다.', 'success');
        updateCompanyStatus(companyId, '승인거부');
    } catch (e) {
        console.error(e);
        showNotification('거부 처리 중 오류가 발생했습니다.', 'warning');
    }
}

/** DOM 상태 갱신 */
function updateCompanyStatus(companyId, status) {
    // 행 찾기: data-company-id 속성이 있으면 우선 사용
    let companyRow = document.querySelector(`tr[data-company-id="${companyId}"]`);
    // 없으면 테이블 셀 텍스트로 fallback
    if (!companyRow) {
        const candidates = Array.from(document.querySelectorAll('tr'));
        companyRow = candidates.find(tr => tr.querySelector('.company-id') && tr.querySelector('.company-id').textContent.trim() === String(companyId));
    }
    if (!companyRow) return;

    const statusCell = companyRow.querySelector('.company-status .status-badge') || companyRow.querySelector('.status-badge');
    if (statusCell) {
        statusCell.textContent = status;
        let cls = 'status-badge ';
        if (status === '승인완료') cls += 'status-approved';
        else if (status === '승인대기') cls += 'status-pending';
        else if (status === '승인거부') cls += 'status-rejected';
        else cls += 'status-suspended';
        statusCell.className = cls;
    }

    // 승인 완료 시 승인/거부 버튼 숨김
    const actionButtons = companyRow.querySelector('.action-buttons');
    if (actionButtons && status === '승인완료') {
        const approveBtn = actionButtons.querySelector('.btn-success');
        const rejectBtn = actionButtons.querySelector('.btn-danger');
        if (approveBtn) approveBtn.remove();
        if (rejectBtn) rejectBtn.remove();
    }
}

/** ========== 모달/알림 ========== */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

function showNotification(message, type = 'info') {
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

    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
    `;

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        cursor: pointer;
        color: inherit;
        padding: 0;
        margin-left: 10px;
    `;

    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);
    setTimeout(() => { if (notification.parentElement) notification.remove(); }, 3000);
}

/** ========== 예약내역 모달 관련 ========== */
let currentCompanyId = null;
let currentPage = 0;
let totalPages = 1;

function viewReservations(companyId) {
    currentCompanyId = companyId;
    currentPage = 0;
    
    // 클릭한 업체의 이름을 가져와서 모달 제목에 설정
    const companyRow = document.querySelector(`tr[data-company-id="${companyId}"]`) || 
                      Array.from(document.querySelectorAll('tr')).find(tr => 
                          tr.querySelector('.company-id') && 
                          tr.querySelector('.company-id').textContent.trim() === String(companyId)
                      );
    
    let companyName = '업체명';
    if (companyRow) {
        const nameCell = companyRow.querySelector('.company-name');
        if (nameCell) {
            companyName = nameCell.textContent.trim();
        }
    }
    
    // 모달 제목과 업체명 설정
    document.getElementById('reservationsModalTitle').textContent = '예약내역';
    document.getElementById('reservationModalCompanyName').textContent = companyName;
    
    // 모달 열기
    const modal = document.getElementById('reservationsModal');
    modal.style.display = 'block';
    
    // 로딩 상태 표시
    showReservationsLoading();
    
    // 예약내역 로드
    loadReservations();
}

function showReservationsLoading() {
    document.getElementById('reservationsLoading').style.display = 'block';
    document.getElementById('reservationsContent').style.display = 'none';
    document.getElementById('noReservations').style.display = 'none';
}

function loadReservations() {
    if (!currentCompanyId) {
        console.error('currentCompanyId가 없습니다.');
        return;
    }
    
    console.log('예약내역 로드 시작, Company ID:', currentCompanyId);
    
    fetch(`/admin/api/companies/${currentCompanyId}/reservations?page=${currentPage}&size=10`)
        .then(response => {
            console.log('API 응답 상태:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API 응답 데이터:', data);
            if (data.success) {
                displayReservations(data);
            } else {
                console.log('API 응답 실패:', data.message);
                showReservationsError(data.message || '예약내역을 불러올 수 없습니다.');
            }
        })
        .catch(error => {
            console.error('예약내역 로드 오류:', error);
            showReservationsError('예약내역을 불러오는 중 오류가 발생했습니다: ' + error.message);
        });
}

function displayReservations(data) {
    const loading = document.getElementById('reservationsLoading');
    const content = document.getElementById('reservationsContent');
    const noData = document.getElementById('noReservations');
    
    // 모든 상태를 먼저 숨김
    loading.style.display = 'none';
    content.style.display = 'none';
    noData.style.display = 'none';
    
    console.log('예약내역 데이터:', data); // 디버깅용 로그 추가
    console.log('예약 배열:', data.reservations);
    console.log('예약 개수:', data.reservations ? data.reservations.length : 'undefined');
    
    // 모달 제목과 업체명 업데이트 (항상)
    document.getElementById('reservationsModalTitle').textContent = '예약내역';
    if (data.companyName) {
        document.getElementById('reservationModalCompanyName').textContent = data.companyName;
    }
    
    // 예약 데이터가 있고 배열에 항목이 있는지 확인
    const hasReservations = data.reservations && Array.isArray(data.reservations) && data.reservations.length > 0;
    
    if (hasReservations) {
        console.log('예약내역이 있습니다. 목록 표시');
        content.style.display = 'block';
        noData.style.display = 'none';
        
        // 통계 업데이트
        document.getElementById('totalReservations').textContent = data.totalElements || data.reservations.length;
        
        // 예약 목록 렌더링
        renderReservationsList(data.reservations);
        
        // 페이지네이션 업데이트
        updateReservationsPagination(data);
    } else {
        console.log('예약내역이 없습니다. no-data 상태 표시');
        content.style.display = 'none';
        noData.style.display = 'block';
        
        // no-data 상태가 제대로 표시되는지 확인
        console.log('noData 요소:', noData);
        console.log('noData display 스타일:', noData.style.display);
    }
}

function renderReservationsList(reservations) {
    const listContainer = document.getElementById('reservationsList');
    
    const reservationsHtml = reservations.map(reservation => {
        const statusClass = getStatusClass(reservation.status);
        const statusText = getStatusText(reservation.status);
        const dateTime = formatDateTime(reservation.date, reservation.startTime);
        
        return `
            <div class="reservation-item">
                <div class="reservation-header">
                    <div class="customer-info">
                        <span class="customer-name">${reservation.customerName || '고객명 없음'}</span>
                        <span class="customer-phone">${reservation.customerContact || '연락처 없음'}</span>
                    </div>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <div class="reservation-details">
                    <div class="reservation-datetime">
                        <i class="fas fa-calendar"></i>
                        ${dateTime}
                    </div>
                    <div class="reservation-service">
                        <i class="fas fa-stethoscope"></i>
                        ${reservation.title || '서비스명 없음'}
                    </div>
                    ${reservation.totalAmount ? `
                        <div class="reservation-amount">
                            <i class="fas fa-won-sign"></i>
                            ${formatAmount(reservation.totalAmount)}원
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    listContainer.innerHTML = reservationsHtml;
}

function updateReservationsPagination(data) {
    totalPages = data.totalPages;
    const pagination = document.getElementById('reservationsPagination');
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    
    if (totalPages > 1) {
        pagination.style.display = 'flex';
        pageInfo.textContent = `페이지 ${data.currentPage + 1} / ${totalPages}`;
        
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage >= totalPages - 1;
    } else {
        pagination.style.display = 'none';
    }
}

function loadReservationsPage(direction) {
    const newPage = currentPage + direction;
    if (newPage >= 0 && newPage < totalPages) {
        currentPage = newPage;
        showReservationsLoading();
        loadReservations();
    }
}

function showReservationsError(message) {
    const loading = document.getElementById('reservationsLoading');
    const content = document.getElementById('reservationsContent');
    const noData = document.getElementById('noReservations');
    
    console.log('오류 표시 함수 호출:', message);
    console.log('noData 요소:', noData);
    
    // 모든 상태 숨김
    if (loading) loading.style.display = 'none';
    if (content) content.style.display = 'none';
    
    if (noData) {
        noData.style.display = 'block';
        noData.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        `;
        console.log('noData 표시 완료, display:', noData.style.display);
    } else {
        console.error('noData 요소를 찾을 수 없습니다!');
    }
    
    console.log('예약내역 오류 표시:', message); // 디버깅용 로그 추가
}

function getStatusClass(status) {
    switch(status) {
        case 'CONFIRMED': return 'status-confirmed';
        case 'CANCELLED': return 'status-cancelled';
        case 'COMPLETED': return 'status-completed';
        default: return 'status-pending';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'CONFIRMED': return '확정';
        case 'CANCELLED': return '취소';
        case 'COMPLETED': return '완료';
        default: return '예약중';
    }
}

function formatDateTime(date, time) {
    const dateStr = new Date(date).toLocaleDateString('ko-KR');
    const timeStr = time ? time.substring(0, 5) : '';
    return `${dateStr} ${timeStr}`;
}

function formatAmount(amount) {
    return new Intl.NumberFormat('ko-KR').format(amount);
}