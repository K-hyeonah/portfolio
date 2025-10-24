// Detail 페이지 JavaScript

// 병원 상세 정보 토글 기능
function toggleHospitalDetail(hospitalItem) {
    const detail = hospitalItem.querySelector('.hospital-detail');
    const arrow = hospitalItem.querySelector('.hospital-arrow');
    
    if (detail.style.display === 'none' || detail.style.display === '') {
        detail.style.display = 'block';
        arrow.classList.add('rotated');
    } else {
        detail.style.display = 'none';
        arrow.classList.remove('rotated');
    }
}

// 병원 아이템 클릭 이벤트 바인딩
function bindHospitalItemEvents() {
    const hospitalItems = document.querySelectorAll('.hospital-item');
    
    hospitalItems.forEach(item => {
        const header = item.querySelector('.hospital-header');
        if (header) {
            header.addEventListener('click', function() {
                toggleHospitalDetail(item);
            });
        }
    });
}

// 카카오 맵 초기화
function initKakaoMap() {
    if (typeof kakao === 'undefined') {
        console.warn('Kakao Maps API가 로드되지 않았습니다.');
        return;
    }

    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // 기본 좌표 (서울 강남역)
    const defaultLat = 37.5665;
    const defaultLng = 126.9780;

    const mapOption = {
        center: new kakao.maps.LatLng(defaultLat, defaultLng),
        level: 3
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);

    // 마커 생성
    const marker = new kakao.maps.Marker({
        position: map.getCenter()
    });
    marker.setMap(map);

    // 인포윈도우 생성
    const infowindow = new kakao.maps.InfoWindow({
        content: '<div style="padding:5px;">병원 위치</div>'
    });

    // 마커 클릭 이벤트
    kakao.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });
}

// 병원 데이터 로드 및 렌더링
async function loadHospitalData(hospitalId) {
    try {
        const response = await fetch(`/api/list/${hospitalId}`);
        if (response.ok) {
            const hospitalData = await response.json();
            renderHospitalData(hospitalData);
        } else {
            console.error('병원 데이터를 가져올 수 없습니다.');
        }
    } catch (error) {
        console.error('병원 데이터 로드 중 오류:', error);
    }
}

// 병원 데이터 렌더링
function renderHospitalData(hospitalData) {
    if (!hospitalData) return;

    // 병원 이름 설정
    const hospitalName = hospitalData.name;
    const nameElements = document.querySelectorAll('#hospital-name, #detail-hospital-name');
    nameElements.forEach(element => {
        if (element) element.textContent = hospitalName;
    });

    // 병원 주소 설정
    const hospitalAddress = hospitalData.address;
    const addressElements = document.querySelectorAll('#hospital-address, #detail-address');
    addressElements.forEach(element => {
        if (element) element.textContent = hospitalAddress;
    });

    // 카테고리 태그 업데이트
    if (hospitalData.category) {
        const tagsContainer = document.querySelector('.hospital-tags');
        if (tagsContainer) {
            tagsContainer.innerHTML = `<span class="tag">${hospitalData.category}</span>`;
        }
    }

    // 지도 업데이트 (좌표가 있는 경우)
    if (hospitalData.coordX && hospitalData.coordY) {
        updateMapLocation(hospitalData.coordX, hospitalData.coordY, hospitalName);
    }
}

// 지도 위치 업데이트
function updateMapLocation(lat, lng, title) {
    if (typeof kakao === 'undefined') return;

    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    const mapOption = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 3
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);

    // 마커 생성
    const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng)
    });
    marker.setMap(map);

    // 인포윈도우 생성
    const infowindow = new kakao.maps.InfoWindow({
        content: `<div style="padding:5px;">${title}</div>`
    });

    // 마커 클릭 이벤트
    kakao.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 병원 아이템 이벤트 바인딩
    bindHospitalItemEvents();

    // URL에서 병원 ID 추출
    const pathParts = window.location.pathname.split('/');
    const hospitalId = pathParts[pathParts.length - 1];
    
    if (hospitalId && !isNaN(hospitalId)) {
        // 병원 데이터 로드
        loadHospitalData(hospitalId);
    } else {
        // 기본 지도 초기화
        initKakaoMap();
    }
});

// 카카오 맵 API 로드 완료 후 초기화
window.addEventListener('load', function() {
    if (typeof kakao !== 'undefined') {
        initKakaoMap();
    }
});
