// 관리자 캘린더 JavaScript

console.log('관리자 캘린더 JavaScript 로드됨');

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedDate = null;

// 서버에서 전달받은 이벤트 데이터를 사용
// calendarEvents는 HTML에서 th:inline="javascript"로 주입됨
const approvedEvents = typeof calendarEvents !== 'undefined' ? calendarEvents : [];

document.addEventListener('DOMContentLoaded', function() {
    initCalendar();
    setupModalEvents();
});

// 캘린더 초기화
function initCalendar() {
    updateCalendar();
    
    // 이전/다음 달 버튼
    document.getElementById('prevMonth').addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });
}

// 캘린더 업데이트
function updateCalendar() {
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    
    // 월/년도 업데이트
    document.getElementById('currentMonth').textContent = `${currentYear}년 ${monthNames[currentMonth]}`;
    
    // 캘린더 날짜 생성
    generateCalendarDays();
}

// 캘린더 날짜 생성
function generateCalendarDays() {
    const daysContainer = document.getElementById('calendarDays');
    daysContainer.innerHTML = '';

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    // 이전 달의 마지막 날들
    const prevMonth = new Date(currentYear, currentMonth, 0);
    const prevMonthDays = prevMonth.getDate();

    // 이전 달 날짜들 추가
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthDays - i;
        const dayElement = createDayElement(day, true);
        daysContainer.appendChild(dayElement);
    }

    // 현재 달 날짜들 추가
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = createDayElement(day, false);
        
        // 이벤트가 있는 날짜 확인
        const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = getEventsForDate(dateString);
        
        if (dayEvents.length > 0) {
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'day-events';
            
            // 최대 3개의 점만 표시
            const displayEvents = dayEvents.slice(0, 3);
            displayEvents.forEach(event => {
                const dot = document.createElement('div');
                dot.className = `event-dot ${event.type}-type`;
                eventsContainer.appendChild(dot);
            });
            
            dayElement.appendChild(eventsContainer);
        }
        
        daysContainer.appendChild(dayElement);
    }

    // 다음 달 날짜들 추가
    const totalCells = daysContainer.children.length;
    const remainingCells = 42 - totalCells; // 6주 표시
    
    for (let i = 1; i <= remainingCells; i++) {
        const dayElement = createDayElement(i, true);
        daysContainer.appendChild(dayElement);
    }
}

// 날짜 요소 생성
function createDayElement(day, isOtherMonth) {
    const dayElement = document.createElement('div');
    dayElement.className = 'day';
    
    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }
    
    // 오늘 날짜 표시
    const today = new Date();
    if (!isOtherMonth && 
        day === today.getDate() && 
        currentMonth === today.getMonth() && 
        currentYear === today.getFullYear()) {
        dayElement.classList.add('today');
    }
    
    dayElement.textContent = day;
    
    // 날짜 클릭 이벤트
    dayElement.addEventListener('click', function() {
        if (!isOtherMonth) {
            selectDate(day);
        }
    });

    return dayElement;
}

// 날짜 선택
function selectDate(day) {
    // 모든 날짜에서 선택 상태 제거
    document.querySelectorAll('.day').forEach(d => {
        d.classList.remove('selected');
    });

    // 클릭된 날짜에 선택 상태 추가
    event.target.classList.add('selected');

    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    selectedDate = dateString;
    
    // 해당 날짜의 이벤트 필터링
    filterEventsByDate(dateString);
}

// 특정 날짜의 이벤트 가져오기
function getEventsForDate(dateString) {
    return approvedEvents.filter(event => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        const checkDate = new Date(dateString);
        
        return checkDate >= eventStart && checkDate <= eventEnd;
    });
}

// 날짜별 이벤트 필터링
function filterEventsByDate(dateString) {
    const eventItems = document.querySelectorAll('.event-item');
    const selectedDateTitle = document.getElementById('selectedDateTitle');
    const clearFilterBtn = document.getElementById('clearDateFilter');
    
    const date = new Date(dateString);
    selectedDateTitle.textContent = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 일정`;
    clearFilterBtn.style.display = 'inline-flex';
    
    const dayEvents = getEventsForDate(dateString);
    
    eventItems.forEach(item => {
        const itemStartDate = item.getAttribute('data-date');
        const itemEndDate = item.getAttribute('data-end-date');
        
        const start = new Date(itemStartDate);
        const end = new Date(itemEndDate);
        const check = new Date(dateString);
        
        if (check >= start && check <= end) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// 날짜 필터 해제
function clearDateFilter() {
    selectedDate = null;
    const eventItems = document.querySelectorAll('.event-item');
    const selectedDateTitle = document.getElementById('selectedDateTitle');
    const clearFilterBtn = document.getElementById('clearDateFilter');
    
    selectedDateTitle.textContent = '전체 일정';
    clearFilterBtn.style.display = 'none';
    
    // 선택된 날짜 스타일 제거
    document.querySelectorAll('.day').forEach(d => {
        d.classList.remove('selected');
    });
    
    eventItems.forEach(item => {
        item.style.display = '';
    });
    
    // 유형 필터 적용
    filterCalendarEvents();
}

// 유형별 이벤트 필터링
function filterCalendarEvents() {
    const checkboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
    const selectedTypes = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    const eventItems = document.querySelectorAll('.event-item');
    
    eventItems.forEach(item => {
        const itemType = item.getAttribute('data-type');
        
        if (selectedTypes.includes(itemType)) {
            // 날짜 필터가 있는 경우 날짜도 확인
            if (selectedDate) {
                const itemStartDate = item.getAttribute('data-date');
                const itemEndDate = item.getAttribute('data-end-date');
                
                const start = new Date(itemStartDate);
                const end = new Date(itemEndDate);
                const check = new Date(selectedDate);
                
                item.style.display = (check >= start && check <= end) ? '' : 'none';
            } else {
                item.style.display = '';
            }
        } else {
            item.style.display = 'none';
        }
    });
    
    // 캘린더 다시 그리기
    updateCalendar();
}

// 오늘로 이동
function goToToday() {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    updateCalendar();
    
    // 오늘 날짜 선택
    setTimeout(() => {
        const todayElement = document.querySelector('.day.today');
        if (todayElement) {
            todayElement.click();
        }
    }, 100);
}

// Google 캘린더 동기화
function syncGoogleCalendar() {
    if (confirm('Google 캘린더와 동기화하시겠습니까?')) {
        console.log('Google 캘린더 동기화 시작');
        alert('동기화 기능은 추후 구현됩니다.');
    }
}

// 유형 텍스트 변환
function getTypeText(type) {
    const typeMap = {
        'placement': '노출',
        'coupon': '쿠폰'
    };
    return typeMap[type] || type;
}

// 모달 이벤트 설정
function setupModalEvents() {
    // 현재는 사용하지 않음 (일정 추가 모달 제거됨)
}


