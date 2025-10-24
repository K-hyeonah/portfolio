// Company Report Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeReportPage();
    setupEventListeners();
    initializeCharts();
});

/**
 * 리포트 페이지 초기화
 */
function initializeReportPage() {
    console.log('Company Report Page initialized');
    
    // 현재 페이지 활성화
    highlightCurrentPage();
    
    // 데이터 로딩 상태 표시
    showLoadingStates();
    
    // 애니메이션 효과 적용
    applyAnimations();
}

/**
 * 현재 페이지 하이라이트
 */
function highlightCurrentPage() {
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    sidebarLinks.forEach(link => {
        if (link.textContent.includes('리포트 & 통계')) {
            link.classList.add('active');
        }
    });
}

/**
 * 이벤트 리스너 설정
 */
function setupEventListeners() {
    // 리포트 카드 클릭 이벤트
    setupReportCardClicks();
    
    // 차트 인터랙션 이벤트
    setupChartInteractions();
    
    // 반응형 처리
    setupResponsiveHandlers();
}

/**
 * 리포트 카드 클릭 이벤트 설정
 */
function setupReportCardClicks() {
    const reportCards = document.querySelectorAll('.report-card');
    
    reportCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            handleReportCardClick(title);
        });
        
        // 호버 효과
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * 리포트 카드 클릭 처리
 */
function handleReportCardClick(title) {
    console.log(`Report card clicked: ${title}`);
    
    // 클릭 효과
    showClickFeedback(title);
    
    // 실제 구현에서는 해당 리포트 상세 페이지로 이동하거나 모달 표시
    switch(title) {
        case '서비스별 예약률':
            openServiceReservationReport();
            break;
        case '서비스별 매출 분석':
            openSalesAnalysisReport();
            break;
        case '월별 방문자 수':
            openMonthlyVisitorReport();
            break;
        case '환자 국가 분포':
            openCountryDistributionReport();
            break;
        default:
            console.log('Unknown report type');
    }
}

/**
 * 클릭 피드백 표시
 */
function showClickFeedback(title) {
    // 간단한 토스트 메시지 표시
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = `${title} 리포트를 불러오는 중...`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #3B82F6;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // 애니메이션
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // 3초 후 제거
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

/**
 * 각 리포트 타입별 처리 함수들
 */
function openServiceReservationReport() {
    // 서비스별 예약률 리포트 열기
    window.location.href = '/company/report/service-reservation';
}

function openSalesAnalysisReport() {
    // 서비스별 매출 분석 리포트 열기
    window.location.href = '/company/report/sales-analysis';
}

function openMonthlyVisitorReport() {
    // 월별 방문자 수 리포트 열기
    window.location.href = '/company/report/monthly-visitors';
}

function openCountryDistributionReport() {
    // 환자 국가 분포 리포트 열기
    window.location.href = '/company/report/country-distribution';
}

/**
 * 차트 인터랙션 설정
 */
function setupChartInteractions() {
    const chartCanvas = document.getElementById('salesChart');
    if (chartCanvas) {
        // 차트 클릭 이벤트 (실제 Chart.js 인스턴스가 필요)
        chartCanvas.addEventListener('click', function(event) {
            console.log('Chart clicked');
            // 차트 데이터 포인트 클릭 처리
            handleChartClick(event);
        });
    }
}

/**
 * 차트 클릭 처리
 */
function handleChartClick(event) {
    // 차트 데이터 포인트 상세 정보 표시
    console.log('Chart point clicked');
}

/**
 * 차트 초기화
 */
function initializeCharts() {
    // Chart.js가 로드된 후 실행
    if (typeof Chart !== 'undefined') {
        console.log('Charts initialized');
    } else {
        console.warn('Chart.js not loaded');
    }
}

/**
 * 로딩 상태 표시
 */
function showLoadingStates() {
    const indicators = document.querySelectorAll('.indicator-value .value');
    
    indicators.forEach(indicator => {
        const originalText = indicator.textContent;
        indicator.textContent = '...';
        
        // 시뮬레이션된 로딩
        setTimeout(() => {
            indicator.textContent = originalText;
        }, 500);
    });
}

/**
 * 애니메이션 효과 적용
 */
function applyAnimations() {
    // 카드들이 순차적으로 나타나는 효과
    const cards = document.querySelectorAll('.report-card, .sales-report-card, .key-indicators-card, .recent-activity-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * 반응형 처리 설정
 */
function setupResponsiveHandlers() {
    let resizeTimeout;
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });
}

/**
 * 리사이즈 처리
 */
function handleResize() {
    const width = window.innerWidth;
    
    // 모바일 뷰 처리
    if (width <= 768) {
        handleMobileView();
    } else {
        handleDesktopView();
    }
    
    // 차트 리사이즈 (Chart.js 인스턴스가 있는 경우)
    resizeCharts();
}

/**
 * 모바일 뷰 처리
 */
function handleMobileView() {
    console.log('Mobile view activated');
    
    // 모바일에서 차트 높이 조정
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) {
        chartContainer.style.height = '250px';
    }
}

/**
 * 데스크톱 뷰 처리
 */
function handleDesktopView() {
    console.log('Desktop view activated');
    
    // 데스크톱에서 차트 높이 복원
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) {
        chartContainer.style.height = '300px';
    }
}

/**
 * 차트 리사이즈
 */
function resizeCharts() {
    // Chart.js 인스턴스가 있다면 리사이즈
    if (window.salesChart && typeof window.salesChart.resize === 'function') {
        window.salesChart.resize();
    }
}

/**
 * 데이터 새로고침
 */
function refreshData() {
    console.log('Refreshing report data...');
    
    // 로딩 스피너 표시
    showLoadingSpinner();
    
    // 실제 구현에서는 AJAX 요청으로 데이터 새로고침
    setTimeout(() => {
        hideLoadingSpinner();
        console.log('Data refreshed');
    }, 1000);
}

/**
 * 로딩 스피너 표시
 */
function showLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.id = 'loading-spinner';
    spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    spinner.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.9);
        padding: 20px;
        border-radius: 50%;
        z-index: 1000;
        font-size: 24px;
        color: #3B82F6;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(spinner);
}

/**
 * 로딩 스피너 숨기기
 */
function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

/**
 * 유틸리티 함수들
 */

// 숫자 포맷팅
function formatNumber(num) {
    return new Intl.NumberFormat('ko-KR').format(num);
}

// 날짜 포맷팅
function formatDate(date) {
    return new Intl.DateTimeFormat('ko-KR').format(new Date(date));
}

// 퍼센트 포맷팅
function formatPercentage(num) {
    return `${num.toFixed(1)}%`;
}

// 색상 유틸리티
const colors = {
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#8B5CF6'
};

// 내보내기
window.CompanyReport = {
    refreshData,
    formatNumber,
    formatDate,
    formatPercentage,
    colors
};
