// FAQ 답변 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 페이지 로드 시 초기화
    initializeFaqAnswer();
});

// FAQ 답변 페이지 초기화
function initializeFaqAnswer() {
    // 현재 FAQ ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const faqId = urlParams.get('id') || getFaqIdFromPath();

    if (faqId) {
        loadFaqAnswer(faqId);
    } else {
        showError('FAQ ID를 찾을 수 없습니다.');
    }
}

// URL 경로에서 FAQ ID 추출
function getFaqIdFromPath() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
}

// FAQ 답변 데이터 로드
function loadFaqAnswer(faqId) {
    // 실제 구현에서는 서버에서 데이터를 가져옴
    // 현재는 더미 데이터 사용
    const faqData = getFaqDataById(faqId);

    if (faqData) {
        displayFaqAnswer(faqData);
    } else {
        showError('FAQ 데이터를 찾을 수 없습니다.');
    }
}

// FAQ 데이터 표시
function displayFaqAnswer(faqData) {
    // 제목 업데이트
    const titleElement = document.querySelector('.faq-question-title');
    if (titleElement) {
        titleElement.textContent = faqData.title;
    }

    // 번호 업데이트
    const numberElement = document.querySelector('.faq-question-number');
    if (numberElement) {
        numberElement.textContent = faqData.number;
    }

    // 작성자 업데이트
    const authorElement = document.querySelector('.faq-question-author');
    if (authorElement) {
        authorElement.textContent = faqData.author;
    }

    // 날짜 업데이트
    const dateElement = document.querySelector('.faq-question-date');
    if (dateElement) {
        dateElement.textContent = faqData.date;
    }

    // 내용 업데이트
    const contentElement = document.querySelector('.faq-question-content');
    if (contentElement) {
        contentElement.textContent = faqData.content;
    }

    // 답변 날짜 업데이트
    const answerDateElement = document.querySelector('.faq-answer-date');
    if (answerDateElement) {
        answerDateElement.textContent = faqData.answerDate;
    }

    // 답변 내용 업데이트
    const answerElement = document.querySelector('.faq-answer-content');
    if (answerElement) {
        answerElement.textContent = faqData.answer;
    }
}

// 더미 FAQ 데이터 (실제로는 서버에서 가져옴)
function getFaqDataById(id) {
    const faqDataList = [
        {
            id: 1,
            number: '001',
            title: '시설 이용 방법에 대해 문의드립니다',
            author: '김철수',
            date: '2025-07-07',
            content: '안녕하세요. 시설 이용 방법에 대해 궁금한 점이 있습니다. 예약은 어떻게 해야 하나요? 그리고 이용 시간은 어떻게 되나요?',
            answer: '안녕하세요. 시설 이용에 대해 답변드리겠습니다.\n\n1. 예약 방법: 전화 또는 온라인으로 예약 가능합니다.\n2. 이용 시간: 평일 09:00-18:00, 주말 09:00-17:00입니다.\n\n추가 문의사항이 있으시면 언제든 연락주세요.',
            answerDate: '2025-07-08'
        },
        {
            id: 2,
            number: '002',
            title: '요양등급 신청 절차가 궁금합니다',
            author: '이영희',
            date: '2025-07-06',
            content: '요양등급 신청을 하고 싶은데 어떤 절차를 거쳐야 하나요? 필요한 서류는 무엇인가요?',
            answer: '요양등급 신청 절차에 대해 안내드리겠습니다.\n\n1. 신청 장소: 읍면동 주민센터 또는 복지관\n2. 필요 서류: 신분증, 의료진단서, 소득증빙서류\n3. 심사 기간: 약 2-3주 소요\n\n자세한 내용은 복지관으로 문의하시기 바랍니다.',
            answerDate: '2025-07-07'
        }
    ];

    return faqDataList.find(faq => faq.id == id);
}

// FAQ 삭제
function deleteFaq() {
    if (confirm('정말로 이 FAQ를 삭제하시겠습니까?')) {
        const faqId = getFaqIdFromPath();

        // 실제 구현에서는 서버에 삭제 요청
        console.log('FAQ 삭제 요청:', faqId);

        // 삭제 성공 시 목록으로 이동
        alert('FAQ가 삭제되었습니다.');
        window.location.href = '/faq';
    }
}

// 에러 메시지 표시
function showError(message) {
    const container = document.querySelector('.faq-answer-container');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <h3>오류</h3>
                <p>${message}</p>
                <button onclick="history.back()">이전 페이지로</button>
            </div>
        `;
    }
}

// 페이지 새로고침 시 데이터 다시 로드
window.addEventListener('beforeunload', function() {
    // 필요한 경우 정리 작업 수행
});

// 브라우저 뒤로가기/앞으로가기 처리
window.addEventListener('popstate', function() {
    initializeFaqAnswer();
});