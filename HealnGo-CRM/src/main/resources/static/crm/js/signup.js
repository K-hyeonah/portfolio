// 회원가입 페이지 JavaScript
let emailVerified = false;

document.addEventListener('DOMContentLoaded', function() {
    // 폼 유효성 검사 및 제출
    setupFormValidation('social-signup-form');

    // 이메일 인증 기능 초기화
    initializeEmailVerification();
});

// 폼 유효성 검사 설정
function setupFormValidation(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!emailVerified) {
            showMessage('이메일 인증을 완료해주세요.', 'error');
            return;
        }
        
        if (validateForm(form)) {
            submitForm(form);
        }
    });

    // 실시간 유효성 검사
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearError(this);
        });
    });
}

// 폼 유효성 검사
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    // 비밀번호 확인 검사
    const password = form.querySelector('input[name="password"]');
    const passwordConfirm = form.querySelector('input[name="passwordConfirm"]');
    
    if (password && passwordConfirm) {
        if (password.value !== passwordConfirm.value) {
            showError(passwordConfirm, '비밀번호가 일치하지 않습니다.');
            isValid = false;
        }
    }

    return isValid;
}

// 개별 필드 유효성 검사
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // 필수 필드 검사
    if (field.hasAttribute('required') && !value) {
        errorMessage = '이 필드는 필수입니다.';
        isValid = false;
    }

    // 이메일 유효성 검사
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = '올바른 이메일 형식을 입력해주세요.';
            isValid = false;
        }
    }

    // 비밀번호 유효성 검사
    if (fieldName === 'password' && value) {
        if (value.length < 8) {
            errorMessage = '비밀번호는 8자 이상이어야 합니다.';
            isValid = false;
        }
    }

    // 전화번호 유효성 검사 (선택 사항)
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^010-\d{4}-\d{4}$/;
        if (!phoneRegex.test(value)) {
            errorMessage = '올바른 전화번호 형식을 입력해주세요. (010-1234-5678)';
            isValid = false;
        }
    }

    if (!isValid) {
        showError(field, errorMessage);
    } else {
        clearError(field);
    }

    return isValid;
}

// 에러 메시지 표시
function showError(field, message) {
    const errorElement = document.getElementById(field.id + '-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    field.style.borderColor = '#dc3545';
    field.style.backgroundColor = '#fff5f5';
}

// 에러 메시지 제거
function clearError(field) {
    const errorElement = document.getElementById(field.id + '-error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    field.style.borderColor = '#e1e5e9';
    field.style.backgroundColor = '#f8f9fa';
}

// 폼 제출
function submitForm(form) {
    const submitBtn = form.querySelector('.user-signup-btn');
    if (!submitBtn) {
        console.error('제출 버튼을 찾을 수 없습니다.');
        return;
    }
    const originalText = submitBtn.textContent;
    
    // 로딩 상태 표시
    submitBtn.classList.add('loading');
    submitBtn.textContent = '처리 중...';
    submitBtn.disabled = true;

    // 데이터 수집
    const formData = {
        email: document.getElementById('social-email').value,
        password: document.getElementById('social-password').value,
        name: document.getElementById('social-name').value,
        phone: document.getElementById('social-phone').value || null
    };
    
    // fetch로 서버에 전송
    fetch('/api/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('서버 오류가 발생했습니다.');
    })
    .then(data => {
        if (data.success) {
            showMessage('회원가입이 완료되었습니다!', 'success');
            // 3초 후 로그인 페이지로 이동
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            showMessage(data.message || '회원가입에 실패했습니다.', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('네트워크 오류가 발생했습니다.', 'error');
    })
    .finally(() => {
        // 로딩 상태 해제
        submitBtn.classList.remove('loading');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// 메시지 표시
function showMessage(message, type) {
    // 기존 메시지 제거
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 새 메시지 생성
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // 폼 앞에 삽입
    const activeForm = document.querySelector('.signup-form.active');
    activeForm.insertBefore(messageDiv, activeForm.firstChild);
    
    // 5초 후 자동 제거
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// 전화번호 자동 포맷팅
document.addEventListener('input', function(e) {
    if (e.target.type === 'tel') {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 11) {
            value = value.substring(0, 11);
            value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        } else if (value.length >= 7) {
            value = value.replace(/(\d{3})(\d{4})/, '$1-$2');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})/, '$1-');
        }
        
        e.target.value = value;
    }
});

// 이메일 인증 기능 초기화
function initializeEmailVerification() {
    const emailInput = document.getElementById('social-email');
    const verifyBtn = document.getElementById('social-verify-btn');
    const verificationGroup = document.getElementById('social-verification-group');
    const verificationCode = document.getElementById('social-verification-code');
    const verifyCodeBtn = document.getElementById('social-verify-code-btn');
    const timer = document.getElementById('social-timer');
    const timeLeft = document.getElementById('social-time-left');
    
    let timeInterval = null;
    let timeLeftSeconds = 300; // 5분
    
    // 인증번호 발송 버튼 클릭
    verifyBtn.addEventListener('click', function() {
        const email = emailInput.value.trim();
        
        if (!email) {
            showError(emailInput, '이메일을 입력해주세요.');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError(emailInput, '올바른 이메일 형식을 입력해주세요.');
            return;
        }
        
        // 인증번호 발송 요청
        sendVerificationCode(email);
    });
    
    // 인증 확인 버튼 클릭
    verifyCodeBtn.addEventListener('click', function() {
        const code = verificationCode.value.trim();
        const email = emailInput.value.trim();
        
        if (!code) {
            showError(verificationCode, '인증번호를 입력해주세요.');
            return;
        }
        
        // 인증번호 확인
        verifyCode(email, code);
    });
    
    // 인증번호 입력 시 실시간 검증
    verificationCode.addEventListener('input', function() {
        // 영문자와 숫자만 허용 (대소문자 구분 없이)
        this.value = this.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        clearError(this);
    });
    
    // 인증번호 발송 함수
    async function sendVerificationCode(email) {
        verifyBtn.disabled = true;
        verifyBtn.textContent = '확인중...';
        
        try {
            // 1단계: 이메일 중복 확인
            const checkResponse = await fetch(`/api/user/check-email?email=${encodeURIComponent(email)}`);
            const checkResult = await checkResponse.json();
            
            if (!checkResult.available) {
                showMessage('이미 사용 중인 이메일입니다. 다른 이메일을 사용해주세요.', 'error');
                verifyBtn.disabled = false;
                verifyBtn.textContent = '인증번호 발송';
                // 이메일 입력 필드 포커스
                emailInput.focus();
                emailInput.select();
                return;
            }
            
            // 2단계: 인증 코드 발송
            verifyBtn.textContent = '발송 중...';
            
            const response = await fetch('/api/user/send-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });
            
            const data = await response.json();
            
            if (data.success) {
                verificationGroup.style.display = 'block';
                timer.style.display = 'block';
                startTimer();
                
                verifyBtn.textContent = '재발송';
                verifyBtn.disabled = false;
                emailInput.disabled = true;
                
                showMessage('인증번호가 이메일로 전송되었습니다.', 'success');
            } else {
                showMessage(data.message || '인증번호 발송에 실패했습니다.', 'error');
                verifyBtn.disabled = false;
                verifyBtn.textContent = '인증번호 발송';
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('네트워크 오류가 발생했습니다.', 'error');
            verifyBtn.disabled = false;
            verifyBtn.textContent = '인증번호 발송';
        }
    }
    
    // 인증번호 확인 함수
    function verifyCode(email, code) {
        verifyCodeBtn.disabled = true;
        verifyCodeBtn.textContent = '확인 중...';
        
        fetch('/api/user/verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, code: code })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 인증 성공
                emailVerified = true;
                verificationGroup.style.display = 'none';
                timer.style.display = 'none';
                clearInterval(timeInterval);
                
                verifyBtn.textContent = '인증완료';
                verifyBtn.disabled = true;
                verifyBtn.style.background = '#28a745';
                
                showMessage('이메일 인증이 완료되었습니다.', 'success');
            } else {
                // 인증 실패
                showError(verificationCode, data.message || '인증번호가 올바르지 않습니다.');
                verifyCodeBtn.disabled = false;
                verifyCodeBtn.textContent = '인증 확인';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('네트워크 오류가 발생했습니다.', 'error');
            verifyCodeBtn.disabled = false;
            verifyCodeBtn.textContent = '인증 확인';
        });
    }
    
    // 타이머 시작
    function startTimer() {
        timeLeftSeconds = 300;
        updateTimer();
        
        if (timeInterval) {
            clearInterval(timeInterval);
        }
        
        timeInterval = setInterval(() => {
            timeLeftSeconds--;
            updateTimer();
            
            if (timeLeftSeconds <= 0) {
                clearInterval(timeInterval);
                timer.classList.add('danger');
                showError(verificationCode, '인증 시간이 만료되었습니다. 다시 발송해주세요.');
                verifyCodeBtn.disabled = true;
            }
        }, 1000);
    }
    
    // 타이머 업데이트
    function updateTimer() {
        const minutes = Math.floor(timeLeftSeconds / 60);
        const seconds = timeLeftSeconds % 60;
        timeLeft.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        timer.classList.remove('warning', 'danger');
        if (timeLeftSeconds <= 30) {
            timer.classList.add('danger');
        } else if (timeLeftSeconds <= 60) {
            timer.classList.add('warning');
        }
    }
}
