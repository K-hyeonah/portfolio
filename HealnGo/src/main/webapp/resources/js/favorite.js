// 즐겨찾기 페이지 JavaScript

// 전역 변수로 현재 모달 상태 관리
let currentModalItemId = null;
let isModalOpen = false;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('즐겨찾기 페이지 로드 완료');
    bindFavoriteEvents();
    adjustCardLayout();
});

// 즐겨찾기 항목 이벤트 바인딩
function bindFavoriteEvents() {
    const removeButtons = document.querySelectorAll('.btn-remove');

    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const itemId = this.closest('.favorite-item').dataset.id;
            const hospitalName = this.closest('.favorite-item').dataset.hospital;

            showRemoveConfirmModal(itemId, hospitalName);
        });
    });
}

// 즐겨찾기 제거 확인 모달 표시
function showRemoveConfirmModal(itemId, hospitalName) {
    // 기존 모달 제거
    const existingModal = document.getElementById('removeConfirmModal');
    if (existingModal) {
        existingModal.remove();
    }

    // 전역 변수 설정
    currentModalItemId = itemId;
    isModalOpen = true;

    // 모달 HTML 생성
    const modalHTML = `
        <div id="removeConfirmModal" class="remove-confirm-modal">
            <div class="remove-confirm-content">
                <h3>즐겨찾기 제거 확인</h3>
                <p>"${hospitalName}"을(를) 즐겨찾기에서 제거하시겠습니까?</p>
                <div class="remove-confirm-buttons">
                    <button type="button" class="remove-confirm-yes" onclick="handleConfirmClick()">확인</button>
                    <button type="button" class="remove-confirm-no" onclick="handleCancelClick()">취소</button>
                </div>
            </div>
        </div>
    `;

    // 새 모달 추가
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 모달 표시
    const modal = document.getElementById('removeConfirmModal');
    modal.style.display = 'flex';

    // 모달 외부 클릭 시 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            handleCancelClick();
        }
    });
}

// 확인 버튼 클릭 시 실행되는 함수
function handleConfirmClick() {
    if (!isModalOpen || !currentModalItemId) {
        console.log('모달이 열려있지 않거나 아이템 ID가 없음');
        return;
    }

    console.log('확인 버튼 클릭됨 - 즐겨찾기 제거 실행');
    console.log('제거할 아이템 ID:', currentModalItemId);

    const itemId = currentModalItemId;
    closeRemoveConfirmModal();
    removeFavorite(itemId);
}

// 취소 버튼 클릭 시 실행되는 함수
function handleCancelClick() {
    if (!isModalOpen) {
        console.log('모달이 열려있지 않음');
        return;
    }

    console.log('취소 버튼 클릭됨 - 모달만 닫기');
    closeRemoveConfirmModal();
}

// 모달 닫기
function closeRemoveConfirmModal() {
    const modal = document.getElementById('removeConfirmModal');
    if (modal) {
        modal.remove();
    }

    // 전역 변수 초기화
    currentModalItemId = null;
    isModalOpen = false;
}

// 즐겨찾기 제거
function removeFavorite(itemId) {
    console.log('=== removeFavorite 함수 호출됨 ===');
    console.log('호출 스택:', new Error().stack);
    console.log('즐겨찾기 제거 시작:', itemId);

    fetch(`/favorite/remove/${itemId}`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('즐겨찾기 제거 성공');
            // 해당 항목을 화면에서 제거
            const item = document.querySelector(`[data-id="${itemId}"]`);
            if (item) {
                item.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    item.remove();
                    // 모든 항목이 제거되었는지 확인
                    const remainingItems = document.querySelectorAll('.favorite-item');
                    if (remainingItems.length === 0) {
                        showEmptyState();
                    } else {
                        // 카드 레이아웃 다시 조정
                        adjustCardLayout();
                    }
                }, 300);
            }
        } else {
            throw new Error('즐겨찾기 제거 실패');
        }
    })
    .catch(error => {
        console.error('즐겨찾기 제거 오류:', error);
        alert('즐겨찾기 제거에 실패했습니다. 다시 시도해주세요.');
    });
}

// 카드 레이아웃 조정
function adjustCardLayout() {
    const favoriteList = document.querySelector('.favorite-list');
    const favoriteItems = document.querySelectorAll('.favorite-item');
    const itemCount = favoriteItems.length;

    // 기존 클래스 제거
    favoriteList.classList.remove('one-card', 'two-cards');

    // 카드 개수에 따라 클래스 추가
    if (itemCount === 1) {
        favoriteList.classList.add('one-card');
    } else if (itemCount === 2) {
        favoriteList.classList.add('two-cards');
    }

    console.log('카드 레이아웃 조정 완료:', itemCount, '개 카드');
}

// 빈 상태 표시
function showEmptyState() {
    const favoriteList = document.querySelector('.favorite-list');
    favoriteList.innerHTML = `
        <div class="empty-favorites">
            <i class="fas fa-heart-broken" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
            <h3>아직 즐겨찾기한 병원이 없습니다</h3>
            <p>관심 있는 병원을 찾아서 하트를 눌러보세요!</p>
            <a href="/main" class="btn-primary">병원 찾아보기</a>
        </div>
    `;
}

// 상세보기 모달
function showDetail(itemId) {
    console.log('상세보기 모달 열기:', itemId);

    // 모달 요소 가져오기
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');

    // 모달 내용 로드 (실제 구현에서는 AJAX로 상세 정보를 가져옴)
    modalBody.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h2>상세 정보</h2>
            <p>병원 ID: ${itemId}</p>
            <p>상세 정보는 현재 구현 중입니다.</p>
        </div>
    `;

    // 모달 표시
    modal.style.display = 'block';
}

// 모달 닫기
function closeModal() {
    const modal = document.getElementById('detailModal');
    modal.style.display = 'none';
}

// 페이지 로드 시 모달 닫기 이벤트 바인딩
document.addEventListener('DOMContentLoaded', function() {
    // 모달 닫기 버튼 이벤트
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // 모달 외부 클릭 시 닫기
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(style);
