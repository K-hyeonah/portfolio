// 사용자 관리 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeTable();
    setupModalEvents();
});

// 이벤트 리스너 초기화
function initializeEventListeners() {
    // 검색 입력 엔터키 이벤트
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// 테이블 초기화
function initializeTable() {
    // 체크박스 이벤트 설정
    setupCheckboxEvents();
}

// 체크박스 이벤트 설정
function setupCheckboxEvents() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const userCheckboxes = document.querySelectorAll('.user-checkbox');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            userCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateBulkActions();
        });
    }
    
    userCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectAllCheckbox();
            updateBulkActions();
        });
    });
}

// 전체 선택 체크박스 업데이트
function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const userCheckboxes = document.querySelectorAll('.user-checkbox');
    const checkedCount = document.querySelectorAll('.user-checkbox:checked').length;
    
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = checkedCount === userCheckboxes.length;
        selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < userCheckboxes.length;
    }
}

// 일괄 작업 버튼 상태 업데이트
function updateBulkActions() {
    const checkedCount = document.querySelectorAll('.user-checkbox:checked').length;
    const bulkButtons = document.querySelectorAll('.table-actions .btn:not(.btn-secondary)');
    
    bulkButtons.forEach(button => {
        button.disabled = checkedCount === 0;
        button.style.opacity = checkedCount === 0 ? '0.5' : '1';
    });
}

// 검색 수행
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    
    // URL 파라미터 업데이트
    const url = new URL(window.location);
    if (searchTerm) {
        url.searchParams.set('search', searchTerm);
    } else {
        url.searchParams.delete('search');
    }
    url.searchParams.set('page', '1'); // 검색 시 첫 페이지로 이동
    
    window.location.href = url.toString();
}

// 필터 적용
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const sortBy = document.getElementById('sortBy');
    const sortDir = document.getElementById('sortDir');
    const searchInput = document.getElementById('searchInput');
    
    const url = new URL(window.location);
    
    // 검색어
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    if (searchTerm) {
        url.searchParams.set('search', searchTerm);
    } else {
        url.searchParams.delete('search');
    }
    
    // 상태 필터
    const status = statusFilter ? statusFilter.value : '';
    if (status) {
        url.searchParams.set('status', status);
    } else {
        url.searchParams.delete('status');
    }
    
    // 정렬
    const sort = sortBy ? sortBy.value : '';
    if (sort) {
        url.searchParams.set('sort', sort);
    } else {
        url.searchParams.delete('sort');
    }
    
    // 정렬 방향
    const dir = sortDir ? sortDir.value : '';
    if (dir) {
        url.searchParams.set('dir', dir);
    } else {
        url.searchParams.delete('dir');
    }
    
    url.searchParams.set('page', '1'); // 필터 적용 시 첫 페이지로 이동
    
    window.location.href = url.toString();
}

// 필터 초기화
function clearFilters() {
    window.location.href = '/admin/users';
}

// 페이지 이동
function goToPage(page) {
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.location.href = url.toString();
}

// 전체 선택
function selectAll() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.dispatchEvent(new Event('change'));
    }
}

// 일괄 작업
async function bulkAction(action) {
    const checkedBoxes = document.querySelectorAll('.user-checkbox:checked');
    const userIds = Array.from(checkedBoxes).map(checkbox => parseInt(checkbox.value));
    
    if (userIds.length === 0) {
        showNotification('선택된 사용자가 없습니다.', 'warning');
        return;
    }
    
    let message = '';
    switch(action) {
        case 'suspend':
            message = `선택된 ${userIds.length}명의 사용자를 정지하시겠습니까?`;
            break;
        case 'activate':
            message = `선택된 ${userIds.length}명의 사용자를 활성화하시겠습니까?`;
            break;
        case 'delete':
            message = `선택된 ${userIds.length}명의 사용자를 삭제하시겠습니까?`;
            break;
    }
    
    if (confirm(message)) {
        try {
            if (action === 'suspend') {
                // 일괄 정지 API 호출
                const response = await fetch('/admin/api/users/bulk-suspend', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userIds: userIds })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showNotification(result.message, 'success');
                    
                    // 페이지 새로고침
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    alert(result.message || '작업에 실패했습니다.');
                }
            } else {
                // 다른 작업은 아직 구현 안됨
                console.log(`${action} action for users:`, userIds);
                showNotification(`${userIds.length}명의 사용자에 대한 작업이 완료되었습니다.`, 'success');
            }
            
            // 체크박스 초기화
            checkedBoxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            updateSelectAllCheckbox();
            updateBulkActions();
            
        } catch (error) {
            console.error('Error:', error);
            alert('작업 중 오류가 발생했습니다.');
        }
    }
}

// 사용자 상세 보기
async function viewUser(userId) {
    console.log('View user:', userId);
    
    // 서버에서 사용자 상세 정보 가져오기
    try {
        const response = await fetch(`/admin/api/users/${userId}`);
        if (!response.ok) {
            throw new Error('사용자 정보를 불러올 수 없습니다.');
        }
        
        const userInfo = await response.json();
        
        // 모달에 사용자 정보 로드
        loadUserDetail(userInfo);
        
        // 모달 표시
        const modal = document.getElementById('userDetailModal');
        if (modal) {
            modal.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('사용자 정보를 불러오는데 실패했습니다.');
    }
}

// 사용자 상세 정보 로드
function loadUserDetail(userInfo) {
    const content = document.getElementById('userDetailContent');
    if (!content) return;
    
    content.innerHTML = `
        <div class="detail-section">
            <h3><i class="fas fa-user"></i> 기본 정보</h3>
            <div class="detail-row">
                <label>사용자 ID:</label>
                <span>${userInfo.id}</span>
            </div>
            <div class="detail-row">
                <label>이름:</label>
                <span><strong>${userInfo.name}</strong></span>
            </div>
            <div class="detail-row">
                <label>이메일:</label>
                <span>${userInfo.email}</span>
            </div>
            <div class="detail-row">
                <label>전화번호:</label>
                <span>${userInfo.phone || '미등록'}</span>
            </div>
            <div class="detail-row">
                <label>상태:</label>
                <span><span class="status-badge ${userInfo.status === '활성' ? 'status-active' : 'status-inactive'}">${userInfo.status}</span></span>
            </div>
        </div>
        
        <div class="detail-section">
            <h3><i class="fas fa-clock"></i> 활동 정보</h3>
            <div class="detail-row">
                <label>가입일:</label>
                <span>${userInfo.joinDate}</span>
            </div>
            <div class="detail-row">
                <label>최근 로그인:</label>
                <span>${userInfo.lastLogin || '정보 없음'}</span>
            </div>
            <div class="detail-row">
                <label>총 예약 수:</label>
                <span>${userInfo.totalReservations || 0}건</span>
            </div>
            <div class="detail-row">
                <label>총 결제 금액:</label>
                <span>${(userInfo.totalSpent || 0).toLocaleString()}원</span>
            </div>
        </div>
        
        ${userInfo.notes ? `
            <div class="detail-section">
                <h3><i class="fas fa-sticky-note"></i> 관리자 메모</h3>
                <div class="detail-row">
                    <span style="grid-column: 1 / -1;">${userInfo.notes}</span>
                </div>
            </div>
        ` : ''}
    `;
}

// getUserData 함수는 더 이상 사용하지 않음 (서버 API로 대체됨)

// 상세 모달 닫기
function closeUserDetailModal() {
    document.getElementById('userDetailModal').style.display = 'none';
}

// 사용자 수정
async function editUser(userId) {
    console.log('Edit user:', userId);
    
    // 서버에서 사용자 데이터 가져오기
    try {
        const response = await fetch(`/admin/api/users/${userId}`);
        if (!response.ok) {
            throw new Error('사용자 정보를 불러올 수 없습니다.');
        }
        
        const userData = await response.json();
        
        // 폼에 데이터 채우기
        document.getElementById('editUserId').value = userId;
        document.getElementById('editUserName').value = userData.name;
        document.getElementById('editUserEmail').value = userData.email;
        document.getElementById('editUserPhone').value = userData.phone || '';
        document.getElementById('editUserStatus').value = userData.status === '활성' ? 'active' : 'inactive';
        document.getElementById('editUserNotes').value = userData.notes || '';
        
        // 모달 열기
        document.getElementById('editUserModal').style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        alert('사용자 정보를 불러오는데 실패했습니다.');
    }
}

// 수정 모달 닫기
function closeEditUserModal() {
    document.getElementById('editUserModal').style.display = 'none';
}

// 사용자 수정 처리
async function processEditUser() {
    const userId = document.getElementById('editUserId').value;
    const name = document.getElementById('editUserName').value;
    const phone = document.getElementById('editUserPhone').value;
    const status = document.getElementById('editUserStatus').value;
    const notes = document.getElementById('editUserNotes').value;
    
    try {
        const response = await fetch(`/admin/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, phone, status, notes })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // 테이블 업데이트
            const row = document.querySelector(`tr .user-checkbox[value="${userId}"]`)?.closest('tr');
            if (row) {
                row.querySelector('.user-name').textContent = name;
                
                const statusBadge = row.querySelector('.status-badge');
                const statusText = status === 'active' ? '활성' : status === 'suspended' ? '정지' : '비활성';
                statusBadge.textContent = statusText;
                statusBadge.className = `status-badge status-${status}`;
            }
            
            closeEditUserModal();
            showNotification('사용자 정보가 수정되었습니다.', 'success');
        } else {
            alert(result.message || '수정에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('사용자 정보 수정 중 오류가 발생했습니다.');
    }
}

// 모달 이벤트 설정
function setupModalEvents() {
    const editForm = document.getElementById('editUserForm');
    
    // 수정 폼 제출 이벤트
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processEditUser();
        });
    }
}

// 사용자 상태 토글 (활성 → 정지 → 비활성화 → 활성)
async function suspendUser(userId) {
    try {
        const response = await fetch(`/admin/api/users/${userId}/toggle-status`, {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(result.message, 'success');
            
            // 테이블에서 상태 업데이트
            updateUserStatus(userId, result.newStatus);
        } else {
            alert(result.message || '상태 변경에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('상태 변경 중 오류가 발생했습니다.');
    }
}

// 사용자 상태 업데이트
function updateUserStatus(userId, status) {
    const row = document.querySelector(`tr .user-checkbox[value="${userId}"]`)?.closest('tr');
    if (row) {
        const statusBadge = row.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.textContent = status;
            let statusClass = 'status-inactive';
            if (status === '활성') {
                statusClass = 'status-active';
            } else if (status === '정지') {
                statusClass = 'status-suspended';
            }
            statusBadge.className = `status-badge ${statusClass}`;
        }
    }
}

// 모달 닫기
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// 모달 외부 클릭 시 닫기
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// 알림 표시
function showNotification(message, type = 'info') {
    // 알림 요소 생성
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // 스타일 추가
    const bgColor = type === 'success' ? '#d4edda' : type === 'warning' ? '#fff3cd' : '#d1ecf1';
    const textColor = type === 'success' ? '#155724' : type === 'warning' ? '#856404' : '#0c5460';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: ${textColor};
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    // 알림 내용 스타일
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
    `;
    
    // 닫기 버튼 스타일
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        cursor: pointer;
        color: inherit;
        padding: 0;
        margin-left: 10px;
    `;
    
    // 애니메이션 스타일 추가
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 알림 추가
    document.body.appendChild(notification);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

