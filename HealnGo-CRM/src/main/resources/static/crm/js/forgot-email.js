// 이메일 찾기 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('forgot-email-form');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const submitBtn = form.querySelector('.submit-btn');

    // 폼 제출 처리
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });

    // 실시간 유효성 검사
    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', clearError);
    
    phoneInput.addEventListener('blur', validatePhone);
    phoneInput.addEventListener('input', clearError);

    // 전화번호 자동 포맷팅
    phoneInput.addEventListener('input', function(e) {
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
    });

    // 폼 유효성 검사
    function validateForm() {
        return validateName() && validatePhone();
    }

    // 이름 유효성 검사
    function validateName() {
        const name = nameInput.value.trim();
        
        if (!name) {
            showError(nameInput, '이름을 입력해주세요.');
            return false;
        }
        
        if (name.length < 2) {
            showError(nameInput, '이름은 2자 이상이어야 합니다.');
            return false;
        }
        
        clearError(nameInput);
        return true;
    }

    // 전화번호 유효성 검사
    function validatePhone() {
        const phone = phoneInput.value.trim();
        const phoneRegex = /^010-\d{4}-\d{4}$/;
        
        if (!phone) {
            showError(phoneInput, '전화번호를 입력해주세요.');
            return false;
        }
        
        if (!phoneRegex.test(phone)) {
            showError(phoneInput, '올바른 전화번호 형식을 입력해주세요. (010-1234-5678)');
            return false;
        }
        
        clearError(phoneInput);
        return true;
    }

    // 폼 제출
    function submitForm() {
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        
        // 로딩 상태 표시
        const originalText = submitBtn.textContent;
        submitBtn.classList.add('loading');
        submitBtn.textContent = '검색 중...';
        submitBtn.disabled = true;

        // 이메일 찾기 요청
        fetch('/forgot-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                name: name,
                phone: phone
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('서버 오류가 발생했습니다.');
        })
        .then(data => {
            if (data.success) {
                if (data.email) {
                    showMessage(`찾으신 이메일: ${data.email}`, 'success');
                } else {
                    showMessage('입력하신 정보와 일치하는 계정을 찾을 수 없습니다.', 'error');
                }
            } else {
                showMessage(data.message || '이메일 찾기에 실패했습니다.', 'error');
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
        form.insertBefore(messageDiv, form.firstChild);
        
        // 5초 후 자동 제거
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
});
