// 마이페이지 JavaScript

// 알림 데이터 저장
let notifications = [];

document.addEventListener('DOMContentLoaded', function() {
    // 알림 데이터 로드
    loadNotifications();
    
    // 알림 팝업 관련 기능
    initializeNotificationPopup();
    
    // 액션 버튼 이벤트 리스너
    initializeActionButtons();
    
    // 예약내역 카드 클릭 이벤트
    initializeBookingItems();
    
    // 주기적으로 알림 확인 (30초마다)
    setInterval(loadNotifications, 30000);
});

// 알림 데이터 로드
async function loadNotifications() {
    try {
        console.log('===== 마케팅 알림 로드 시작 =====');
        
        // 서버에서 마케팅 메시지 가져오기
        const response = await fetch('/api/marketing-notifications/my-notifications');
        if (!response.ok) {
            console.error('알림 조회 실패:', response.status);
            notifications = [];
            renderNotifications();
            return;
        }
        
        const marketingMessages = await response.json();
        console.log('조회된 마케팅 메시지 수:', marketingMessages.length);
        console.log('마케팅 메시지 원본:', marketingMessages);
        
        // MarketingMessage를 알림 형식으로 변환
        notifications = marketingMessages.map(msg => {
            const notification = {
                id: msg.messageId,
                type: 'MARKETING',
                title: msg.title || '제목 없음',
                message: msg.content || '',
                companyName: msg.company ? msg.company.companyName : '업체',
                linkUrl: msg.linkUrl || null,
                read: false,
                createdAt: new Date(msg.sentAt || msg.createdAt)
            };
            console.log('변환된 알림:', notification);
            return notification;
        });
        
        console.log('최종 알림 목록:', notifications);
        
        // 알림 렌더링
        renderNotifications();
    } catch (error) {
        console.error('알림 로드 실패:', error);
        notifications = [];
        renderNotifications();
    }
}

// 알림 렌더링
function renderNotifications() {
    const notificationList = document.getElementById('notificationList');
    const unreadNotifications = notifications.filter(n => !n.read).slice(0, 3); // 최신 3개만
    
    if (unreadNotifications.length === 0) {
        notificationList.innerHTML = `
            <li class="no-notifications" style="text-align: center; padding: 40px; color: #adb5bd;">
                <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 16px; display: block;"></i>
                <p style="margin: 0;">새로운 소식이 없습니다</p>
            </li>
        `;
        return;
    }
    
    notificationList.innerHTML = unreadNotifications.map(notification => {
        const icon = getNotificationIcon(notification.type);
        const timeAgo = getTimeAgo(notification.createdAt);
        
        return `
            <li class="notification-item" data-id="${notification.id}" onclick="markAsRead(${notification.id})">
                <span class="notification-icon">${icon}</span>
                <div class="notification-content">
                    <span class="notification-text">${notification.title}</span>
                    ${notification.companyName ? `<span class="notification-company">${notification.companyName}</span>` : ''}
                    ${notification.reservationTitle ? `<span class="notification-detail">${notification.reservationTitle}</span>` : ''}
                    ${notification.newDate ? `<span class="notification-detail">${notification.newDate}</span>` : ''}
                </div>
                <span class="notification-time">${timeAgo}</span>
            </li>
        `;
    }).join('');
}

// 알림 타입에 따른 아이콘 반환
function getNotificationIcon(type) {
    switch(type) {
        case 'CHAT':
            return '<i class="fas fa-comment-dots"></i>';
        case 'RESERVATION_CONFIRMED':
            return '<i class="fas fa-bell"></i>';
        case 'RESERVATION_UPDATED':
            return '<i class="fas fa-calendar-alt"></i>';
        case 'MARKETING':
            return '<i class="fas fa-bullhorn"></i>';
        default:
            return '<i class="fas fa-info-circle"></i>';
    }
}

// 시간 전 표시
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return `${seconds}초 전`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}일 전`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}주 전`;
    const months = Math.floor(days / 30);
    return `${months}개월 전`;
}

// 알림 읽음 처리
async function markAsRead(notificationId) {
    try {
        console.log('알림 클릭 - notificationId:', notificationId);
        
        // 로컬에서 읽음 처리
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            
            console.log('알림 타입:', notification.type);
            console.log('링크 URL:', notification.linkUrl);
            
            // 알림 타입에 따라 다른 동작
            switch(notification.type) {
                case 'CHAT':
                    window.location.href = '/chat';
                    break;
                case 'RESERVATION_CONFIRMED':
                case 'RESERVATION_UPDATED':
                    window.location.href = '/booking';
                    break;
                case 'MARKETING':
                    // 마케팅 메시지의 링크 URL이 있으면 해당 페이지로 이동
                    if (notification.linkUrl) {
                        window.open(notification.linkUrl, '_blank');
                    } else {
                        showMessage(notification.message);
                    }
                    break;
                default:
                    break;
            }
            
            // 알림 다시 렌더링
            renderNotifications();
        }
    } catch (error) {
        console.error('알림 읽음 처리 실패:', error);
    }
}

// 알림 팝업 초기화
function initializeNotificationPopup() {
    // 알림 섹션 클릭 시 팝업 열기
    const notificationsSection = document.querySelector('.notifications-section');
    if (notificationsSection) {
        notificationsSection.addEventListener('click', function(e) {
            if (!e.target.closest('.view-all') && !e.target.closest('.notification-item')) {
                openNotificationPopup();
            }
        });
    }
}

// 알림 팝업 열기
function openNotificationPopup() {
    const popup = document.getElementById('notificationPopup');
    if (popup) {
        popup.style.display = 'block';
        // 배경 클릭으로 닫기
        document.addEventListener('click', closeOnBackgroundClick);
    }
}

// 알림 팝업 닫기
function closeNotificationPopup() {
    const popup = document.getElementById('notificationPopup');
    if (popup) {
        popup.style.display = 'none';
        document.removeEventListener('click', closeOnBackgroundClick);
    }
}

// 배경 클릭 시 팝업 닫기
function closeOnBackgroundClick(e) {
    const popup = document.getElementById('notificationPopup');
    if (popup && !popup.contains(e.target)) {
        closeNotificationPopup();
    }
}

// 액션 버튼 초기화
function initializeActionButtons() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            handleActionClick(action);
        });
    });
}

// 액션 버튼 클릭 처리
function handleActionClick(action) {
    switch(action) {
        case '찜':
            showMessage('찜 목록 페이지로 이동합니다.');
            // 실제로는 찜 목록 페이지로 이동
            // window.location.href = '/favorites';
            break;
        case '채팅':
            showMessage('채팅 페이지로 이동합니다.');
            // 실제로는 채팅 페이지로 이동
            // window.location.href = '/chat';
            break;
        case '후기':
            showMessage('후기 페이지로 이동합니다.');
            // 실제로는 후기 페이지로 이동
            // window.location.href = '/reviews';
            break;
        case '문의&신고':
            showMessage('문의&신고 페이지로 이동합니다.');
            // 실제로는 문의&신고 페이지로 이동
            // window.location.href = '/inquiry';
            break;
    }
}

// 예약내역 아이템 초기화
function initializeBookingItems() {
    const bookingItems = document.querySelectorAll('.booking-item');
    
    bookingItems.forEach(item => {
        item.addEventListener('click', function() {
            const bookingNumber = this.querySelector('.booking-number').textContent;
            showBookingDetails(bookingNumber);
        });
    });
}

// 예약 상세 정보 표시
function showBookingDetails(bookingNumber) {
    showMessage(`예약번호 ${bookingNumber}의 상세 정보를 표시합니다.`);
    // 실제로는 예약 상세 페이지로 이동
    // window.location.href = `/booking/${bookingNumber}`;
}

// 메시지 표시 (임시)
function showMessage(message) {
    // 간단한 알림 표시
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        font-size: 14px;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// 스크롤 애니메이션
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 애니메이션 대상 요소들
    const animatedElements = document.querySelectorAll('.user-profile, .notifications-section, .booking-section');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 페이지 로드 시 스크롤 애니메이션 초기화
window.addEventListener('load', initializeScrollAnimations);

// 반응형 네비게이션 (모바일용)
function initializeMobileNavigation() {
    const header = document.querySelector('.main-header');
    const userActions = document.querySelector('.user-actions');
    
    if (window.innerWidth <= 768) {
        // 모바일에서 사용자 액션 버튼들을 햄버거 메뉴로 변경
        const mobileMenu = document.createElement('button');
        mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenu.className = 'mobile-menu-btn';
        mobileMenu.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 10px;
        `;
        
        // 기존 사용자 액션을 숨기고 모바일 메뉴 추가
        if (userActions) {
            userActions.style.display = 'none';
            header.querySelector('.header-container').appendChild(mobileMenu);
        }
    }
}

// 윈도우 리사이즈 이벤트
window.addEventListener('resize', function() {
    initializeMobileNavigation();
});

// 초기 로드 시 모바일 네비게이션 초기화
initializeMobileNavigation();

// 알림 모달 열기
function openNotificationModal() {
    const modal = document.getElementById('notificationModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
        
        // 모달 내용 렌더링
        renderNotificationModal();
    }
}

// 알림 모달 내용 렌더링
function renderNotificationModal() {
    const modalList = document.getElementById('notificationModalList');
    if (!modalList) return;
    
    const allNotifications = notifications.filter(n => !n.read);
    
    if (allNotifications.length === 0) {
        modalList.innerHTML = `
            <li style="text-align: center; padding: 60px; color: #adb5bd;">
                <i class="fas fa-inbox" style="font-size: 64px; margin-bottom: 20px; display: block;"></i>
                <p style="margin: 0; font-size: 16px;">새로운 소식이 없습니다</p>
            </li>
        `;
        return;
    }
    
    modalList.innerHTML = allNotifications.map(notification => {
        const icon = getNotificationIcon(notification.type);
        const timeAgo = getTimeAgo(notification.createdAt);
        
        let detailHtml = '';
        if (notification.type === 'RESERVATION_CONFIRMED') {
            detailHtml = `
                <div class="notification-details">
                    <p><strong>예약 내용:</strong> ${notification.reservationTitle}</p>
                    <p><strong>예약 일시:</strong> ${notification.reservationDate}</p>
                    <p><strong>업체명:</strong> ${notification.companyName}</p>
                </div>
            `;
        } else if (notification.type === 'RESERVATION_UPDATED') {
            detailHtml = `
                <div class="notification-details">
                    <p><strong>예약 내용:</strong> ${notification.reservationTitle}</p>
                    <p><strong>변경 전:</strong> ${notification.oldDate}</p>
                    <p><strong>변경 후:</strong> ${notification.newDate}</p>
                    <p><strong>업체명:</strong> ${notification.companyName}</p>
                </div>
            `;
        } else if (notification.type === 'CHAT') {
            detailHtml = `
                <div class="notification-details">
                    <p><strong>업체명:</strong> ${notification.companyName}</p>
                    <p>${notification.message}</p>
                </div>
            `;
        } else if (notification.type === 'MARKETING') {
            detailHtml = `
                <div class="notification-details">
                    <p><strong>업체명:</strong> ${notification.companyName}</p>
                    <p style="white-space: pre-wrap;">${notification.message}</p>
                    ${notification.linkUrl ? `<p><a href="${notification.linkUrl}" target="_blank" style="color: #3498db;">자세히 보기 →</a></p>` : ''}
                </div>
            `;
        }
        
        return `
            <li class="notification-modal-item" onclick="markAsRead(${notification.id})">
                <div class="notification-item">
                    <div class="notification-line"></div>
                    <div class="notification-header">
                        <span class="notification-icon">${icon}</span>
                        <span class="notification-text">${notification.title}</span>
                        <span class="notification-time">${timeAgo}</span>
                    </div>
                    ${detailHtml}
                </div>
            </li>
        `;
    }).join('');
}

// 알림 모달 닫기
function closeNotificationModal() {
    const modal = document.getElementById('notificationModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // 스크롤 복원
    }
}

// 모달 배경 클릭 시 닫기
document.addEventListener('click', function(e) {
    const modal = document.getElementById('notificationModal');
    if (modal && e.target === modal) {
        closeNotificationModal();
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeNotificationModal();
        closeProfileModal();
    }
});

// 정보 수정 모달 열기
function openProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    }
}

// 정보 수정 모달 닫기
function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // 스크롤 복원
    }
}

// 프로필 저장
async function saveProfile() {
    const modal = document.getElementById('profileModal');
    if (!modal) return;
    
    // 폼 데이터 수집
    const nameInput = modal.querySelector('.profile-form input[type="text"]:not([readonly])');
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    const formData = {
        name: nameInput ? nameInput.value : '',
        currentPassword: currentPasswordInput ? currentPasswordInput.value : '',
        newPassword: newPasswordInput ? newPasswordInput.value : '',
        confirmPassword: confirmPasswordInput ? confirmPasswordInput.value : ''
    };
    
    // 유효성 검사
    if (!formData.name.trim()) {
        alert('이름을 입력해주세요.');
        return;
    }
    
    // 비밀번호 변경 시 유효성 검사
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
        if (!formData.currentPassword) {
            alert('현재 비밀번호를 입력해주세요.');
            return;
        }
        
        if (!formData.newPassword) {
            alert('새 비밀번호를 입력해주세요.');
            return;
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        
        if (formData.newPassword.length < 8) {
            alert('비밀번호는 8자 이상이어야 합니다.');
            return;
        }
    }
    
    try {
        // 서버에 데이터 전송
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.name,
                currentPassword: formData.currentPassword || null,
                newPassword: formData.newPassword || null
            })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            alert('정보가 성공적으로 저장되었습니다.');
            
            // 메인 페이지 정보 업데이트
            updateMainProfile({ name: formData.name });
            
            // 비밀번호 필드 초기화
            if (currentPasswordInput) currentPasswordInput.value = '';
            if (newPasswordInput) newPasswordInput.value = '';
            if (confirmPasswordInput) confirmPasswordInput.value = '';
            
            // 모달 닫기
            closeProfileModal();
            
            // 페이지 새로고침 (선택사항)
            // window.location.reload();
        } else {
            alert(result.message || '저장에 실패했습니다.');
        }
    } catch (error) {
        console.error('프로필 저장 실패:', error);
        alert('저장 중 오류가 발생했습니다.');
    }
}

// 메인 페이지 프로필 정보 업데이트
function updateMainProfile(formData) {
    // 사용자 이름 업데이트
    const userName = document.querySelector('.mypage-user-name');
    if (userName && formData.name) {
        userName.textContent = `${formData.name} 님`;
    }
}

// 모달 배경 클릭 시 닫기 (정보 수정 모달)
document.addEventListener('click', function(e) {
    const profileModal = document.getElementById('profileModal');
    if (profileModal && e.target === profileModal) {
        closeProfileModal();
    }
});

// 프로필 이미지 처리
function handleProfileImage(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // 모달 내 프로필 이미지 업데이트
            const modalPreview = document.querySelector('.profile-image-preview');
            if (modalPreview) {
                modalPreview.innerHTML = `<img src="${e.target.result}" alt="프로필 이미지" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            }
            
            // 메인 페이지 프로필 이미지 업데이트
            const mainProfileImage = document.getElementById('mainProfileImage');
            if (mainProfileImage) {
                mainProfileImage.innerHTML = `<img src="${e.target.result}" alt="프로필 이미지" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            }
            
            console.log('프로필 이미지가 업데이트되었습니다.');
        };
        reader.readAsDataURL(file);
    }
}

// 비밀번호 보기 토글
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// 비밀번호 강도 체크
function checkPasswordStrength(password) {
    const strengthBar = document.querySelector('#passwordStrength .password-strength-bar');
    const strengthContainer = document.getElementById('passwordStrength');
    
    if (!password) {
        strengthContainer.style.display = 'none';
        return;
    }
    
    strengthContainer.style.display = 'block';
    
    let strength = 0;
    
    // 길이 체크
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // 복잡도 체크
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    // 강도 표시
    strengthBar.className = 'password-strength-bar';
    if (strength <= 2) {
        strengthBar.classList.add('password-strength-weak');
    } else if (strength <= 4) {
        strengthBar.classList.add('password-strength-medium');
    } else {
        strengthBar.classList.add('password-strength-strong');
    }
    
    // 비밀번호 일치 확인도 함께 체크
    checkPasswordMatch();
}

// 비밀번호 일치 확인
function checkPasswordMatch() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageDiv = document.getElementById('passwordMatchMessage');
    
    if (!confirmPassword) {
        messageDiv.innerHTML = '';
        return;
    }
    
    if (newPassword === confirmPassword) {
        messageDiv.className = 'password-match-message success';
        messageDiv.innerHTML = '<i class="fas fa-check-circle"></i> 비밀번호가 일치합니다';
    } else {
        messageDiv.className = 'password-match-message error';
        messageDiv.innerHTML = '<i class="fas fa-times-circle"></i> 비밀번호가 일치하지 않습니다';
    }
}
