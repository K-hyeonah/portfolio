// index.html 전용 JS (main.js와 충돌 방지)

// 즐겨찾기 관리 함수들
function getFavorites() {
  const favorites = localStorage.getItem('facilityFavorites');
  return favorites ? JSON.parse(favorites) : [];
}

function addToFavorites(facility) {
  const favorites = getFavorites();
  if (!favorites.find(f => f.id === facility.id)) {
    favorites.push(facility);
    localStorage.setItem('facilityFavorites', JSON.stringify(favorites));
  }
}

function removeFromFavorites(facilityId) {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(f => f.id !== facilityId);
  localStorage.setItem('facilityFavorites', JSON.stringify(updatedFavorites));
}

function isFavorite(facilityId) {
  const favorites = getFavorites();
  // facilityId가 숫자로 처리되도록 하여 일관된 비교를 보장합니다.
  return favorites.some(f => f.id == facilityId);
}

// 10개 단위 페이지네이션
function indexRenderFacilityPagination(total, page, perPage) {
  const pagDiv = document.getElementById('facilityPagination');
  if (!pagDiv) return;

  const maxPage = Math.ceil(total / perPage);
  const groupSize = 10;
  const totalPages = maxPage;

  let html = '';
  const groupIdx = Math.floor((page - 1) / groupSize);
  const groupStart = groupIdx * groupSize + 1;
  const groupEnd = Math.min(groupStart + groupSize - 1, totalPages);

  if (groupStart > 1) {
    html += `<a href="#" class="page-prev-group" data-page="${groupStart - 1}">&lt;</a>`;
  }

  for (let i = groupStart; i <= groupEnd; i++) {
    html += `<a href="#" class="${i === page ? 'active' : ''}" data-page="${i}">${i}</a>`;
  }

  if (groupEnd < totalPages) {
    html += `<a href="#" class="page-next-group" data-page="${groupEnd + 1}">&gt;</a>`;
  }

  pagDiv.className = 'facility-pagination';
  pagDiv.innerHTML = html;

  // 페이지네이션 링크 이벤트 바인딩
  pagDiv.querySelectorAll('a[data-page]').forEach(a => {
    a.onclick = function(e) {
      e.preventDefault();
      this.blur();
      indexRenderFacilitiesTablePaged(window.indexCurrentFacilityList, parseInt(this.dataset.page), perPage);
    };
  });
}

// 페이징된 ul/li 리스트 렌더링 (이미지 스타일)
window.indexCurrentFacilityList = []; // 현재 표시되는 목록 (페이지네이션용)
let initialFacilityData = []; // 필터링되지 않은 전체 시설 데이터

function indexRenderFacilitiesTablePaged(list, page = 1, perPage = 10) {
  window.indexCurrentFacilityList = list;
  const startIdx = (page - 1) * perPage;
  const pageList = list.slice(startIdx, startIdx + perPage);
  indexRenderFacilitiesList(pageList);
  indexRenderFacilityPagination(list.length, page, perPage);
}

// ul/li 구조로 시설 리스트 렌더링
function indexRenderFacilitiesList(list) {
  const container = document.getElementById('facilityList');
  if (!container) return;

  container.innerHTML = ''; // 이전 목록 항목 지우기

  if (!list || list.length === 0) {
    container.innerHTML = '<li style="padding:32px 0;text-align:center;color:#888;">해당 지역의 요양원이 없습니다.</li>';
    const facilityCountSpan = document.querySelector('.facility-count');
    if (facilityCountSpan) {
      facilityCountSpan.textContent = '0개';
    }
    return;
  }

  list.forEach((fac) => {
    // id가 숫자형으로 일관되게 비교되도록 합니다.
    const id = Number(fac.id);
    const isFav = isFavorite(id);
    const isHeartSelected = JSON.parse(localStorage.getItem('heartSelections') || '[]').includes(id);
    const imageUrl = fac.image || 'img/default.jpg'; // 'image' 속성 또는 'imageUrl'을 대체로 사용합니다.

    container.innerHTML += `
      <li class="facility-item" style="cursor: pointer;" onclick="window.location.href='/facilities/${id}'">
        <img src="${imageUrl}" alt="시설사진" class="facility-thumb">
        <div class="facility-info">
          <div class="facility-name">${fac.name}</div>
          <div class="facility-addr">${fac.address}</div>
          <div class="facility-tel">전화번호 <span>${fac.phone}</span></div>
        </div>
        <input type="checkbox" id="scrap${id}" class="facility-fav-chk" ${isFav ? 'checked' : ''} data-facility-id="${id}">
        <label for="scrap${id}" class="facility-fav-label"></label>
        <input type="checkbox" id="heart${id}" class="facility-heart-chk" ${isHeartSelected ? 'checked' : ''} data-facility-id="${id}">
        <label for="heart${id}" class="facility-heart-label"></label>
      </li>
    `;
  });



  const facilityCountSpan = document.querySelector('.facility-count');
  if (facilityCountSpan) {
    facilityCountSpan.textContent = list.length + '개';
  }

  // 즐겨찾기 체크박스 이벤트 추가
  container.querySelectorAll('.facility-fav-chk').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const facilityId = parseInt(this.dataset.facilityId);
      // initialFacilityData에서 시설을 찾습니다.
      const facility = initialFacilityData.find(f => Number(f.id) === facilityId);

      if (this.checked) {
        // 즐겨찾기 추가
        if (facility) {
          addToFavorites({
            id: facilityId,
            name: facility.name,
            address: facility.address,
            phone: facility.phone,
            image: facility.image || 'img/default.jpg'
          });
        }
      } else {
        // 즐겨찾기 제거
        removeFromFavorites(facilityId);
      }
      // 즐겨찾기에 추가된 경우 마이페이지로 이동
      if (this.checked) {
        setTimeout(() => {
          if (confirm('즐겨찾기에 추가되었습니다. 마이페이지에서 확인하시겠습니까?')) {
            window.location.href = '/favorite';
          }
        }, 100);
      }
    });

    // 즐겨찾기 체크박스 클릭 시 이벤트 전파 방지
    checkbox.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });

  // 하트 체크박스 이벤트 추가 (통합된 로직)
  container.querySelectorAll('.facility-heart-chk').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const facilityId = parseInt(this.dataset.facilityId);
      let heartSelections = JSON.parse(localStorage.getItem('heartSelections') || '[]');

      if (this.checked) {
        // 최대 3개까지만 선택 가능 (전체 페이지 기준)
        if (!heartSelections.includes(facilityId) && heartSelections.length >= 3) {
          this.checked = false;
          alert('최대 3개까지만 선택할 수 있습니다.');
          return;
        }

        // 하트 추가
        if (!heartSelections.includes(facilityId)) {
          heartSelections.push(facilityId);
          console.log('하트 추가:', facilityId);
        }
      } else {
        // 하트 제거
        heartSelections = heartSelections.filter(id => id !== facilityId);
        console.log('하트 제거:', facilityId);
      }

      // localStorage에 저장
      localStorage.setItem('heartSelections', JSON.stringify(heartSelections));



      // UI 업데이트
      updateCompareButton();
      updateCompareSidebar();

      // 하트 추가 시 사이드바 자동으로 열기
      if (this.checked) {
        setTimeout(() => {
          showCompareSidebar();
        }, 100);
      }
    });

    // 하트 체크박스 클릭 시 이벤트 전파 방지
    checkbox.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });
}

// 하트 선택 상태를 localStorage에 저장 (더 이상 사용하지 않음 - 통합된 로직으로 대체)

// localStorage에서 하트 선택 상태 복원 (페이지 이동 시 호출) - 더 이상 필요하지 않음
function restoreHeartSelections() {
  // 이 함수는 더 이상 사용하지 않습니다.
  // 하트 상태는 indexRenderFacilitiesList에서 직접 설정됩니다.
}

function showCompareSidebar() {
  const sidebar = document.getElementById('compareSidebar');
  const collapsedBtn = document.getElementById('collapsedSidebarBtn');
  if (sidebar) {
    sidebar.style.display = 'flex';
    document.querySelector('.facility-main').classList.add('sidebar-open');
  }
  // 사이드바가 열릴 때 접힌 버튼 숨기기
  if (collapsedBtn) {
    collapsedBtn.style.display = 'none';
  }
  console.log('사이드바 열기:', sidebar ? sidebar.style.display : '사이드바 없음');
}

function hideCompareSidebar() {
  const sidebar = document.getElementById('compareSidebar');
  const collapsedBtn = document.getElementById('collapsedSidebarBtn');
  if (sidebar) {
    sidebar.style.display = 'none';
    document.querySelector('.facility-main').classList.remove('sidebar-open');
  }
  // 사이드바가 닫힐 때 접힌 버튼 표시 (선택된 항목이 있을 때만)
  const heartSelections = JSON.parse(localStorage.getItem('heartSelections') || '[]');
  if (collapsedBtn && heartSelections.length > 0) {
    collapsedBtn.style.display = 'flex';
    collapsedBtn.style.position = 'fixed';
    collapsedBtn.style.top = '50%';
    collapsedBtn.style.right = '20px';
    collapsedBtn.style.left = 'auto';
    collapsedBtn.style.transform = 'translateY(-50%)';
  }
  console.log('사이드바 닫기, 비교 버튼 표시:', collapsedBtn ? collapsedBtn.style.display : '버튼 없음');
}

function updateCompareSidebar() {
  const heartSelections = JSON.parse(localStorage.getItem('heartSelections') || '[]');
  const compareList = document.getElementById('compareList');
  const compareCount = document.getElementById('compareCount');

  if (!compareList || !compareCount) return;

  // 카운트 업데이트
  compareCount.textContent = heartSelections.length;

  // 사이드바는 기본적으로 닫혀있고, 비교 버튼만 표시
  const sidebar = document.getElementById('compareSidebar');
  const collapsedBtn = document.getElementById('collapsedSidebarBtn');

  if (heartSelections.length > 0) {
    // 선택된 항목이 있으면 사이드바는 닫혀있고 비교 버튼만 표시
    if (sidebar) {
      sidebar.style.display = 'none';
      document.querySelector('.facility-main').classList.remove('sidebar-open');
    }
    if (collapsedBtn) {
      collapsedBtn.style.display = 'flex';
      collapsedBtn.style.position = 'fixed';
      collapsedBtn.style.top = '50%';
      collapsedBtn.style.right = '20px';
      collapsedBtn.style.left = 'auto';
      collapsedBtn.style.transform = 'translateY(-50%)';
    }
  } else {
    // 선택된 항목이 없으면 모두 숨김
    if (sidebar) {
      sidebar.style.display = 'none';
      document.querySelector('.facility-main').classList.remove('sidebar-open');
    }
    if (collapsedBtn) {
      collapsedBtn.style.display = 'none';
    }
  }

  // 비교 목록 업데이트
  compareList.innerHTML = '';

  if (heartSelections.length === 0) {
    compareList.classList.add('empty');
    return;
  }

  compareList.classList.remove('empty');

  heartSelections.forEach(facilityId => {
    // initialFacilityData에서 시설을 찾습니다.
    const facility = initialFacilityData.find(f => Number(f.id) === facilityId);

    if (facility) {
      const compareItem = document.createElement('div');
      compareItem.className = 'compare-item';
      compareItem.innerHTML = `
        <div class="compare-item-info">
          <div class="compare-item-name">${facility.name}</div>
        </div>
        <button class="remove-item-btn" data-facility-id="${facilityId}">×</button>
      `;

      compareList.appendChild(compareItem);
    }
  });

  // 삭제 버튼 이벤트 추가
  compareList.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const facilityId = parseInt(this.dataset.facilityId);
      let heartSelections = JSON.parse(localStorage.getItem('heartSelections') || '[]');

      // localStorage에서 제거
      heartSelections = heartSelections.filter(id => id !== facilityId);
      localStorage.setItem('heartSelections', JSON.stringify(heartSelections));

      // UI 업데이트
      updateCompareButton();
      updateCompareSidebar();
    });
  });
}

// 비교담기 버튼 업데이트 함수
function updateCompareButton() {
  const heartSelections = JSON.parse(localStorage.getItem('heartSelections') || '[]');
  const collapsedCount = document.getElementById('collapsedCount');
  const collapsedSidebarBtn = document.getElementById('collapsedSidebarBtn');

  // '비교' 버튼의 숫자 업데이트
  if (collapsedCount) {
    collapsedCount.textContent = heartSelections.length;
  }

  // 비교하기 버튼 표시/숨김 로직
  if (collapsedSidebarBtn) {
    const sidebar = document.getElementById('compareSidebar');
    const isSidebarOpen = sidebar && (sidebar.style.display === 'flex' || sidebar.style.display === 'block');

    if (heartSelections.length > 0) {
      if (isSidebarOpen) {
        // 사이드바가 열려있으면 버튼 숨김
        collapsedSidebarBtn.style.display = 'none';
      } else {
        // 사이드바가 닫혀있으면 버튼 표시 (오른쪽 중앙)
        collapsedSidebarBtn.style.display = 'flex';
        collapsedSidebarBtn.style.position = 'fixed';
        collapsedSidebarBtn.style.top = '50%';
        collapsedSidebarBtn.style.right = '20px';
        collapsedSidebarBtn.style.left = 'auto';
        collapsedSidebarBtn.style.transform = 'translateY(-50%)';
      }
    } else {
      // 선택된 항목이 없으면 버튼 숨김
      collapsedSidebarBtn.style.display = 'none';
    }
  }

  // '비교' 버튼의 빨간색 뱃지 로직
  if (collapsedSidebarBtn) {
    const existingBadge = collapsedSidebarBtn.querySelector('.compare-badge');
    if (existingBadge) {
      existingBadge.remove();
    }

    if (heartSelections.length > 0) {
      const badge = document.createElement('div');
      badge.className = 'compare-badge';
      badge.style.cssText = `
        position: absolute;
        top: -5px;
        right: 5px;
        width: 12px;
        height: 12px;
        background: #ff4444;
        border-radius: 50%;
        border: 2px solid #fff;
        z-index: 10;
      `;
      collapsedSidebarBtn.style.position = 'relative';
      collapsedSidebarBtn.appendChild(badge);
    }
  }
}

// 초기 시설 데이터를 설정하고 렌더링을 시작하는 함수
function initializeFacilityData(data) {
  initialFacilityData = data;
  indexRenderFacilitiesTablePaged(initialFacilityData, 1, 10);

  // 초기 상태 설정: 사이드바는 닫혀있고, 비교 버튼만 표시
  const sidebar = document.getElementById('compareSidebar');
  const collapsedBtn = document.getElementById('collapsedSidebarBtn');

  if (sidebar) {
    sidebar.style.display = 'none';
    document.querySelector('.facility-main').classList.remove('sidebar-open');
  }

  // 초기 데이터 로드 후 비교담기 버튼 업데이트
  setTimeout(() => {
    updateCompareButton();
    updateCompareSidebar(); // 사이드바 초기 상태 업데이트

    // 비교 시설이 있으면 비교 버튼 표시 (오른쪽 중앙)
    const heartSelections = JSON.parse(localStorage.getItem('heartSelections') || '[]');
    if (heartSelections.length > 0 && collapsedBtn) {
      collapsedBtn.style.display = 'flex';
      collapsedBtn.style.position = 'fixed';
      collapsedBtn.style.top = '50%';
      collapsedBtn.style.right = '20px';
      collapsedBtn.style.left = 'auto';
      collapsedBtn.style.transform = 'translateY(-50%)';
      console.log('초기화: 비교 버튼 표시됨');
    } else {
      console.log('초기화: 비교 시설 없음 또는 버튼 없음');
    }
  }, 100);
}


// 정렬 버튼, 지역 필터, SVG 지도, 체크박스 등 index.html 전용 이벤트
window.addEventListener('DOMContentLoaded', function() {
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

  /*function highlightAndFilterRegion(regionKor) {
    regionCheckboxes.forEach(cb => {
      cb.checked = (cb.value === regionKor);
    });
    colorRegions();
    const filtered = initialFacilityData.filter(fac => fac.address.includes(regionKor));
    indexRenderFacilitiesTablePaged(filtered.length ? filtered : initialFacilityData, 1, 10);
  }*/

  function highlightAndFilterRegion(regionKor) {
    regionCheckboxes.forEach(cb => {
      cb.checked = (cb.value === regionKor);
    });
    colorRegions();
    const filtered = initialFacilityData.filter(fac => {
      if (regionKor === '강원도') {
        return fac.address.includes('강원도') || fac.address.includes('강원특별자치도');
      } else if (regionKor === '경상도') {
        return fac.address.includes('경상도') || fac.address.includes('경상북도') || fac.address.includes('경상남도');
      } else if (regionKor === '전라도') {
        return fac.address.includes('경상도') || fac.address.includes('전라북도') || fac.address.includes('전북특별자치도') || fac.address.includes('전라남도');
      } else if (regionKor === '충청도') {
        return fac.address.includes('충청도') || fac.address.includes('충청북도') || fac.address.includes('충청남도');
      } else if (regionKor === '제주도') {
        return fac.address.includes('충청도') || fac.address.includes('제주특별자치도');
      }
      return fac.address.includes(regionKor);
    });

  indexRenderFacilitiesTablePaged(filtered, 1, 10);
}

  function colorRegions() {
    Object.values(regionToSvgId).flat().forEach(id => {
      const path = svgObj?.contentDocument?.getElementById(id);
      if (path) path.setAttribute('fill', 'none');
    });
    regionCheckboxes.forEach(cb => {
      if (cb.checked) {
        let ids = regionToSvgId[cb.value];
        if (!ids) return;
        if (!Array.isArray(ids)) ids = [ids];
        ids.forEach(id => {
          const path = svgObj?.contentDocument?.getElementById(id);
          if (path) path.setAttribute('fill', '#e6f0fa');
        });
      }
    });
  }

  regionCheckboxes.forEach(cb => {
    cb.addEventListener('change', function() {
      if (this.checked) {
        highlightAndFilterRegion(this.value);
      } else {
        const anyChecked = Array.from(regionCheckboxes).some(checkbox => checkbox.checked);
        if (!anyChecked) {
          indexRenderFacilitiesTablePaged(initialFacilityData, 1, 10);
          colorRegions(); // 체크된 항목이 없으면 모든 지도를 초기화
        }
      }
    });
  });

  // SVG 지도 path 클릭 이벤트
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
              regionCheckboxes.forEach(cb => {
                cb.checked = (cb.value === regionKor);
              });
              highlightAndFilterRegion(regionKor);
            });
            regionPath.addEventListener('mouseenter', function() {
              regionPath.setAttribute('fill', '#b3d1fa');
            });
            regionPath.addEventListener('mouseleave', function() {
              const checked = Array.from(regionCheckboxes).find(cb => cb.checked && regionToSvgId[cb.value]?.includes(id));
              if (!checked) regionPath.setAttribute('fill', 'none');
            });
          }
        });
      });
    });
  }

  // 검색 기능
  const searchInput = document.getElementById('facilitySearchInput');
  const searchBtn = document.getElementById('facilitySearchBtn');
  const searchForm = document.getElementById('facilitySearchForm');

  function doFacilitySearch() {
    const keyword = searchInput.value.trim();
    if (!keyword) {
      indexRenderFacilitiesTablePaged(initialFacilityData, 1, 10);
      return;
    }
    const filtered = initialFacilityData.filter(f => f.name.includes(keyword) || f.address.includes(keyword));
    indexRenderFacilitiesTablePaged(filtered, 1, 10);
  }
  searchBtn.addEventListener('click', doFacilitySearch);
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      doFacilitySearch();
    }
  });
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    doFacilitySearch();
  });

  // 사이드바 이벤트 리스너들
  const closeSidebarBtn = document.getElementById('closeSidebar');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const addFacilityBtn = document.getElementById('addFacilityBtn');
  const compareSearchBtn = document.getElementById('compareSearchBtn');

  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', function() {
      hideCompareSidebar();
      updateCompareButton(); // 버튼 상태 업데이트
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', function() {
      // localStorage에서 heartSelections 전체 삭제
      localStorage.setItem('heartSelections', JSON.stringify([]));
      // 모든 하트 체크박스 해제 (현재 페이지)
      document.querySelectorAll('.facility-heart-chk').forEach(checkbox => {
        checkbox.checked = false;
      });
      updateCompareButton();
      updateCompareSidebar();
    });
  }

  /*if (addFacilityBtn) {
    addFacilityBtn.addEventListener('click', function() {
      // 비교 페이지로 이동
      window.location.href = 'compare.html';
    });
  }*/
  if (addFacilityBtn) {
    addFacilityBtn.addEventListener('click', function() {
      // 1. localStorage에서 저장된 ID 목록을 가져옵니다.
      const heartSelections = JSON.parse(localStorage.getItem('heartSelections') || '[]');

      // 2. ID 목록이 비어있지 않은 경우에만 URL을 생성합니다.
      if (heartSelections.length > 0) {
        // 3. ID들을 URL 쿼리 파라미터로 변환합니다. (예: ?ids=1,2,3)
        const queryString = `?ids=${heartSelections.join(',')}`;

        // 4. compare.html 페이지로 이동합니다.
        window.location.href = `/compare${queryString}`;
      } else {
        // 선택된 항목이 없을 경우, 그냥 compare.html 페이지로 이동합니다.
        window.location.href = '/compare';
      }
    });
  }

  if (compareSearchBtn) {
    compareSearchBtn.addEventListener('click', function() {
      // VS 검색 기능 (현재는 알림만)
      alert('VS 검색 기능은 개발 중입니다.');
    });
  }

  // 접힌 사이드바 버튼 이벤트 리스너
  const collapsedSidebarBtn = document.getElementById('collapsedSidebarBtn');
  if (collapsedSidebarBtn) {
    collapsedSidebarBtn.addEventListener('click', function() {
      showCompareSidebar();
      updateCompareButton(); // 버튼 상태 업데이트
    });
  }
});