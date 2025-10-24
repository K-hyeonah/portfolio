// ========================================
// 전역 변수
// ========================================
let currentCompanyId = null;
let currentCompanyName = null;
let selectedCompanyData = null;
let allServices = [];
let currentFilter = 'all';

// ========================================
// 업체 선택
// ========================================
function selectCompany(element) {
    console.log('===== 업체 선택 =====');
    
    // element가 null인지 확인
    if (!element) {
        console.error('업체 요소가 null입니다.');
        return;
    }
    
    // 이전 선택 해제
    document.querySelectorAll('.company-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // 현재 선택 표시
    element.classList.add('selected');
    
    // 데이터 가져오기
    const companyId = element.getAttribute('data-company-id');
    const companyName = element.getAttribute('data-company-name');
    const itemId = element.getAttribute('data-item-id');
    const approvalStatus = element.getAttribute('data-approval-status');
    const createdAt = element.getAttribute('data-created-at');
    
    console.log('선택된 업체:', {
        companyId,
        companyName,
        itemId,
        approvalStatus,
        createdAt
    });
    
    // 전역 변수에 저장
    selectedCompanyData = {
        companyId,
        companyName,
        itemId,
        approvalStatus,
        createdAt
    };
    
    // 사이드바 업데이트
    updateSidebar(selectedCompanyData);
}

// ========================================
// 사이드바 업데이트
// ========================================
function updateSidebar(data) {
    console.log('사이드바 업데이트:', data);
    
    // 업체 ID와 이름
    document.getElementById('sidebarCompanyId').textContent = 'PN' + data.itemId;
    document.getElementById('sidebarCompanyName').textContent = data.companyName;
    
    // 담당자 (현재 데이터 없음)
    document.getElementById('sidebarManager').textContent = '-';
    
    // 연락처 (현재 데이터 없음)
    document.getElementById('sidebarPhone').textContent = '-';
    
    // 주소 (현재 데이터 없음)
    document.getElementById('sidebarAddress').textContent = '-';
    
    // 등록일
    if (data.createdAt) {
        const date = new Date(data.createdAt);
        const formatted = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
        document.getElementById('sidebarCreatedDate').textContent = formatted;
    } else {
        document.getElementById('sidebarCreatedDate').textContent = '-';
    }
    
    // 상태
    const statusElement = document.getElementById('sidebarStatus');
    let statusText = '대기';
    let statusClass = 'status-normal';
    
    if (data.approvalStatus === 'APPROVED') {
        statusText = '정상';
        statusClass = 'status-normal';
    } else if (data.approvalStatus === 'REPORTED') {
        statusText = '신고 접수';
        statusClass = 'status-warning';
    } else if (data.approvalStatus === 'SUSPENDED') {
        statusText = '제재중';
        statusClass = 'status-danger';
    }
    
    statusElement.textContent = statusText;
    statusElement.className = 'detail-value ' + statusClass;
    
    // 상품 목록 버튼 활성화
    document.getElementById('productListBtn').disabled = false;
}

// ========================================
// 사이드바에서 모달 열기
// ========================================
function openMedicalServiceModalFromSidebar() {
    console.log('===== 사이드바에서 모달 열기 =====');
    
    if (!selectedCompanyData) {
        alert('업체를 먼저 선택해주세요.');
        return;
    }
    
    currentCompanyId = selectedCompanyData.companyId;
    currentCompanyName = selectedCompanyData.companyName;
    
    console.log('Company ID:', currentCompanyId);
    console.log('Company Name:', currentCompanyName);
    
    // 모달 표시
    const modal = document.getElementById('medicalServiceModal');
    modal.classList.add('active');
    
    // 업체명 설정
    document.getElementById('modalCompanyName').textContent = currentCompanyName;
    
    // 데이터 로드
    loadMedicalServices(currentCompanyId);
}

// ========================================
// 모달 닫기
// ========================================
function closeMedicalServiceModal() {
    const modal = document.getElementById('medicalServiceModal');
    modal.classList.remove('active');
    
    // 데이터 초기화
    currentCompanyId = null;
    currentCompanyName = null;
    allServices = [];
    currentFilter = 'all';
    
    // UI 초기화
    document.getElementById('serviceTableBody').innerHTML = '';
    document.getElementById('modalLoading').style.display = 'flex';
    document.getElementById('serviceListContainer').style.display = 'none';
    document.getElementById('serviceSearch').value = '';
    
    // 필터 탭 초기화
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.filter-tab')[0].classList.add('active');
}

// 모달 외부 클릭 시 닫기
document.addEventListener('click', function(event) {
    const modal = document.getElementById('medicalServiceModal');
    if (event.target === modal) {
        closeMedicalServiceModal();
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('medicalServiceModal');
        if (modal.classList.contains('active')) {
            closeMedicalServiceModal();
        }
    }
});

// ========================================
// 의료 서비스 데이터 로드
// ========================================
async function loadMedicalServices(companyId) {
    console.log('===== 서비스 데이터 로드 시작 =====');
    console.log('Company ID:', companyId);
    
    try {
        // 로딩 표시
        document.getElementById('modalLoading').style.display = 'flex';
        document.getElementById('serviceListContainer').style.display = 'none';
        
        // API 호출
        const response = await fetch(`/admin/api/companies/${companyId}/medical-services`);
        
        console.log('응답 상태:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const services = await response.json();
        console.log('받은 서비스 데이터:', services);
        
        allServices = services;
        
        // 로딩 숨기고 컨텐츠 표시
        document.getElementById('modalLoading').style.display = 'none';
        document.getElementById('serviceListContainer').style.display = 'block';
        
        // 통계 업데이트
        updateStatistics(services);
        
        // 테이블 렌더링
        renderServiceTable(services);
        
    } catch (error) {
        console.error('서비스 로드 중 오류:', error);
        document.getElementById('modalLoading').innerHTML = `
            <i class="fas fa-exclamation-circle" style="color: #dc3545;"></i>
            <p style="color: #dc3545;">데이터를 불러오는 중 오류가 발생했습니다.</p>
            <p style="font-size: 14px; color: #6c757d;">${error.message}</p>
        `;
    }
}

// ========================================
// 통계 업데이트
// ========================================
function updateStatistics(services) {
    const total = services.length;
    const active = services.filter(s => isServiceActive(s)).length;
    const inactive = total - active;
    
    document.getElementById('totalServices').textContent = total;
    document.getElementById('activeServices').textContent = active;
    document.getElementById('inactiveServices').textContent = inactive;
    
    console.log('통계 업데이트:', { total, active, inactive });
}

// ========================================
// 서비스 활성 상태 확인 (deleted_at 기준)
// ========================================
function isServiceActive(service) {
    // deleted_at이 null이면 활성, null이 아니면 비활성
    return service.deletedAt === null || service.deletedAt === undefined;
}

// ========================================
// 서비스 테이블 렌더링
// ========================================
function renderServiceTable(services) {
    const tbody = document.getElementById('serviceTableBody');
    const noServices = document.getElementById('noServices');
    
    if (services.length === 0) {
        tbody.innerHTML = '';
        noServices.style.display = 'block';
        return;
    }
    
    noServices.style.display = 'none';
    
    tbody.innerHTML = services.map(service => {
        const isActive = isServiceActive(service);
        const statusClass = isActive ? 'active' : 'inactive';
        const statusText = isActive ? '활성' : '비활성';
        
        return `
            <tr>
                <td><span class="service-id">#${service.serviceId}</span></td>
                <td><span class="service-name">${service.name || '-'}</span></td>
                <td><span class="service-category">${formatCategory(service.tags)}</span></td>
                <td><span class="service-price">${formatPrice(service.price, service.currency)}</span></td>
                <td><span class="service-period">${formatPeriod(service.startDate, service.endDate)}</span></td>
                <td><span class="service-status ${statusClass}">${statusText}</span></td>
                <td><span class="service-date">${formatDate(service.createdAt)}</span></td>
            </tr>
        `;
    }).join('');
    
    console.log(`테이블 렌더링 완료: ${services.length}개 서비스`);
}

// ========================================
// 필터링
// ========================================
function filterServices(filterType) {
    console.log('필터 변경:', filterType);
    currentFilter = filterType;
    
    // 탭 활성화 상태 변경
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 필터링된 서비스
    let filteredServices = allServices;
    
    if (filterType === 'active') {
        filteredServices = allServices.filter(s => isServiceActive(s));
    } else if (filterType === 'inactive') {
        filteredServices = allServices.filter(s => !isServiceActive(s));
    }
    
    // 검색어가 있으면 추가 필터링
    const searchTerm = document.getElementById('serviceSearch').value;
    if (searchTerm) {
        filteredServices = filteredServices.filter(s => 
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.tags && s.tags.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }
    
    renderServiceTable(filteredServices);
}

// ========================================
// 검색
// ========================================
function searchServices() {
    const searchTerm = document.getElementById('serviceSearch').value.toLowerCase();
    console.log('검색어:', searchTerm);
    
    let filteredServices = allServices;
    
    // 현재 필터 적용
    if (currentFilter === 'active') {
        filteredServices = filteredServices.filter(s => isServiceActive(s));
    } else if (currentFilter === 'inactive') {
        filteredServices = filteredServices.filter(s => !isServiceActive(s));
    }
    
    // 검색어 필터링
    if (searchTerm) {
        filteredServices = filteredServices.filter(s => 
            (s.name && s.name.toLowerCase().includes(searchTerm)) ||
            (s.tags && s.tags.toLowerCase().includes(searchTerm)) ||
            (s.serviceId && s.serviceId.toString().includes(searchTerm))
        );
    }
    
    renderServiceTable(filteredServices);
}

// ========================================
// 유틸리티 함수
// ========================================

// 카테고리 포맷
function formatCategory(tags) {
    if (!tags) return '-';
    const tagArray = tags.split(',');
    return tagArray[0] || '-';
}

// 가격 포맷
function formatPrice(price, currency) {
    if (!price) return '-';
    const formatted = new Intl.NumberFormat('ko-KR').format(price);
    return `${formatted} ${currency || 'KRW'}`;
}

// 기간 포맷
function formatPeriod(startDate, endDate) {
    if (!startDate || !endDate) return '-';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const formatDate = (date) => {
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };
    
    return `${formatDate(start)} ~ ${formatDate(end)}`;
}

// 날짜 포맷
function formatDate(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

// ========================================
// 업체 승인 처리
// ========================================
function approveCompany(button) {
    const companyId = button.getAttribute('data-company-id');
    const companyName = button.getAttribute('data-company-name');
    
    console.log('===== 업체 승인 요청 =====');
    console.log('업체 ID:', companyId);
    console.log('업체명:', companyName);
    
    // 확인 대화상자
    if (!confirm(`${companyName} 업체를 승인하시겠습니까?\n\n승인 후에는 되돌릴 수 없습니다.`)) {
        console.log('승인 취소됨');
        return;
    }
    
    // 버튼 비활성화
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 승인 중...';
    
    // API 호출
    fetch(`/admin/api/companies/${companyId}/approve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('승인 응답:', data);
        
        if (data.success) {
            // 성공 메시지 표시
            showApprovalSuccess(companyName);
            
            // 페이지 새로고침 (승인된 업체는 PENDING 목록에서 사라짐)
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            
        } else {
            // 실패 메시지 표시
            showApprovalError(data.message || '승인에 실패했습니다.');
            
            // 버튼 복원
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-check"></i> 입점 승인';
        }
    })
    .catch(error => {
        console.error('승인 요청 오류:', error);
        showApprovalError('서버와의 통신 중 오류가 발생했습니다.');
        
        // 버튼 복원
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-check"></i> 입점 승인';
    });
}

// 승인 성공 메시지 표시
function showApprovalSuccess(companyName) {
    const alertElement = document.createElement('div');
    alertElement.className = 'approval-success-alert';
    alertElement.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-check-circle"></i>
            <div class="alert-text">
                <h4>승인 완료!</h4>
                <p>${companyName} 업체가 성공적으로 승인되었습니다.</p>
            </div>
        </div>
    `;
    
    // 스타일 적용
    alertElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4caf50, #45a049);
        color: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        z-index: 10000;
        animation: slideInRight 0.5s ease;
        max-width: 400px;
    `;
    
    // CSS 애니메이션 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .alert-content {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .alert-content i {
            font-size: 24px;
        }
        .alert-text h4 {
            margin: 0 0 5px 0;
            font-size: 16px;
            font-weight: 600;
        }
        .alert-text p {
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(alertElement);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        alertElement.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            if (alertElement.parentNode) {
                alertElement.remove();
            }
        }, 500);
    }, 3000);
    
    // 슬라이드아웃 애니메이션 추가
    const slideOutStyle = document.createElement('style');
    slideOutStyle.textContent = `
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(slideOutStyle);
}

// 승인 실패 메시지 표시
function showApprovalError(message) {
    const alertElement = document.createElement('div');
    alertElement.className = 'approval-error-alert';
    alertElement.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-exclamation-triangle"></i>
            <div class="alert-text">
                <h4>승인 실패</h4>
                <p>${message}</p>
            </div>
        </div>
    `;
    
    // 스타일 적용
    alertElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #f44336, #d32f2f);
        color: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(244, 67, 54, 0.3);
        z-index: 10000;
        animation: slideInRight 0.5s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(alertElement);
    
    // 5초 후 자동 제거
    setTimeout(() => {
        alertElement.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            if (alertElement.parentNode) {
                alertElement.remove();
            }
        }, 500);
    }, 5000);
}

console.log('admin_manage_company_detail.js 로드 완료');

// ========================================
// 예약내역 모달 관련
// ========================================
let currentReservationPage = 0;
let totalReservationPages = 1;

function openReservationModalFromSidebar() {
    console.log('===== 예약내역 모달 열기 =====');
    
    if (!selectedCompanyData || !selectedCompanyData.companyId) {
        showCustomAlert('먼저 업체를 선택해주세요.', 'warning');
        return;
    }
    
    currentCompanyId = selectedCompanyData.companyId;
    currentCompanyName = selectedCompanyData.companyName;
    currentReservationPage = 0;
    
    console.log('선택된 업체 ID:', currentCompanyId);
    console.log('선택된 업체명:', currentCompanyName);
    
    // 모달 열기
    const modal = document.getElementById('reservationModal');
    if (!modal) {
        console.error('예약내역 모달을 찾을 수 없습니다.');
        return;
    }
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // 업체명 미리 설정
    const companyNameElement = document.getElementById('reservationModalCompanyName');
    if (companyNameElement) {
        companyNameElement.textContent = currentCompanyName;
        console.log('업체명 미리 설정:', currentCompanyName);
    }
    
    // 로딩 상태 표시
    showReservationLoading();
    
    // 예약내역 로드
    loadReservations();
}

function closeReservationModal() {
    const modal = document.getElementById('reservationModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function showReservationLoading() {
    document.getElementById('reservationLoading').style.display = 'flex';
    document.getElementById('reservationListContainer').style.display = 'none';
}

function loadReservations() {
    if (!currentCompanyId) {
        console.error('업체 ID가 없습니다.');
        return;
    }
    
    console.log(`예약내역 로드: /admin/api/companies/${currentCompanyId}/reservations?page=${currentReservationPage}&size=10`);
    
    fetch(`/admin/api/companies/${currentCompanyId}/reservations?page=${currentReservationPage}&size=10`)
        .then(response => {
            console.log('응답 상태:', response.status);
            if (!response.ok) {
                throw new Error('서버 오류: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('받은 데이터:', data);
            if (data.success) {
                displayReservations(data);
            } else {
                showReservationError(data.message || '예약내역을 불러올 수 없습니다.');
            }
        })
        .catch(error => {
            console.error('예약내역 로드 오류:', error);
            showReservationError('예약내역을 불러오는 중 오류가 발생했습니다.');
        });
}

function displayReservations(data) {
    const loading = document.getElementById('reservationLoading');
    const content = document.getElementById('reservationListContainer');
    const noData = document.getElementById('noReservations');
    
    console.log('displayReservations 호출됨:', data);
    console.log('loading 요소:', loading);
    console.log('content 요소:', content);
    console.log('noData 요소:', noData);
    
    // 모든 상태를 먼저 숨김
    if (loading) loading.style.display = 'none';
    if (content) content.style.display = 'none';
    if (noData) noData.style.display = 'none';
    
    // 업체명 설정 (항상)
    const companyNameElement = document.getElementById('reservationModalCompanyName');
    if (companyNameElement) {
        const companyName = data.companyName || currentCompanyName || '업체명';
        companyNameElement.textContent = companyName;
        console.log('업체명 설정:', companyName);
    }
    
    // 예약 데이터 확인
    const hasReservations = data.reservations && Array.isArray(data.reservations) && data.reservations.length > 0;
    console.log('예약 데이터 확인:', {
        reservations: data.reservations,
        isArray: Array.isArray(data.reservations),
        length: data.reservations ? data.reservations.length : 'undefined',
        hasReservations: hasReservations
    });
    
    if (hasReservations) {
        console.log('예약내역이 있습니다. 목록 표시');
        if (content) content.style.display = 'block';
        if (noData) noData.style.display = 'none';
        
        // 통계 업데이트
        const totalElement = document.getElementById('totalReservations');
        if (totalElement) {
            totalElement.textContent = data.totalElements || 0;
        }
        
        // 예약 목록 렌더링
        renderReservationTable(data.reservations);
        
        // 페이지네이션 업데이트
        updateReservationPagination(data);
    } else {
        console.log('예약내역이 없습니다. no-data 상태 표시');
        if (content) content.style.display = 'none';
        if (noData) {
            noData.style.display = 'flex';
            noData.innerHTML = `
                <i class="fas fa-calendar-times"></i>
                <p>예약된 내역이 없습니다.</p>
            `;
            console.log('noData 표시 완료, display:', noData.style.display);
        } else {
            console.error('noData 요소를 찾을 수 없습니다!');
        }
    }
}

function renderReservationTable(reservations) {
    const tbody = document.getElementById('reservationTableBody');
    
    const rows = reservations.map(reservation => {
        const statusClass = getReservationStatusClass(reservation.status);
        const statusText = getReservationStatusText(reservation.status);
        const dateTime = formatReservationDateTime(reservation.date, reservation.startTime);
        
        return `
            <tr>
                <td>${reservation.id || '-'}</td>
                <td>${reservation.customerName || '고객명 없음'}</td>
                <td>${reservation.customerContact || '연락처 없음'}</td>
                <td>${dateTime}</td>
                <td>${reservation.title || '서비스명 없음'}</td>
                <td>${reservation.totalAmount ? formatReservationAmount(reservation.totalAmount) + '원' : '-'}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            </tr>
        `;
    }).join('');
    
    tbody.innerHTML = rows;
}

function updateReservationPagination(data) {
    totalReservationPages = data.totalPages || 1;
    const pagination = document.getElementById('reservationPagination');
    const pageInfo = document.getElementById('reservationPageInfo');
    const prevBtn = document.getElementById('prevReservationBtn');
    const nextBtn = document.getElementById('nextReservationBtn');
    
    if (totalReservationPages > 1) {
        pagination.style.display = 'flex';
        pageInfo.textContent = `페이지 ${data.currentPage + 1} / ${totalReservationPages}`;
        
        prevBtn.disabled = currentReservationPage === 0;
        nextBtn.disabled = currentReservationPage >= totalReservationPages - 1;
    } else {
        pagination.style.display = 'none';
    }
}

function loadReservationsPage(direction) {
    const newPage = currentReservationPage + direction;
    if (newPage >= 0 && newPage < totalReservationPages) {
        currentReservationPage = newPage;
        showReservationLoading();
        loadReservations();
    }
}

function showReservationError(message) {
    const loading = document.getElementById('reservationLoading');
    const content = document.getElementById('reservationListContainer');
    const noData = document.getElementById('noReservations');
    
    console.log('showReservationError 호출됨:', message);
    console.log('loading 요소:', loading);
    console.log('content 요소:', content);
    console.log('noData 요소:', noData);
    
    // 모든 상태 숨김
    if (loading) loading.style.display = 'none';
    if (content) content.style.display = 'none';
    
    if (noData) {
        noData.style.display = 'flex';
        noData.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        `;
        console.log('오류 메시지 표시 완료, display:', noData.style.display);
    } else {
        console.error('noData 요소를 찾을 수 없습니다!');
    }
}

function getReservationStatusClass(status) {
    switch(status) {
        case 'CONFIRMED': return 'status-confirmed';
        case 'CANCELLED': return 'status-cancelled';
        case 'COMPLETED': return 'status-completed';
        case 'PENDING': return 'status-pending';
        default: return 'status-pending';
    }
}

function getReservationStatusText(status) {
    switch(status) {
        case 'CONFIRMED': return '확정';
        case 'CANCELLED': return '취소';
        case 'COMPLETED': return '완료';
        case 'PENDING': return '대기';
        default: return '알 수 없음';
    }
}

function formatReservationDateTime(date, time) {
    if (!date) return '-';
    const dateStr = new Date(date).toLocaleDateString('ko-KR');
    const timeStr = time ? time.substring(0, 5) : '';
    return `${dateStr} ${timeStr}`;
}

function formatReservationAmount(amount) {
    return new Intl.NumberFormat('ko-KR').format(amount);
}

