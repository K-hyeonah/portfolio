// Company Edit Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Company Edit Page DOM loaded');
    initializeCompanyEditPage();
    setupTabNavigation();
    setupFormValidation();
    setupCharacterCounter();
    setupFormSubmission();
    setupRealTimePreview();
    setupLogoUpload();
});

/**
 * 회사 정보 수정 페이지 초기화
 */
function initializeCompanyEditPage() {
    console.log('Company Edit Page initialized');
    
    // 현재 페이지 활성화
    highlightCurrentPage();
    
    // 폼 상태 초기화
    initializeFormState();
    
    // 자동 저장 설정
    setupAutoSave();
}

/**
 * 현재 페이지 하이라이트
 */
function highlightCurrentPage() {
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    sidebarLinks.forEach(link => {
        if (link.textContent.includes('업체 정보 수정')) {
            link.classList.add('active');
        }
    });
}

/**
 * 탭 네비게이션 설정
 */
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    console.log('탭 버튼 개수:', tabButtons.length);
    console.log('탭 패널 개수:', tabPanes.length);
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            console.log('탭 클릭됨:', targetTab);
            
            // 모든 탭 버튼에서 active 클래스 제거
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // 모든 탭 패널에서 active 클래스 제거
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // 클릭된 탭 버튼에 active 클래스 추가
            this.classList.add('active');
            
            // 해당 탭 패널에 active 클래스 추가
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
                console.log('탭 패널 활성화됨:', targetTab);
            } else {
                console.error('탭 패널을 찾을 수 없음:', targetTab);
            }
            
            // 탭 변경 이벤트 발생
            onTabChange(targetTab);
        });
    });
}

/**
 * 탭 변경 시 호출되는 함수
 */
function onTabChange(tabName) {
    console.log(`Tab changed to: ${tabName}`);
    
    // 폼 검증 상태 업데이트
    updateFormValidationStatus();
    
    // 진행률 업데이트
    updateProgressBar();
}

/**
 * 폼 검증 설정
 */
function setupFormValidation() {
    const requiredFields = document.querySelectorAll('input[required], textarea[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            // 실시간 검증 (입력 중에는 에러 메시지 제거)
            clearFieldError(this);
        });
    });
}

/**
 * 필드 검증
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    let isValid = true;
    let errorMessage = '';
    
    // 필수 필드 검증
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = '필수 입력 항목입니다.';
    }
    
    // 이메일 형식 검증
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = '올바른 이메일 형식을 입력하세요.';
        }
    }
    
    // 전화번호 형식 검증
    if (fieldName === 'mainPhone' && value) {
        const phoneRegex = /^[0-9-+\s()]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = '올바른 전화번호 형식을 입력하세요.';
        }
    }
    
    // URL 형식 검증
    if (fieldName === 'website' && value) {
        try {
            new URL(value.startsWith('http') ? value : 'https://' + value);
        } catch (e) {
            isValid = false;
            errorMessage = '올바른 웹사이트 URL을 입력하세요.';
        }
    }
    
    // 검증 결과 처리
    if (isValid) {
        clearFieldError(field);
    } else {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

/**
 * 필드 에러 표시
 */
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #E53E3E;
        font-size: 12px;
        margin-top: 4px;
    `;
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#E53E3E';
}

/**
 * 필드 에러 제거
 */
function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

/**
 * 문자 수 카운터 설정
 */
function setupCharacterCounter() {
    const textarea = document.getElementById('companyIntroduction');
    const counter = document.getElementById('charCount');
    
    if (!textarea || !counter) return;
    
    // 초기 문자 수 설정
    const initialLength = textarea.value.length;
    counter.textContent = initialLength;
    
    textarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        const maxLength = this.getAttribute('maxlength') || 500;
        
        counter.textContent = currentLength;
        
        // 문자 수에 따른 스타일 변경
        if (currentLength > maxLength * 0.9) {
            counter.style.color = '#E53E3E';
        } else if (currentLength > maxLength * 0.7) {
            counter.style.color = '#F6AD55';
        } else {
            counter.style.color = '#718096';
        }
    });
}

/**
 * 폼 제출 설정
 */
function setupFormSubmission() {
    const saveButton = document.querySelector('.btn-save');
    const cancelButton = document.querySelector('.btn-cancel');
    
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveCompanyInfo();
        });
    }
    
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            confirmCancel();
        });
    }
}

/**
 * 회사 정보 저장
 */
async function saveCompanyInfo() {
    console.log('Saving company information...');
    
    // 폼 검증
    if (!validateForm()) {
        showNotification('입력 정보를 확인해주세요.', 'error');
        return;
    }
    
    // 로딩 상태 표시
    showLoadingState(true);
    
    // 폼 데이터 수집
    const formData = collectFormData();
    
    try {
        // 서버에 저장 요청
        const response = await fetch('/company/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        showLoadingState(false);
        
        if (result.success) {
            showNotification('회사 정보가 저장되었습니다.', 'success');
            updateLastModifiedTime();
            updateProgressBar();
        } else {
            showNotification(result.message || '저장에 실패했습니다.', 'error');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showLoadingState(false);
        showNotification('저장 중 오류가 발생했습니다.', 'error');
    }
}

/**
 * 폼 검증
 */
function validateForm() {
    const requiredFields = document.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * 폼 데이터 수집
 */
function collectFormData() {
    const data = {
        basicInfo: {
            companyName: document.getElementById('companyName')?.value || '',
            businessNumber: document.getElementById('businessNumber')?.value || '',
            representative: document.getElementById('representative')?.value || '',
            category: document.getElementById('category')?.value || '',
            companyIntroduction: document.getElementById('companyIntroduction')?.value || ''
        },
        contactInfo: {
            email: document.getElementById('email')?.value || '',
            mainPhone: document.getElementById('mainPhone')?.value || '',
            fax: document.getElementById('fax')?.value || '',
            postcode: document.getElementById('postcode')?.value || '',
            address: document.getElementById('deliveryAddress')?.value || '',
            detailAddress: document.getElementById('detailAddress')?.value || '',
            website: document.getElementById('website')?.value || ''
        }
    };
    
    return data;
}

/**
 * 취소 확인
 */
function confirmCancel() {
    if (confirm('변경사항이 저장되지 않습니다. 정말 취소하시겠습니까?')) {
        window.history.back();
    }
}

/**
 * 실시간 미리보기 설정
 */
function setupRealTimePreview() {
    const previewFields = [
        'companyName',
        'representative',
        'email',
        'mainPhone',
        'fax',
        'deliveryAddress',
        'detailAddress'
    ];
    
    previewFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', function() {
                updatePreview(fieldId, this.value);
            });
        }
    });
}

/**
 * 미리보기 업데이트
 */
function updatePreview(fieldId, value) {
    // 실제 구현에서는 미리보기 영역의 해당 요소를 업데이트
    console.log(`Preview updated: ${fieldId} = ${value}`);
}

/**
 * 진행률 바 업데이트
 */
function updateProgressBar() {
    const requiredFields = document.querySelectorAll('input[required], textarea[required]');
    const filledFields = Array.from(requiredFields).filter(field => field.value.trim());
    const progress = Math.round((filledFields.length / requiredFields.length) * 100);
    
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.status-value');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    if (progressText && progressText.parentElement.querySelector('.status-label')?.textContent.includes('완료도')) {
        progressText.textContent = `${progress}%`;
    }
}

/**
 * 폼 상태 초기화
 */
function initializeFormState() {
    updateProgressBar();
}

/**
 * 자동 저장 설정
 */
function setupAutoSave() {
    let autoSaveTimeout;
    
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                // 자동 저장 로직 (실제 구현에서는 서버에 저장)
                console.log('Auto-saving form data...');
            }, 3000);
        });
    });
}

/**
 * 마지막 수정 시간 업데이트
 */
function updateLastModifiedTime() {
    const timeElements = document.querySelectorAll('.status-value');
    timeElements.forEach(element => {
        if (element.parentElement.querySelector('.status-label')?.textContent.includes('마지막')) {
            element.textContent = '방금 전';
        }
    });
}

/**
 * 로딩 상태 표시
 */
function showLoadingState(isLoading) {
    const saveButton = document.querySelector('.btn-save');
    
    if (isLoading) {
        saveButton.disabled = true;
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 저장 중...';
    } else {
        saveButton.disabled = false;
        saveButton.innerHTML = '<i class="fas fa-save"></i> 저장하기';
    }
}

/**
 * 알림 표시
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const colors = {
        success: '#48BB78',
        error: '#E53E3E',
        warning: '#F6AD55',
        info: '#3182CE'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // 애니메이션
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 3초 후 제거
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * 폼 검증 상태 업데이트
 */
function updateFormValidationStatus() {
    // 현재 활성 탭의 필드들 검증
    const activeTab = document.querySelector('.tab-pane.active');
    if (!activeTab) return;
    
    const fields = activeTab.querySelectorAll('input, textarea');
    
    fields.forEach(field => {
        if (field.value.trim()) {
            validateField(field);
        }
    });
}

/**
 * 로고 업로드 설정
 */
function setupLogoUpload() {
    const logoInput = document.getElementById('logoInput');
    
    if (!logoInput) return;
    
    logoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (!file) return;
        
        // 파일 유효성 검사
        if (!file.type.startsWith('image/')) {
            showNotification('이미지 파일만 업로드 가능합니다.', 'error');
            return;
        }
        
        // 파일 크기 검사 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('파일 크기는 5MB 이하여야 합니다.', 'error');
            return;
        }
        
        // 미리보기 표시
        const reader = new FileReader();
        reader.onload = function(event) {
            const logoPreview = document.getElementById('companyLogoPreview');
            const logoImage = document.getElementById('logoImage');
            const logoInitial = document.getElementById('logoInitial');
            
            if (logoImage) {
                logoImage.src = event.target.result;
                logoImage.style.display = 'block';
            } else {
                // 이미지 엘리먼트가 없으면 생성
                const img = document.createElement('img');
                img.id = 'logoImage';
                img.className = 'logo-image';
                img.src = event.target.result;
                img.alt = 'Company Logo';
                img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; display: block;';
                logoPreview.insertBefore(img, logoPreview.firstChild);
            }
            
            if (logoInitial) {
                logoInitial.style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
        
        // 서버에 업로드
        uploadLogo(file);
    });
}

/**
 * 로고 업로드
 */
async function uploadLogo(file) {
    const formData = new FormData();
    formData.append('logo', file);
    
    try {
        const response = await fetch('/company/upload-logo', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('로고가 업로드되었습니다.', 'success');
        } else {
            showNotification(result.message || '로고 업로드에 실패했습니다.', 'error');
        }
    } catch (error) {
        console.error('Logo upload error:', error);
        showNotification('로고 업로드 중 오류가 발생했습니다.', 'error');
    }
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
            
            // 미리보기 업데이트
            updatePreview('deliveryAddress', addr);
        },
        onresize: function(size) {
            element_wrap.style.height = size.height + 'px';
        },
        width: '100%',
        height: '100%'
    }).embed(element_wrap);

    element_wrap.style.display = 'block';
}

// 내보내기
window.CompanyEdit = {
    updateProgressBar,
    showNotification,
    saveCompanyInfo,
    searchAddress,
    foldDaumPostcode,
    uploadLogo
};
