// 배너 슬라이더 변수
let currentSlide = 0;
let slideInterval;

// 배너 슬라이더 함수
function initBannerSlider() {
    const slides = document.querySelectorAll('.banner-slide');
    const indicators = document.querySelectorAll('.banner-indicator');

    function showSlide(index) {
        // 모든 슬라이드 비활성화
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // 현재 슬라이드 활성화
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // 인디케이터 클릭 이벤트
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentSlide = index;
            showSlide(currentSlide);
            resetInterval();
        });
    });

    // 자동 슬라이드 시작
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 3000); // 3초마다 전환
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    // 자동 슬라이드 시작
    startAutoSlide();

    // 마우스 호버 시 자동 슬라이드 일시정지
    const slider = document.querySelector('.banner-slider');
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', startAutoSlide);
}

// 패키지 스크롤 함수
function scrollPackages(containerId, direction) {
    const container = document.getElementById(containerId);
    const scrollAmount = 300; // 한 번에 스크롤할 픽셀 수

    if (direction === 'left') {
        container.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    } else if (direction === 'right') {
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }

    // 스크롤 버튼 상태 업데이트
    updateScrollButtons(containerId);
}

// 스크롤 버튼 상태 업데이트 함수
function updateScrollButtons(containerId) {
    const container = document.getElementById(containerId);
    const scrollContainer = container.parentElement;
    const prevButton = scrollContainer.querySelector('.scroll-button.prev');
    const nextButton = scrollContainer.querySelector('.scroll-button.next');

    // 왼쪽 스크롤 버튼 상태
    if (container.scrollLeft <= 0) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }

    // 오른쪽 스크롤 버튼 상태
    if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing tourism page...');
    
    // 모달 요소들 확인
    const plannerModal = document.getElementById('plannerModal');
    const packageModal = document.getElementById('packageModal');
    
    if (!plannerModal) {
        console.error('Planner modal not found!');
    } else {
        console.log('Planner modal found');
    }
    
    if (!packageModal) {
        console.error('Package modal not found!');
    } else {
        console.log('Package modal found');
    }
    
    // 배너 슬라이더 초기화
    initBannerSlider();

    // 패키지 상세보기 버튼 클릭 시 모달 오픈 (새 디자인)
    const detailButtons = document.querySelectorAll('.package-button');
    console.log('Found package buttons:', detailButtons.length);
    
    detailButtons.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            console.log('Package button clicked:', index);
            e.stopPropagation();
            const card = this.closest('.package-card');
            const titleEl = card.querySelector('.package-title');
            const descEl = card.querySelector('.package-description');
            const packageName = titleEl ? titleEl.textContent.trim() : '패키지';
            const description = descEl ? descEl.textContent.trim() : '';
            const categories = Array.from(card.querySelectorAll('.feature-tag')).map(el => el.textContent.trim());
            console.log('Package data:', { packageName, categories, description });
            showPackageModal(packageName, categories, description);
        });
    });

    // 플래너 카드 클릭 이벤트는 onclick 속성으로 처리됨
    const plannerCards = document.querySelectorAll('.planner-card');
    console.log('Found planner cards:', plannerCards.length);

    // 초기 스크롤 버튼 상태 설정
    updateScrollButtons('popular-packages');
    updateScrollButtons('new-packages');

    // 스크롤 이벤트 리스너 추가
    const popularContainer = document.getElementById('popular-packages');
    const newContainer = document.getElementById('new-packages');

    popularContainer.addEventListener('scroll', function() {
        updateScrollButtons('popular-packages');
    });

    newContainer.addEventListener('scroll', function() {
        updateScrollButtons('new-packages');
    });
});

// 플래너 모달 관련 함수들
function showPlannerModal(plannerId) {
    console.log('showPlannerModal called with:', plannerId);
    const modal = document.getElementById('plannerModal');
    const companyImage = document.getElementById('companyImage');
    const plannerProfileImage = document.getElementById('plannerProfileImage');
    const plannerCompanyInfo = document.getElementById('plannerCompanyInfo');
    const plannerNameInfo = document.getElementById('plannerNameInfo');
    
    console.log('Modal elements:', { modal, companyImage, plannerProfileImage, plannerCompanyInfo, plannerNameInfo });
    
    if (!modal) {
        console.error('Planner modal not found!');
        return;
    }

    // 플래너별 데이터 설정
    const plannerData = {
        kimhyuna: {
            companyImage: '/resources/images/현아현아업체.jpg',
            profileImage: '/resources/images/김현아.png',
            company: '(주)현아현아업체',
            name: '김현아 플래너',
            phone: '010-1111-1111',
            email: 'hyunahyuna@gmail.com',
            website: 'www.hyunahyuna.co.kr'
        },
        kangyukyung: {
            companyImage: '/resources/images/yoyo업체.jpg',
            profileImage: '/resources/images/강유경.png',
            company: '(주)YOYO업체',
            name: '강유경 플래너',
            phone: '010-2222-2222',
            email: 'yoyo@gmail.com',
            website: 'www.yoyo.co.kr'
        },
        kimhaemin: {
            companyImage: '/resources/images/해민스업체.jpg',
            profileImage: '/resources/images/김해민.png',
            company: '(주)해민스업체',
            name: '김해민 플래너',
            phone: '010-3333-3333',
            email: 'haemins@gmail.com',
            website: 'www.haemins.co.kr'
        },
        jungminseo: {
            companyImage: '/resources/images/말랑핑업체.jpg',
            profileImage: '/resources/images/정민서.png',
            company: '(주)말랑핑업체',
            name: '정민서 플래너',
            phone: '010-1234-1234',
            email: 'mallangping33@gmail.com',
            website: 'www.mallangping.co.kr'
        }
    };

    const data = plannerData[plannerId];

    // 첫 번째 화면 설정 (업체 이미지)
    companyImage.src = data.companyImage;
    companyImage.alt = data.company;

    // 두 번째 화면 데이터 미리 설정
    plannerProfileImage.src = data.profileImage;
    plannerProfileImage.alt = data.name;
    plannerCompanyInfo.textContent = data.company;
    plannerNameInfo.textContent = data.name;

    // 연락처 정보 설정
    document.getElementById('plannerPhone').textContent = data.phone;
    document.getElementById('plannerEmail').textContent = data.email;
    document.getElementById('plannerWebsite').textContent = data.website;

    // 모달 표시 (페이드인)
    console.log('Showing planner modal...');
    modal.style.display = 'block';
    modal.style.opacity = '0';
    
    // 강제로 리플로우 발생
    modal.offsetHeight;
    
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        modal.classList.add('show');
        console.log('Modal should be visible now');
    });

    // 첫 번째 화면만 표시
    document.getElementById('companyImageScreen').style.display = 'block';
    document.getElementById('plannerInfoScreen').style.display = 'none';
}

function showPlannerInfo() {
    // 두 번째 화면으로 전환
    document.getElementById('companyImageScreen').style.display = 'none';
    document.getElementById('plannerInfoScreen').style.display = 'block';
}

function closePlannerModal() {
    console.log('Closing planner modal...');
    const modal = document.getElementById('plannerModal');
    if (modal) {
        modal.style.opacity = '0';
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            console.log('Planner modal hidden');
        }, 300);
    }
}
// ====== 패키지 서비스 데이터(전역) ======
const serviceData = {
  waxing: [
    { title: getMessage('service.waxing.leg5.title'), description: getMessage('service.waxing.leg5.description') },
    { title: getMessage('service.waxing.thigh5.title'), description: getMessage('service.waxing.thigh5.description') }
  ],
  plasticsurgery: [
    { title: getMessage('service.plasticsurgery.signature.color.title'), description: getMessage('service.plasticsurgery.signature.color.description') },
    { title: getMessage('service.plasticsurgery.signature.pore.title'), description: getMessage('service.plasticsurgery.signature.pore.description') }
  ],
  dermatology: [
    { title: getMessage('service.dermatology.cryocell.title'), description: getMessage('service.dermatology.cryocell.description') },
    { title: getMessage('service.dermatology.dualtone.title'), description: getMessage('service.dermatology.dualtone.description') }
  ],
  dental: [
    { title: getMessage('service.dental.scaling.title'), description: getMessage('service.dental.scaling.description') },
    { title: getMessage('service.dental.whitening.title'), description: getMessage('service.dental.whitening.description') }
  ],
  pharmacy: [
    { title: getMessage('service.pharmacy.travel.title'), description: getMessage('service.pharmacy.travel.description') },
    { title: getMessage('service.pharmacy.skin.title'), description: getMessage('service.pharmacy.skin.description') }
  ],
  massage: [
    { title: getMessage('service.massage.aroma.title'), description: getMessage('service.massage.aroma.description') },
    { title: getMessage('service.massage.foot.title'), description: getMessage('service.massage.foot.description') }
  ],
  oriental: [
    { title: getMessage('service.oriental.diet.title'), description: getMessage('service.oriental.diet.description') },
    { title: getMessage('service.oriental.shape.title'), description: getMessage('service.oriental.shape.description') }
  ],
  orientalHospital: [
    { title: getMessage('service.orientalHospital.pain.title'), description: getMessage('service.orientalHospital.pain.description') },
    { title: getMessage('service.orientalHospital.rehab.title'), description: getMessage('service.orientalHospital.rehab.description') }
  ]
};

// 카테고리 매핑/표시/이미지
const CATEGORY_ALIAS = {
  '왁싱샵': 'waxing',
  '피부과': 'dermatology',
  '성형외과': 'plasticsurgery',
  '치과': 'dental',
  '약국': 'pharmacy',
  '마사지샵': 'massage',
  '한의원': 'oriental',
  '한방병원': 'orientalHospital'
};

const CATEGORY_DISPLAY = {
  waxing: getMessage('package.modal.category.waxing'),
  dermatology: getMessage('package.modal.category.dermatology'),
  plasticsurgery: getMessage('package.modal.category.plasticsurgery'),
  dental: getMessage('package.modal.category.dental'),
  pharmacy: getMessage('package.modal.category.pharmacy'),
  massage: getMessage('package.modal.category.massage'),
  oriental: getMessage('package.modal.category.oriental'),
  orientalHospital: getMessage('package.modal.category.orientalHospital')
};

const CATEGORY_IMAGE = {
  waxing: '/resources/images/packages/packagewaxing.png',
  dermatology: '/resources/images/packages/packageph.png',
  plasticsurgery: '/resources/images/packages/packageplastic.png',
  dental: '/resources/images/packages/packagedental.png',
  pharmacy: '/resources/images/packages/packagePharmacy.jpg',
  massage: '/resources/images/packages/packagesmilemassage.png',
  oriental: '/resources/images/packages/packageOriental.jpg',
  orientalHospital: '/resources/images/packages/packageOrientalHospital.jpg'
};

function buildCategoryTiles(keys){
  return keys.map(key => `
    <div class="tile-card" data-category="${key}">
      <img src="${CATEGORY_IMAGE[key] || '/resources/images/packages/packageph.png'}" alt="${CATEGORY_DISPLAY[key] || key}" class="tile-img">
      <div class="tile-caption">${CATEGORY_DISPLAY[key] || key}</div>
    </div>
  `).join('');
}

// 2) 유틸
function renderServices(category){
  const list = document.getElementById('serviceList');
  const items = serviceData[category] || [];
  console.log('Rendering services for category:', category, 'Items:', items); // 디버깅용
  list.innerHTML = items.map(it => `
    <div class="service-item">
      <div class="service-title">${it.title}</div>
      <div class="service-description">${it.description}</div>
    </div>
  `).join('');
}
function setActiveSegment(category){
  document.querySelectorAll('#packageSegment .segment-btn')
    .forEach(b => {
      if(b.dataset.category === category) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
}

// 모든 카테고리 서비스 일괄 렌더링
function renderAllServices(categoryKeys){
  const container = document.getElementById('serviceList');
  if(!container) return;

  // 기존 컨테이너에 그리드 클래스가 있으면 제거 (내부 섹션에서 그리드 적용)
  container.classList.remove('service-list');

  const html = categoryKeys.map(key => {
    const items = serviceData[key] || [];
    const listHtml = items.map(it => `
      <div class="service-item">
        <div class="service-title">${it.title}</div>
        <div class="service-description">${it.description}</div>
      </div>
    `).join('');
    return `
      <div class="service-category-group" id="cat-${key}">
        <div class="service-list">
          ${listHtml}
        </div>
      </div>
    `;
  }).join('');

  const columnsHtml = `
    <div class="service-columns">
      ${html}
    </div>
  `;
  container.innerHTML = columnsHtml;
}

// 3) showPackageModal (단일)
function showPackageModal(packageName, categories, description){
  console.log('showPackageModal called with:', packageName, categories, description);
  const modal = document.getElementById('packageModal');
  
  if (!modal) {
      console.error('Package modal not found!');
      return;
  }
  
  document.getElementById('packageModalTitle').textContent = packageName || '패키지';

  // feature-tag 텍스트를 내부 키로 매핑하고 중복 제거
  const mappedKeys = Array.from(new Set(
    (categories || [])
      .map(label => CATEGORY_ALIAS[label] || null)
      .filter(Boolean)
  ));

  // 인식된 카테고리가 없으면 기본값
  const keysToUse = mappedKeys.length ? mappedKeys : ['dermatology'];
  const isMany = keysToUse.length >= 4;

  // 타일 동적 렌더링 + 그리드 정렬 조정
  const grid = document.querySelector('#packageModal .package-image-grid');
  if (grid) {
    grid.innerHTML = buildCategoryTiles(keysToUse);

    // 카테고리가 4개 이상이면 4열 그리드로 고정해 줄 맞춤
    if (isMany) {
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(4, minmax(0, 1fr))';
      grid.style.gap = '12px';
      grid.style.alignItems = 'start';
    } else {
      // 원상 복구
      grid.style.display = '';
      grid.style.gridTemplateColumns = '';
      grid.style.gap = '';
      grid.style.alignItems = '';
    }

    // 타일 이미지 높이 통일로 카드 높이 균일화
    document.querySelectorAll('#packageModal .tile-card .tile-img').forEach(img => {
      if (isMany) {
        img.style.height = '90px';
        img.style.objectFit = 'cover';
        img.style.width = '100%';
        img.style.height = '100%';
      } else {
        img.style.height = '';
        img.style.objectFit = '';
        img.style.width = '';
        img.style.height = '';
      }
    });
  }

  // 모든 카테고리 서비스 한 번에 렌더링
  renderAllServices(keysToUse);

  // 서비스 리스트를 2열 그리드로 전환(카테고리 4개 이상 시)
  const columns = document.querySelector('#serviceList .service-columns');
  if (columns) {
    if (isMany) {
      columns.style.display = 'grid';
      columns.style.gridTemplateColumns = 'repeat(4, minmax(0, 1fr))';
      columns.style.gap = '16px';
      columns.style.alignItems = 'start';
    } else {
      columns.style.display = '';
      columns.style.gridTemplateColumns = '';
      columns.style.gap = '';
      columns.style.alignItems = '';
    }
  }

  // 타일 클릭 시 해당 카테고리 섹션으로 스크롤
  document.querySelectorAll('#packageModal .tile-card').forEach(tile=>{
    tile.onclick = () => {
      const c = tile.dataset.category;
      const section = document.getElementById(`cat-${c}`);
      if (section) {
        section.scrollIntoView({behavior:'smooth', block:'start'});
      } else {
        document.getElementById('serviceList')?.scrollIntoView({behavior:'smooth', block:'start'});
      }
    };
  });

  // 모달 폭 살짝 확장(가능할 경우) 및 상태 클래스 토글
  modal.classList.toggle('many-categories', isMany);
  const modalContent = modal.querySelector('.modal-content');
  if (modalContent) {
    if (isMany) {
      modalContent.style.maxWidth = '900px';
      modalContent.style.width = '90%';
    } else {
      modalContent.style.maxWidth = '';
      modalContent.style.width = '';
    }
  }

  // 모달 표시
  console.log('Showing package modal...');
  modal.style.display = 'block';
  modal.style.opacity = '0';
  
  // 강제로 리플로우 발생
  modal.offsetHeight;
  
  requestAnimationFrame(() => {
      modal.style.opacity = '1';
      modal.classList.add('show');
      console.log('Package modal should be visible now');
  });
}
// ====== 모달 닫기 ======
function closePackageModal(){
  console.log('Closing package modal...');
  const modal = document.getElementById('packageModal');
  if (modal) {
      modal.style.opacity = '0';
      modal.classList.remove('show');
      setTimeout(() => {
          modal.style.display = 'none';
          console.log('Package modal hidden');
      }, 300);
  }
}


// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const plannerModal = document.getElementById('plannerModal');
    const packageModal = document.getElementById('packageModal');
    if (event.target === plannerModal) {
        closePlannerModal();
    }
    if (event.target === packageModal) {
        closePackageModal();
    }
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePlannerModal();
        closePackageModal();
    }
});
