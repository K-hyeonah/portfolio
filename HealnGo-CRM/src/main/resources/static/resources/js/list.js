// 병원 아이템 클릭 핸들러 (HTML onclick에서 호출)
function handleHospitalClick(element) {
    console.log('\n🟢🟢🟢 handleHospitalClick 호출! 🟢🟢🟢');
    
    const itemId = element.dataset.itemId || element.getAttribute('data-item-id');
    const hospital = element.dataset.hospital || element.getAttribute('data-hospital');
    
    console.log('병원명:', hospital);
    console.log('item_id:', itemId);
    
    // 1. 클릭 로그 전송 (무조건)
    if (itemId) {
        logCompanyClick(itemId);
    } else {
        console.error('❌ item_id가 없음!');
    }
    
    // 2. 병원 선택
    selectHospital(element);
    
    // 3. 상세 정보 표시
    if (element.classList.contains('active')) {
        showHospitalDetail(element);
    }
    
    console.log('🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢\n');
}

// 값 공백/placeholder 검사
function isBlank(v) {
    return !v || /^\s*$/.test(v);
}

// 홈페이지를 안전하게 HTML로 렌더 (없으면 링크 없이 텍스트만)
function websiteToHtml(raw) {
    const text = (raw || '').trim();

    // 비어있거나 placeholder면 링크 만들지 않음
    if (isBlank(text) || text === '-' || text === '홈페이지 정보 없음') {
        return '홈페이지 정보 없음';
    }

    // 스킴 없으면 https 붙이기
    let url = text;
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }

    // URL 유효성 최종 체크 실패 시에도 링크 금지
    try {
        new URL(url);
    } catch {
        return '홈페이지 정보 없음';
    }

    // 정상일 때만 앵커로 렌더
    return `<a href="${url}" target="_blank" rel="noopener">${text}</a>`;
}


// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', async function() {
    console.log('병원 목록 페이지 로드 완료');

    bindHospitalItemEvents();   // ✅ 여기서 호출
    bindPagination();           // ✅ AJAX 페이징 바인딩
    // updateTotalCount();
    await restoreHeartStates();

    const didAutoOpen = await autoSelectFromQuery();

    const detailContent = document.querySelector('.detail-content');
    const detailPlaceholder = document.querySelector('.detail-placeholder');
    if (!didAutoOpen) {
        if (detailContent) detailContent.style.display = 'none';
        if (detailPlaceholder) detailPlaceholder.style.display = 'block';
    }
});

function bindHospitalItemEvents() {
    // HTML에서 onclick="handleHospitalClick(this)"를 사용하므로
    // JavaScript 이벤트 리스너 바인딩은 건너뜀
    console.log('✅ bindHospitalItemEvents - HTML onclick 사용 중');
    return;
    
    /* 사용하지 않음 - HTML onclick으로 대체됨
    const list = document.querySelector('.hospital-list');
    console.log('찾은 hospital-list:', list);

    if (!list || list.dataset.bound === '1') {
        console.log('이벤트 바인딩 건너뜀 - 리스트 없음 또는 이미 바인딩됨');
        return; // 중복 바인딩 방지
    }
    list.dataset.bound = '1';

    console.log('병원 아이템 이벤트 바인딩 완료');

    list.addEventListener('click', function(e) {
        console.log('클릭 이벤트 발생:', e.target);

        // 하트 클릭 확인 (하트 요소 또는 하트 아이콘 클릭)
        const heart = e.target.closest('.hospital-heart');
        const heartIcon = e.target.closest('.hospital-heart i');

        if (heart || heartIcon) {
            console.log('하트 클릭 감지됨');

            // 병원 아이템 찾기
            const item = (heart || heartIcon).closest('.hospital-item');
            if (!item) {
                console.log('병원 아이템을 찾을 수 없습니다');
                return;
            }

            console.log('하트 요소:', heart);
            console.log('병원 아이템:', item);
            console.log('병원 이름:', item.dataset.hospital);
            console.log('아이템 ID:', item.dataset.itemId);

            e.preventDefault();
            e.stopPropagation();

            // 하트 상태 확인
            const heartIconElement = item.querySelector('.hospital-heart i');
            const isCurrentlyLiked = heartIconElement.classList.contains('fas');

            if (isCurrentlyLiked) {
                // 이미 즐겨찾기된 상태면 바로 삭제
                removeFromFavorite(item);
            } else {
                // 즐겨찾기되지 않은 상태면 모달창 표시
                try {
                    showFavoriteConfirmModal(item);
                    console.log('모달창 호출 완료');
                } catch (error) {
                    console.error('모달창 호출 중 오류:', error);
                }
            }
            return;
        }

        // HTML onclick 사용
    });
    */
}



// 병원 상세 정보 표시
function showHospitalDetail(hospitalItem) {
    console.log('showHospitalDetail 함수 호출됨');
    const hospitalName = hospitalItem.dataset.hospital;
    const detailContent = document.querySelector('.detail-content');
    const detailPlaceholder = document.querySelector('.detail-placeholder');

    console.log('병원 이름:', hospitalName);
    console.log('detailContent 요소:', detailContent);
    console.log('detailPlaceholder 요소:', detailPlaceholder);

    if (!detailContent || !detailPlaceholder) {
        console.error('상세 패널 요소를 찾을 수 없습니다');
        return;
    }

    // 플레이스홀더 숨기기
    detailPlaceholder.style.display = 'none';
    console.log('플레이스홀더 숨김');

    // 상세 정보 로드 및 표시
    detailContent.style.display = 'block';
    const detailHTML = generateHospitalDetailHTML(hospitalName);
    console.log('생성된 상세 HTML:', detailHTML);
    detailContent.innerHTML = detailHTML;
    console.log('상세 내용 설정 완료');

    // 지도 초기화 (Google Maps API가 로드된 경우)
    const initializeMapWhenReady = () => {
        const mapElement = detailContent.querySelector('#map');
        if (mapElement) {
            const hospitalData = getHospitalData(hospitalName);
            console.log('지도 초기화 시작 - 병원:', hospitalName, '주소:', hospitalData.address);

            // Google Maps API가 로드되었는지 확인
            if (typeof google !== 'undefined' && google.maps) {
                // map.js의 initializeMap 함수 사용
                initializeMap(mapElement, hospitalName, hospitalData.address);
            } else {
                // API가 아직 로드되지 않았으면 다시 시도
                setTimeout(initializeMapWhenReady, 100);
            }
        } else {
            console.error('지도 요소를 찾을 수 없습니다.');
        }
    };

    // DOM 업데이트 후 지도 초기화 시작 (약간의 지연 추가)
    setTimeout(initializeMapWhenReady, 100);

    console.log('상세 정보 표시:', hospitalName);
}



// 클릭 로그 API 호출
function logCompanyClick(companyId) {
    try {
        if (!companyId) {
            console.warn('companyId가 비어 있어 클릭 로그를 건너뜁니다.');
            return;
        }
        fetch(`/api/clicks/${encodeURIComponent(companyId)}`, {
            method: 'POST'
        }).then(res => {
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            console.debug('클릭 로그 저장 완료:', companyId);
        }).catch(err => {
            console.warn('클릭 로그 저장 실패:', err);
        });
    } catch (e) {
        console.warn('클릭 로그 실행 중 예외:', e);
    }
}

function generateHospitalDetailHTML(hospitalName) {
    const data = getHospitalData(hospitalName);

    const websiteHtml = websiteToHtml(data.website);
    const phone   = (!isBlank(data.phone) && data.phone !== '전화번호 정보 없음')
        ? data.phone : '연락처 정보 없음';
    const address = !isBlank(data.address) ? data.address : '주소 정보 없음';

    return `
    <div class="hospital-detail-info">
      <div class="hospital-header">
        <h2 class="hospital-title">${hospitalName}</h2>
        <div class="hospital-image">
          <div id="photo-gallery" class="photo-gallery">사진 로딩 중…</div>
        </div>
      </div>

      <div class="hospital-info-table">
        <table>
          <tr>
            <th>홈페이지</th>
            <td class="hospital_website">${websiteHtml}</td>
          </tr>
          <tr>
            <th>연락처</th>
            <td class="hospital_phonenumber">${phone}</td>
          </tr>
          <tr>
            <th>위치 및 교통정보</th>
            <td class="hospital_address">${address}</td>
          </tr>
        </table>
      </div>

      <div class="hospital-map">
        <h3>지도</h3>
        <div id="map" class="map"></div>
      </div>
    </div>
  `;
}



// 병원 데이터 가져오기 (DB에서 실제 데이터 사용)
function getHospitalData(hospitalName) {
    // 현재 페이지의 병원 목록에서 해당 병원 찾기
    const hospitalItems = document.querySelectorAll('.hospital-item');

    for (let item of hospitalItems) {
        if (item.dataset.hospital === hospitalName) {
            // DB에서 가져온 실제 데이터 사용
            const address = item.dataset.address || '주소 정보 없음';
            const phone = item.dataset.phone || '전화번호 정보 없음';
            const homepage = item.dataset.homepage || '홈페이지 정보 없음';
            const region = item.dataset.region || '';
            const subregion = item.dataset.subregion || '';

            // 지하철 정보는 기본값 사용 (DB에 지하철 정보가 없으므로)
            const subway = '지하철 정보 없음';

            return {
                website: homepage,
                phone: phone,
                address: address,
                subway: subway,
                region: region,
                subregion: subregion
            };
        }
    }

    // 병원을 찾지 못한 경우 기본값 반환
    return {
        website: '-',
        phone: '-',
        address: '주소 정보 없음',
        subway: '지하철 정보 없음',
        region: '',
        subregion: ''
    };
}

// 병원 필터링
function filterHospitals() {
    const selectedCategories = getSelectedCategories();
    const hospitalItems = document.querySelectorAll('.hospital-item');

    hospitalItems.forEach(item => {
        const hospitalName = item.querySelector('.hospital-name').textContent;
        const shouldShow = selectedCategories.length === 0 ||
            selectedCategories.some(category =>
                hospitalName.includes(getCategoryKeyword(category))
            );

        if (shouldShow) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });

    updateTotalCount();
}





// 병원 선택
function selectHospital(hospitalItem) {
    // 현재 선택된 병원이 다시 클릭된 경우 선택 취소
    if (hospitalItem.classList.contains('active')) {
        hospitalItem.classList.remove('active');
        console.log('병원 선택 취소:', hospitalItem.dataset.hospital);

        // detail-content 숨기고 placeholder 표시
        const detailContent = document.querySelector('.detail-content');
        const detailPlaceholder = document.querySelector('.detail-placeholder');

        if (detailContent) {
            detailContent.style.display = 'none';
        }
        if (detailPlaceholder) {
            detailPlaceholder.style.display = 'block';
        }
    } else {
        // 기존 선택 해제
        const activeItems = document.querySelectorAll('.hospital-item.active');
        activeItems.forEach(item => {
            item.classList.remove('active');
        });

        // 새로운 선택
        hospitalItem.classList.add('active');
        console.log('병원 선택:', hospitalItem.dataset.hospital);
    }
}

// 페이지네이션 처리
function handlePagination(clickedLink) {
    const pageLinks = document.querySelectorAll('.page-link');
    pageLinks.forEach(link => {
        link.classList.remove('active');
    });

    clickedLink.classList.add('active');

    const pageNumber = clickedLink.textContent;
    console.log('페이지 이동:', pageNumber);

    // 실제 페이지네이션 로직 구현 (서버 요청 등)
    // loadPage(pageNumber);
}

// ✅ 더 이상 클라이언트에서 총 건수 계산/덮어쓰기 하지 않음
function updateTotalCount(){}

// 필터 초기화
function resetFilters() {
    const checkboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    const hospitalItems = document.querySelectorAll('.hospital-item');
    hospitalItems.forEach(item => {
        item.style.display = 'flex';
        item.style.order = '';
    });

    updateTotalCount();
    console.log('필터 초기화');
}

// 즐겨찾기 목록 가져오기
function getFavoriteHospitals() {
    const favoriteItems = document.querySelectorAll('.hospital-item .fas.fa-heart');
    return Array.from(favoriteItems).map(heart =>
        heart.closest('.hospital-item').dataset.hospital
    );
}

// 즐겨찾기만 표시
function showFavoritesOnly() {
    const hospitalItems = document.querySelectorAll('.hospital-item');

    hospitalItems.forEach(item => {
        const heartIcon = item.querySelector('.hospital-heart i');
        if (heartIcon.classList.contains('fas')) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });

    updateTotalCount();
    console.log('즐겨찾기만 표시');
}

// 로그인 상태 확인
async function checkLoginStatus() {
    try {
        const response = await fetch('/favorite/check-login');
        const isLoggedIn = await response.json();
        console.log('로그인 상태:', isLoggedIn);
        return isLoggedIn;
    } catch (error) {
        console.error('로그인 상태 확인 중 오류:', error);
        return false;
    }
}

// 하트 상태 초기화
async function restoreHeartStates() {
    try {
        const hospitalItems = document.querySelectorAll('.hospital-item');

        // 현재 페이지가 즐겨찾기 페이지인지 확인
        const isFavoritePage = window.location.pathname === '/favorite';
        console.log('현재 페이지가 즐겨찾기 페이지인가?:', isFavoritePage);

        if (isFavoritePage) {
            // 즐겨찾기 페이지에서는 모든 병원이 즐겨찾기된 상태로 표시
            hospitalItems.forEach(item => {
                const hospitalName = item.dataset.hospital;
                const heartIcon = item.querySelector('.hospital-heart i');

                if (heartIcon) {
                    heartIcon.classList.remove('far');
                    heartIcon.classList.add('fas');
                    heartIcon.style.color = '#ff4757';
                    console.log('즐겨찾기 페이지 - 하트 활성화:', hospitalName);
                }
            });
        } else {
            // 로그인 상태 확인
            const isLoggedIn = await checkLoginStatus();

            if (!isLoggedIn) {
                // 로그아웃 상태면 모든 하트를 빈 하트로 표시
                hospitalItems.forEach(item => {
                    const hospitalName = item.dataset.hospital;
                    const heartIcon = item.querySelector('.hospital-heart i');

                    if (heartIcon) {
                        // 모든 하트를 빈 하트로 표시
                        heartIcon.classList.remove('fas');
                        heartIcon.classList.add('far');
                        heartIcon.style.color = '#ccc';
                        heartIcon.style.opacity = '1';
                        console.log('로그아웃 상태 - 모든 하트 빈 하트로 초기화:', hospitalName);
                    }
                });
            } else {
                // 로그인 상태면 서버에서 실제 즐겨찾기 상태를 가져와서 설정
                try {
                    const favoritesResponse = await fetch('/favorite/list');
                    if (favoritesResponse.ok) {
                        const favorites = await favoritesResponse.json();
                        const favoriteItemIds = favorites.map(fav => fav.id);

                        hospitalItems.forEach(item => {
                            const hospitalName = item.dataset.hospital;
                            const heartIcon = item.querySelector('.hospital-heart i');
                            const itemId = parseInt(item.dataset.itemId);

                            if (heartIcon) {
                                if (favoriteItemIds.includes(itemId)) {
                                    // 서버에서 찜해둔 하트는 빨간색으로 표시
                                    heartIcon.classList.remove('far');
                                    heartIcon.classList.add('fas');
                                    heartIcon.style.color = '#ff4757';
                                    heartIcon.style.opacity = '1';
                                    console.log('로그인 상태 - 서버에서 찜한 하트 복원:', hospitalName);
                                } else {
                                    // 찜하지 않은 하트는 빈 하트로 표시
                                    heartIcon.classList.remove('fas');
                                    heartIcon.classList.add('far');
                                    heartIcon.style.color = '#ccc';
                                    heartIcon.style.opacity = '1';
                                }
                            }
                        });
                    } else {
                        console.error('즐겨찾기 목록 가져오기 실패');
                        // 실패 시 localStorage 사용
                        const heartStates = JSON.parse(localStorage.getItem('hospitalHeartStates') || '{}');
                        hospitalItems.forEach(item => {
                            const hospitalName = item.dataset.hospital;
                            const heartIcon = item.querySelector('.hospital-heart i');

                            if (heartIcon) {
                                if (heartStates[hospitalName]) {
                                    heartIcon.classList.remove('far');
                                    heartIcon.classList.add('fas');
                                    heartIcon.style.color = '#ff4757';
                                    heartIcon.style.opacity = '1';
                                } else {
                                    heartIcon.classList.remove('fas');
                                    heartIcon.classList.add('far');
                                    heartIcon.style.color = '#ccc';
                                    heartIcon.style.opacity = '1';
                                }
                            }
                        });
                    }
                } catch (error) {
                    console.error('즐겨찾기 상태 확인 중 오류:', error);
                    // 오류 시 localStorage 사용
                    const heartStates = JSON.parse(localStorage.getItem('hospitalHeartStates') || '{}');
                    hospitalItems.forEach(item => {
                        const hospitalName = item.dataset.hospital;
                        const heartIcon = item.querySelector('.hospital-heart i');

                        if (heartIcon) {
                            if (heartStates[hospitalName]) {
                                heartIcon.classList.remove('far');
                                heartIcon.classList.add('fas');
                                heartIcon.style.color = '#ff4757';
                                heartIcon.style.opacity = '1';
                            } else {
                                heartIcon.classList.remove('fas');
                                heartIcon.classList.add('far');
                                heartIcon.style.color = '#ccc';
                                heartIcon.style.opacity = '1';
                            }
                        }
                    });
                }
            }
        }

        console.log('하트 상태 복원 완료');
    } catch (error) {
        console.error('하트 상태 복원 중 오류:', error);
    }
}

// ---- AJAX Pagination ----

// 초기 바인딩 (DOMContentLoaded 끝에 호출)
function bindPagination() {
    const pager = document.querySelector('.pagination');
    if (!pager || pager.dataset.bound === '1') return;
    pager.dataset.bound = '1';

    pager.addEventListener('click', function (e) {
        const a = e.target.closest('a.page-link');
        if (!a) return;
        e.preventDefault();
        ajaxNavigate(a.href);
    });
}

// 히스토리 뒤로/앞으로도 AJAX로 복원
window.addEventListener('popstate', () => {
    ajaxNavigate(location.href, { push: false });
});

// 공통: 서버에서 받은 HTML에서 필요한 부분만 교체
function replaceSection(doc, selector) {
    const newEl = doc.querySelector(selector);
    const curEl = document.querySelector(selector);
    if (newEl && curEl) {
        curEl.innerHTML = newEl.innerHTML;
    }
}

// 핵심: 링크를 AJAX로 로드해서 부분 교체 + URL 갱신
async function ajaxNavigate(url, { push = true } = {}) {
    try {
        // 로딩 상태(선택): 리스트 살짝 투명하게
        const listWrap = document.querySelector('.hospital-list');
        if (listWrap) listWrap.style.opacity = '0.5';

        const res = await fetch(url, {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);

        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        // 필요한 영역만 갈아끼우기
        replaceSection(doc, '.hospital-list');
        replaceSection(doc, '.pagination');
        replaceSection(doc, '.total-count');

        // 교체 후 필요한 이벤트 다시 바인딩
        bindHospitalItemEvents();  // 병원 아이템/하트 클릭 등
        // pagination 컨테이너는 같은 노드이면 이벤트 위임 유지됨
        // 만약 .pagination 자체를 통으로 교체한다면 아래 한 줄을 다시 호출:
        bindPagination();

        // URL만 바꾸고 페이지는 그대로 유지
        if (push) history.pushState({ url }, '', url);

        // 부드럽게 리스트 상단으로 스크롤
        const leftPanel = document.querySelector('.left-panel');
        if (leftPanel) {
            leftPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

    } catch (err) {
        console.error('AJAX 페이지 네비게이션 실패, 폴백으로 이동합니다.', err);
        // 문제가 생기면 그냥 원래 방식으로 이동
        window.location.href = url;
    } finally {
        const listWrap = document.querySelector('.hospital-list');
        if (listWrap) listWrap.style.opacity = '';
    }
}

// 즐겨찾기 확인 모달창 표시
function showFavoriteConfirmModal(hospitalItem) {
    console.log('showFavoriteConfirmModal 함수 호출됨');
    console.log('전달받은 hospitalItem:', hospitalItem);

    const hospitalName = hospitalItem.dataset.hospital;
    const itemId = hospitalItem.dataset.itemId;

    console.log('병원 이름:', hospitalName);
    console.log('아이템 ID:', itemId);

    // 먼저 하트 상태를 빨간색으로 변경 (즉시 피드백)
    const heartIcon = hospitalItem.querySelector('.hospital-heart i');
    if (heartIcon) {
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        heartIcon.style.color = '#ff4757';
        console.log('하트 상태 즉시 변경됨');
    }

    // 모달 HTML 생성
    const modalHTML = `
        <div id="favoriteConfirmModal" class="favorite-confirm-modal">
            <div class="favorite-confirm-content">
                <h3>즐겨찾기 확인</h3>
                <p>"${hospitalName}"을(를) 즐겨찾기에<br>추가하고 즐겨찾기 페이지로<br>이동하시겠습니까?</p>
                <div class="favorite-confirm-buttons">
                    <button class="favorite-confirm-yes" data-item-id="${itemId}" data-hospital-name="${hospitalName}">네</button>
                    <button class="favorite-confirm-no">아니오</button>
                </div>
            </div>
        </div>
    `;

    console.log('생성된 모달 HTML:', modalHTML);

    // 기존 모달 제거
    const existingModal = document.getElementById('favoriteConfirmModal');
    if (existingModal) {
        existingModal.remove();
    }

    // 새 모달 추가
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    console.log('모달 HTML DOM에 추가됨');

    // 모달 스타일 적용
    const modal = document.getElementById('favoriteConfirmModal');
    console.log('찾은 모달 요소:', modal);

    if (modal) {
        modal.style.display = 'flex';
        console.log('모달 표시 설정 완료');
    } else {
        console.error('모달 요소를 찾을 수 없습니다!');
    }

    // 이벤트 리스너 추가
    const yesBtn = modal.querySelector('.favorite-confirm-yes');
    const noBtn = modal.querySelector('.favorite-confirm-no');

    yesBtn.addEventListener('click', () => {
        addToFavoriteAndNavigate(itemId, hospitalItem);
        closeFavoriteConfirmModal();
    });

    noBtn.addEventListener('click', () => {
        // "아니오" 클릭 시에도 찜하기는 그대로 추가하고 모달만 닫기
        addToFavoriteWithoutNavigate(itemId, hospitalItem);
        closeFavoriteConfirmModal();
    });

    // 모달 외부 클릭 시 닫기 (찜하기는 그대로 추가)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            // "아니오"와 동일한 동작
            addToFavoriteWithoutNavigate(itemId, hospitalItem);
            closeFavoriteConfirmModal();
        }
    });
}

// 모달창 닫기
function closeFavoriteConfirmModal() {
    const modal = document.getElementById('favoriteConfirmModal');
    if (modal) {
        modal.remove();
    }
}

// 즐겨찾기 삭제
function removeFromFavorite(hospitalItem) {
    const heartIcon = hospitalItem.querySelector('.hospital-heart i');
    const hospitalName = hospitalItem.dataset.hospital;
    const itemId = hospitalItem.dataset.itemId;

    // 현재 페이지가 즐겨찾기 페이지인지 확인
    const isFavoritePage = window.location.pathname === '/favorite';

    // 하트 상태 변경
    heartIcon.classList.remove('fas');
    heartIcon.classList.add('far');
    heartIcon.style.color = '#ccc';

    // localStorage에서 하트 상태 제거
    saveHeartState(hospitalName, false);

    // 서버에 즐겨찾기 삭제 요청
    fetch(`/favorite/remove/${itemId}`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
        .then(res => res.text())
        .then(result => {
            console.log("즐겨찾기 삭제 성공:", result);
            // 즐겨찾기 페이지에서는 삭제 후 페이지 새로고침
            if (isFavoritePage) {
                window.location.reload();
            }
        })
        .catch(error => {
            console.error("즐겨찾기 삭제 실패:", error);
            // 실패 시 하트 상태 되돌리기
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas');
            heartIcon.style.color = '#ff4757';
            // localStorage에서도 되돌리기
            saveHeartState(hospitalName, true);
        });
}

// 하트 상태를 localStorage에 저장
function saveHeartState(hospitalName, isLiked) {
    try {
        const heartStates = JSON.parse(localStorage.getItem('hospitalHeartStates') || '{}');
        heartStates[hospitalName] = isLiked;
        localStorage.setItem('hospitalHeartStates', JSON.stringify(heartStates));
        console.log('하트 상태 저장:', hospitalName, isLiked);
    } catch (error) {
        console.error('하트 상태 저장 중 오류:', error);
    }
}

// 즐겨찾기 추가 (페이지 이동 없음)
function addToFavoriteWithoutNavigate(itemId, hospitalItem) {
    const heartIcon = hospitalItem.querySelector('.hospital-heart i');
    const hospitalName = hospitalItem.dataset.hospital;

    // localStorage에 하트 상태 저장
    saveHeartState(hospitalName, true);

    // 서버에 즐겨찾기 추가 요청
    fetch(`/favorite/add/${itemId}`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
        .then(res => res.text())
        .then(result => {
            console.log("즐겨찾기 추가 성공 (페이지 이동 없음):", result);
            // 하트 상태는 이미 변경되어 있으므로 추가 작업 불필요
        })
        .catch(error => {
            console.error("즐겨찾기 추가 실패:", error);
            // 실패 시 하트 상태 되돌리기
            heartIcon.classList.remove('fas');
            heartIcon.classList.add('far');
            heartIcon.style.color = '#ccc';
            // localStorage에서도 제거
            saveHeartState(hospitalName, false);
        });
}

// 즐겨찾기 추가 및 페이지 이동
function addToFavoriteAndNavigate(itemId, hospitalItem) {
    const heartIcon = hospitalItem.querySelector('.hospital-heart i');
    const hospitalName = hospitalItem.dataset.hospital;

    // localStorage에 하트 상태 저장
    saveHeartState(hospitalName, true);

    // 서버에 즐겨찾기 추가 요청
    fetch(`/favorite/add/${itemId}`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
        .then(res => res.text())
        .then(result => {
            console.log("즐겨찾기 추가 성공:", result);
            // favorite 페이지로 이동 (favorite.css가 적용된 페이지)
            window.location.href = '/favorite';
        })
        .catch(error => {
            console.error("즐겨찾기 추가 실패:", error);
            // 실패 시 하트 상태 되돌리기
            heartIcon.classList.remove('fas');
            heartIcon.classList.add('far');
            heartIcon.style.color = '#ccc';
            // localStorage에서도 제거
            saveHeartState(hospitalName, false);
        });
}

// 초기 진입 시 URL의 Id 또는 name 파라미터로 상세 자동 오픈
async function autoSelectFromQuery() {
    try {
        const params = new URLSearchParams(window.location.search);
        const idParam = params.get('Id') || params.get('id');
        const nameParam = params.get('name') || params.get('hospital') || params.get('company');

        // 아이템 찾기 함수
        const findTargetItem = () => {
            // 1) Id로 찾기
            if (idParam) {
                const byId = document.querySelector(`.hospital-item[data-item-id="${idParam}"]`);
                if (byId) return byId;
            }
            // 2) name으로 찾기 (정확 일치)
            if (nameParam) {
                const name = nameParam.trim();
                const items = document.querySelectorAll('.hospital-item');
                for (const el of items) {
                    if ((el.dataset.hospital || '').trim() === name) {
                        return el;
                    }
                }
            }
            return null;
        };

        // DOM 준비 지연 대응: 최대 10회, 100ms 간격으로 재시도
        let attempt = 0;
        let item = findTargetItem();
        while (!item && attempt < 10) {
            await new Promise(r => setTimeout(r, 100));
            item = findTargetItem();
            attempt++;
        }
        if (!item) return false;

        // 선택 및 상세 표시 (handleHospitalClick 사용)
        console.log('🔵 URL에서 자동 선택:', item.dataset.hospital);
        handleHospitalClick(item);

        // 좌측 목록 내에서 해당 아이템으로 스크롤
        try {
            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (_) {}

        return true;
    } catch (e) {
        console.warn('URL 기반 자동 상세 오픈 실패:', e);
        return false;
    }
}

// 병원 목록 데이터 로드 함수 (HTML에서 호출)
async function loadListData() {
    try {
        // URL 파라미터에서 검색 조건 추출
        const urlParams = new URLSearchParams(window.location.search);
        const region = urlParams.get('region') || '';
        const subRegion = urlParams.get('subRegion') || '';
        const category = urlParams.get('category') || '';
        const pageNo = urlParams.get('pageNo') || '1';
        const amount = urlParams.get('amount') || '10';

        // API 호출을 위한 URL 구성
        let apiUrl = '/api/list';
        const queryParams = new URLSearchParams();

        if (region) queryParams.append('region', region);
        if (subRegion) queryParams.append('subRegion', subRegion);
        if (category) queryParams.append('category', category);
        queryParams.append('pageNo', pageNo);
        queryParams.append('amount', amount);

        if (queryParams.toString()) {
            apiUrl += '?' + queryParams.toString();
        }

        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            renderHospitalList(data);
            updateRegionInfo(region, subRegion);
        } else {
            console.error('병원 목록 데이터 로드 실패');
            renderEmptyList();
        }
    } catch (error) {
        console.error('병원 목록 데이터 로드 중 오류:', error);
        renderEmptyList();
    }
}

// 병원 목록 렌더링
function renderHospitalList(data) {
    const container = document.getElementById('hospital-list-content');
    if (!container) return;

    container.innerHTML = '';

    if (!data.lists || data.lists.length === 0) {
        renderEmptyList();
        return;
    }

    data.lists.forEach(hospital => {
        const hospitalItem = document.createElement('div');
        hospitalItem.className = 'hospital-item';
        hospitalItem.dataset.itemId = hospital.id;
        hospitalItem.dataset.hospital = hospital.name;
        hospitalItem.dataset.address = hospital.address;
        hospitalItem.dataset.phone = hospital.phone;
        hospitalItem.dataset.homepage = hospital.homepage;
        hospitalItem.dataset.region = hospital.region;
        hospitalItem.dataset.subregion = hospital.subregion;

        hospitalItem.innerHTML = `
            <div class="hospital-heart">
                <i class="far fa-heart"></i>
            </div>
            <div class="hospital-name">
                ${hospital.name}
            </div>
        `;

        container.appendChild(hospitalItem);
    });

    // 총 건수 업데이트
    const totalCountElement = document.querySelector('.total-count');
    if (totalCountElement) {
        totalCountElement.textContent = `총 ${data.totalCount}건`;
        totalCountElement.dataset.totalCount = data.totalCount;
    }

    // 페이지네이션 렌더링
    renderPagination(data);

    // 이벤트 바인딩
    bindHospitalItemEvents();
}

// 빈 목록 렌더링
function renderEmptyList() {
    const container = document.getElementById('hospital-list-content');
    if (!container) return;

    container.innerHTML = `
        <div class="detail-empty">
            <i class="fas fa-hospital"></i>
            <p>표시할 결과가 없습니다.</p>
        </div>
    `;
}

// 지역 정보 업데이트
function updateRegionInfo(region, subRegion) {
    const regionInfo = document.querySelector('.region-info h2');
    if (regionInfo) {
        const displayRegion = subRegion || region || '전체';
        regionInfo.textContent = `선택된 지역: ${displayRegion}`;
    }
}

// 페이지네이션 렌더링
function renderPagination(data) {
    const paginationContainer = document.getElementById('pagination-content');
    if (!paginationContainer || data.totalPages <= 1) {
        if (paginationContainer) paginationContainer.style.display = 'none';
        return;
    }

    paginationContainer.style.display = 'flex';
    paginationContainer.innerHTML = '';

    // 이전 페이지 버튼
    if (data.pageNo > 1) {
        const prevLink = createPageLink('&laquo;', data.pageNo - 1, data);
        paginationContainer.appendChild(prevLink);
    }

    // 페이지 번호들
    for (let i = data.startPage; i <= data.endPage; i++) {
        const pageLink = createPageLink(i.toString(), i, data);
        if (i === data.pageNo) {
            pageLink.classList.add('active');
        }
        paginationContainer.appendChild(pageLink);
    }

    // 다음 페이지 버튼
    if (data.pageNo < data.totalPages) {
        const nextLink = createPageLink('&gt;', data.pageNo + 1, data);
        paginationContainer.appendChild(nextLink);
    }
}

// 페이지 링크 생성
function createPageLink(text, pageNo, data) {
    const link = document.createElement('a');
    link.className = 'page-link';
    link.href = buildPageUrl(pageNo, data);
    link.innerHTML = text;
    return link;
}

// 페이지 URL 구성
function buildPageUrl(pageNo, data) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('pageNo', pageNo);
    return window.location.pathname + '?' + urlParams.toString();
}

// 전역 함수로 노출
window.loadListData = loadListData;