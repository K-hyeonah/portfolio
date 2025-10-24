// Reservation Page JavaScript
let serviceData = null;
let hospitalData = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page
    initializeReservationPage();
});

async function initializeReservationPage() {
    // URL에서 serviceId와 itemId 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('serviceId');
    const itemId = urlParams.get('itemId');
    
    // 서비스 정보가 있으면 로드
    if (serviceId) {
        await loadServiceData(serviceId);
    }
    
    // 병원 정보가 있으면 로드
    if (itemId) {
        await loadHospitalData(itemId);
    }
    
    // Category tab functionality
    setupCategoryTabs();
    
    // Procedure selection functionality
    setupProcedureSelection();
    
    // Time slot selection
    setupTimeSlotSelection();
    
    // Date picker functionality
    setupDatePicker();
    
    // Wishlist button functionality
    setupWishlistButton();
    
    // Price calculation
    updateTotalPrice();
}

// 서비스 데이터 로드
async function loadServiceData(serviceId) {
    try {
        const response = await fetch(`/api/items/services/${serviceId}`);
        if (response.ok) {
            serviceData = await response.json();
            console.log('서비스 데이터 로드됨:', serviceData);
            displayServiceData();
        }
    } catch (error) {
        console.error('서비스 데이터 로드 실패:', error);
    }
}

// 병원 데이터 로드
async function loadHospitalData(itemId) {
    try {
        const response = await fetch(`/api/items/${itemId}`);
        if (response.ok) {
            hospitalData = await response.json();
            console.log('병원 데이터 로드됨:', hospitalData);
        }
    } catch (error) {
        console.error('병원 데이터 로드 실패:', error);
    }
}

// 서비스 데이터 표시
function displayServiceData() {
    if (!serviceData) return;
    
    // 페이지 제목 변경
    const pageTitle = document.querySelector('.page-title h1');
    if (pageTitle) {
        pageTitle.textContent = serviceData.name || '시술 예약';
    }
    
    // 카테고리 탭 숨기기 (특정 서비스 예약이므로)
    const categoryTabs = document.querySelector('.category-tabs');
    if (categoryTabs) {
        categoryTabs.style.display = 'none';
    }
    
    // 기존 시술 옵션 대신 선택된 서비스만 표시
    const procedureSelection = document.querySelector('.procedure-selection');
    if (procedureSelection) {
        const priceText = serviceData.price 
            ? `${Number(serviceData.price).toLocaleString()} ${serviceData.currency || '원'}`
            : '가격 문의';
        
        const tags = serviceData.tags 
            ? serviceData.tags.split(',').map(t => t.trim()).filter(Boolean).join(', ')
            : '';
        
        procedureSelection.innerHTML = `
            <div class="procedure-option">
                <div class="option-content">
                    <input type="checkbox" id="selectedService" class="procedure-checkbox" checked>
                    <label for="selectedService" class="procedure-label">
                        <div class="procedure-info">
                            <div class="procedure-name">${serviceData.name || '서비스'}</div>
                            <div class="procedure-detail">${tags || serviceData.serviceCategory || ''}</div>
                        </div>
                        <div class="procedure-price">${priceText}</div>
                    </label>
                    <button class="detail-btn" onclick="toggleServiceDetail()">▼</button>
                </div>
                <div class="procedure-detail-content" id="serviceDetail" style="display: none;">
                    <div class="detail-section">
                        <h3>서비스 정보</h3>
                        <p>${serviceData.description || '서비스에 대한 상세 설명이 표시됩니다.'}</p>
                        ${serviceData.startDate && serviceData.endDate ? `
                            <p><strong>제공 기간:</strong> ${serviceData.startDate} ~ ${serviceData.endDate}</p>
                        ` : ''}
                        ${serviceData.genderTarget ? `
                            <p><strong>대상:</strong> ${getGenderText(serviceData.genderTarget)}</p>
                        ` : ''}
                    </div>
                    <div class="detail-section">
                        <h3>가격 정보</h3>
                        <p><strong>기본 가격:</strong> ${priceText}</p>
                        <p><strong>VAT:</strong> ${serviceData.vatIncluded ? '포함' : '별도'}</p>
                        <p><strong>환불:</strong> ${serviceData.isRefundable ? '가능' : '불가능'}</p>
                    </div>
                </div>
            </div>
        `;
        
        // 체크박스 이벤트 재설정
        setupProcedureSelection();
    }
    
    // 정보 섹션 업데이트
    updateInfoSection();
    
    // VAT 정보 업데이트
    const vatNote = document.querySelector('.vat-note');
    if (vatNote && serviceData.vatIncluded !== undefined) {
        vatNote.textContent = serviceData.vatIncluded ? '(VAT 포함)' : '(VAT 별도)';
    }
    
    // 가격 업데이트
    updateTotalPrice();
}

// 정보 섹션 업데이트
function updateInfoSection() {
    const infoSections = document.querySelector('.info-sections');
    if (!infoSections || !serviceData) return;
    
    infoSections.innerHTML = `
        <div class="info-section">
            <h3>시술정보</h3>
            <p>${serviceData.description || '안전하고 효과적인 시술을 위해 전문의가 직접 상담 후 진행됩니다.'}</p>
            ${serviceData.startDate && serviceData.endDate ? `
                <p><strong>제공 기간:</strong> ${serviceData.startDate} ~ ${serviceData.endDate}</p>
            ` : ''}
        </div>
        <div class="info-section">
            <h3>주의사항</h3>
            <p>시술 전 24시간 금주, 시술 후 6시간 동안 마사지 금지, 일주일간 사우나 및 찜질방 이용 금지 등이 있습니다.</p>
            ${serviceData.isRefundable !== undefined ? `
                <p><strong>환불 정책:</strong> ${serviceData.isRefundable ? '환불 가능' : '환불 불가능'}</p>
            ` : ''}
        </div>
    `;
}

// 성별 텍스트 변환
function getGenderText(genderTarget) {
    const genderMap = {
        'ALL': '남녀공용',
        'MALE': '남성',
        'FEMALE': '여성'
    };
    return genderMap[genderTarget] || '남녀공용';
}

// 서비스 상세 토글
window.toggleServiceDetail = function() {
    const detailContent = document.getElementById('serviceDetail');
    const detailBtn = event.target.closest('.procedure-option').querySelector('.detail-btn');
    
    if (detailContent && detailBtn) {
        if (detailContent.style.display === 'none') {
            detailContent.style.display = 'block';
            detailBtn.textContent = '▲';
        } else {
            detailContent.style.display = 'none';
            detailBtn.textContent = '▼';
        }
    }
}

// Detail Toggle Functionality
window.toggleDetail = function(procedureNumber) {
    const detailContent = document.getElementById(`detail${procedureNumber}`);
    const detailBtn = document.querySelector(`#procedure${procedureNumber}`).closest('.procedure-option').querySelector('.detail-btn');
    
    if (detailContent.style.display === 'none') {
        detailContent.style.display = 'block';
        detailBtn.textContent = '▲';
        detailBtn.classList.add('rotated');
    } else {
        detailContent.style.display = 'none';
        detailBtn.textContent = '▼';
        detailBtn.classList.remove('rotated');
    }
}

// Category Tab Functionality
function setupCategoryTabs() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update procedure options based on category
            updateProcedureOptions(this.dataset.category);
        });
    });
}

function updateProcedureOptions(category) {
    // This would typically fetch data from server based on category
    // For now, we'll just show/hide existing options
    const procedureOptions = document.querySelectorAll('.procedure-option');
    
    procedureOptions.forEach(option => {
        // In a real implementation, you would filter based on category
        option.style.display = 'block';
    });
}

// Procedure Selection Functionality
function setupProcedureSelection() {
    const checkboxes = document.querySelectorAll('.procedure-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateTotalPrice();
        });
    });
}

function updateTotalPrice() {
    const checkboxes = document.querySelectorAll('.procedure-checkbox:checked');
    let totalPrice = 0;
    
    checkboxes.forEach(checkbox => {
        const priceText = checkbox.closest('.procedure-option').querySelector('.procedure-price').textContent;
        const price = parseInt(priceText.replace(/[^\d]/g, ''));
        totalPrice += price;
    });
    
    // Update total price display
    const priceAmount = document.querySelector('.price-amount');
    if (priceAmount) {
        priceAmount.textContent = totalPrice.toLocaleString();
    }
}

// Wishlist Button Functionality
function setupWishlistButton() {
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            toggleWishlist();
        });
    }
}

function toggleWishlist() {
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const checkedBoxes = document.querySelectorAll('.procedure-checkbox:checked');
    
    if (checkedBoxes.length === 0) {
        alert('시술을 선택해주세요.');
        return;
    }
    
    if (wishlistBtn.textContent === '찜') {
        wishlistBtn.textContent = '찜 완료';
        wishlistBtn.style.backgroundColor = '#28a745';
        wishlistBtn.style.color = 'white';
        wishlistBtn.style.borderColor = '#28a745';
    } else {
        wishlistBtn.textContent = '찜';
        wishlistBtn.style.backgroundColor = '#e8f5e8';
        wishlistBtn.style.color = '#28a745';
        wishlistBtn.style.borderColor = '#28a745';
    }
}

// Time Slot Selection
function setupTimeSlotSelection() {
    const timeSlots = document.querySelectorAll('.time-slot');
    
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            // Don't allow selection of unavailable slots
            if (this.classList.contains('unavailable')) {
                return;
            }
            
            // Remove selected class from all slots
            timeSlots.forEach(s => s.classList.remove('selected'));
            
            // Add selected class to clicked slot
            this.classList.add('selected');
            
            // Update reservation time in the modal
            updateReservationTime(this.textContent);
        });
    });
}

function updateReservationTime(time) {
    const reservationTimeElement = document.querySelector('.info-row .value');
    if (reservationTimeElement && reservationTimeElement.textContent.includes('15:00')) {
        reservationTimeElement.textContent = reservationTimeElement.textContent.replace('15:00', time);
    }
}

// Date Picker Functionality
function setupDatePicker() {
    const dateInput = document.getElementById('reservationDate');
    if (dateInput) {
        // Set minimum date to today
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        dateInput.min = todayString;
        
        // Set maximum date to 1 year from today
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        const maxDateString = maxDate.toISOString().split('T')[0];
        dateInput.max = maxDateString;
        
        // Add event listener for date change
        dateInput.addEventListener('change', function() {
            updateReservationDate(this.value);
        });
    }
}

function updateReservationDate(selectedDate) {
    // Update the reservation date display in the modal
    const dateValue = new Date(selectedDate);
    const formattedDate = dateValue.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\./g, '.').replace(/\s/g, '');
    
    // Update the date display in the service information
    const serviceInfoElements = document.querySelectorAll('.info-row .value');
    serviceInfoElements.forEach(element => {
        if (element.textContent.includes('2025.10.01')) {
            element.textContent = element.textContent.replace('2025.10.01', formattedDate);
        }
    });
    
    console.log('Selected date:', formattedDate);
}

// Modal Functions
function openReservationModal() {
    const modal = document.getElementById('reservationModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Scroll modal to top
        modal.scrollTop = 0;
        
        // Update modal content with selected procedures
        updateModalContent();
    }
}

function closeReservationModal() {
    const modal = document.getElementById('reservationModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

function updateModalContent() {
    const selectedProcedures = document.querySelectorAll('.procedure-checkbox:checked');
    
    // 서비스명 업데이트
    if (serviceData) {
        const serviceNameElement = document.getElementById('serviceName');
        if (serviceNameElement) {
            serviceNameElement.textContent = serviceData.name || '서비스';
        }
    }
    
    // 병원명 업데이트
    if (hospitalData) {
        const hospitalNameElement = document.getElementById('hospitalName');
        if (hospitalNameElement) {
            hospitalNameElement.textContent = hospitalData.name || '병원';
        }
    }
    
    // 예약 일시 업데이트 (현재 날짜와 선택된 시간)
    const selectedDate = document.getElementById('reservationDate');
    const selectedTime = document.querySelector('.time-slot.selected');
    const reservationDateTimeElement = document.getElementById('reservationDateTime');
    
    if (selectedDate && selectedTime && reservationDateTimeElement) {
        const date = new Date(selectedDate.value);
        const time = selectedTime.textContent;
        const formattedDate = date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'short'
        }).replace(/\./g, '.').replace(/\s/g, '');
        
        reservationDateTimeElement.textContent = `${formattedDate} ${time}`;
    }
    
    // Update total amount in modal
    const checkedBoxes = document.querySelectorAll('.procedure-checkbox:checked');
    let totalPrice = 0;
    
    checkedBoxes.forEach(checkbox => {
        const priceText = checkbox.closest('.procedure-option').querySelector('.procedure-price').textContent;
        const price = parseInt(priceText.replace(/[^\d]/g, ''));
        totalPrice += price;
    });
    
    const modalTotalAmount = document.querySelector('.amount');
    if (modalTotalAmount) {
        modalTotalAmount.textContent = totalPrice.toLocaleString();
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('reservationModal');
    if (event.target === modal) {
        closeReservationModal();
    }
});

// Confirm reservation
async function confirmReservation() {
    // Get selected procedures
    const selectedProcedures = document.querySelectorAll('.procedure-checkbox:checked');
    const selectedTime = document.querySelector('.time-slot.selected');
    const selectedDate = document.getElementById('reservationDate');
    
    if (selectedProcedures.length === 0) {
        alert('시술을 선택해주세요.');
        return;
    }
    
    if (!selectedTime) {
        alert('예약 시간을 선택해주세요.');
        return;
    }
    
    if (!selectedDate || !selectedDate.value) {
        alert('예약 날짜를 선택해주세요.');
        return;
    }
    
    // Get reservation data
    const serviceName = selectedProcedures[0].closest('.procedure-option').querySelector('.procedure-name').textContent;
    const totalAmountText = document.querySelector('.amount').textContent;
    const totalAmount = parseFloat(totalAmountText.replace(/,/g, ''));
    const hospitalName = hospitalData ? hospitalData.name : 'Yoyo의원';
    
    // Calculate end time (assuming 1 hour duration)
    const startTime = selectedTime.textContent;
    const [hours, minutes] = startTime.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(hours + 1, minutes);
    const endTimeString = endTime.toTimeString().slice(0, 5);
    
    // URL 파라미터에서 companyId 가져오기 (있다면)
    let companyId = getCompanyIdFromUrl();
    
    const reservationData = {
        serviceName: serviceName,
        date: selectedDate.value,
        startTime: startTime + ':00',
        endTime: endTimeString + ':00',
        description: serviceData ? serviceData.description : '시술 예약',
        hospitalName: hospitalName,
        totalAmount: totalAmount,
        companyId: companyId, // URL 파라미터에서 가져온 값 (없으면 null)
        serviceId: serviceData ? serviceData.serviceId : null, // serviceId 추가
        itemId: hospitalData ? hospitalData.id : null // itemId는 별도로 전송
    };
    
    console.log('Sending reservation data:', reservationData);
    
    // Show loading state
    const confirmBtn = document.querySelector('.confirm-btn');
    const originalText = confirmBtn.textContent;
    confirmBtn.textContent = '예약 처리 중...';
    confirmBtn.disabled = true;
    
    try {
        // Send data to server
        const response = await fetch('/api/reservation/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('예약이 완료되었습니다!');
            closeReservationModal();
            
            // Optional: redirect to confirmation page or show success message
            // window.location.href = '/reservation-success?id=' + result.reservationId;
        } else {
            alert('예약 처리 중 오류가 발생했습니다: ' + result.message);
        }
        
    } catch (error) {
        console.error('Reservation error:', error);
        alert('예약 처리 중 오류가 발생했습니다.');
    } finally {
        // Restore button state
        confirmBtn.textContent = originalText;
        confirmBtn.disabled = false;
    }
}

// Add event listener for confirm button
document.addEventListener('DOMContentLoaded', function() {
    const confirmBtn = document.querySelector('.confirm-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmReservation);
    }
});

// Utility functions
function formatPrice(price) {
    return price.toLocaleString() + ' 원';
}

function validateReservation() {
    const selectedProcedures = document.querySelectorAll('.procedure-checkbox:checked');
    const selectedTime = document.querySelector('.time-slot.selected');
    
    if (selectedProcedures.length === 0) {
        return { valid: false, message: '시술을 선택해주세요.' };
    }
    
    if (!selectedTime) {
        return { valid: false, message: '예약 시간을 선택해주세요.' };
    }
    
    return { valid: true, message: '' };
}

// URL에서 업체 ID 가져오기
function getCompanyIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const companyId = urlParams.get('companyId');
    return companyId ? parseInt(companyId) : null;
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        openReservationModal,
        closeReservationModal,
        updateTotalPrice,
        confirmReservation,
        validateReservation
    };
}
