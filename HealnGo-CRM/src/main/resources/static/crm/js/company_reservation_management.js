// 예약 관리 페이지 JavaScript
console.log('예약 관리 JavaScript 로드됨');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 로드 완료, 예약 관리 초기화 시작');

    // 예약 데이터 (DB에서 가져옴)
    let reservations = {};
    let allReservations = []; // 전체 예약 데이터 저장
    
    // DB에서 예약 데이터 가져오기
    loadReservations();
    
    // DB에서 예약 데이터 가져오기
    function loadReservations() {
        // Thymeleaf에서 전달받은 reservationList 사용
        const reservationList = window.reservationList || [];
        allReservations = reservationList;
        
        console.log('=== DB 예약 데이터 로드 ===');
        console.log('전체 예약 수:', reservationList.length);
        console.log('예약 데이터:', reservationList);
        
        // 날짜별로 예약 데이터 그룹화
        reservations = {};
        reservationList.forEach(reservation => {
            const dateKey = reservation.date;
            
            if (!reservations[dateKey]) {
                reservations[dateKey] = { count: 0, events: [] };
            }
            
            reservations[dateKey].count++;
            reservations[dateKey].events.push({
                id: reservation.id,
                title: reservation.title || '예약',
                customerName: reservation.customerName || '고객',
                time: reservation.startTime ? reservation.startTime.substring(0, 5) : '',
                endTime: reservation.endTime ? reservation.endTime.substring(0, 5) : '',
                status: reservation.status || 'CONFIRMED',
                date: reservation.date,
                location: reservation.location,
                totalAmount: reservation.totalAmount,
                description: reservation.description
            });
        });
        
        console.log('날짜별 예약 그룹:', reservations);
        console.log('==========================');
    }
});

// ========== 예약 완료 처리 함수들 ==========

let currentReservationId = null; // 현재 완료 처리할 예약 ID

// 예약 완료 확인 모달 열기
function openCompleteModal(reservationId) {
    currentReservationId = reservationId;
    const modal = document.getElementById('completeConfirmModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// 예약 완료 확인 모달 닫기
function closeCompleteModal() {
    const modal = document.getElementById('completeConfirmModal');
    if (modal) {
        modal.style.display = 'none';
    }
    currentReservationId = null;
}

// 예약 완료 처리 실행
function confirmComplete() {
    if (!currentReservationId) {
        alert('예약 ID를 찾을 수 없습니다.');
        return;
    }

    // API 호출로 예약 완료 처리
    fetch(`/company/api/reservations/${currentReservationId}/complete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('예약이 완료 처리되었습니다.');
            closeCompleteModal();
            location.reload(); // 페이지 새로고침하여 변경사항 반영
        } else {
            alert('예약 완료 처리 실패: ' + (data.message || '알 수 없는 오류'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('예약 완료 처리 중 오류가 발생했습니다.');
    });
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const completeModal = document.getElementById('completeConfirmModal');
    if (event.target === completeModal) {
        closeCompleteModal();
    }
}
