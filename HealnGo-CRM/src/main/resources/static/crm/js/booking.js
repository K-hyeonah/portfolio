// 예약내역 페이지 JavaScript

let currentReservationId = null;

// 예약 상세 정보 열기
function openBookingDetail(reservationId) {
    currentReservationId = reservationId;
    
    // API로 예약 상세 정보 가져오기
    fetch(`/api/reservations/${reservationId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showBookingModal(data.reservation);
            } else {
                alert('예약 정보를 불러올 수 없습니다.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('예약 정보를 불러오는 중 오류가 발생했습니다.');
        });
}

// 예약 상세 모달 표시
function showBookingModal(reservation) {
    // 상태 표시 텍스트 및 클래스
    let statusText = '대기';
    let statusClass = 'pending';
    
    switch(reservation.status) {
        case 'CONFIRMED':
            statusText = '확정';
            statusClass = 'confirmed';
            break;
        case 'CANCELLED':
            statusText = '취소';
            statusClass = 'cancelled';
            break;
        case 'COMPLETED':
            statusText = '완료';
            statusClass = 'completed';
            break;
        default:
            statusText = '대기';
            statusClass = 'pending';
    }
    
    // 금액 포맷
    const amountText = reservation.totalAmount 
        ? new Intl.NumberFormat('ko-KR').format(reservation.totalAmount) + '원' 
        : '-';
    
    // 모달 HTML 생성 (담당의 제외)
    const modalHTML = `
        <div id="bookingDetailModal" class="booking-detail-modal">
            <div class="booking-detail-content">
                <div class="booking-detail-header">
                    <h3>예약 상세 정보</h3>
                    <button class="booking-close-btn" onclick="closeBookingModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="booking-detail-body">
                    <div class="booking-info-section">
                        <div class="info-row">
                            <label>예약 번호</label>
                            <span>#${reservation.id}</span>
                        </div>
                        <div class="info-row">
                            <label>병원명</label>
                            <span>${reservation.companyName || '알 수 없음'}</span>
                        </div>
                        <div class="info-row">
                            <label>서비스명</label>
                            <span>${reservation.title || '-'}</span>
                        </div>
                        <div class="info-row">
                            <label>예약일</label>
                            <span>${reservation.date || '-'}</span>
                        </div>
                        <div class="info-row">
                            <label>예약 시간</label>
                            <span>${reservation.startTime && reservation.endTime ? reservation.startTime + ' ~ ' + reservation.endTime : '-'}</span>
                        </div>
                        <div class="info-row">
                            <label>위치</label>
                            <span>${reservation.location || '-'}</span>
                        </div>
                        <div class="info-row">
                            <label>상태</label>
                            <span class="status ${statusClass}">${statusText}</span>
                        </div>
                        <div class="info-row">
                            <label>총 금액</label>
                            <span>${amountText}</span>
                        </div>
                        ${reservation.description ? `
                        <div class="info-row">
                            <label>메모</label>
                            <span>${reservation.description}</span>
                        </div>
                        ` : ''}
                    </div>
                    <div class="booking-actions">
                        <button class="booking-btn cancel" onclick="closeBookingModal()">닫기</button>
                        ${reservation.status === 'CONFIRMED' ? 
                            '<button class="booking-btn booking-btn-cancel" onclick="cancelBooking()">예약 취소</button>' : 
                            '<button class="booking-btn booking-btn-cancel" disabled style="opacity: 0.5; cursor: not-allowed;">예약 취소</button>'}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 기존 모달 제거
    const existingModal = document.getElementById('bookingDetailModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 모달 추가
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 모달 표시
    const modal = document.getElementById('bookingDetailModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// 예약 모달 닫기
function closeBookingModal() {
    const modal = document.getElementById('bookingDetailModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    currentReservationId = null;
}

// 예약 취소
function cancelBooking() {
    if (!currentReservationId) {
        alert('예약 정보를 찾을 수 없습니다.');
        return;
    }
    
    if (!confirm('정말로 예약을 취소하시겠습니까?')) {
        return;
    }
    
    // API로 예약 취소 요청
    fetch(`/api/reservations/${currentReservationId}/cancel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('예약이 취소되었습니다.');
            closeBookingModal();
            // 페이지 새로고침
            location.reload();
        } else {
            alert(data.message || '예약 취소에 실패했습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('예약 취소 중 오류가 발생했습니다.');
    });
}

// 모달 외부 클릭 시 닫기
document.addEventListener('click', function(event) {
    const modal = document.getElementById('bookingDetailModal');
    if (event.target === modal) {
        closeBookingModal();
    }
});

