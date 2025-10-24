// 배너 슬라이더 기능
let currentSlide = 0;
const slides = document.querySelectorAll('.banner-slide');
const indicators = document.querySelectorAll('.banner-indicator');

function showSlide(index) {
    // 모든 슬라이드 숨기기
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // 현재 슬라이드 보이기
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// 인디케이터 클릭 이벤트
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// 자동 슬라이드 (5초마다)
setInterval(nextSlide, 5000);

// 패키지 스크롤 기능
function scrollPackages(containerId, direction) {
    const container = document.getElementById(containerId);
    const scrollAmount = 300;
    
    if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
    } else {
        container.scrollLeft += scrollAmount;
    }
}

// 플래너 모달 기능
function showPlannerModal(plannerId) {
    const modal = document.getElementById('plannerModal');
    const companyImage = document.getElementById('companyImage');
    const plannerProfileImage = document.getElementById('plannerProfileImage');
    const plannerCompanyInfo = document.getElementById('plannerCompanyInfo');
    const plannerNameInfo = document.getElementById('plannerNameInfo');
    
    // 플래너 데이터 (실제로는 서버에서 가져와야 함)
    const plannerData = {
        'kimhyuna': {
            companyImage: '/resources/images/맘랑핑로고.png',
            profileImage: '/resources/images/김현아.png',
            company: '맘랑핑',
            name: '김현아'
        },
        'kangyukyung': {
            companyImage: '/resources/images/맘랑핑로고.png',
            profileImage: '/resources/images/강유경.png',
            company: '맘랑핑',
            name: '강유경'
        },
        'kimhaemin': {
            companyImage: '/resources/images/맘랑핑로고.png',
            profileImage: '/resources/images/김해민.png',
            company: '맘랑핑',
            name: '김해민'
        },
        'jungminseo': {
            companyImage: '/resources/images/맘랑핑로고.png',
            profileImage: '/resources/images/정민서.png',
            company: '맘랑핑',
            name: '정민서'
        }
    };
    
    const planner = plannerData[plannerId];
    if (planner) {
        companyImage.src = planner.companyImage;
        plannerProfileImage.src = planner.profileImage;
        plannerCompanyInfo.textContent = planner.company;
        plannerNameInfo.textContent = planner.name;
    }
    
    modal.style.display = 'block';
    modal.classList.add('show');
}

function closePlannerModal() {
    const modal = document.getElementById('plannerModal');
    modal.style.display = 'none';
    modal.classList.remove('show');
}

function showPlannerInfo() {
    const companyImageScreen = document.getElementById('companyImageScreen');
    const plannerInfoScreen = document.getElementById('plannerInfoScreen');
    
    companyImageScreen.style.display = 'none';
    plannerInfoScreen.style.display = 'block';
}

// 패키지 모달 기능
function showPackageModal(packageName) {
    const modal = document.getElementById('packageModal');
    const title = document.getElementById('packageModalTitle');
    
    title.textContent = packageName;
    modal.style.display = 'block';
    modal.classList.add('show');
}

function closePackageModal() {
    const modal = document.getElementById('packageModal');
    modal.style.display = 'none';
    modal.classList.remove('show');
}

// 패키지 버튼 클릭 이벤트
document.addEventListener('DOMContentLoaded', function() {
    const packageButtons = document.querySelectorAll('.package-button');
    packageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const packageTitle = this.closest('.package-card').querySelector('.package-title').textContent;
            showPackageModal(packageTitle);
        });
    });
    
    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', function(event) {
        const plannerModal = document.getElementById('plannerModal');
        const packageModal = document.getElementById('packageModal');
        
        if (event.target === plannerModal) {
            closePlannerModal();
        }
        if (event.target === packageModal) {
            closePackageModal();
        }
    });
});

// 서비스 카테고리 필터링 기능
function filterServices(category) {
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// 타일 카드 클릭 이벤트
document.addEventListener('DOMContentLoaded', function() {
    const tileCards = document.querySelectorAll('.tile-card');
    tileCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            filterServices(category);
        });
    });
});
