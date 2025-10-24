document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/crm/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            showAlert('로그인 성공! 이동 중...', 'success');
            setTimeout(() => {
                window.location.href = result.redirectUrl || '/crm/company';
            }, 1000);
        } else {
            // 승인 상태별 처리
            if (result.status === 'PENDING') {
                showApprovalModal('승인 대기중입니다', result.detail || '관리자의 승인을 기다리고 있습니다. 승인 완료 후 로그인이 가능합니다.', 'pending');
            } else if (result.status === 'REJECTED') {
                showApprovalModal('승인이 거부되었습니다', result.detail || '관리자에게 문의하시기 바랍니다.', 'rejected');
            } else if (result.status === 'INACTIVE') {
                showApprovalModal('비활성화된 계정입니다', result.detail || '관리자에게 문의하시기 바랍니다.', 'inactive');
            } else {
                showAlert(result.message || '아이디 또는 비밀번호를 확인해주세요.', 'error');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('아이디 또는 비밀번호를 확인해주세요.', 'error');
    }
});

function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>';
    alertBox.innerHTML = `<div class="alert alert-${type}">${icon} ${message}</div>`;
    
    setTimeout(() => {
        alertBox.innerHTML = '';
    }, 5000);
}

// 승인 상태 모달 표시 함수
function showApprovalModal(title, message, status) {
    const modal = document.getElementById('approvalModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalIcon = document.getElementById('modalIcon');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    // 상태에 따른 아이콘 변경
    if (status === 'pending') {
        modalIcon.innerHTML = '<i class="fas fa-clock"></i>';
        modalIcon.className = 'modal-icon status-pending';
    } else if (status === 'rejected') {
        modalIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
        modalIcon.className = 'modal-icon status-rejected';
    } else if (status === 'inactive') {
        modalIcon.innerHTML = '<i class="fas fa-ban"></i>';
        modalIcon.className = 'modal-icon status-inactive';
    }
    
    modal.style.display = 'flex';
}

// 모달 닫기 함수
function closeApprovalModal() {
    const modal = document.getElementById('approvalModal');
    modal.style.display = 'none';
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('approvalModal');
    if (event.target === modal) {
        closeApprovalModal();
    }
}

// URL 파라미터 확인
window.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('error')) {
        showAlert('이메일 또는 비밀번호가 올바르지 않습니다.', 'error');
    }
    if (urlParams.get('logout')) {
        showAlert('로그아웃되었습니다.', 'success');
    }
});
