// 커뮤니티 기능 JavaScript

// 게시글 데이터 (로컬 스토리지 사용)
let posts = JSON.parse(localStorage.getItem('communityPosts')) || [];
let currentPage = 1;
const postsPerPage = 5;

// DOM 요소들
const writeToggleBtn = document.getElementById('writeToggleBtn');
const writeForm = document.getElementById('writeForm');
const cancelBtn = document.getElementById('cancelBtn');
const postsList = document.getElementById('postsList');
const postsCount = document.getElementById('postsCount');
const pagination = document.getElementById('pagination');

// 샘플 게시글 데이터 (처음 방문 시)
const samplePosts = [
  {
    id: 1,
    author: '김어르신',
    title: '요양원 생활에 대한 조언',
    content: '안녕하세요! 요양원에서 2년째 생활하고 있는 김어르신입니다. 처음에는 적응이 어려웠지만, 이제는 정말 편안하게 지내고 있어요. 특히 요양원 직원분들이 정말 친절하시고, 다른 어르신들과도 좋은 관계를 맺을 수 있어서 행복합니다. 요양원을 고민하고 계신 분들께 조언드리자면, 미리 방문해보시고 직원분들과 대화해보시는 것을 추천드려요.',
    date: '2025-01-15',
    likes: 12,
    comments: 5
  },
  {
    id: 2,
    author: '박가족',
    title: '어머니 요양원 입소 후기',
    content: '어머니가 요양원에 입소한 지 3개월이 되었습니다. 처음에는 많이 걱정했는데, 어머니가 생각보다 잘 적응하시고 계셔서 다행입니다. 요양원에서는 전문적인 케어를 받을 수 있고, 다른 어르신들과의 교류도 활발하게 이루어지고 있어요. 가족분들께서도 요양원 입소를 고민하고 계시다면, 충분한 상담과 견학을 통해 결정하시기를 권합니다.',
    date: '2025-01-12',
    likes: 8,
    comments: 3
  },
  {
    id: 3,
    author: '이요양사',
    title: '요양사로서의 마음가짐',
    content: '요양사로 일한 지 5년이 되었습니다. 이 일을 하면서 가장 중요한 것은 어르신들을 진심으로 사랑하는 마음이라고 생각해요. 매일매일이 새로운 도전이지만, 어르신들의 웃음소리를 들을 때면 모든 피로가 사라집니다. 요양사가 되고 싶어하는 분들께 조언드리자면, 인내심과 사랑의 마음을 가지고 임하시면 정말 보람찬 일이 될 거예요.',
    date: '2025-01-10',
    likes: 15,
    comments: 7
  },
  {
    id: 4,
    author: '최의사',
    title: '노년기 건강관리 팁',
    content: '노년기 건강관리에 대해 몇 가지 조언을 드리고 싶습니다. 첫째, 규칙적인 운동이 중요합니다. 매일 30분 정도의 가벼운 산책이나 스트레칭을 하시면 좋아요. 둘째, 균형 잡힌 식단을 유지하세요. 단백질과 비타민이 풍부한 음식을 섭취하는 것이 중요합니다. 셋째, 정기적인 건강검진을 받으세요. 조기 발견이 치료의 핵심입니다.',
    date: '2025-01-08',
    likes: 20,
    comments: 9
  },
  {
    id: 5,
    author: '정사회복지사',
    title: '노인복지 정책 안내',
    content: '최근 노인복지 정책에 대한 문의가 많아서 안내드립니다. 2025년부터 노인장기요양보험 급여가 일부 개편되었습니다. 특히 1-2등급 어르신들의 본인부담금이 조정되었으니 확인해보시기 바랍니다. 또한 요양원 입소 대기시간 단축을 위한 다양한 지원책도 마련되어 있으니, 관심 있으신 분들은 복지관이나 시청에 문의해보세요.',
    date: '2025-01-05',
    likes: 11,
    comments: 4
  }
];

// 초기화
document.addEventListener('DOMContentLoaded', function() {
  // 샘플 데이터가 없으면 추가
  if (posts.length === 0) {
    posts = samplePosts;
    savePosts();
  }
  
  initializeEventListeners();
  renderPosts();
  updatePostsCount();
});

// 이벤트 리스너 초기화
function initializeEventListeners() {
  // 글쓰기 토글 버튼
  writeToggleBtn.addEventListener('click', toggleWriteForm);
  
  // 취소 버튼
  cancelBtn.addEventListener('click', toggleWriteForm);
  
  // 폼 제출
  writeForm.addEventListener('submit', handleFormSubmit);
}

// 글쓰기 폼 토글
function toggleWriteForm() {
  const isVisible = writeForm.style.display !== 'none';
  
  if (isVisible) {
    writeForm.style.display = 'none';
    writeToggleBtn.textContent = '글쓰기';
    writeForm.reset();
  } else {
    writeForm.style.display = 'block';
    writeToggleBtn.textContent = '접기';
  }
}

// 폼 제출 처리
function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(writeForm);
  const authorName = formData.get('authorName').trim();
  const postTitle = formData.get('postTitle').trim();
  const postContent = formData.get('postContent').trim();
  
  if (!authorName || !postTitle || !postContent) {
    alert('모든 필드를 입력해주세요.');
    return;
  }
  
  // 새 게시글 생성
  const newPost = {
    id: Date.now(),
    author: authorName,
    title: postTitle,
    content: postContent,
    date: new Date().toISOString().split('T')[0],
    likes: 0,
    comments: 0
  };
  
  // 게시글 목록 맨 앞에 추가
  posts.unshift(newPost);
  savePosts();
  
  // 폼 초기화 및 숨기기
  writeForm.reset();
  toggleWriteForm();
  
  // 게시글 목록 새로고침
  currentPage = 1;
  renderPosts();
  updatePostsCount();
  
  // 성공 메시지
  showNotification('게시글이 성공적으로 등록되었습니다!');
}

// 게시글 목록 렌더링
function renderPosts() {
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);
  
  if (currentPosts.length === 0) {
    postsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <div class="empty-state-text">아직 게시글이 없습니다</div>
        <div class="empty-state-subtext">첫 번째 게시글을 작성해보세요!</div>
      </div>
    `;
  } else {
    postsList.innerHTML = currentPosts.map(post => createPostHTML(post)).join('');
  }
  
  renderPagination();
  addPostEventListeners();
}

// 게시글 HTML 생성
function createPostHTML(post) {
  return `
    <div class="post-item" data-post-id="${post.id}">
      <div class="post-header">
        <h4 class="post-title">${escapeHtml(post.title)}</h4>
      </div>
      <div class="post-meta">
        <span class="post-author">${escapeHtml(post.author)}</span>
        <span class="post-date">${post.date}</span>
      </div>
      <p class="post-content">${escapeHtml(post.content)}</p>
      <div class="post-actions">
        <button class="post-action-btn like" data-post-id="${post.id}">
          👍 좋아요 <span class="like-count">${post.likes}</span>
        </button>
        <button class="post-action-btn comment" data-post-id="${post.id}">
          💬 댓글 <span class="comment-count">${post.comments}</span>
        </button>
      </div>
    </div>
  `;
}

// 게시글 이벤트 리스너 추가
function addPostEventListeners() {
  // 좋아요 버튼
  document.querySelectorAll('.post-action-btn.like').forEach(btn => {
    btn.addEventListener('click', handleLike);
  });
  
  // 댓글 버튼
  document.querySelectorAll('.post-action-btn.comment').forEach(btn => {
    btn.addEventListener('click', handleComment);
  });
  
  // 게시글 클릭 (상세보기)
  document.querySelectorAll('.post-item').forEach(item => {
    item.addEventListener('click', handlePostClick);
  });
}

// 좋아요 처리
function handleLike(e) {
  e.stopPropagation();
  const postId = parseInt(e.currentTarget.dataset.postId);
  const post = posts.find(p => p.id === postId);
  
  if (post) {
    post.likes++;
    savePosts();
    renderPosts();
    showNotification('좋아요를 눌렀습니다!');
  }
}

// 댓글 처리
function handleComment(e) {
  e.stopPropagation();
  const postId = parseInt(e.currentTarget.dataset.postId);
  showNotification('댓글 기능은 준비 중입니다!');
}

// 게시글 클릭 처리
function handlePostClick(e) {
  if (e.target.classList.contains('post-action-btn')) {
    return;
  }
  
  const postId = parseInt(e.currentTarget.dataset.postId);
  const post = posts.find(p => p.id === postId);
  
  if (post) {
    showPostDetail(post);
  }
}

// 게시글 상세보기
function showPostDetail(post) {
  const modal = document.createElement('div');
  modal.className = 'post-modal';
  modal.innerHTML = `
    <div class="post-modal-content">
      <div class="post-modal-header">
        <h2>${escapeHtml(post.title)}</h2>
        <button class="modal-close-btn">&times;</button>
      </div>
      <div class="post-modal-body">
        <div class="post-modal-meta">
          <span class="post-author">${escapeHtml(post.author)}</span>
          <span class="post-date">${post.date}</span>
        </div>
        <div class="post-modal-content-text">
          ${escapeHtml(post.content).replace(/\n/g, '<br>')}
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // 모달 닫기
  modal.querySelector('.modal-close-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

// 페이지네이션 렌더링
function renderPagination() {
  const totalPages = Math.ceil(posts.length / postsPerPage);
  
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  
  let paginationHTML = '';
  
  // 이전 버튼
  paginationHTML += `
    <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
      이전
    </button>
  `;
  
  // 페이지 번호
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      paginationHTML += `<button class="pagination-btn active">${i}</button>`;
    } else {
      paginationHTML += `<button class="pagination-btn" onclick="changePage(${i})">${i}</button>`;
    }
  }
  
  // 다음 버튼
  paginationHTML += `
    <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
      다음
    </button>
  `;
  
  pagination.innerHTML = paginationHTML;
}

// 페이지 변경
function changePage(page) {
  const totalPages = Math.ceil(posts.length / postsPerPage);
  
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderPosts();
    
    // 페이지 상단으로 스크롤
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// 게시글 수 업데이트
function updatePostsCount() {
  postsCount.textContent = posts.length;
}

// 로컬 스토리지에 저장
function savePosts() {
  localStorage.setItem('communityPosts', JSON.stringify(posts));
}

// HTML 이스케이프
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 알림 표시
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  // 스타일 추가
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // 3초 후 제거
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// 애니메이션 스타일 추가
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .post-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .post-modal-content {
    background: white;
    border-radius: 15px;
    max-width: 600px;
    width: 90%;
    max-height: 80%;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }
  
  .post-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #e9ecef;
  }
  
  .post-modal-header h2 {
    margin: 0;
    color: #2c3e50;
  }
  
  .modal-close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6c757d;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.3s ease;
  }
  
  .modal-close-btn:hover {
    background: #f8f9fa;
  }
  
  .post-modal-body {
    padding: 2rem;
  }
  
  .post-modal-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: #6c757d;
  }
  
  .post-modal-content-text {
    line-height: 1.8;
    color: #495057;
    white-space: pre-line;
  }
`;
document.head.appendChild(style);
