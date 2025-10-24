// 관리자 헤더 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // 헤더 검색 기능
    const headerSearchInput = document.querySelector('.header-search .search-input');
    const searchSuggestions = document.querySelector('.search-suggestions');
    
    if (headerSearchInput) {
        // 검색 입력 이벤트
        headerSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            
            if (searchTerm.length > 0) {
                showSearchSuggestions(searchTerm);
            } else {
                hideSearchSuggestions();
            }
        });
        
        // Enter 키 이벤트
        headerSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    // 전역 검색 수행
                    performGlobalSearch(searchTerm);
                }
            }
        });
        
        // 포커스 이벤트
        headerSearchInput.addEventListener('focus', function() {
            if (this.value.trim().length > 0) {
                showSearchSuggestions(this.value.trim());
            }
        });
        
        // 포커스 아웃 이벤트
        document.addEventListener('click', function(e) {
            if (!headerSearchInput.contains(e.target) && !searchSuggestions?.contains(e.target)) {
                hideSearchSuggestions();
            }
        });
    }
    
    // 사용자 프로필 드롭다운
    const userProfile = document.querySelector('.user-profile');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userProfile && userDropdown) {
        userProfile.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleUserDropdown();
        });
        
        // 드롭다운 외부 클릭 시 닫기
        document.addEventListener('click', function(e) {
            if (!userProfile.contains(e.target)) {
                closeUserDropdown();
            }
        });
    }
    
    // 사용자 드롭다운 토글
    function toggleUserDropdown() {
        const dropdownMenu = document.querySelector('.user-dropdown-menu');
        
        if (!dropdownMenu) {
            const menu = createUserDropdownMenu();
            userProfile.appendChild(menu);
        } else {
            dropdownMenu.classList.toggle('show');
        }
    }
    
    // 사용자 드롭다운 닫기
    function closeUserDropdown() {
        const dropdownMenu = document.querySelector('.user-dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.classList.remove('show');
        }
    }
    
    // 사용자 드롭다운 메뉴 생성
    function createUserDropdownMenu() {
            const menu = document.createElement('div');
            menu.className = 'user-dropdown-menu';
            menu.innerHTML = `

                <a href="/crm/logout" class="dropdown-item">
                    <i class="fas fa-sign-out-alt"></i> 로그아웃
                </a>
            `;

            return menu;
        }
    
    // 키보드 단축키
    document.addEventListener('keydown', function(e) {
        // Ctrl + K: 검색 포커스
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            if (headerSearchInput) {
                headerSearchInput.focus();
            }
        }
        
        // Escape: 검색 제안 닫기
        if (e.key === 'Escape') {
            hideSearchSuggestions();
            closeUserDropdown();
        }
    });
});

// 헤더 관련 유틸리티 함수들
const HeaderUtils = {
    // 검색어 하이라이트
    highlightSearchTerm: function(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    },
    
    // 사용자 정보 업데이트
    updateUserInfo: function(userInfo) {
        const userName = document.querySelector('.user-dropdown .user-name');
        const profileImg = document.querySelector('.profile-img');
        
        if (userName) userName.textContent = userInfo.name;
        if (profileImg && userInfo.avatar) profileImg.src = userInfo.avatar;
    }
};
