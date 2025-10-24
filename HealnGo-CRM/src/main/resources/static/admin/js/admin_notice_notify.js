// 공지사항 관리 JavaScript

// 현재 상세보기 중인 공지사항 데이터
let currentNoticeData = null;

// 모달 열기
function openNoticeModal() {
    document.getElementById('noticeModal').style.display = 'flex';
    document.getElementById('noticeForm').reset();
    document.getElementById('noticeId').value = '';
    document.getElementById('modalTitle').textContent = '새 공지사항 작성';
}

// 모달 닫기
function closeNoticeModal() {
    document.getElementById('noticeModal').style.display = 'none';
}

// 상세보기 모달 열기
function viewNoticeDetail(element) {
    console.log('viewNoticeDetail called', element);
    
    currentNoticeData = {
        noticeId: element.getAttribute('data-notice-id'),
        title: element.getAttribute('data-title'),
        body: element.getAttribute('data-body'),
        audience: element.getAttribute('data-audience'),
        isPinned: element.getAttribute('data-pinned') === 'true',
        publishAt: element.getAttribute('data-publish-at'),
        createdAt: element.getAttribute('data-created-at')
    };
    
    console.log('currentNoticeData set:', currentNoticeData);
    
    // 상세 정보 표시
    document.getElementById('detailTitle').textContent = currentNoticeData.title || '';
    document.getElementById('detailBody').textContent = currentNoticeData.body || '';
    
    // 대상 표시
    const audienceText = {
        'ALL': '전체',
        'SOCIAL': '사용자',
        'COMPANY': '업체'
    };
    document.getElementById('detailAudience').textContent = audienceText[currentNoticeData.audience] || currentNoticeData.audience;
    
    // 상태 표시
    const isPinned = currentNoticeData.isPinned;
    document.getElementById('detailStatus').innerHTML = isPinned 
        ? '<span style="color: #ff6b6b; font-weight: 600;">⭐ 상단 고정</span>' 
        : '<span style="color: #51cf66;">일반</span>';
    
    // 날짜 표시
    document.getElementById('detailPublishAt').textContent = currentNoticeData.publishAt;
    document.getElementById('detailCreatedAt').textContent = currentNoticeData.createdAt;
    
    document.getElementById('noticeDetailModal').style.display = 'flex';
}

// 상세보기 모달 닫기
function closeNoticeDetailModal() {
    document.getElementById('noticeDetailModal').style.display = 'none';
    currentNoticeData = null;
}

// 상세보기에서 수정
function editFromDetail() {
    console.log('editFromDetail called', currentNoticeData);
    
    if (!currentNoticeData) {
        console.error('currentNoticeData is null');
        alert('공지사항 데이터를 불러올 수 없습니다.');
        return;
    }
    
    // 데이터를 로컬 변수에 복사
    const noticeData = {
        noticeId: currentNoticeData.noticeId,
        title: currentNoticeData.title,
        body: currentNoticeData.body,
        audience: currentNoticeData.audience,
        isPinned: currentNoticeData.isPinned
    };
    
    // 상세보기 모달 닫기
    closeNoticeDetailModal();
    
    // 수정 모달 열기
    document.getElementById('noticeId').value = noticeData.noticeId || '';
    document.getElementById('noticeTitle').value = noticeData.title || '';
    document.getElementById('noticeContent').value = noticeData.body || '';
    document.getElementById('noticeAudience').value = noticeData.audience || 'ALL';
    
    document.getElementById('modalTitle').textContent = '공지사항 수정';
    document.getElementById('noticeModal').style.display = 'flex';
    
    console.log('Edit modal opened');
}

// 상세보기에서 삭제
function deleteFromDetail() {
    if (!currentNoticeData) return;
    
    if (!confirm('정말 삭제하시겠습니까?')) {
        return;
    }
    
    const formData = new FormData();
    formData.append('noticeId', currentNoticeData.noticeId);
    
    fetch('/admin/notice-notify/delete', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        if (result === 'success') {
            alert('공지사항이 삭제되었습니다.');
            closeNoticeDetailModal();
            location.reload();
        } else if (result === 'login_required') {
            alert('로그인이 필요합니다.');
            window.location.href = '/crm/crm_login';
        } else {
            alert('삭제 중 오류가 발생했습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('삭제 중 오류가 발생했습니다.');
    });
}

// 공지사항 작성/수정
function submitNotice() {
    const noticeId = document.getElementById('noticeId').value;
    const title = document.getElementById('noticeTitle').value.trim();
    const content = document.getElementById('noticeContent').value.trim();
    const audience = document.getElementById('noticeAudience').value;
    
    const topFixed = false; // 상단 고정 기능 제거
    
    if (!title || !content) {
        alert('제목과 내용을 입력해주세요.');
        return;
    }
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('audience', audience);
    formData.append('topFixed', topFixed);
    
    const url = noticeId 
        ? '/admin/notice-notify/update' 
        : '/admin/notice-notify/create';
    
    if (noticeId) {
        formData.append('noticeId', noticeId);
    }
    
    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        if (result === 'success') {
            alert(noticeId ? '공지사항이 수정되었습니다.' : '공지사항이 등록되었습니다.');
            closeNoticeModal();
            location.reload();
        } else if (result === 'login_required') {
            alert('로그인이 필요합니다.');
            window.location.href = '/crm/crm_login';
        } else {
            alert('처리 중 오류가 발생했습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('처리 중 오류가 발생했습니다.');
    });
}

// 공지사항 수정 (목록의 수정 버튼에서 직접 호출)
function editNoticeFromData(button) {
    const noticeId = button.getAttribute('data-notice-id');
    const title = button.getAttribute('data-title');
    const body = button.getAttribute('data-body');
    const audience = button.getAttribute('data-audience');
    const isPinned = button.getAttribute('data-pinned') === 'true';
    
    console.log('editNoticeFromData called:', {noticeId, title, audience, isPinned});
    
    document.getElementById('noticeId').value = noticeId;
    document.getElementById('noticeTitle').value = title;
    document.getElementById('noticeContent').value = body;
    document.getElementById('noticeAudience').value = audience;
    
        // 상단 고정 기능 제거됨
    
    document.getElementById('modalTitle').textContent = '공지사항 수정';
    document.getElementById('noticeModal').style.display = 'flex';
    
    console.log('Edit modal displayed');
}

// 공지사항 삭제 (data 속성에서 읽기)
function deleteNoticeFromData(button) {
    const noticeId = button.getAttribute('data-notice-id');
    
    if (!confirm('정말 삭제하시겠습니까?')) {
        return;
    }
    
    const formData = new FormData();
    formData.append('noticeId', noticeId);
    
    fetch('/admin/notice-notify/delete', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        if (result === 'success') {
            alert('공지사항이 삭제되었습니다.');
            location.reload();
        } else if (result === 'login_required') {
            alert('로그인이 필요합니다.');
            window.location.href = '/crm/crm_login';
        } else {
            alert('삭제 중 오류가 발생했습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('삭제 중 오류가 발생했습니다.');
    });
}

// 탭 전환
function showTab(tabName) {
    // 모든 탭 버튼의 active 클래스 제거
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 모든 탭 콘텐츠 숨기기
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 선택된 탭 버튼에 active 클래스 추가
    event.target.classList.add('active');
    
    // 선택된 탭 콘텐츠 표시
    document.getElementById(tabName + 'Tab').classList.add('active');
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeNoticeModal();
        closeNoticeDetailModal();
    }
});

// 모달 외부 클릭 시 닫기
window.addEventListener('click', function(e) {
    const noticeModal = document.getElementById('noticeModal');
    const detailModal = document.getElementById('noticeDetailModal');
    
    if (e.target === noticeModal) {
        closeNoticeModal();
    }
    if (e.target === detailModal) {
        closeNoticeDetailModal();
    }
});

