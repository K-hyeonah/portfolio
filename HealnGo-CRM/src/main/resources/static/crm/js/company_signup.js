// 회원가입 데이터 저장
let signupData = {
    email: '',
    emailVerified: false,
    phone: '',
    password: '',
    userType: 'company', // 기본값: 업체
    // 업체용
    companyName: '',
    companyNumber: '',
    representative: '',
    mainPhone: '',
    fax: '',
    postcode: '',
    address: '',
    detailAddress: '',
    category: '',
    companyIntroduction: '',
    website: '',
    // 관리자용
    managerName: '',
    adminInviteCode: ''
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
            // 영문자와 숫자만 허용 (대소문자 구분 없이)
            this.value = this.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        });
    }

    // 비밀번호 토글
    setupPasswordToggle();
    
    // 폼 검증
    setupFormValidation();
    
    // 문자 수 카운터
    setupCharacterCounter();
}

// 문자 수 카운터 설정
function setupCharacterCounter() {
    const textarea = document.getElementById('companyIntroduction');
    const counter = document.getElementById('charCount');
    
    if (textarea && counter) {
        textarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            counter.textContent = currentLength;
            
            // 문자 수에 따른 스타일 변경
            if (currentLength > 450) {
                counter.style.color = '#E53E3E';
            } else if (currentLength > 350) {
                counter.style.color = '#F6AD55';
            } else {
                counter.style.color = '#6b7280';
            }
        });
    }
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
    sendButton.textContent = '확인중...';
    
    try {
        // 1단계: 이메일 중복 확인
        const checkResponse = await fetch(`/crm/check-email?email=${encodeURIComponent(email)}`);
        const checkResult = await checkResponse.json();
        
        if (!checkResult.available) {
            alert('이미 사용 중인 이메일입니다. 다른 이메일을 사용해주세요.');
            sendButton.disabled = false;
            sendButton.textContent = '인증하기';
            // 이메일 입력 필드 포커스
            document.getElementById('email').focus();
            document.getElementById('email').select();
            return;
        }
        
        // 2단계: 인증 코드 발송
        sendButton.textContent = '전송중...';
        
        const response = await fetch('/crm/send-code', {
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
        const response = await fetch('/crm/verify-code', {
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
            signupData.phone = document.getElementById('phoneNumber').value || '';
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
        saveCurrentStepData();
        currentStep++;
        showStep(currentStep);
        updateProgressSteps();
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

// 현재 단계 데이터 저장
function saveCurrentStepData() {
    if (currentStep === 2) {
        const userTypeInput = document.querySelector('input[name="userType"]:checked');
        signupData.userType = userTypeInput ? userTypeInput.value : 'company';
        
        if (signupData.userType === 'company') {
            signupData.companyName = document.getElementById('companyName').value;
            signupData.companyNumber = document.getElementById('companyNumber').value;
            signupData.representative = document.getElementById('representative').value;
            signupData.mainPhone = document.getElementById('mainPhone').value;
            signupData.fax = document.getElementById('fax').value;
            signupData.postcode = document.getElementById('postcode').value;
            signupData.address = document.getElementById('deliveryAddress').value;
            signupData.detailAddress = document.getElementById('detailAddress').value;
            signupData.category = document.getElementById('category').value;
            signupData.companyIntroduction = document.getElementById('companyIntroduction').value;
            signupData.website = document.getElementById('website').value;
        } else {
            signupData.managerName = document.getElementById('managerName').value;
            signupData.adminInviteCode = document.getElementById('adminInviteCode').value;
        }
    }
}

// 사용자 유형에 따라 필드 토글
function toggleUserTypeFields() {
    const userType = document.querySelector('input[name="userType"]:checked').value;
    const companyFields = document.querySelectorAll('.company-only');
    const managerFields = document.querySelectorAll('.manager-only');
    
    if (userType === 'company') {
        companyFields.forEach(field => field.style.display = 'block');
        managerFields.forEach(field => field.style.display = 'none');
        // 관리자 필드 required 제거
        document.getElementById('managerName').removeAttribute('required');
        document.getElementById('adminInviteCode').removeAttribute('required');
        // 업체 필수 필드 required 추가
        document.getElementById('companyName').setAttribute('required', 'required');
        document.getElementById('companyNumber').setAttribute('required', 'required');
        document.getElementById('representative').setAttribute('required', 'required');
        document.getElementById('mainPhone').setAttribute('required', 'required');
        document.getElementById('postcode').setAttribute('required', 'required');
        document.getElementById('deliveryAddress').setAttribute('required', 'required');
        document.getElementById('category').setAttribute('required', 'required');
    } else {
        companyFields.forEach(field => field.style.display = 'none');
        managerFields.forEach(field => field.style.display = 'block');
        // 업체 필드 required 제거
        document.getElementById('companyName').removeAttribute('required');
        document.getElementById('companyNumber').removeAttribute('required');
        document.getElementById('representative').removeAttribute('required');
        document.getElementById('mainPhone').removeAttribute('required');
        document.getElementById('postcode').removeAttribute('required');
        document.getElementById('deliveryAddress').removeAttribute('required');
        document.getElementById('category').removeAttribute('required');
        // 관리자 필드 required 추가
        document.getElementById('managerName').setAttribute('required', 'required');
        document.getElementById('adminInviteCode').setAttribute('required', 'required');
    }
}

// 이메일 유효성 검사
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 회원가입 제출
async function submitSignup() {
    // 현재 단계 데이터 저장
    saveCurrentStepData();
    
    // Step 2 검증 - userType에 따라 다르게 검증
    if (signupData.userType === 'company') {
        if (!signupData.companyName) {
            alert('업체명을 입력해주세요.');
            return;
        }
        
        if (!signupData.companyNumber) {
            alert('사업자등록번호를 입력해주세요.');
            return;
        }
        
        if (!signupData.representative) {
            alert('대표자명을 입력해주세요.');
            return;
        }
        
        if (!signupData.mainPhone) {
            alert('대표 전화번호를 입력해주세요.');
            return;
        }
        
        if (!signupData.postcode) {
            alert('우편번호를 입력해주세요. (우편번호 찾기 버튼을 클릭하세요)');
            return;
        }
        
        if (!signupData.address) {
            alert('주소를 입력해주세요. (우편번호 찾기 버튼을 클릭하세요)');
            return;
        }
        
        if (!signupData.category) {
            alert('카테고리를 선택해주세요.');
            return;
        }
    } else if (signupData.userType === 'manager') {
        if (!signupData.managerName) {
            alert('이름을 입력해주세요.');
            return;
        }
        
        if (!signupData.adminInviteCode) {
            alert('관리자 초대 코드를 입력해주세요.');
            return;
        }
    }
    
    console.log('회원가입 데이터:', signupData);
    
    // userType에 따라 다른 데이터 전송
    let requestData = {
        email: signupData.email,
        password: signupData.password,
        phone: signupData.phone || null
    };
    
    if (signupData.userType === 'company') {
        requestData.companyName = signupData.companyName;
        requestData.bizNo = signupData.companyNumber;
        requestData.representative = signupData.representative;
        requestData.mainPhone = signupData.mainPhone;
        requestData.fax = signupData.fax || null;
        requestData.postcode = signupData.postcode;
        requestData.address = signupData.address;
        requestData.detailAddress = signupData.detailAddress || null;
        requestData.category = signupData.category;
        requestData.companyIntroduction = signupData.companyIntroduction || null;
        requestData.website = signupData.website || null;
    } else {
        requestData.name = signupData.managerName;
        requestData.inviteCode = signupData.adminInviteCode;
    }
    
    try {
        const endpoint = signupData.userType === 'company' ? '/crm/register' : '/crm/register-manager';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
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

// 대시보드로 이동
function goToDashboard() {
    window.location.href = '/crm/company';
}

// 카카오 우편번호 API
let element_wrap;

function searchAddress() {
    sample3_execDaumPostcode();
}

function foldDaumPostcode() {
    if (element_wrap) {
        element_wrap.style.display = 'none';
    }
}

function sample3_execDaumPostcode() {
    element_wrap = document.getElementById('wrap');
    if (!element_wrap) return;

    var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);

    new daum.Postcode({
        oncomplete: function(data) {
            var addr = '';
            var extraAddr = '';

            if (data.userSelectedType === 'R') {
                addr = data.roadAddress;
            } else {
                addr = data.jibunAddress;
            }

            if (data.userSelectedType === 'R') {
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                }
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                if (extraAddr !== '') {
                    extraAddr = ' (' + extraAddr + ')';
                }
                document.getElementById("deliveryAddress").value = addr + extraAddr;
            } else {
                document.getElementById("deliveryAddress").value = addr;
            }

            document.getElementById('postcode').value = data.zonecode;
            document.getElementById("detailAddress").focus();

            element_wrap.style.display = 'none';
            document.body.scrollTop = currentScroll;
        },
        onresize: function(size) {
            element_wrap.style.height = size.height + 'px';
        },
        width: '100%',
        height: '100%'
    }).embed(element_wrap);

    element_wrap.style.display = 'block';
}

// 페이지 로드 시 초기화
updateProgressSteps();
