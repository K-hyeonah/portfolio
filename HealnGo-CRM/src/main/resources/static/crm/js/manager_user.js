// 사용자 관리 페이지 JavaScript

// 검색 함수
function performSearch() {
    const searchInput = document.querySelector('.search-input-main');
    if (searchInput) {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            window.location.href = '/admin/manager-user?search=' + encodeURIComponent(searchTerm);
        } else {
            window.location.href = '/admin/manager-user';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 검색 기능
    const searchInputMain = document.querySelector('.search-input-main');
    
    // 메인 검색바 검색 기능
    if (searchInputMain) {
        searchInputMain.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    window.location.href = '/admin/manager-user?search=' + encodeURIComponent(searchTerm);
                } else {
                    window.location.href = '/admin/manager-user';
                }
            }
        });
        
        // 실시간 검색 (선택사항)
        searchInputMain.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterUsers(searchTerm);
        });
    }
    
    // 사용자 필터링 함수
    function filterUsers(searchTerm) {
        const userCards = document.querySelectorAll('.user-card');
        
        userCards.forEach(card => {
            const username = card.querySelector('.username').textContent.toLowerCase();
            const name = card.querySelector('.data-item .value').textContent.toLowerCase();
            const email = card.querySelectorAll('.data-item .value')[1].textContent.toLowerCase();
            
            if (username.includes(searchTerm) || 
                name.includes(searchTerm) || 
                email.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // 신고 체크박스 기능
    const reportCheckboxes = document.querySelectorAll('.report-checkbox');
    reportCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const userCard = this.closest('.user-card');
            const checkedBoxes = userCard.querySelectorAll('.report-checkbox:checked');
            
            // 3개 이상 체크되면 경고 표시
            if (checkedBoxes.length >= 3) {
                showWarning(userCard, '이 사용자는 3회 이상 신고되었습니다.');
                userCard.style.borderLeft = '4px solid #ff4444';
            } else if (checkedBoxes.length >= 1) {
                userCard.style.borderLeft = '4px solid #ffaa00';
            } else {
                userCard.style.borderLeft = '1px solid #f0f0f0';
                hideWarning(userCard);
            }
        });
    });
    
    // 경고 메시지 표시
    function showWarning(userCard, message) {
        let warningDiv = userCard.querySelector('.warning-message');
        if (!warningDiv) {
            warningDiv = document.createElement('div');
            warningDiv.className = 'warning-message';
            warningDiv.style.cssText = `
                background-color: #ff4444;
                color: white;
                padding: 8px 12px;
                border-radius: 5px;
                font-size: 12px;
                margin-top: 10px;
                animation: slideIn 0.3s ease;
            `;
            userCard.querySelector('.user-data').appendChild(warningDiv);
        }
        warningDiv.textContent = message;
    }
    
    // 경고 메시지 숨기기
    function hideWarning(userCard) {
        const warningDiv = userCard.querySelector('.warning-message');
        if (warningDiv) {
            warningDiv.remove();
        }
    }
    
    // 페이지네이션 기능
    const pageButtons = document.querySelectorAll('.page-btn');
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('active') || this.disabled) return;
            
            // 모든 버튼에서 active 클래스 제거
            pageButtons.forEach(btn => btn.classList.remove('active'));
            
            // 숫자 버튼인 경우에만 active 클래스 추가
            if (!isNaN(this.textContent)) {
                this.classList.add('active');
            }
            
            // 페이지 변경 로직 (필요시 구현)
            const pageNumber = this.textContent;
            if (!isNaN(pageNumber)) {
                loadPage(parseInt(pageNumber));
            } else {
                handlePaginationAction(this);
            }
        });
    });
    
    // 페이지 로드 함수
    function loadPage(pageNumber) {
        console.log(`Loading page ${pageNumber}`);
        // 실제 페이지 로드 로직 구현
        // 예: fetch(`/api/users?page=${pageNumber}`)
        //     .then(response => response.json())
        //     .then(data => updateUserList(data));
    }
    
    // 페이지네이션 액션 처리
    function handlePaginationAction(button) {
        const currentActive = document.querySelector('.page-btn.active');
        const currentPage = currentActive ? parseInt(currentActive.textContent) : 1;
        
        if (button.classList.contains('prev-double')) {
            loadPage(1);
        } else if (button.classList.contains('prev')) {
            loadPage(Math.max(1, currentPage - 1));
        } else if (button.classList.contains('next')) {
            loadPage(Math.min(5, currentPage + 1));
        } else if (button.classList.contains('next-double')) {
            loadPage(5);
        }
    }
    
    // 사용자 카드 클릭 이벤트 (상세 보기)
    const userCards = document.querySelectorAll('.user-card');
    userCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 체크박스나 버튼 클릭 시에는 상세 보기 실행하지 않음
            if (e.target.type === 'checkbox' || e.target.tagName === 'BUTTON') {
                return;
            }
            
            const userId = this.querySelector('.user-id').textContent;
            showUserDetails(userId);
        });
        
        // 호버 효과
        card.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });
    
    // 사용자 상세 정보 표시
    function showUserDetails(userId) {
        console.log(`Showing details for user: ${userId}`);
        // 실제 상세 정보 모달이나 페이지 구현
        // 예: openModal(`/user/${userId}`)
    }
    
    // 사용자 관리 유틸리티 함수들
    const UserManager = {
        // 사용자 목록 새로고침
        refreshUserList: function() {
            console.log('Refreshing user list...');
            // 실제 API 호출 구현
        },
        
        // 사용자 검색
        searchUsers: function(query) {
            console.log(`Searching for: ${query}`);
            // 실제 검색 API 호출 구현
        },
        
        // 사용자 신고 처리
        reportUser: function(userId, reason) {
            console.log(`Reporting user ${userId} for: ${reason}`);
            // 실제 신고 API 호출 구현
        },
        
        // 사용자 정지/활성화
        toggleUserStatus: function(userId, status) {
            console.log(`Setting user ${userId} status to: ${status}`);
            // 실제 상태 변경 API 호출 구현
        }
    };
    
    // 키보드 단축키
    document.addEventListener('keydown', function(e) {
        // Ctrl + F: 검색 포커스
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            searchInputMain.focus();
        }
        
        // Escape: 검색 초기화
        if (e.key === 'Escape') {
            searchInputMain.value = '';
            filterUsers('');
        }
    });
});

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .user-card {
        transition: all 0.3s ease;
    }
    
    .warning-message {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);
