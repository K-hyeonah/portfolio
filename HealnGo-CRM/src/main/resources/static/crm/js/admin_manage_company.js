// 업체 관리 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    setupSearchFunctionality();
    setupFilterTabs();
    setupCompanySelection();
});

// 페이지 초기화
function initializePage() {
    console.log('업체 관리 페이지 초기화');
    
    // 첫 번째 업체를 기본 선택으로 설정 (null 체크 추가)
    const firstCompany = document.querySelector('.company-item');
    if (firstCompany) {
        selectCompany(firstCompany);
    } else {
        console.log('업체 데이터가 없습니다.');
    }
    
    // 로딩 애니메이션
    showLoadingAnimation();
    setTimeout(hideLoadingAnimation, 500);
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 헤더 검색
    const headerSearch = document.querySelector('.header-left .search-bar input');
    if (headerSearch) {
        headerSearch.addEventListener('input', function(e) {
            handleHeaderSearch(e.target.value);
        });
    }
    
    // 업체 검색
    const companySearch = document.querySelector('.company-search');
    if (companySearch) {
        companySearch.addEventListener('input', function(e) {
            handleCompanySearch(e.target.value);
        });
    }
    
    // 검색 버튼
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchValue = document.querySelector('.company-search').value;
            handleCompanySearch(searchValue);
        });
    }
    
    // 알림 아이콘
    const notificationIcon = document.querySelector('.notification-icon');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', function() {
            showNotifications();
        });
    }
    
    // 사용자 드롭다운
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        userInfo.addEventListener('click', function() {
            toggleUserDropdown();
        });
    }
    
    // 로그아웃 버튼
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            handleLogout();
        });
    }
    
    // 액션 버튼들
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleActionButton(this.textContent);
        });
    });
    
    // View all 링크
    const viewAllLink = document.querySelector('.view-all-link');
    if (viewAllLink) {
        viewAllLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleViewAll();
        });
    }
    
    // View more 링크
    const viewMoreLink = document.querySelector('.view-more a');
    if (viewMoreLink) {
        viewMoreLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleViewMore();
        });
    }
}

// 검색 기능 설정
function setupSearchFunctionality() {
    // 실시간 검색을 위한 디바운싱
    let searchTimeout;
    
    function debounceSearch(func, delay) {
        return function(...args) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    // 업체 검색 디바운싱
    const debouncedCompanySearch = debounceSearch(handleCompanySearch, 300);
    const companySearchInput = document.querySelector('.company-search');
    if (companySearchInput) {
        companySearchInput.addEventListener('input', function(e) {
            debouncedCompanySearch(e.target.value);
        });
    }
}

// 필터 탭 설정
function setupFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 모든 탭에서 active 클래스 제거
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // 클릭된 탭에 active 클래스 추가
            this.classList.add('active');
            
            // 필터 적용
            const filterType = this.textContent.trim();
            applyFilter(filterType);
        });
    });
}

// 업체 선택 기능 설정
function setupCompanySelection() {
    const companyItems = document.querySelectorAll('.company-item');
    
    companyItems.forEach(item => {
        item.addEventListener('click', function() {
            selectCompany(this);
        });
        
        // 호버 효과
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        });
    });
}

// 헤더 검색 처리
function handleHeaderSearch(searchValue) {
    console.log('헤더 검색:', searchValue);
    // 전역 검색 기능 구현
    if (searchValue.length > 2) {
        showSearchSuggestions(searchValue);
    } else {
        hideSearchSuggestions();
    }
}

// 업체 검색 처리
function handleCompanySearch(searchValue) {
    console.log('업체 검색:', searchValue);
    
    const companyItems = document.querySelectorAll('.company-item');
    let visibleCount = 0;
    
    companyItems.forEach(item => {
        const companyName = item.querySelector('.company-name').textContent.toLowerCase();
        const companyId = item.querySelector('.company-id').textContent.toLowerCase();
        const searchTerm = searchValue.toLowerCase();
        
        if (companyName.includes(searchTerm) || companyId.includes(searchTerm)) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    // 검색 결과 표시
    showSearchResults(visibleCount, searchValue);
}

// 필터 적용
function applyFilter(filterType) {
    console.log('필터 적용:', filterType);
    
    const companyItems = document.querySelectorAll('.company-item');
    let visibleCount = 0;
    
    companyItems.forEach(item => {
        const statusElement = item.querySelector('.company-status');
        const status = statusElement.textContent.trim();
        
        let shouldShow = false;
        
        switch (filterType) {
            case '전체':
                shouldShow = true;
                break;
            case '정상':
                shouldShow = status === '정상';
                break;
            case '신고 접수':
                shouldShow = status === '신고 접수';
                break;
            case '제재중':
                shouldShow = status === '제재중';
                break;
            case '휴면':
                shouldShow = status === '휴면';
                break;
        }
        
        if (shouldShow) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    // 필터 결과 표시
    showFilterResults(visibleCount, filterType);
}

// 업체 선택
function selectCompany(companyElement) {
    // 모든 업체에서 selected 클래스 제거
    document.querySelectorAll('.company-item').forEach(item => {
        item.classList.remove('selected');
        item.style.backgroundColor = '#f8f9fa';
    });
    
    // 선택된 업체에 selected 클래스 추가
    companyElement.classList.add('selected');
    companyElement.style.backgroundColor = '#e3f2fd';
    
    // 사이드바 업데이트
    updateCompanyDetails(companyElement);
    
    console.log('업체 선택됨:', companyElement.querySelector('.company-name').textContent);
}

// 업체 상세 정보 업데이트
function updateCompanyDetails(companyElement) {
    const companyId = companyElement.querySelector('.company-id').textContent;
    const companyName = companyElement.querySelector('.company-name').textContent;
    const status = companyElement.querySelector('.company-status').textContent.trim();
    
    // 사이드바의 업체 정보 업데이트
    const sidebarCompanyId = document.querySelector('.company-basic-info .company-id');
    const sidebarCompanyName = document.querySelector('.company-basic-info .company-name');
    const sidebarStatus = document.querySelector('.detail-value.status-normal');
    
    if (sidebarCompanyId) sidebarCompanyId.textContent = companyId;
    if (sidebarCompanyName) sidebarCompanyName.textContent = companyName;
    if (sidebarStatus) {
        sidebarStatus.textContent = status;
        sidebarStatus.className = 'detail-value ' + getStatusClass(status);
    }
    
    // 애니메이션 효과
    const sidebarSection = document.querySelector('.sidebar-section');
    sidebarSection.style.opacity = '0.7';
    setTimeout(() => {
        sidebarSection.style.opacity = '1';
    }, 200);
}

// 상태에 따른 CSS 클래스 반환
function getStatusClass(status) {
    switch (status) {
        case '정상':
            return 'status-normal';
        case '신고 접수':
            return 'status-report';
        case '제재중':
            return 'status-sanction';
        case '휴면':
            return 'status-dormant';
        default:
            return 'status-normal';
    }
}

// 액션 버튼 처리
function handleActionButton(action) {
    console.log('액션 버튼 클릭:', action);
    
    const selectedCompany = document.querySelector('.company-item.selected');
    if (!selectedCompany) {
        showAlert('업체를 선택해주세요.', 'warning');
        return;
    }
    
    const companyName = selectedCompany.querySelector('.company-name').textContent;
    
    switch (action) {
        case '상품 목록':
            showProductList(companyName);
            break;
        case '상세 페이지':
            showCompanyDetails(companyName);
            break;
    }
}

// 상품 목록 표시
function showProductList(companyName) {
    showAlert(`${companyName}의 상품 목록을 불러오는 중...`, 'info');
    // 실제 구현에서는 모달이나 새 페이지로 이동
}

// 업체 상세 페이지 표시
function showCompanyDetails(companyName) {
    showAlert(`${companyName}의 상세 페이지로 이동합니다.`, 'info');
    // 실제 구현에서는 새 페이지로 이동
}

// View all 처리
function handleViewAll() {
    console.log('모든 업체 보기');
    // 모든 필터 제거하고 전체 목록 표시
    document.querySelector('.filter-tab.active').classList.remove('active');
    document.querySelector('.filter-tab').classList.add('active');
    applyFilter('전체');
}

// View more 처리
function handleViewMore() {
    console.log('더 많은 문의/신고 보기');
    showAlert('더 많은 문의/신고 목록을 불러오는 중...', 'info');
}

// 알림 표시
function showNotifications() {
    console.log('알림 표시');
    showAlert('새로운 알림이 없습니다.', 'info');
}

// 사용자 드롭다운 토글
function toggleUserDropdown() {
    console.log('사용자 드롭다운 토글');
    // 드롭다운 메뉴 구현
}

// 로그아웃 처리
function handleLogout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        console.log('로그아웃');
        showAlert('로그아웃 중...', 'info');
        // 실제 구현에서는 로그아웃 API 호출
        setTimeout(() => {
            window.location.href = '/login';
        }, 1000);
    }
}

// 검색 결과 표시
function showSearchResults(count, searchTerm) {
    if (searchTerm.length > 0) {
        showAlert(`${count}개의 업체를 찾았습니다.`, 'info');
    }
}

// 필터 결과 표시
function showFilterResults(count, filterType) {
    showAlert(`${filterType} 필터: ${count}개의 업체가 표시됩니다.`, 'info');
}

// 검색 제안 표시
function showSearchSuggestions(searchTerm) {
    // 검색 제안 기능 구현
    console.log('검색 제안:', searchTerm);
}

// 검색 제안 숨기기
function hideSearchSuggestions() {
    // 검색 제안 숨기기
    console.log('검색 제안 숨김');
}

// 로딩 애니메이션 표시
function showLoadingAnimation() {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading-overlay';
    loadingElement.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>데이터를 불러오는 중...</p>
        </div>
    `;
    loadingElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    const spinnerStyle = `
        .loading-spinner {
            text-align: center;
        }
        .loading-spinner i {
            font-size: 48px;
            color: #007bff;
            margin-bottom: 20px;
        }
        .loading-spinner p {
            font-size: 16px;
            color: #6c757d;
            margin: 0;
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = spinnerStyle;
    document.head.appendChild(styleElement);
    document.body.appendChild(loadingElement);
}

// 로딩 애니메이션 숨기기
function hideLoadingAnimation() {
    const loadingElement = document.getElementById('loading-overlay');
    if (loadingElement) {
        loadingElement.remove();
    }
}

// 알림 표시 함수
function showAlert(message, type = 'info') {
    // 기존 알림 제거
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alertElement = document.createElement('div');
    alertElement.className = `custom-alert alert-${type}`;
    alertElement.textContent = message;
    
    const alertStyle = `
        .custom-alert {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        }
        .alert-info { background: #007bff; }
        .alert-success { background: #28a745; }
        .alert-warning { background: #ffc107; color: #212529; }
        .alert-danger { background: #dc3545; }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = alertStyle;
    document.head.appendChild(styleElement);
    document.body.appendChild(alertElement);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        alertElement.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (alertElement.parentNode) {
                alertElement.remove();
            }
        }, 300);
    }, 3000);
    
    // 슬라이드아웃 애니메이션 추가
    const slideOutStyle = document.createElement('style');
    slideOutStyle.textContent = `
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(slideOutStyle);
}

// 키보드 단축키
document.addEventListener('keydown', function(e) {
    // Ctrl + F: 검색 포커스
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('.company-search');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape: 검색 초기화
    if (e.key === 'Escape') {
        const searchInput = document.querySelector('.company-search');
        if (searchInput) {
            searchInput.value = '';
            handleCompanySearch('');
        }
    }
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', function() {
    // 정리 작업
    console.log('페이지 언로드 - 정리 작업');
});
