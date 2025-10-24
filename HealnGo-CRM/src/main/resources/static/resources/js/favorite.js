// favorite.js
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Favorite 페이지 로드 완료');
    
    // 모달 관련 이벤트 리스너
    const modal = document.getElementById('detailModal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // 즐겨찾기 데이터 로드
    await loadFavorites();
});

// 즐겨찾기 데이터 로드
async function loadFavorites() {
    console.log('loadFavorites 호출됨');
    
    const container = document.getElementById('favorites-content');
    
    if (!container) {
        console.error('favorites-content 컨테이너를 찾을 수 없습니다');
        return;
    }
    
    try {
        // API로 즐겨찾기 목록 가져오기
        const response = await fetch('/favorite/list');
        
        if (!response.ok) {
            if (response.status === 401) {
                console.log('로그인하지 않은 사용자');
                container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">로그인 후 이용해주세요.</p>';
                return;
            }
            console.error('즐겨찾기 목록 조회 실패:', response.status);
            renderEmptyFavorites();
            return;
        }
        
        const favorites = await response.json();
        console.log('즐겨찾기 데이터:', favorites);
        
        if (favorites && favorites.length > 0) {
            console.log('찜한 병원 수:', favorites.length);
            renderFavorites(favorites);
        } else {
            console.log('찜한 병원이 없음');
            renderEmptyFavorites();
        }
    } catch (error) {
        console.error('즐겨찾기 로드 중 오류:', error);
        renderEmptyFavorites();
    }
}

// 즐겨찾기 목록 렌더링
function renderFavorites(favorites) {
    const container = document.getElementById('favorites-content');
    
    if (!favorites || favorites.length === 0) {
        renderEmptyFavorites();
        return;
    }
    
    container.innerHTML = favorites.map((favorite, index) => `
        <div class="favorite-item" data-id="${favorite.id}" data-hospital="${favorite.name}">
            <div class="item-banner">
                <span class="day-number">${index + 1}</span>
            </div>
            <div class="item-content">
                <div class="item-info">
                    <h3 class="hospital-name">${favorite.name || '병원명'}</h3>
                    <div class="hospital-details">
                        <p class="hospital-address">
                            <i class="fas fa-map-marker-alt"></i>
                            ${favorite.address || '주소 정보 없음'}
                        </p>
                        <p class="hospital-phone">
                            <i class="fas fa-phone"></i>
                            ${favorite.phone || '전화번호 정보 없음'}
                        </p>
                        <p class="hospital-category">
                            <i class="fas fa-hospital"></i>
                            ${favorite.category || '카테고리 정보 없음'}
                        </p>
                    </div>
                    <div class="hospital-tags">
                        ${favorite.region ? `<span class="tag">${favorite.region}</span>` : ''}
                        ${favorite.subregion ? `<span class="tag">${favorite.subregion}</span>` : ''}
                        ${favorite.category ? `<span class="tag">${favorite.category}</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="item-actions">
                <button class="btn-detail" onclick="goToList(${favorite.id})">상세보기</button>
                <button class="btn-remove" onclick="removeFavorite(${favorite.id})" title="삭제">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// 빈 즐겨찾기 상태 렌더링
function renderEmptyFavorites() {
    const container = document.getElementById('favorites-content');
    container.innerHTML = `
        <div class="empty-favorites">
            <div class="empty-icon">
                <i class="fas fa-heart"></i>
                <i class="fas fa-plus empty-plus"></i>
            </div>
            <div class="empty-content">
                <h3>아직 즐겨찾기한 병원이 없습니다</h3>
                <p class="empty-description">마음에 드는 병원을 찾아서 즐겨찾기에 추가해보세요!</p>
            </div>
            <div class="empty-actions">
                <a href="/list" class="btn-primary">병원 찾아보기</a>
            </div>
        </div>
    `;
}

// 즐겨찾기 삭제 함수
async function removeFavorite(itemId) {
    if (!confirm('즐겨찾기에서 삭제하시겠습니까?')) {
        return;
    }
    
    try {
        const response = await fetch(`/favorite/remove/${itemId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log('찜하기 제거 완료');
            showNotification('즐겨찾기에서 삭제되었습니다.', 'success');
            
            // 1초 후 페이지 새로고침
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else if (response.status === 401) {
            alert('로그인이 필요한 서비스입니다.');
            window.location.href = '/login';
        } else {
            showNotification('삭제에 실패했습니다.', 'error');
        }
    } catch (error) {
        console.error('즐겨찾기 삭제 중 오류:', error);
        showNotification('삭제 중 오류가 발생했습니다.', 'error');
    }
}

// list 페이지로 이동 (병원 상세보기)
function goToList(itemId) {
    window.location.href = `/list?Id=${itemId}`;
}

// 알림 메시지 표시 함수
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-size: 15px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// 전역 함수 노출
window.removeFavorite = removeFavorite;
window.goToList = goToList;
window.showNotification = showNotification;
