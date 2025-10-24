/* ===== 사용자 신고/문의 JS ===== */
document.addEventListener('DOMContentLoaded', () => {
  initializeTabs();
  initializeFileUpload();
  initializeFormValidation();
  initializeFormSubmit();
  
  // 초기 탭 상태 설정 (신고하기가 기본)
  switchTab('report');
});

/* 탭 */
function initializeTabs() {
  document.querySelectorAll('.inquiry-tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });
}
function switchTab(tabName) {
  document.querySelectorAll('.inquiry-tab').forEach(t => t.classList.remove('active'));
  const btn = document.querySelector(`.inquiry-tab[data-tab="${tabName}"]`);
  if (btn) btn.classList.add('active');

  const report = document.getElementById('reportFormContent');
  const inquiry = document.getElementById('inquiryFormContent');
  const history = document.getElementById('historyFormContent');
  
  // 탭 표시/숨김
  report.style.display = tabName === 'report' ? 'block' : 'none';
  inquiry.style.display = tabName === 'inquiry' ? 'block' : 'none';
  history.style.display = tabName === 'history' ? 'block' : 'none';
  
  // 현재 탭이 아닌 폼의 required 속성 제거
  if (tabName === 'report') {
    enableRequired(report, true);
    enableRequired(inquiry, false);
  } else if (tabName === 'inquiry') {
    enableRequired(report, false);
    enableRequired(inquiry, true);
  } else {
    enableRequired(report, false);
    enableRequired(inquiry, false);
  }

  if (tabName === 'history') loadInquiryHistory();
}

// required 속성 동적 제어
function enableRequired(container, enable) {
  if (!container) return;
  container.querySelectorAll('input, select, textarea').forEach(el => {
    if (el.type === 'file' || el.name === 'targetUrl' || el.name === 'orderId') {
      // 파일, targetUrl, orderId는 선택 사항이므로 제외
      return;
    }
    if (enable) {
      el.setAttribute('required', 'required');
    } else {
      el.removeAttribute('required');
    }
  });
}

/* 파일 업로드 표시 */
function initializeFileUpload() {
  wireFile('reportFile', 'reportFileName');
  wireFile('inquiryFile', 'inquiryFileName');
}
function wireFile(inputId, nameId) {
  const inp = document.getElementById(inputId);
  const name = document.getElementById(nameId);
  if (!inp) return;
  inp.addEventListener('change', e => {
    const f = e.target.files?.[0];
    if (!f) { name.textContent=''; name.classList.remove('active'); return; }
    const max = 10 * 1024 * 1024;
    if (f.size > max) { alert('파일 크기는 10MB를 초과할 수 없습니다.'); inp.value=''; return; }
    name.textContent = f.name; name.classList.add('active');
  });
}

/* 검증(간단) */
function initializeFormValidation() {
  document.querySelectorAll('.form-control').forEach(el => {
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => el.classList.contains('is-invalid') && validateField(el));
  });
}
function validateField(field) {
  const val = (field.value || '').trim();
  let ok = true, msg = '';
  if (field.hasAttribute('required') && !val) { ok=false; msg='이 필드는 필수입니다.'; }
  if (field.name === 'email' && val) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; if (!re.test(val)) { ok=false; msg='올바른 이메일 주소를 입력해주세요.'; }
  }
  if (!ok) { field.classList.add('is-invalid'); showFieldError(field, msg); }
  else { field.classList.remove('is-invalid'); clearFieldError(field); }
  return ok;
}
function showFieldError(field, msg) {
  clearFieldError(field);
  const div = document.createElement('div');
  div.className = 'invalid-feedback';
  div.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg}`;
  field.parentNode.appendChild(div);
}
function clearFieldError(field) {
  const old = field.parentNode.querySelector('.invalid-feedback');
  if (old) old.remove();
}

/* 제출 */
function initializeFormSubmit() {
    const form = document.getElementById('mainForm');
  form.addEventListener('submit', e => {
            e.preventDefault();
    handleFormSubmit();
  });
}
function handleFormSubmit() {
  const isReport = document.querySelector('.inquiry-tab.active')?.dataset.tab === 'report';
  const active = isReport ? document.getElementById('reportFormContent') : document.getElementById('inquiryFormContent');

  const submitBtn = active.querySelector('button[type="submit"]');
  
  // 현재 활성 탭의 필수 입력 검증만 수행
  let ok = true;
  const visibleRequiredFields = active.querySelectorAll('.form-control[required]');
  console.log('검증할 필드 수:', visibleRequiredFields.length);
  
  visibleRequiredFields.forEach(el => { 
    const isValid = validateField(el);
    console.log(`필드 ${el.name} 검증:`, isValid);
    if (!isValid) ok = false;
  });
  
  if (!ok) { 
    alert('필수 항목을 모두 올바르게 입력해주세요.'); 
    return; 
  }

  // 백엔드 DTO 필드만 담아서 전송 (subject, content, orderId?, attachment?)
  const fd = new FormData();
  const subject = active.querySelector('input[name="subject"]')?.value?.trim() || '';
  const content = active.querySelector('textarea[name="content"]')?.value?.trim() || '';
  const orderId = active.querySelector('input[name="orderId"]')?.value?.trim();
  const fileInp = active.querySelector('input[type="file"][name="attachment"]');

  console.log('제출 데이터 확인:');
  console.log('- subject:', subject);
  console.log('- content:', content);
  console.log('- orderId:', orderId);

  // 제목과 내용이 비어있으면 제출 중단
  if (!subject || !content) {
    alert('제목과 내용을 모두 입력해주세요.');
    return;
  }

  // 신고/문의 유형은 내용 앞에 태그로만 붙여서 저장(필드가 없으므로)
  if (isReport) {
    const reportType = active.querySelector('select[name="reportType"]')?.value || '';
    const targetUrl  = active.querySelector('input[name="targetUrl"]')?.value || '';
    fd.append('subject', `[신고:${reportType}] ${subject}`);
    fd.append('content', `${targetUrl ? `URL: ${targetUrl}\n\n` : ''}${content}`);
  } else {
    const inquiryType = active.querySelector('select[name="inquiryType"]')?.value || '';
    fd.append('subject', `[문의:${inquiryType}] ${subject}`);
    fd.append('content', content);
  }
  if (orderId) fd.append('orderId', orderId);
  if (fileInp?.files?.[0]) fd.append('attachment', fileInp.files[0]);

  submitBtn.disabled = true;

  console.log('폼 제출 시작 - URL:', '/api/user-inquiry/submit');
  console.log('FormData 내용:', Array.from(fd.entries()));
  
  fetch('/api/user-inquiry/submit', { method: 'POST', body: fd })
    .then(r => {
      console.log('응답 상태:', r.status);
      if (!r.ok) {
        return r.text().then(text => {
          console.error('서버 응답 에러:', text);
          throw new Error(`서버 에러 (${r.status}): ${text}`);
        });
      }
      return r.json();
    })
    .then(j => {
      console.log('서버 응답:', j);
      submitBtn.disabled = false;
      if (j?.success) {
        alert(`등록되었습니다. 번호: ${j.id}`);
        // 폼 초기화
        document.getElementById('mainForm').reset();
        ['reportFileName','inquiryFileName'].forEach(id => { const n = document.getElementById(id); if (n){n.textContent=''; n.classList.remove('active');} });
        // 내역 탭으로 전환하여 결과 확인
        switchTab('history');
      } else {
        alert('실패: ' + (j?.message || '알 수 없는 오류'));
      }
    })
    .catch(e => {
      console.error('제출 실패:', e);
      submitBtn.disabled = false;
      alert('오류가 발생했습니다: ' + e.message);
    });
}

/* 내역 조회 - /api/user-inquiry/my-history (InquiryHistoryItem 리스트) */
function loadInquiryHistory() {
  const loading = document.getElementById('historyLoading');
  const list = document.getElementById('historyList');
  const empty = document.getElementById('historyEmpty');

  loading.style.display = 'block';
  list.style.display = 'none';
  empty.style.display = 'none';

  fetch('/api/user-inquiry/my-history')
    .then(r => r.json())
    .then(items => {
      console.log('===== 문의 내역 조회 결과 =====');
      console.log('조회된 항목 수:', items.length);
      items.forEach(item => {
        console.log('문의 ID:', item.inquiryId);
        console.log('  - 제목:', item.subject);
        console.log('  - 상태:', item.status);
        console.log('  - adminAnswer:', item.adminAnswer);
        console.log('  - answeredAt:', item.answeredAt);
      });
      
      loading.style.display = 'none';
      if (!items || items.length === 0) { empty.style.display='block'; return; }
      list.innerHTML = items.map(toHistoryCard).join('');
      list.style.display = 'block';
    })
    .catch(err => {
      console.error('문의 내역 조회 실패:', err);
      loading.style.display = 'none';
      empty.style.display = 'block';
    });
}
function toHistoryCard(it) {
  const statusK = (s) => ({OPEN:'대기중',ANSWERED:'답변완료',CLOSED:'종료'})[s] || s;
  const fmt = (d) => d ? new Date(d).toLocaleString('ko-KR') : '-';
  const cleanSubject = (s) => (s || '').replace(/^\[(?:문의|신고):[^\]]+\]\s*/, '');
  
  console.log('카드 생성 - ID:', it.inquiryId, 'status:', it.status, 'adminAnswer:', it.adminAnswer, 'answeredAt:', it.answeredAt);
  
  // 답변 섹션 HTML 생성
  let replySection = '';
  if (it.adminAnswer && it.adminAnswer.trim()) {
    // 답변이 있는 경우
    replySection = `
      <div class="history-item-reply">
        <div class="history-item-reply-header"><i class="fas fa-reply"></i><span>관리자 답변</span></div>
        <div class="history-item-reply-text">${escapeHtml(it.adminAnswer)}</div>
        <div class="history-item-reply-date">답변일: ${fmt(it.answeredAt)}</div>
      </div>`;
  } else if (it.status === 'ANSWERED') {
    // 상태는 답변완료인데 답변 내용이 없는 경우
    replySection = `
      <div class="history-item-reply" style="background: #fff3cd; border-left-color: #ffc107;">
        <div class="history-item-reply-header"><i class="fas fa-clock"></i><span>답변 처리 중</span></div>
        <div class="history-item-reply-date">답변일: ${fmt(it.answeredAt)}</div>
      </div>`;
  }
  
  // 상태에 따른 클래스와 텍스트 결정
  const isAnswered = it.status === 'ANSWERED';
  const isClosed = it.status === 'CLOSED';
  const statusClass = isAnswered || isClosed ? 'answered' : 'pending';
  const statusIcon = isAnswered || isClosed ? 'fa-check-circle' : 'fa-clock';
  const statusText = isAnswered ? '답변완료' : (isClosed ? '종료' : '확인중');
  
  return `
    <div class="history-item">
      <div class="history-item-header">
        <div class="history-item-title-wrapper">
          <span class="history-item-type ${statusClass}">${statusK(it.status)}</span>
          <div class="history-item-title">${escapeHtml(cleanSubject(it.subject))}</div>
          <div class="history-item-date">${fmt(it.createdAt)}</div>
        </div>
        <div class="history-item-status ${statusClass}">
          <i class="fas ${statusIcon}"></i>
          <span>${statusText}</span>
        </div>
      </div>
      <div class="history-item-content">
        <div class="history-item-label">문의/신고 내용</div>
        <div class="history-item-text">${escapeHtml(it.content || '')}</div>
      </div>
      ${replySection}
    </div>`;
}
function escapeHtml(t) { const d=document.createElement('div'); d.textContent=t||''; return d.innerHTML; }
