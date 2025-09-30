// 메인배너 슬라이드 (이미지 4개)
const bannerImgs = [
  'img/banner1.jpg',
  'img/banner2.jpg',
  'img/banner3.jpg',
  'img/banner4.jpg',
];
let bannerIdx = 0;
let autoSlideInterval;

// 배너 슬라이드 함수
function slideBanner(dir) {
  bannerIdx = (bannerIdx + dir + bannerImgs.length) % bannerImgs.length;
  const bannerImg = document.getElementById('mainBannerImg');
  bannerImg.style.opacity = '0';
  setTimeout(() => {
    bannerImg.src = bannerImgs[bannerIdx];
    bannerImg.style.opacity = '1';
  }, 300);
}

// 자동 슬라이드 시작/정지
function startAutoSlide() {
  autoSlideInterval = setInterval(() => slideBanner(1), 3000);
}
function stopAutoSlide() {
  if (autoSlideInterval) clearInterval(autoSlideInterval);
}

// 페이지 로드 시 자동 슬라이드
document.addEventListener('DOMContentLoaded', function() {
  startAutoSlide();
  const bannerContainer = document.querySelector('.main-banner-slider');
  if (bannerContainer) {
    bannerContainer.addEventListener('mouseenter', stopAutoSlide);
    bannerContainer.addEventListener('mouseleave', startAutoSlide);
  }
  const leftArrow = document.querySelector('.banner-arrow.left');
  const rightArrow = document.querySelector('.banner-arrow.right');
  if (leftArrow) leftArrow.addEventListener('click', () => { stopAutoSlide(); setTimeout(startAutoSlide, 1000); });
  if (rightArrow) rightArrow.addEventListener('click', () => { stopAutoSlide(); setTimeout(startAutoSlide, 1000); });
});

// 맨위로 버튼 노출 제어
const topFab = document.querySelector('.top-fab');
window.addEventListener('scroll', function() {
  if (window.scrollY > 120) topFab.style.display = 'block';
  else topFab.style.display = 'none';
});
topFab.style.display = 'none';

// 공지/FAQ 토글
document.getElementById('showNoticeBtn').onclick = function() {
  document.getElementById('mainNoticeBox').style.display = '';
  document.getElementById('mainFaqBox').style.display = 'none';
};
document.getElementById('showFaqBtn').onclick = function() {
  document.getElementById('mainNoticeBox').style.display = 'none';
  document.getElementById('mainFaqBox').style.display = '';
};

// 시설찾기/카드 이동
document.getElementById('mainSearchBtn').onclick = function() {
  var sido = document.getElementById('sidoSelect').value;
  var gugun = document.getElementById('gugunSelect').value;
  var dong = document.getElementById('dongSelect').value;
  var keyword = document.querySelector('.main-searchbar-row input[type="text"]').value.trim();
  if ((sido === '전체' || !sido) && (gugun === '전체' || !gugun) && (dong === '전체' || !dong) && !keyword) {
    alert('검색 조건(지역 또는 시설명)을 입력해 주세요.');
    return;
  }
  location.href = '/facilities';
};
document.getElementById('cardGrade').onclick = () => location.href = '/grade';
document.getElementById('cardPolicy').onclick = () => location.href = '/policy';
document.getElementById('cardCompare').onclick = () => location.href = '/hireinfo';

// 공지/FAQ 리스트 클릭 → 상세 이동
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('#mainNoticeList li').forEach(function(li) {
    li.style.cursor = 'pointer';
    li.onclick = function() {
      const id = li.getAttribute('data-id');
      if (id) {
        location.href = `/notice/${id}`;
      }
    };
  });
  
  document.querySelectorAll('#mainFaqList li').forEach(function(li) {
    li.style.cursor = 'pointer';
    li.onclick = function() {
      const id = li.getAttribute('data-id');
      if (id) {
        location.href = `/faq/${id}`;
      }
    };
  });
});

// index.html 전용: 페이지네이션
function renderFacilityPagination(total, page, perPage) {
  const pagDiv = document.getElementById('facilityPagination');
  if (!pagDiv) return;
  const totalPages = Math.ceil(total / perPage);
  let html = '';
  const groupSize = 10;
  const maxPage = 30;
  const lastPage = Math.min(totalPages, maxPage);
  const groupStart = Math.floor((page - 1) / groupSize) * groupSize + 1;
  const groupEnd = Math.min(groupStart + groupSize - 1, lastPage);
  if (groupStart > 1) html += `<a href="#" class="page-prev-group" data-page="${groupStart - 1}">&lt;</a>`;
  for (let i = groupStart; i <= groupEnd; i++) {
    html += `<a href="#" class="${i === page ? 'active' : ''}" data-page="${i}">${i}</a>`;
  }
  if (groupEnd < lastPage) html += `<a href="#" class="page-next-group" data-page="${groupEnd + 1}">&gt;</a>`;
  pagDiv.innerHTML = html;
  pagDiv.querySelectorAll('a[data-page]').forEach(a => {
    a.onclick = function(e) {
      e.preventDefault();
      this.blur();
      renderFacilitiesTablePaged(currentFacilityList, parseInt(this.dataset.page), perPage);
    };
  });
}

let currentFacilityList = [];
function renderFacilitiesTablePaged(list, page = 1, perPage = 10) {
  currentFacilityList = list;
  const startIdx = (page - 1) * perPage;
  const pageList = list.slice(startIdx, startIdx + perPage);
  renderFacilitiesTable(pageList);
  renderFacilityPagination(list.length, page, perPage);
}

// 카드형 렌더링
function renderFacilities(list) {
  const container = document.getElementById('facilityList');
  container.innerHTML = '';
  list.forEach(fac => {
    container.innerHTML += `
      <div class="facility-card">
        <img src="${fac.image}" alt="${fac.name}">
        <div class="facility-info">
          <h3>${fac.name}</h3>
          <div class="address">${fac.address}</div>
          <div class="phone">${fac.phone}</div>
          <button onclick="location.href='detail.html?id=${fac.id}'">상세보기</button>
          <button onclick="addToCompare(${fac.id})">비교담기</button>
        </div>
      </div>
    `;
  });
}

// 표 형태 렌더링
function renderFacilitiesTable(list) {
  const container = document.getElementById('facilityList');
  if (!container) return;
  container.innerHTML = '';
  if (!list.length) {
    container.innerHTML = '<tr><td colspan="5">해당 지역의 요양원이 없습니다.</td></tr>';
    return;
  }
  list.forEach(fac => {
    container.innerHTML += `
      <tr class="facility-row">
        <td><a href="detail.html">${fac.name}</a></td>
        <td>${fac.address}</td>
        <td>${fac.type || '노인요양'}</td>
        <td>${fac.capacity || '-'}</td>
        <td>${fac.phone}</td>
      </tr>
    `;
  });
}

// 검색(카드형 예시)
function searchFacility() {
  const keyword = document.getElementById('search').value;
  const filtered = facilities.filter(f => f.name.includes(keyword) || f.address.includes(keyword));
  renderFacilities(filtered);
}

/* -------------------------
   지역 셀렉트: API 우선 + regionData 폴백
------------------------- */
async function setSidoOptions() {
  const sidoSelect = document.getElementById('sidoSelect');
  sidoSelect.innerHTML = '<option>전체</option>';
  try {
    const res = await fetch('/api/region/sido');
    if (!res.ok) throw new Error('API /sido 응답 오류');
    const sidoList = await res.json();
    sidoList.forEach(sido => {
      const opt = document.createElement('option');
      opt.value = sido;
      opt.textContent = sido;
      sidoSelect.appendChild(opt);
    });
  } catch (e) {
    // console.warn('sido API 실패, regionData 폴백 사용:', e);
    if (typeof regionData !== 'undefined') {
      Object.keys(regionData).forEach(sido => {
        const opt = document.createElement('option');
        opt.value = sido;
        opt.textContent = sido;
        sidoSelect.appendChild(opt);
      });
    }
  }
}

async function setGugunOptions() {
  const sido = document.getElementById('sidoSelect').value;
  const gugunSelect = document.getElementById('gugunSelect');
  gugunSelect.innerHTML = '<option>전체</option>';
  if (!sido || sido === '전체') return;
  try {
    const res = await fetch(`/api/region/gugun?sido=${encodeURIComponent(sido)}`);
    if (!res.ok) throw new Error('API /gugun 응답 오류');
    const gugunList = await res.json();
    gugunList.forEach(gugun => {
      const opt = document.createElement('option');
      opt.value = gugun;
      opt.textContent = gugun;
      gugunSelect.appendChild(opt);
    });
  } catch (e) {
    // console.warn('gugun API 실패, regionData 폴백 사용:', e);
    if (typeof regionData !== 'undefined' && regionData[sido]) {
      Object.keys(regionData[sido]).forEach(gugun => {
        const opt = document.createElement('option');
        opt.value = gugun;
        opt.textContent = gugun;
        gugunSelect.appendChild(opt);
      });
    }
  }
}

async function setDongOptions() {
  const sido = document.getElementById('sidoSelect').value;
  const gugun = document.getElementById('gugunSelect').value;
  const dongSelect = document.getElementById('dongSelect');
  dongSelect.innerHTML = '<option>전체</option>';
  if (!sido || sido === '전체' || !gugun || gugun === '전체') return;
  try {
    const res = await fetch(`/api/region/dong?sido=${encodeURIComponent(sido)}&gugun=${encodeURIComponent(gugun)}`);
    if (!res.ok) throw new Error('API /dong 응답 오류');
    const dongList = await res.json();
    dongList.forEach(dong => {
      const opt = document.createElement('option');
      opt.value = dong;
      opt.textContent = dong;
      dongSelect.appendChild(opt);
    });
  } catch (e) {
    // console.warn('dong API 실패, regionData 폴백 사용:', e);
    if (typeof regionData !== 'undefined' && regionData[sido] && regionData[sido][gugun]) {
      regionData[sido][gugun].forEach(dong => {
        const opt = document.createElement('option');
        opt.value = dong;
        opt.textContent = dong;
        dongSelect.appendChild(opt);
      });
    }
  }
}

// 초기 바인딩
document.addEventListener('DOMContentLoaded', () => {
  // console.log("✅ DOM fully loaded");
  setSidoOptions();
  document.getElementById('sidoSelect').addEventListener('change', () => {
    // console.log("✅ sido changed");
    setGugunOptions();
    document.getElementById('dongSelect').innerHTML = '<option>전체</option>';
  });
  document.getElementById('gugunSelect').addEventListener('change', () => {
    // console.log("✅ gugun changed");
    setDongOptions();
  });
});

/* -------------------------
   main-card-row 모바일 슬라이더
------------------------- */
function updateMainCardSlider(idx) {
  const cards = document.querySelectorAll('#mainCardRow .main-card');
  cards.forEach((card, i) => {
    card.classList.remove('active', 'prev', 'next');
    if (i === idx) card.classList.add('active');
    else if (i === idx - 1) card.classList.add('prev');
    else if (i === idx + 1) card.classList.add('next');
  });
  if (window.innerWidth <= 768) {
    mainCardPrevBtn.disabled = (idx === 0);
    mainCardNextBtn.disabled = (idx === cards.length - 1);
  } else {
    mainCardPrevBtn.disabled = false;
    mainCardNextBtn.disabled = false;
  }
}
let mainCardCurrentIdx = 0;
function mainCardSliderGo(dir) {
  const cards = document.querySelectorAll('#mainCardRow .main-card');
  if (!cards.length) return;
  mainCardCurrentIdx += dir;
  if (mainCardCurrentIdx < 0) mainCardCurrentIdx = 0;
  if (mainCardCurrentIdx > cards.length - 1) mainCardCurrentIdx = cards.length - 1;
  updateMainCardSlider(mainCardCurrentIdx);
}
const mainCardPrevBtn = document.getElementById('mainCardPrevBtn');
const mainCardNextBtn = document.getElementById('mainCardNextBtn');
if (mainCardPrevBtn && mainCardNextBtn) {
  mainCardPrevBtn.onclick = () => mainCardSliderGo(-1);
  mainCardNextBtn.onclick = () => mainCardSliderGo(1);
}
function mainCardSliderInit() {
  if (window.innerWidth <= 768) {
    updateMainCardSlider(mainCardCurrentIdx);
  } else {
    const cards = document.querySelectorAll('#mainCardRow .main-card');
    cards.forEach(card => card.classList.remove('active', 'prev', 'next'));
    mainCardPrevBtn.disabled = false;
    mainCardNextBtn.disabled = false;
    mainCardCurrentIdx = 0;
  }
}
window.addEventListener('resize', mainCardSliderInit);
document.addEventListener('DOMContentLoaded', mainCardSliderInit);

/* -------------------------
   pick-card-v3 슬라이드
------------------------- */
document.addEventListener('DOMContentLoaded', function() {
  const pickList = document.getElementById('mainPickListV3');
  const prevBtn = document.getElementById('mainPickPrevBtn');
  const nextBtn = document.getElementById('mainPickNextBtn');
  if (pickList && prevBtn && nextBtn) {
    prevBtn.onclick = () => pickList.scrollBy({ left: -320, behavior: 'smooth' });
    nextBtn.onclick = () => pickList.scrollBy({ left: 320, behavior: 'smooth' });
  }
});

/* -------------------------
   SVG 지도 + 표 필터
------------------------- */
document.addEventListener('DOMContentLoaded', function() {
  const obj = document.getElementById('svgMapObj');
  const facilityList = document.getElementById('facilityList');
  if (obj && facilityList) {
    obj.addEventListener('load', function() {
      const svgDoc = obj.contentDocument;
      if (!svgDoc) return;
      const paths = svgDoc.querySelectorAll('path');
      let activePath = null;
      paths.forEach(function(path) {
        path.style.transition = 'fill 0.18s';
        path.addEventListener('mouseenter', () => path.classList.add('svg-region-hover'));
        path.addEventListener('mouseleave', () => path.classList.remove('svg-region-hover'));
        path.addEventListener('click', function() {
          if (activePath) activePath.classList.remove('svg-region-active');
          path.classList.add('svg-region-active');
          activePath = path;
          const regionName = path.getAttribute('name');
          filterFacilitiesByRegionTable(regionName);
        });
      });
    });
    renderFacilitiesTablePaged(facilities, 1, 10);
  }
});

function filterFacilitiesByRegionTable(regionName) {
  const regionMap = {
    '서울': '서울',
    '경기도': '경기',
    '강원도': '강원',
    '경상도': ['경기', '강원', '대구', '울산', '부산'],
    '전라도': ['전남', '광주', '전북', '충남', '충북'],
    '충청도': ['충북', '충남', '대전', '세종', '충남'],
    '인천': '인천',
    '대전': '대전',
    '대구': '대구',
    '울산': '울산',
    '부산': '부산',
    '제주도': '제주'
  };
  const korRegion = regionMap[regionName] || regionName;
  const filtered = facilities.filter(fac => fac.address.includes(korRegion));
  renderFacilitiesTablePaged(filtered.length ? filtered : facilities, 1, 10);
}

// 초기 카드형 렌더 (페이지에서 facilities 제공 가정)
window.onload = () => renderFacilities(facilities);

/* -------------------------
   체크박스 ↔ SVG 연동(하이라이트)
------------------------- */
document.addEventListener('DOMContentLoaded', function() {
  const sortBtns = document.querySelectorAll('.facility-sort-btn');
  sortBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      sortBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  const regionCheckboxes = document.querySelectorAll('.region-item input[type="checkbox"]');
  const regionToSvgId = {
    '서울': 'KR11', '경기도': 'KR41', '강원도': 'KR42',
    '경상도': ['KR47','KR48','KR31','KR26'],
    '전라도': ['KR45','KR46','KR29'],
    '충청도': ['KR43','KR44','KR50','KR30'],
    '인천': 'KR28', '대전': 'KR30', '대구': 'KR27',
    '울산': 'KR31', '부산': 'KR26', '제주도': 'KR49'
  };
  const svgObj = document.getElementById('krMapObj');

  function highlightSvgRegion(regionKor, highlight) {
    if (!svgObj || !svgObj.contentDocument) return;
    let ids = regionToSvgId[regionKor];
    if (!ids) return;
    if (!Array.isArray(ids)) ids = [ids];
    ids.forEach(id => {
      const path = svgObj.contentDocument.getElementById(id);
      if (path) path.setAttribute('fill', highlight ? '#b3d1fa' : 'none');
    });
  }

  function colorRegions() {
    const unicodeMap = {
      '\uc11c\uc6b8': 'KR11',
      '\uacbd\uae30\ub3c4': 'KR41',
      '\uac15\uc6d0\ub3c4': 'KR42',
      '\uacbd\uc0c1\ub3c4': ['KR47','KR48','KR31','KR26'],
      '\uc804\ub77c\ub3c4': ['KR45','KR46','KR29'],
      '\ucda9\uccad\ub3c4': ['KR43','KR44','KR50','KR30'],
      '\uc778\cc9c': 'KR28',
      '\ub300\uc804': 'KR30',
      '\ub300\uad6c': 'KR27',
      '\uc6b8\uc0b0': 'KR31',
      '\ubd80\uc0b0': 'KR26',
      '\uc81c\uc8fc\ub3c4': 'KR49'
    };
    if (!svgObj || !svgObj.contentDocument) return;
    Object.values(unicodeMap).flat().forEach(id => {
      const path = svgObj.contentDocument.getElementById(id);
      if (path) path.setAttribute('fill', 'none');
    });
    regionCheckboxes.forEach(cb => {
      if (cb.checked) {
        let ids = unicodeMap[cb.value] || regionToSvgId[cb.value];
        if (!ids) return;
        if (!Array.isArray(ids)) ids = [ids];
        ids.forEach(id => {
          const path = svgObj.contentDocument.getElementById(id);
          if (path) path.setAttribute('fill', '#e6f0fa');
        });
      }
    });
  }

  regionCheckboxes.forEach(cb => {
    cb.addEventListener('change', function() {
      if (svgObj.contentDocument) colorRegions();
      else svgObj.addEventListener('load', colorRegions, { once: true });
    });
  });

  if (svgObj) {
    svgObj.addEventListener('load', function() {
      const svgDoc = svgObj.contentDocument;
      if (!svgDoc) return;
      Object.entries(regionToSvgId).forEach(([regionKor, ids]) => {
        if (!Array.isArray(ids)) ids = [ids];
        ids.forEach(id => {
          const regionPath = svgDoc.getElementById(id);
          if (regionPath) {
            regionPath.style.cursor = 'pointer';
            regionPath.addEventListener('click', function() {
              regionCheckboxes.forEach(cb => cb.checked = (cb.value === regionKor));
              Object.keys(regionToSvgId).forEach(region => highlightSvgRegion(region, false));
              highlightSvgRegion(regionKor, true);
            });
            regionPath.addEventListener('mouseenter', () => regionPath.setAttribute('fill', '#b3d1fa'));
            regionPath.addEventListener('mouseleave', function() {
              const checked = Array.from(regionCheckboxes).find(cb => {
                const ids = regionToSvgId[cb.value];
                return cb.checked && (Array.isArray(ids) ? ids.includes(id) : ids === id);
              });
              if (!checked) regionPath.setAttribute('fill', 'none');
            });
          }
        });
      });
    });
  }
});

/* -------------------------
   챗봇
------------------------- */
const chatbotFab = document.getElementById('chatbotFab');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatbotCloseBtn = document.getElementById('chatbotCloseBtn');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSendBtn = document.getElementById('chatbotSendBtn');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotScrollBtn = document.getElementById('chatbotScrollBtn');
const API_ENDPOINT = '/chat';

function determineMessageType(text) {
  if (text.includes('메뉴') || text.includes('선택') || text.includes('어떤') || text.includes('무엇을')) return 'menu';
  else if (text.includes('요양원') || text.includes('시설') || text.includes('기관')) return 'facility';
  else if (text.includes('정보') || text.includes('알려드리') || text.includes('설명') || text.includes('소개')) return 'info';
  else if (text.includes('도움') || text.includes('안내') || text.includes('가이드') || text.includes('죄송')) return 'help';
  else return 'default';
}

function splitLongMessage(text) {
  if (text.includes('요양원') && text.length > 200) {
    const lines = text.split('\n').filter(line => line.trim());
    const cards = [];
    const filteredLines = lines.filter(line =>
      !line.includes('요청하신') &&
      !line.includes('정렬') &&
      !line.includes('조건') &&
      !line.includes('맞춰') &&
      !line.includes('추천') &&
      !line.includes('알려드리')
    );
    const facilityLines = filteredLines.filter(line =>
      (line.includes('요양원') && !line.includes('주소')) || line.includes('주소')
    );
    if (facilityLines.length > 0) {
      const limitedFacilities = facilityLines.slice(0, 10);
      cards.push({ type: 'facility', content: limitedFacilities.join('\n') });
    }
    return cards;
  }
  if (text.length > 300) {
    const sentences = text.split(/[.!?]\s+/);
    const cards = [];
    let currentCard = '';
    for (const sentence of sentences) {
      if ((currentCard + sentence).length > 200) {
        if (currentCard) cards.push({ type: 'default', content: currentCard.trim() });
        currentCard = sentence;
      } else {
        currentCard += (currentCard ? '. ' : '') + sentence;
      }
    }
    if (currentCard) cards.push({ type: 'default', content: currentCard.trim() });
    return cards;
  }
  return null;
}

chatbotFab.addEventListener('click', () => {
  chatbotContainer.style.display = 'block';
  chatbotFab.style.display = 'none';
  setTimeout(() => { scrollToBottom(false); updateScrollIndicator(); }, 100);
});
chatbotCloseBtn.addEventListener('click', () => {
  chatbotContainer.style.display = 'none';
  chatbotFab.style.display = 'block';
});

function scrollToBottom(smooth = true) {
  const scrollHeight = chatbotMessages.scrollHeight;
  const clientHeight = chatbotMessages.clientHeight;
  const maxScrollTop = scrollHeight - clientHeight;
  if (smooth) chatbotMessages.scrollTo({ top: maxScrollTop, behavior: 'smooth' });
  else chatbotMessages.scrollTop = maxScrollTop;
  setTimeout(updateScrollIndicator, 300);
}
function isScrolledToBottom() {
  const threshold = 30;
  const scrollTop = chatbotMessages.scrollTop;
  const clientHeight = chatbotMessages.clientHeight;
  const scrollHeight = chatbotMessages.scrollHeight;
  return (scrollTop + clientHeight >= scrollHeight - threshold);
}
function updateScrollIndicator() {
  const scrollHeight = chatbotMessages.scrollHeight;
  const clientHeight = chatbotMessages.clientHeight;
  const hasScroll = scrollHeight > clientHeight + 10;
  const isAtBottom = isScrolledToBottom();
  if (hasScroll) {
    chatbotMessages.classList.add('has-scroll');
    if (!isAtBottom) {
      chatbotScrollBtn.style.display = 'flex';
      chatbotScrollBtn.style.opacity = '1';
    } else {
      chatbotScrollBtn.style.display = 'none';
      chatbotScrollBtn.style.opacity = '0';
    }
  } else {
    chatbotMessages.classList.remove('has-scroll');
    chatbotScrollBtn.style.display = 'none';
    chatbotScrollBtn.style.opacity = '0';
  }
}
chatbotMessages.addEventListener('scroll', () => {
  updateScrollIndicator();
  chatbotMessages.classList.add('scrolling');
  clearTimeout(chatbotMessages.scrollTimeout);
  chatbotMessages.scrollTimeout = setTimeout(() => {
    chatbotMessages.classList.remove('scrolling');
  }, 150);
});
window.addEventListener('resize', () => setTimeout(updateScrollIndicator, 100));

function addMessage(message, sender, options = {}) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);
  if (sender === 'bot') {
    messageDiv.classList.add('post-card');
    if (options.type) messageDiv.setAttribute('data-type', options.type);
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    let cardContent = '';
    if (options.type === 'menu') {
      cardContent = `
        <div class="post-header">
          <div class="post-avatar">AI</div>
          <div class="post-info">
            <div class="post-author">챗봇 어시스턴트</div>
            <div class="post-date">${formattedDate}</div>
          </div>
        </div>
        <div class="post-content">${message}</div>
        <div class="post-footer">
          <div class="menu-cards-row">
            <div class="menu-card" onclick="location.href='/facilities'"><div class="menu-icon">🏥</div><div class="menu-text">요양원 정보</div></div>
            <div class="menu-card" onclick="location.href='/grade'"><div class="menu-icon">⭐</div><div class="menu-text">등급</div></div>
            <div class="menu-card" onclick="location.href='/payinfo'"><div class="menu-icon">💰</div><div class="menu-text">비용안내</div></div>
          </div>
        </div>`;
    } else if (options.type === 'info') {
      cardContent = `
        <div class="post-header">
          <div class="post-avatar">AI</div>
          <div class="post-info">
            <div class="post-author">챗봇 어시스턴트</div>
            <div class="post-date">${formattedDate}</div>
          </div>
        </div>
        <div class="post-content">${message}</div>
        <div class="post-footer"><div class="post-stats"><i>📋</i><span>정보</span></div></div>`;
    } else if (options.type === 'help') {
      cardContent = `
        <div class="post-header">
          <div class="post-avatar">AI</div>
          <div class="post-info">
            <div class="post-author">챗봇 어시스턴트</div>
            <div class="post-date">${formattedDate}</div>
          </div>
        </div>
        <div class="post-content">${message}</div>`;
    } else if (options.type === 'facility') {
      const lines = message.split('\n').filter(line => line.trim());
      let facilityInfo = '';
      if (lines.length > 0) {
        const facilities = [];
        for (let i = 0; i < lines.length; i += 2) {
          if (i + 1 < lines.length) {
            const nameLine = lines[i];
            const addressLine = lines[i + 1];
            if (nameLine.includes('요양원') && addressLine.includes('주소')) {
              facilities.push({ name: nameLine, address: addressLine });
            }
          }
        }
        facilityInfo = facilities.map(facility => `
          <div class="facility-group">
            <div class="facility-item facility-name">🏥 ${facility.name}</div>
            <div class="facility-item facility-address">📍 ${facility.address}</div>
            <div class="facility-action-btn" onclick="location.href='/facilities'"><span class="view-facility">보러가기</span></div>
          </div>
        `).join('');
      }
      cardContent = `
        <div class="post-header">
          <div class="post-avatar">🏥</div>
          <div class="post-info">
            <div class="post-author">챗봇 어시스턴트</div>
            <div class="post-date">${formattedDate}</div>
          </div>
        </div>
        <div class="post-content">
          <div class="facility-card">
            <div class="facility-header"><h3 class="facility-title">추천 요양원</h3></div>
            <div class="facility-info">${facilityInfo}</div>
          </div>
        </div>`;
    } else {
      cardContent = `
        <div class="post-header">
          <div class="post-avatar">AI</div>
          <div class="post-info">
            <div class="post-author">챗봇 어시스턴트</div>
            <div class="post-date">${formattedDate}</div>
          </div>
        </div>
        <div class="post-content">${message}</div>`;
    }
    messageDiv.innerHTML = cardContent;
  } else {
    messageDiv.innerText = message;
  }
  chatbotMessages.appendChild(messageDiv);
  setTimeout(() => { scrollToBottom(true); updateScrollIndicator(); }, 50);
}

async function sendMessage() {
  const message = chatbotInput.value.trim();
  if (message === '') return;
  addMessage(message, 'user');
  chatbotInput.value = '';
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: 'web_user', message })
    });
    const data = await response.json();
    if (data && data.length > 0) {
      data.forEach(item => {
        if (item.text) {
          const splitCards = splitLongMessage(item.text);
          if (splitCards && splitCards.length > 1) {
            splitCards.forEach(card => addMessage(card.content, 'bot', { type: card.type }));
          } else {
            const cardType = determineMessageType(item.text);
            addMessage(item.text, 'bot', { type: cardType });
          }
        }
      });
    } else {
      addMessage('죄송합니다. 이해하지 못했습니다.', 'bot', { type: 'help' });
    }
  } catch (error) {
    console.error('Error fetching from Rasa:', error);
    addMessage('챗봇 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.', 'bot', { type: 'help' });
  }
}

chatbotSendBtn.addEventListener('click', sendMessage);
chatbotInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
chatbotScrollBtn.addEventListener('click', () => { scrollToBottom(true); setTimeout(() => (chatbotScrollBtn.style.display = 'none'), 500); });

// 초기 스크롤 상태/날짜/효과
setTimeout(updateScrollIndicator, 100);
document.addEventListener('DOMContentLoaded', () => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
  const initialMessages = document.querySelectorAll('.message.bot.post-card .post-date');
  initialMessages.forEach(dateElement => { dateElement.textContent = formattedDate; });
  setTimeout(updateScrollIndicator, 200);
  const clickableCards = document.querySelectorAll('.clickable-card');
  clickableCards.forEach(card => {
    card.addEventListener('click', function() {
      this.style.transform = 'scale(0.98)';
      setTimeout(() => { this.style.transform = ''; }, 150);
    });
  });
  const menuCards = document.querySelectorAll('.menu-card');
  menuCards.forEach(card => {
    card.addEventListener('click', function() {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => { this.style.transform = ''; }, 150);
    });
  });
  setTimeout(updateScrollIndicator, 500);
  setInterval(updateScrollIndicator, 1000);
});
