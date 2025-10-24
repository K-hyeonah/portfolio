// 회원가입 데이터 저장
let signupData = {
    email: '',
    emailVerified: false,
    password: '',
    name: '',
    phone: ''
};

let currentStep = 1;
let timerInterval = null;
let timeLeft = 300; // 5분

document.addEventListener('DOMContentLoaded', function() {
    initializeSignup();
});

function initializeSignup() {
    // 이메일 인증 코드 입력 이벤트
    const emailCodeInput = document.getElementById('emailCode');
    if (emailCodeInput) {
        emailCodeInput.addEventListener('input', function() {
            if (this.value.length === 6) {
                // 자동으로 인증 확인하지 않고 버튼 클릭하도록 변경
            }
        });
    }

    // 비밀번호 토글
    setupPasswordToggle();
    
    // 폼 검증
    setupFormValidation();
}

// 이메일 인증 코드 전송
async function sendEmailCode() {
    const email = document.getElementById('email').value;
    const sendButton = document.querySelector('.btn-send-sms');
    
    // 이메일 유효성 검사
    if (!email || !isValidEmail(email)) {
        alert('올바른 이메일 주소를 입력해주세요.');
        return;
    }
    
    // 버튼 비활성화
    sendButton.disabled = true;
    sendButton.textContent = '전송중...';
    
    try {
        const response = await fetch('/api/user/send-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // 이메일 전송 성공
            document.getElementById('sentEmail').textContent = email;
            document.getElementById('emailInfo').style.display = 'flex';
            
            // 타이머 시작
            startTimer();
            
            // 버튼 상태 변경
            sendButton.textContent = '재전송';
            sendButton.disabled = false;
            
            alert('인증 코드가 이메일로 전송되었습니다.');
        } else {
            alert('이메일 전송 중 오류가 발생했습니다: ' + result.message);
            sendButton.disabled = false;
            sendButton.textContent = '인증하기';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('이메일 전송 중 오류가 발생했습니다.');
        sendButton.disabled = false;
        sendButton.textContent = '인증하기';
    }
}

// 이메일 인증 확인 및 다음 단계
async function verifyAndNext() {
    const email = document.getElementById('email').value;
    const code = document.getElementById('emailCode').value;
    const password = document.getElementById('password').value;
    
    // 기본 검증
    if (!email || !isValidEmail(email)) {
        alert('올바른 이메일 주소를 입력해주세요.');
        return;
    }
    
    if (!code || code.length !== 6) {
        alert('6자리 인증번호를 입력해주세요.');
        return;
    }
    
    if (!password || password.length < 8) {
        alert('비밀번호는 8자 이상 입력해주세요.');
        return;
    }
    
    try {
        // 인증 코드 확인
        const response = await fetch('/api/user/verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, code: code })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // 인증 성공
            signupData.email = email;
            signupData.password = password;
            signupData.emailVerified = true;
            
            clearInterval(timerInterval);
            nextStep();
        } else {
            alert(result.message || '인증 코드가 올바르지 않습니다.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('인증 확인 중 오류가 발생했습니다.');
    }
}

// 이메일 타이머
function startTimer() {
    timeLeft = 300; // 5분
    
    timerInterval = setInterval(function() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        document.getElementById('timer').textContent = 
            String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
        
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(timerInterval);
            document.getElementById('emailInfo').style.display = 'none';
            alert('인증 시간이 만료되었습니다. 다시 시도해주세요.');
        }
    }, 1000);
}

// 비밀번호 토글 설정
function setupPasswordToggle() {
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordInput = document.getElementById('password');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    }
}

// 폼 검증 설정
function setupFormValidation() {
    const forms = document.querySelectorAll('.signup-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    });
}

// 비밀번호 토글
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.password-toggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// 다음 단계로 이동
function nextStep() {
    if (currentStep < 2) {
        currentStep++;
        showStep(currentStep);
        updateProgressSteps();
    } else {
        submitSignup();
    }
}

// 이전 단계로 이동
function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgressSteps();
    }
}

// 현재 단계 표시
function showStep(step) {
    // 모든 단계 숨기기
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 현재 단계 표시
    const currentStepContent = document.getElementById(`step${step}-content`);
    if (currentStepContent) {
        currentStepContent.classList.add('active');
    }
}

// 진행 단계 업데이트
function updateProgressSteps() {
    for (let i = 1; i <= 2; i++) {
        const stepCircle = document.querySelector(`#step${i} .step-circle`);
        const stepNumber = document.querySelector(`#step${i} .step-number`);
        
        if (i < currentStep) {
            // 완료된 단계
            stepCircle.classList.remove('active');
            stepCircle.classList.add('completed');
            if (stepNumber) stepNumber.style.display = 'none';
        } else if (i === currentStep) {
            // 현재 단계
            stepCircle.classList.remove('completed');
            stepCircle.classList.add('active');
            if (stepNumber) stepNumber.style.display = 'block';
        } else {
            // 아직 안 한 단계
            stepCircle.classList.remove('active', 'completed');
            if (stepNumber) stepNumber.style.display = 'block';
        }
    }
}

// 이메일 유효성 검사
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 회원가입 제출
async function submitSignup() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phoneNumber').value || '';
    
    if (!name) {
        alert('이름을 입력해주세요.');
        return;
    }
    
    console.log('회원가입 데이터:', signupData);
    
    try {
        const response = await fetch('/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: signupData.email,
                password: signupData.password,
                name: name,
                phone: phone
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccessPage();
        } else {
            alert('회원가입 중 오류가 발생했습니다: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('회원가입 중 오류가 발생했습니다.');
    }
}

// 성공 페이지 표시
function showSuccessPage() {
    // 모든 단계 숨기기
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 성공 페이지 표시
    document.getElementById('success-content').style.display = 'block';
    
    // 사이드바 숨기기
    document.querySelector('.signup-sidebar').style.display = 'none';
    document.querySelector('.signup-main').style.width = '100%';
}

// 메인으로 이동
function goToMain() {
    window.location.href = '/login';
}

// 페이지 로드 시 초기화
updateProgressSteps();

