// 메인배너 슬라이드 (이미지 3개)
  const bannerImgs = [
    'img/123.jpg',
    'img/444.jpg',
    'img/555.jpg'
  ];
  let bannerIdx = 0;
      function slideBanner(dir) {
        bannerIdx = (bannerIdx + dir + bannerImgs.length) % bannerImgs.length;
        document.getElementById('mainBannerImg').src = bannerImgs[bannerIdx];
      }
  // 맨위로 버튼 노출 제어
  const topFab = document.querySelector('.top-fab');
  window.addEventListener('scroll', function() {
    if(window.scrollY > 120) topFab.style.display = 'block';
    else topFab.style.display = 'none';
  });
  topFab.style.display = 'none';
  // 공지/FAQ 토글 기능
  document.getElementById('showNoticeBtn').onclick = function() {
    document.getElementById('mainNoticeBox').style.display = '';
    document.getElementById('mainFaqBox').style.display = 'none';
  };
  document.getElementById('showFaqBtn').onclick = function() {
    document.getElementById('mainNoticeBox').style.display = 'none';
    document.getElementById('mainFaqBox').style.display = '';
  };
  // 시설찾기/카드 클릭 이동
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
  document.getElementById('cardGrade').onclick = function() {
    location.href = '/grade';
  };
  document.getElementById('cardPolicy').onclick = function() {
    location.href = '/policy';
  };
  document.getElementById('cardCompare').onclick = function() {
    location.href = '/facilities';
  };
  // 공지/FAQ 리스트 클릭 시 상세로 이동
  document.querySelectorAll('#mainNoticeList li').forEach(function(li) {
    li.style.cursor = 'pointer';
    li.onclick = function() {
      const id = li.getAttribute('data-id');
      location.href = `/notice/detail?n=${id}`;
    };
  });
  document.querySelectorAll('#mainFaqList li').forEach(function(li) {
    li.style.cursor = 'pointer';
    li.onclick = function() {
      const id = li.getAttribute('data-id');
      location.href = `/faq/detail?n=${id}`;
    };
  });

// index.html 전용: 10개 단위 페이지네이션
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
  if (groupStart > 1) {
    html += `<a href="#" class="page-prev-group" data-page="${groupStart - 1}">&lt;</a>`;
  }
  for (let i = groupStart; i <= groupEnd; i++) {
    html += `<a href="#" class="${i === page ? 'active' : ''}" data-page="${i}">${i}</a>`;
  }
  if (groupEnd < lastPage) {
    html += `<a href="#" class="page-next-group" data-page="${groupEnd + 1}">&gt;</a>`;
  }
  pagDiv.innerHTML = html;
  // 이벤트 바인딩
  pagDiv.querySelectorAll('a[data-page]').forEach(a => {
    a.onclick = function(e) {
      e.preventDefault();
      this.blur(); // 클릭 후 포커스 해제해서 스크롤 튐 방지
      renderFacilitiesTablePaged(currentFacilityList, parseInt(this.dataset.page), perPage);
    };
  });
}

// index.html 전용: 페이징된 표 렌더링
let currentFacilityList = [];
function renderFacilitiesTablePaged(list, page=1, perPage=10) {
  currentFacilityList = list;
  const startIdx = (page-1)*perPage;
  const pageList = list.slice(startIdx, startIdx+perPage);
  renderFacilitiesTable(pageList);
  renderFacilityPagination(list.length, page, perPage);
}

// index.html에 실제로 적혀있는 3개 시설 정보만 사용
// const baseFacilities = [...]; // 이미 index.html에 직접 작성되어 있으므로 js에서는 사용하지 않음
// const facilities = Array.from({length: 300}, ...); // 이 부분 전체 제거
// renderFacilitiesTablePaged(facilities, 1, 10); // 이 부분도 제거


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

function searchFacility() {
  const keyword = document.getElementById('search').value;
  const filtered = facilities.filter(f => f.name.includes(keyword) || f.address.includes(keyword));
  renderFacilities(filtered);
}

function setSidoOptions() {
  const sidoSelect = document.getElementById('sidoSelect');
  sidoSelect.innerHTML = '<option>전체</option>';
  Object.keys(regionData).forEach(sido => {
    const opt = document.createElement('option');
    opt.value = sido;
    opt.textContent = sido;
    sidoSelect.appendChild(opt);
  });
}

function setGugunOptions() {
  const sido = document.getElementById('sidoSelect').value;
  const gugunSelect = document.getElementById('gugunSelect');
  gugunSelect.innerHTML = '<option>전체</option>';
  if(regionData[sido]) {
    Object.keys(regionData[sido]).forEach(gugun => {
      const opt = document.createElement('option');
      opt.value = gugun;
      opt.textContent = gugun;
      gugunSelect.appendChild(opt);
    });
  }
}

function setDongOptions() {
  const sido = document.getElementById('sidoSelect').value;
  const gugun = document.getElementById('gugunSelect').value;
  const dongSelect = document.getElementById('dongSelect');
  dongSelect.innerHTML = '<option>전체</option>';
  if(regionData[sido] && regionData[sido][gugun]) {
    regionData[sido][gugun].forEach(dong => {
      const opt = document.createElement('option');
      opt.value = dong;
      opt.textContent = dong;
      dongSelect.appendChild(opt);
    });
  }
}

// main-card-row 모바일 슬라이더 기능
function updateMainCardSlider(idx) {
  const cards = document.querySelectorAll('#mainCardRow .main-card');
  cards.forEach((card, i) => {
    card.classList.remove('active', 'prev', 'next');
    if (i === idx) card.classList.add('active');
    else if (i === idx - 1) card.classList.add('prev');
    else if (i === idx + 1) card.classList.add('next');
  });
  // 화살표 비활성화 처리
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
  mainCardPrevBtn.onclick = function() { mainCardSliderGo(-1); };
  mainCardNextBtn.onclick = function() { mainCardSliderGo(1); };
}

// 초기화 및 리사이즈 대응
function mainCardSliderInit() {
  if (window.innerWidth <= 768) {
    updateMainCardSlider(mainCardCurrentIdx);
  } else {
    // PC에서는 모든 카드 보이게
    const cards = document.querySelectorAll('#mainCardRow .main-card');
    cards.forEach(card => card.classList.remove('active', 'prev', 'next'));
    mainCardPrevBtn.disabled = false;
    mainCardNextBtn.disabled = false;
    mainCardCurrentIdx = 0;
  }
}
window.addEventListener('resize', mainCardSliderInit);
document.addEventListener('DOMContentLoaded', mainCardSliderInit);

// pick-card-v3 슬라이드 (화살표 클릭 시 scrollLeft 이동)
document.addEventListener('DOMContentLoaded', function() {
  const pickList = document.getElementById('mainPickListV3');
  const prevBtn = document.getElementById('mainPickPrevBtn');
  const nextBtn = document.getElementById('mainPickNextBtn');
  if (pickList && prevBtn && nextBtn) {
    prevBtn.onclick = function() {
      pickList.scrollBy({ left: -320, behavior: 'smooth' });
    };
    nextBtn.onclick = function() {
      pickList.scrollBy({ left: 320, behavior: 'smooth' });
    };
  }
});

// 표 형태로 요양원 목록 렌더링 (index.html용)
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

// 기존 renderFacilitiesTable을 index.html에서만 사용하도록 분리
// SVG 지도 인터랙션 및 지역별 요양원 필터링 (index.html에서만 동작)
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
        path.addEventListener('mouseenter', function() {
          path.classList.add('svg-region-hover');
        });
        path.addEventListener('mouseleave', function() {
          path.classList.remove('svg-region-hover');
        });
        path.addEventListener('click', function() {
          if (activePath) activePath.classList.remove('svg-region-active');
          path.classList.add('svg-region-active');
          activePath = path;
          // 지역명 추출 (SVG path의 name 속성)
          const regionName = path.getAttribute('name');
          filterFacilitiesByRegionTable(regionName);
        });
      });
    });
    // 페이지 진입 시 전체 요양원 표로 렌더링 (10개 단위)
    renderFacilitiesTablePaged(facilities, 1, 10);
  }
});

// 표 필터링용 함수 (index.html)
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

window.onload = () => renderFacilities(facilities);

document.addEventListener('DOMContentLoaded', function() {
  // 정렬 버튼
  const sortBtns = document.querySelectorAll('.facility-sort-btn');
  sortBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      sortBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // 지역 선택 (체크박스)
  const regionCheckboxes = document.querySelectorAll('.region-item input[type="checkbox"]');
  const regionToSvgId = {
    '서울': 'KR11',
    '경기도': 'KR41',
    '강원도': 'KR42',
    '경상도': ['KR47', 'KR48', 'KR31', 'KR26'],
    '전라도': ['KR45', 'KR46', 'KR29'],
    '충청도': ['KR43', 'KR44', 'KR50', 'KR30'],
    '인천': 'KR28',
    '대전': 'KR30',
    '대구': 'KR27',
    '울산': 'KR31',
    '부산': 'KR26',
    '제주도': 'KR49'
  };
  const svgObj = document.getElementById('krMapObj');

  // 지도 SVG와 체크박스 연동 함수 통합 및 SVG path 클릭 이벤트 추가
  function highlightAndFilterRegion(regionKor) {
    // 체크박스 싱크
    const regionCheckboxes = document.querySelectorAll('.region-item input[type="checkbox"]');
    regionCheckboxes.forEach(cb => {
      cb.checked = (cb.value === regionKor);
    });
    // 색상 변경
    colorRegions();
    // 리스트 필터링
    const filtered = facilities.filter(fac => fac.address.includes(regionKor));
    renderFacilitiesTablePaged(filtered.length ? filtered : facilities, 1, 10);
  }

  function colorRegions() {
    const regionToSvgId = {
      '\uc11c\uc6b8': 'KR11',
      '\uacbd\uae30\ub3c4': 'KR41',
      '\uac15\uc6d0\ub3c4': 'KR42',
      '\uacbd\uc0c1\ub3c4': ['KR47', 'KR48', 'KR31', 'KR26'],
      '\uc804\ub77c\ub3c4': ['KR45', 'KR46', 'KR29'],
      '\ucda9\uccad\ub3c4': ['KR43', 'KR44', 'KR50', 'KR30'],
      '\uc778\cc9c': 'KR28',
      '\ub300\uc804': 'KR30',
      '\ub300\uad6c': 'KR27',
      '\uc6b8\uc0b0': 'KR31',
      '\ubd80\uc0b0': 'KR26',
      '\uc81c\uc8fc\ub3c4': 'KR49'
    };
    const svgObj = document.getElementById('krMapObj');
    if (!svgObj || !svgObj.contentDocument) return;
    // 모든 지역 색상 원복
    Object.values(regionToSvgId).flat().forEach(id => {
      const path = svgObj.contentDocument.getElementById(id);
      if (path) path.setAttribute('fill', 'none');
    });
    // 선택된 지역만 색칠
    regionCheckboxes.forEach(cb => {
      if (cb.checked) {
        let ids = regionToSvgId[cb.value];
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
      if (svgObj.contentDocument) {
        colorRegions();
      } else {
        svgObj.addEventListener('load', colorRegions, { once: true });
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const svgObj = document.getElementById('krMapObj');
  // 체크박스와 SVG path id 매핑
  const regionToSvgId = {
    '서울': 'KR11',
    '경기도': 'KR41',
    '강원도': 'KR42',
    '경상도': ['KR47', 'KR48', 'KR31', 'KR26'],
    '전라도': ['KR45', 'KR46', 'KR29'],
    '충청도': ['KR43', 'KR44', 'KR50', 'KR30'],
    '인천': 'KR28',
    '대전': 'KR30',
    '대구': 'KR27',
    '울산': 'KR31',
    '부산': 'KR26',
    '제주도': 'KR49'
  };

  function highlightSvgRegion(regionKor, highlight) {
    if (!svgObj || !svgObj.contentDocument) return;
    let ids = regionToSvgId[regionKor];
    if (!ids) return;
    if (!Array.isArray(ids)) ids = [ids];
    ids.forEach(id => {
      const path = svgObj.contentDocument.getElementById(id);
      if (path) {
        path.setAttribute('fill', highlight ? '#b3d1fa' : 'none');
      }
    });
  }

  // 체크박스와 SVG 연동
  const regionCheckboxes = document.querySelectorAll('.region-item input[type="checkbox"]');
  regionCheckboxes.forEach(cb => {
    cb.addEventListener('change', function() {
      // 모든 지역 색상 원복
      Object.keys(regionToSvgId).forEach(region => highlightSvgRegion(region, false));
      // 체크된 지역만 색상 적용
      regionCheckboxes.forEach(box => {
        if (box.checked) highlightSvgRegion(box.value, true);
      });
    });
  });

  // SVG 클릭 시 체크박스도 연동
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
              // 체크박스 상태 토글 (단일 선택)
              regionCheckboxes.forEach(cb => {
                cb.checked = (cb.value === regionKor);
              });
              // 모든 지역 색상 원복 후 해당 지역만 하이라이트
              Object.keys(regionToSvgId).forEach(region => highlightSvgRegion(region, false));
              highlightSvgRegion(regionKor, true);
            });
            regionPath.addEventListener('mouseenter', function() {
              regionPath.setAttribute('fill', '#b3d1fa');
            });
            regionPath.addEventListener('mouseleave', function() {
              // 체크된 지역은 유지, 나머지는 원복
              const checked = Array.from(regionCheckboxes).find(cb => cb.checked && regionToSvgId[cb.value]?.includes(id));
              if (!checked) regionPath.setAttribute('fill', 'none');
            });
          }
        });
      });
    });
  }
});


// 챗봇 기능 추가
    const chatbotFab = document.getElementById('chatbotFab');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotCloseBtn = document.getElementById('chatbotCloseBtn');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSendBtn = document.getElementById('chatbotSendBtn');
    const chatbotMessages = document.getElementById('chatbotMessages');

    const API_ENDPOINT = '/chat'; // 스프링 컨트롤러의 API 엔드포인트

    chatbotFab.addEventListener('click', () => {
        chatbotContainer.style.display = 'block';
        chatbotFab.style.display = 'none';
    });

    chatbotCloseBtn.addEventListener('click', () => {
        chatbotContainer.style.display = 'none';
        chatbotFab.style.display = 'block';
    });

    function addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.innerText = message;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // 스크롤을 맨 아래로
    }

    async function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message === '') return;

        addMessage(message, 'user');
        chatbotInput.value = '';

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sender: 'web_user', message: message }),
            });
            const data = await response.json();

            // Rasa 응답은 리스트 형태로 오며, 각 요소는 텍스트를 포함
            if (data && data.length > 0) {
                data.forEach(item => {
                    if (item.text) {
                        addMessage(item.text, 'bot');
                    }
                });
            } else {
                addMessage('죄송합니다. 이해하지 못했습니다.', 'bot');
            }
        } catch (error) {
            console.error('Error fetching from Rasa:', error);
            addMessage('챗봇 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.', 'bot');
        }
    }

    chatbotSendBtn.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });