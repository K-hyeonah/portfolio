let currentStep = 1;
let verificationTimer = null;
let timeLeft = 300; // 5분 = 300초

// Step 1: 이메일 전송
async function sendVerificationCode() {
    const email = document.getElementById('email').value;
    
    if (!email) {
        showAlert('이메일을 입력해주세요.', 'error');
        return;
    }
    
    try {
        const response = await fetch('/crm/send-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('인증 코드가 이메일로 전송되었습니다.', 'success');
            document.getElementById('sendCodeBtn').disabled = true;
            startTimer();
        } else {
            showAlert(result.message || '이메일 전송에 실패했습니다.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('이메일 전송 중 오류가 발생했습니다.', 'error');
    }
}

// Step 1 다음 단계
async function verifyEmail() {
    const email = document.getElementById('email').value;
    const code = document.getElementById('verificationCode').value;
    
    if (!email || !code) {
        showAlert('이메일과 인증 코드를 모두 입력해주세요.', 'error');
        return;
    }
    
    try {
        const response = await fetch('/crm/verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, code })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('인증이 완료되었습니다.', 'success');
            stopTimer();
            nextStep();
        } else {
            showAlert(result.message || '인증 코드가 올바르지 않습니다.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('인증 확인 중 오류가 발생했습니다.', 'error');
    }
}

// Step 2: 비밀번호 재설정
async function resetPassword() {
    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // 비밀번호 검증
    if (!newPassword || !confirmPassword) {
        showAlert('모든 필드를 입력해주세요.', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        showAlert('비밀번호는 8자 이상이어야 합니다.', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showAlert('비밀번호가 일치하지 않습니다.', 'error');
        return;
    }
    
    try {
        const response = await fetch('/crm/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, newPassword })
        });
        
        const result = await response.json();
        
        if (result.success) {
            nextStep();
        } else {
            showAlert(result.message || '비밀번호 재설정에 실패했습니다.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('비밀번호 재설정 중 오류가 발생했습니다.', 'error');
    }
}

// 다음 단계로 이동
function nextStep() {
    // 현재 단계 숨기기
    document.getElementById(`step${currentStep}`).classList.remove('active');
    
    // 다음 단계 표시
    currentStep++;
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    // Progress bar 업데이트
    updateProgressBar();
}

// 이전 단계로 이동
function previousStep() {
    if (currentStep > 1) {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        currentStep--;
        document.getElementById(`step${currentStep}`).classList.add('active');
        updateProgressBar();
    }
}

// Progress bar 업데이트
function updateProgressBar() {
    const progressPercent = ((currentStep - 1) / 2) * 100;
    document.getElementById('progressFill').style.width = progressPercent + '%';
    
    // Step 표시 업데이트
    for (let i = 1; i <= 3; i++) {
        const stepElement = document.getElementById(`progressStep${i}`);
        if (i < currentStep) {
            stepElement.classList.add('completed');
            stepElement.classList.remove('active');
        } else if (i === currentStep) {
            stepElement.classList.add('active');
            stepElement.classList.remove('completed');
        } else {
            stepElement.classList.remove('active', 'completed');
        }
    }
}

// 타이머 시작
function startTimer() {
    timeLeft = 300; // 5분
    updateTimerDisplay();
    
    verificationTimer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            stopTimer();
            showAlert('인증 시간이 만료되었습니다. 다시 시도해주세요.', 'error');
            document.getElementById('sendCodeBtn').disabled = false;
        }
    }, 1000);
}

// 타이머 중지
function stopTimer() {
    if (verificationTimer) {
        clearInterval(verificationTimer);
        verificationTimer = null;
    }
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.style.display = 'none';
    }
}

// 타이머 표시 업데이트
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timerElement = document.getElementById('timer');
    
    if (timerElement) {
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        timerElement.style.display = 'block';
        
        if (timeLeft <= 60) {
            timerElement.classList.add('expired');
        }
    }
}

// Alert 메시지 표시
function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : 
                 type === 'info' ? '<i class="fas fa-info-circle"></i>' :
                 '<i class="fas fa-exclamation-circle"></i>';
    
    alertBox.innerHTML = `<div class="alert alert-${type}">${icon} ${message}</div>`;
    
    setTimeout(() => {
        alertBox.innerHTML = '';
    }, 5000);
}

// 로그인 페이지로 이동
function goToLogin() {
    window.location.href = '/crm/crm_login';
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    updateProgressBar();
    
    // 인증 코드 입력 필드: 영문+숫자만 허용, 대문자 변환
    const verificationCodeInput = document.getElementById('verificationCode');
    if (verificationCodeInput) {
        verificationCodeInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        });
    }
});

