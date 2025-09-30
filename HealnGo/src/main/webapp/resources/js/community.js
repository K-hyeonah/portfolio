// 글작성 토글
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.write-btn');
  if (!btn) return;

  const row = btn.closest('.community-row');
  const insert = row?.nextElementSibling; // .community-insert

  if (insert && insert.classList.contains('community-insert')) {
    insert.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', insert.classList.contains('is-open'));
    
    // 작성 모드로 초기화
    if (insert.classList.contains('is-open')) {
      setInsertMode('write');
    }
  }
});

// 드롭다운 선택 시 버튼 라벨/hidden 값 세팅
document.addEventListener('click', function(e){
  const item = e.target.closest('.dropdown-item');
  if(!item) return;
  e.preventDefault();

  const dropdown = item.closest('.dropdown');
  const btn = dropdown.querySelector('.dropdown-toggle');
  const hidden = dropdown.querySelector('.insert-category');

  const text = item.textContent.trim();
  const val  = item.dataset.value || text;

  btn.textContent = text;
  if (hidden) hidden.value = val;
});

// insert 폼 열기
function openInsert() {
  const insert = getInsertBox();
  if (!insert.classList.contains('is-open')) {
    insert.classList.add('is-open');
  }
}

// insert 박스 가져오기
function getInsertBox() {
  return document.querySelector('.community-insert');
}

// insert 폼 모드 설정
function setInsertMode(mode, postId = null) {
  const insert = getInsertBox();
  const titleInput = insert.querySelector('.insert-title');
  const contentInput = insert.querySelector('.insert-content');
  const categoryDropdown = insert.querySelector('.insert-category');
  const submitBtn = insert.querySelector('.insert-btn');

  if (mode === 'edit') {
    // 수정 모드
    insert.dataset.mode = 'edit';
    insert.dataset.postId = postId;
    submitBtn.textContent = '수정';
    submitBtn.dataset.mode = 'edit'; // CSS 색상 구분용
  } else {
    // 작성 모드
    insert.dataset.mode = 'write';
    delete insert.dataset.postId;
    submitBtn.textContent = '입력';
    submitBtn.dataset.mode = 'write'; // CSS 색상 구분용
    
    // 폼 초기화
    titleInput.value = '';
    contentInput.value = '';
    if (categoryDropdown) {
      categoryDropdown.value = '';
    }
    // 카테고리 버튼도 초기화
    const categoryBtn = insert.querySelector('.dropdown-toggle');
    if (categoryBtn) {
      categoryBtn.textContent = '카테고리';
    }
  }
}

// 작성/수정 버튼 클릭 이벤트 통합
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.insert-btn');
  if (!btn) return;

  const insert = getInsertBox();
  const mode = insert.dataset.mode || 'write';
  const title = insert.querySelector('.insert-title').value.trim();
  const content = insert.querySelector('.insert-content').value.trim();
  const category = insert.querySelector('.insert-category')?.value.trim() || '';

  if (!title || !content || !category) {
    const modalHTML = `
          <div id="insertAlertModal" class="insert-confirm-modal">
            <div class="insert-confirm-content">
              <h3 style="font-size:15px">제목과 내용 카테고리를 입력하세요</h3>
              <div class="insert-confirm-buttons">
                <button class="insert-confirm-ok">확인</button>
              </div>
            </div>
          </div>`;
        document.querySelector('#insertAlertModal')?.remove();
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.querySelector('.insert-confirm-ok')
          .addEventListener('click', () => document.querySelector('#insertAlertModal').remove());
    return;
  }

  try {
    let url, body;
    
    if (mode === 'edit') {
      const postId = insert.dataset.postId;
      url = '/community/edit/fetch';
      body = new URLSearchParams({ postId, title, content, category });
    } else {
      url = '/community/write/fetch';
      body = new URLSearchParams({ title, content, category });
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    });

    const text = await res.text();
    if (text.trim() === 'success') {
      // 수정이든 작성이든 바로 새로고침
      location.reload();
    } else if (text.trim() === 'login_required') {
      alert('로그인이 필요합니다.');
    } else if (text.trim() === 'unauthorized') {
      alert('본인이 작성한 글만 수정할 수 있습니다.');
    } else if (text.trim() === 'post_not_found') {
      alert('글이 존재하지 않습니다.');
    } else {
      alert(mode === 'edit' ? '수정 실패' : '저장 실패');
    }
  } catch (err) {
    console.error(err);
    const modalHTML = `
                  <div id="insertAlertModal" class="insert-confirm-modal">
                    <div class="insert-confirm-content">
                      <h3 style="font-size:15px">저장 중 오류가 발생했습니다.</h3>
                      <div class="insert-confirm-buttons">
                        <button class="insert-confirm-ok">확인</button>
                      </div>
                    </div>
                  </div>`;
                document.querySelector('#insertAlertModal')?.remove();
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                document.querySelector('.insert-confirm-ok')
                  .addEventListener('click', () => document.querySelector('#insertAlertModal').remove());
  }
});

// 수정 버튼 → 인라인 편집 모드로 전환
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.show-update');
  if (!btn) return;

  const card = btn.closest('.community-show');
  if (!card) return;

  // 편집 모드로 전환
  enterEditMode(card);
});

// 편집 모드 진입
function enterEditMode(card) {
  // 텍스트 → 입력 필드로 전환
  const titleText = card.querySelector('.title-text');
  const titleEdit = card.querySelector('.title-edit');
  const contentText = card.querySelector('.content-text');
  const contentEdit = card.querySelector('.content-edit');

  if (titleText && titleEdit && contentText && contentEdit) {
    titleText.style.display = 'none';
    titleEdit.style.display = 'block';
    contentText.style.display = 'none';
    contentEdit.style.display = 'block';
  }

  // 버튼 상태 변경
  const updateBtn = card.querySelector('.show-update');
  const cancelBtn = card.querySelector('.show-cancel');
  const saveBtn = card.querySelector('.show-save');
  const deleteBtn = card.querySelector('.show-delete');

  if (updateBtn && cancelBtn && saveBtn && deleteBtn) {
    updateBtn.style.display = 'none';
    cancelBtn.style.display = 'inline-block';
    saveBtn.style.display = 'inline-block';
    deleteBtn.style.display = 'none'; // 편집 중에는 삭제 버튼 숨김
  }

  // 제목 입력 필드에 포커스
  if (titleEdit) {
    titleEdit.focus();
    titleEdit.select(); // 전체 텍스트 선택
  }
}

// 취소 버튼 → 편집 모드 취소
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.show-cancel');
  if (!btn) return;

  const card = btn.closest('.community-show');
  if (!card) return;

  // 편집 모드 취소
  exitEditMode(card, true); // true = 원래 값으로 복원
});

// 저장 버튼 → 편집 내용 저장
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.show-save');
  if (!btn) return;

  const card = btn.closest('.community-show');
  if (!card) return;

  // 편집된 내용 가져오기
  const titleEdit = card.querySelector('.title-edit');
  const contentEdit = card.querySelector('.content-edit');
  
  if (!titleEdit || !contentEdit) return;

  const newTitle = titleEdit.value.trim();
  const newContent = contentEdit.value.trim();
  const postId = card.dataset.postId;

  if (!newTitle || !newContent) {
    alert('제목과 내용을 모두 입력해주세요.');
    return;
  }

  try {
    // 서버에 수정 요청
    const res = await fetch('/community/edit/fetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ 
        postId, 
        title: newTitle, 
        content: newContent, 
        category: card.dataset.category || '' 
      })
    });

    const text = await res.text();
    if (text.trim() === 'success') {
      // 성공 시 화면 업데이트
      updateCardDisplay(card, newTitle, newContent);
      exitEditMode(card, false); // false = 새 값 유지
      console.log('수정이 완료되었습니다!');
    } else if (text.trim() === 'login_required') {
      alert('로그인이 필요합니다.');
    } else if (text.trim() === 'unauthorized') {
      alert('본인이 작성한 글만 수정할 수 있습니다.');
    } else if (text.trim() === 'post_not_found') {
      alert('글이 존재하지 않습니다.');
    } else {
      alert('수정에 실패했습니다.');
    }
  } catch (err) {
    console.error(err);
    alert('서버 오류가 발생했습니다.');
  }
});

// 초기 로드 시 좋아요 버튼을 메타 영역(카테고리) 뒤로 이동
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.community-show').forEach(card => {
    const like = card.querySelector('.show-title .like-toggle');
    const meta = card.querySelector('.show-meta');
    if (like && meta) {
      meta.appendChild(like);
    }
  });
});

// 편집 모드 종료
function exitEditMode(card, restoreOriginal = false) {
  const titleText = card.querySelector('.title-text');
  const titleEdit = card.querySelector('.title-edit');
  const contentText = card.querySelector('.content-text');
  const contentEdit = card.querySelector('.content-edit');

  if (titleText && titleEdit && contentText && contentEdit) {
    if (restoreOriginal) {
      // 원래 값으로 복원
      titleEdit.value = titleText.textContent;
      contentEdit.value = contentText.textContent;
    }
    
    titleText.style.display = 'block';
    titleEdit.style.display = 'none';
    contentText.style.display = 'block';
    contentEdit.style.display = 'none';
  }

  // 버튼 상태 원복
  const updateBtn = card.querySelector('.show-update');
  const cancelBtn = card.querySelector('.show-cancel');
  const saveBtn = card.querySelector('.show-save');
  const deleteBtn = card.querySelector('.show-delete');

  if (updateBtn && cancelBtn && saveBtn && deleteBtn) {
    updateBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'none';
    saveBtn.style.display = 'none';
    deleteBtn.style.display = 'inline-block';
  }
}

// 카드 화면 업데이트
function updateCardDisplay(card, newTitle, newContent) {
  const titleText = card.querySelector('.title-text');
  const contentText = card.querySelector('.content-text');
  
  if (titleText) titleText.textContent = newTitle;
  if (contentText) contentText.textContent = newContent;
}

// 카드 DOM 생성 & prepend
function prependCard(p) {
  const list = document.getElementById('community-list');
  const card = document.createElement('div');
  card.className = 'community-show';
  card.dataset.postId = p.id;

  card.innerHTML = `
    <div class="show-title"><strong>${escapeHtml(p.title)}</strong></div>
    <div class="show-btn-wrap">
      <span class="show-meta">
        ${escapeHtml(p.userId)} · ${p.createdAt} · ${escapeHtml(p.category || '')}
      </span>
      <div>
        <button class="show-update">수정</button>
        <button class="show-delete">삭제</button>
      </div>
    </div>
    <hr/>
    <div class="show-content">${escapeHtml(p.content).replace(/\n/g,'<br>')}</div>
  `;

  list.prepend(card);
}

// XSS 방지용
function escapeHtml(s){
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// 삭제 버튼
document.addEventListener('click', function (e) {
  const deleteBtn = e.target.closest('.show-delete');
  if (!deleteBtn) return;

  // 모달 HTML
  const html = `
    <div id="deleteConfirmModal" class="delete-confirm-modal">
      <div class="delete-confirm-content">
        <h3 style="font-size:15px">정말 삭제하시겠습니까?</h3>
        <div class="delete-confirm-buttons">
          <button class="delete-confirm-ok">확인</button>
          <button class="delete-confirm-cancel">취소</button>
        </div>
      </div>
    </div>
  `;
  document.querySelector('#deleteConfirmModal')?.remove();
  document.body.insertAdjacentHTML('beforeend', html);

  const modal = document.querySelector('#deleteConfirmModal');
  const okBtn = modal.querySelector('.delete-confirm-ok');
  const cancelBtn = modal.querySelector('.delete-confirm-cancel');

  // 확인 버튼 클릭 → fetch로 DB 삭제
  okBtn.addEventListener('click', async () => {
    const card = deleteBtn.closest('.community-show');
    const postId = card?.dataset.postId;
    if (!postId) return;

    try {
      const res = await fetch('/community/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ postId })
      });
      const text = await res.text();

      if (text.trim() === 'success') {
        card.remove();  // 화면에서 카드 제거
      } else if (text.trim() === 'login_required') {
        alert('로그인이 필요합니다.');
      } else if (text.trim() === 'unauthorized') {
        alert('본인이 작성한 글만 삭제할 수 있습니다.');
      } else if (text.trim() === 'post_not_found') {
        alert('글이 존재하지 않습니다.');
      } else {
        alert('삭제 실패');
      }
    } catch (err) {
      console.error(err);
      alert('서버 오류');
    } finally {
      modal.remove();  // 모달 닫기
    }
  });

  // 취소 버튼 → 모달 닫기
  cancelBtn.addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (ev) => {
    if (ev.target === modal) modal.remove();
  });
});

// 좋아요 토글
document.addEventListener('click', async (e) => {
  const toggle = e.target.closest('.like-toggle');
  if (!toggle) return;
  try {
    const container = document.querySelector('.community-container');
    const loggedIn = container?.dataset.loggedIn === 'true';
    if (!loggedIn) {
      alert('로그인이 필요합니다.');
      window.location.href = '/login';
      return;
    }
    const card = toggle.closest('.community-show');
    const postId = card?.dataset.postId;
    if (!postId) return;

    const res = await fetch('/community/like/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ postId })
    });
    const data = await res.json().catch(() => ({}));

    if (data.status === 'login_required') {
      alert('로그인이 필요합니다.');
      window.location.href = '/login';
      return;
    }
    if (data.status !== 'success') {
      alert('처리 중 오류가 발생했습니다.');
      return;
    }

    const icon = toggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fas', data.liked === true);
      icon.classList.toggle('far', data.liked !== true);
    }
    const countEl = toggle.querySelector('.like-count');
    if (countEl && typeof data.likeCount === 'number') {
      countEl.textContent = data.likeCount;
    }
    toggle.dataset.liked = String(data.liked === true);
  } catch (err) {
    console.error(err);
    alert('서버 오류가 발생했습니다.');
  }
});


