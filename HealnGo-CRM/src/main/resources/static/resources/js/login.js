(function() {
    // DOM 요소들
    const kakaoLoginBtn = document.getElementById('kakao-login-btn');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // 이벤트 리스너 등록
    function initEventListeners() {
        // 소셜 로그인 버튼들
        if (kakaoLoginBtn) {
            kakaoLoginBtn.addEventListener('click', function(e) {
                // 서버에서 전달받은 URL을 사용하므로 href 속성으로 직접 이동
                // preventDefault()를 제거하여 기본 동작(링크 이동)을 허용
            });
        }

        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', function(e) {
                // 서버에서 전달받은 URL을 사용하므로 href 속성으로 직접 이동
                // preventDefault()를 제거하여 기본 동작(링크 이동)을 허용
            });
        }

        // 로그인 폼 이벤트
        if (loginForm) {
            loginForm.addEventListener('submit', handleLoginSubmit);
        }

        // 실시간 유효성 검사
        if (emailInput) {
            emailInput.addEventListener('blur', validateEmail);
            emailInput.addEventListener('input', clearError);
        }

        if (passwordInput) {
            passwordInput.addEventListener('blur', validatePassword);
            passwordInput.addEventListener('input', clearError);
        }
    }

    // 로그인 폼 제출 처리
    function handleLoginSubmit(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        // 유효성 검사
        if (!validateEmail() || !validatePassword()) {
            return;
        }
        
        // 로딩 상태 표시
        const submitBtn = loginForm.querySelector('.primary-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.classList.add('loading');
        submitBtn.textContent = '로그인 중...';
        submitBtn.disabled = true;
        
        // 로그인 요청
        fetch('/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            // 로그인 실패 시 (401, 403 등)
            return response.json().then(data => {
                throw new Error(data.message || '아이디 또는 비밀번호를 확인해주세요.');
            }).catch(() => {
                throw new Error('아이디 또는 비밀번호를 확인해주세요.');
            });
        })
        .then(data => {
            if (data.success) {
                showMessage('로그인에 성공했습니다!', 'success');
                // 메인 페이지로 리다이렉트
                setTimeout(() => {
                    window.location.href = '/main';
                }, 1500);
            } else {
                showMessage(data.message || '아이디 또는 비밀번호를 확인해주세요.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage(error.message || '아이디 또는 비밀번호를 확인해주세요.', 'error');
        })
        .finally(() => {
            // 로딩 상태 해제
            submitBtn.classList.remove('loading');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }

    // 이메일 유효성 검사
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            showError(emailInput, '이메일을 입력해주세요.');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            showError(emailInput, '올바른 이메일 형식을 입력해주세요.');
            return false;
        }
        
        clearError(emailInput);
        return true;
    }

    // 비밀번호 유효성 검사
    function validatePassword() {
        const password = passwordInput.value.trim();
        
        if (!password) {
            showError(passwordInput, '비밀번호를 입력해주세요.');
            return false;
        }
        
        if (password.length < 6) {
            showError(passwordInput, '비밀번호는 6자 이상이어야 합니다.');
            return false;
        }
        
        clearError(passwordInput);
        return true;
    }

    // 에러 메시지 표시
    function showError(field, message) {
        if (!field) return; // null 체크 추가
        
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
        if (!field) return; // null 체크 추가
        
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        field.style.borderColor = '#e1e5e9';
        field.style.backgroundColor = '#f8f9fa';
    }

    // 메시지 표시
    function showMessage(message, type) {
        // 기존 메시지 제거
        const existingMessage = document.querySelector('.login-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // 새 메시지 생성
        const messageDiv = document.createElement('div');
        messageDiv.className = `login-message ${type}`;
        messageDiv.textContent = message;
        
        // 폼 앞에 삽입
        loginForm.insertBefore(messageDiv, loginForm.firstChild);
        
        // 5초 후 자동 제거
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // 초기화
    function init() {
        initEventListeners();
    }

    // DOM 로드 완료 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
