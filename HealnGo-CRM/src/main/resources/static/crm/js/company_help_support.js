// 도움말/고객센터 페이지 JavaScript

// 탭 전환
function switchTab(tabName) {
    // 모든 탭 비활성화
    document.querySelectorAll('.tab-item').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // 선택된 탭 활성화
    document.querySelector(`.tab-item[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// 탭 클릭 이벤트
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
});

// 요청 상세 보기
function viewRequest(id) {
    // 선택된 행 표시
    document.querySelectorAll('.requests-table tbody tr').forEach(tr => tr.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    // AJAX로 상세 정보 가져오기 (서버에서 전달된 데이터 사용)
    const requests = window.requestsData || [];
    const request = requests.find(r => r.id === id);
    
    if (!request) return;
    
    const detailHtml = `
        <div class="detail-header">
            <h3 class="detail-title">${request.title}</h3>
            <div class="detail-badges">
                <span class="type-badge ${getTypeBadgeClass(request.type)}">${request.type}</span>
                <span class="status-badge ${getStatusBadgeClass(request.status)}">${request.status}</span>
                <span class="priority-badge ${request.priority === '긴급' ? 'urgent' : 'normal'}">${request.priority}</span>
            </div>
        </div>
        
        <div class="detail-info-grid">
            <div class="info-item">
                <span class="info-label">등록일</span>
                <span class="info-value">${request.createdDate}</span>
            </div>
            <div class="info-item">
                <span class="info-label">답변일</span>
                <span class="info-value">${request.answeredDate || '-'}</span>
            </div>
        </div>
        
        <div class="content-section">
            <div class="content-label">요청 내용</div>
            <div class="content-text">${request.content}</div>
        </div>
        
        ${request.attachment ? `
        <div class="attachment-section">
            <div class="content-label">첨부 파일</div>
            <div class="attachment-item">
                <div class="attachment-icon">
                    <i class="fas fa-file-image"></i>
                </div>
                <div class="attachment-info">
                    <div class="attachment-name">${request.attachment}</div>
                    <div class="attachment-size">2.3 MB</div>
                </div>
                <i class="fas fa-download" style="color: #3498db;"></i>
            </div>
        </div>
        ` : ''}
        
        <div class="admin-answer-section ${!request.adminAnswer ? 'no-answer' : ''}">
            <div class="answer-label">
                <i class="fas ${request.adminAnswer ? 'fa-check-circle' : 'fa-clock'}"></i>
                운영자 답변
            </div>
            <div class="answer-text">${request.adminAnswer || '답변 대기 중입니다.'}</div>
        </div>
    `;
    
    document.getElementById('requestDetail').innerHTML = detailHtml;
}

function getTypeBadgeClass(type) {
    const classes = {
        '프로모션': 'promotion',
        '고객신고': 'report',
        '기술지원': 'tech',
        '정산': 'payment',
        '계정관리': 'account'
    };
    return classes[type] || 'account';
}

function getStatusBadgeClass(status) {
    const classes = {
        '처리중': 'processing',
        '완료': 'completed',
        '반려': 'rejected'
    };
    return classes[status] || 'processing';
}

// 필터 기능
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.filter-section .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 필터 버튼 활성화
            document.querySelectorAll('.filter-section .filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            const rows = document.querySelectorAll('.requests-table tbody tr');
            
            rows.forEach(row => {
                if (filter === 'all') {
                    row.style.display = '';
                } else {
                    const status = row.dataset.status;
                    if (filter === 'processing' && status === '처리중') {
                        row.style.display = '';
                    } else if (filter === 'completed' && status === '완료') {
                        row.style.display = '';
                    } else if (filter === 'rejected' && status === '반려') {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    });
});

// FAQ 아코디언
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const isOpen = faqItem.classList.contains('open');
            
            // 모든 FAQ 닫기
            document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('open'));
            
            // 클릭한 FAQ만 열기
            if (!isOpen) {
                faqItem.classList.add('open');
            }
        });
    });
});

// 새 요청 제출
function submitRequest(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    console.log('요청 제출 시작...');
    
    fetch('/company/api/help-support/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('서버 응답:', data);
        if (data.success) {
            alert('요청이 제출되었습니다. 운영팀이 확인 후 답변드리겠습니다.');
            form.reset();
            // 요청 내역 탭으로 이동하고 페이지 새로고침
            location.reload();
        } else {
            alert('제출 실패: ' + (data.message || '알 수 없는 오류'));
        }
    })
    .catch(error => {
        console.error('제출 에러:', error);
        alert('요청 제출에 실패했습니다. 다시 시도해주세요.');
    });
}

// 파일 업로드 처리
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                const fileName = e.target.files[0].name;
                const uploadText = document.querySelector('.file-upload-text');
                if (uploadText) {
                    uploadText.textContent = `선택된 파일: ${fileName}`;
                }
            }
        });
    }
});

