// company_review.js (final) - CACHE BUST v2
// 업체 리뷰 관리 페이지 JavaScript

// ========== 전역 상태 ==========
let reviewData = [];
let currentFilter = 'all';
let selectedReview = null;
let currentCompanyId = null;

// ========== ReviewAPI (없으면 최소 구현) ==========
if (!window.ReviewAPI) {
  window.ReviewAPI = {
    async getRepliesByReview(reviewId) {
      const r = await fetch(`/review/reply/review/${reviewId}`, {
        credentials: 'include',
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      });
      if (!r.ok) throw new Error('getRepliesByReview failed');
      return r.json();
    },
    async createReply(reviewId, companyId, body, isPublic) {
      const r = await fetch(`/review/reply`, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ reviewId, companyId, body, public: !!isPublic })
      });
      if (!r.ok) throw new Error('createReply failed');
      return r.json();
    },
    async updateReply(replyId, body, isPublic = true) {
      const r = await fetch(`/review/reply/${replyId}`, {
        method: 'PUT',
        credentials: 'include',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ body, public: !!isPublic })
      });
      if (!r.ok) throw new Error('updateReply failed');
      return r.json();
    },
    async deleteReply(replyId) {
      const r = await fetch(`/review/reply/${replyId}`, {
        method: 'DELETE',
        credentials: 'include',
        cache: 'no-store'
      });
      if (!r.ok) throw new Error('deleteReply failed');
    },
    async toggleReplyVisibility(replyId) {
      const r = await fetch(`/review/reply/${replyId}/visibility`, {
        method: 'PATCH',
        credentials: 'include',
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      });
      if (!r.ok) throw new Error('toggleReplyVisibility failed');
      return r.json();
    },
    async getReviewById(reviewId) {
      const r = await fetch(`/api/review/${reviewId}`, {
        credentials: 'include',
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      });
      if (!r.ok) throw new Error('getReviewById failed');
      return r.json();
    }
  };
}

// ========== 초기화 ==========
document.addEventListener('DOMContentLoaded', async function () {
    currentCompanyId = await getCurrentCompanyId();
  console.log('🔍 getCurrentCompanyId 결과:', currentCompanyId);
    
  // 임시 하드코딩 (테스트용)
    if (!currentCompanyId) {
    console.log('⚠️ API에서 companyId를 가져오지 못함. 하드코딩으로 테스트...');
    currentCompanyId = 1; // 임시로 1로 설정
  }
  
  console.log('🔍 최종 currentCompanyId:', currentCompanyId);

  await loadReviewData();     // 리뷰 + 답글 로드
  updateStats();              // 통계 카드 갱신
  setupFilterButtons();       // 필터 버튼
  setupSearch();              // 검색
  setupReplyButtons();        // 답변 작성/수정/취소
});

// ========== 현재 업체 ID ==========
async function getCurrentCompanyId() {
    try {
      const res = await fetch('/crm/api/current-company', {
        credentials: 'include',
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) return null;                   // 401/403/302 등
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      if (!ct.includes('application/json')) return null;  // HTML이면 리다이렉트
      const data = await res.json();
      return (data && data.companyId != null) ? data.companyId : null;
    } catch {
      return null;
    }
  }

// ========== 리뷰 데이터 로드 ==========
async function loadReviewData() {
  let source = 'unknown';
  try {
    console.log('🔍 현재 업체 ID:', currentCompanyId);
    const url = `/api/review/company-reviews/${currentCompanyId}`;
    console.log('[reviews] GET', url);
    const response = await fetch(url, {
      credentials: 'include',
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      source = `api-error(${response.status})`;
      throw new Error('리뷰 조회 실패: ' + response.status);
    }

                const reviews = await response.json();
    console.log('[reviews] api size:', reviews?.length);
    console.log('🔍 API 응답 데이터:', reviews);

    // 13 컬럼 매핑 (백엔드 쿼리 순서에 맞춤)
    reviewData = (reviews || []).map(r => ({
      reviewId: r[0],
      userId: r[1],
      itemId: r[2],
      bookingId: r[3],
      rating: r[4],
      title: r[5],
      content: r[6],
      imageMime: r[7],
      isPublic: r[8],
      createdAt: r[9],
      updatedAt: r[10],
      itemName: r[11],
      userName: r[12],
      imageUrl: `/review/${r[0]}/image`,
      replies: []
    }));

    source = 'api(' + reviewData.length + ')';

    await loadAllReplies();       // 각 리뷰의 답글 로드
    renderReviewList(reviewData); // 리스트 렌더
                if (reviewData.length > 0) {
      await selectReview(reviewData[0]); // 첫 리뷰 선택
                } else {
                    showNoReviewsMessage();
                }
  } catch (e) {
    console.error('Failed to load review data:', e);
    // 네트워크/서버 에러일 때만 더미 사용
    source = 'dummy';
            loadTestData();
  } finally {
    showDataSourceBanner(`companyId=${currentCompanyId} · source=${source}`);
  }
}

// 모든 리뷰의 답글 로드
async function loadAllReplies() {
  const jobs = reviewData.map(async (review) => {
    try {
      const replies = await ReviewAPI.getRepliesByReview(review.reviewId);
      review.replies = Array.isArray(replies) ? replies : [];
    } catch {
      review.replies = [];
    }
  });
  await Promise.all(jobs);
}

// ========== 리스트 렌더 ==========
function renderReviewList(reviews) {
  const reviewListContainer = document.querySelector('.review-list');
  if (!reviewListContainer) return;

    reviewListContainer.innerHTML = '';
    
  if (!reviews || reviews.length === 0) {
        reviewListContainer.innerHTML = '<div class="empty-message">리뷰가 없습니다.</div>';
        return;
    }
    
  reviews.forEach((review) => {
        const hasReply = review.replies && review.replies.length > 0;
        const status = hasReply ? 'completed' : 'pending';
        const statusText = hasReply ? '답변 완료' : '답변 대기';
        
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.dataset.reviewId = review.reviewId;
        reviewItem.dataset.status = status;
        
        reviewItem.innerHTML = `
            <div class="review-header">
                <span class="review-id">#${String(review.reviewId).padStart(4, '0')}</span>
                <span class="status-badge ${status}">${statusText}</span>
            </div>
      <h4>${escapeHtml(review.title || '제목 없음')}</h4>
      <p class="customer">고객 : ${escapeHtml(maskName(review.userName || '익명'))}</p>
      <p class="review-text">${escapeHtml(truncateText(review.content, 50))}</p>
            <div class="review-footer">
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <span>${review.rating || 0}</span>
                </div>
                <span class="date">${formatDate(review.createdAt)}</span>
        <span class="item-name">${escapeHtml(review.itemName || '')}</span>
            </div>
        `;
        
    reviewItem.addEventListener('click', () => selectReview(review));
        reviewListContainer.appendChild(reviewItem);
    });
}

// ========== 리뷰 선택 & 상세 갱신 ==========
async function selectReview(review) {
  // 리스트에서 선택 표시
  document.querySelectorAll('.review-item').forEach((el) => el.classList.remove('selected'));
    const selectedItem = document.querySelector(`[data-review-id="${review.reviewId}"]`);
  if (selectedItem) selectedItem.classList.add('selected');

  selectedReview = review; // 항상 객체

  // 최신 답글 로드
  try {
    const replies = await ReviewAPI.getRepliesByReview(review.reviewId);
    selectedReview.replies = Array.isArray(replies) ? replies : [];
    const idx = reviewData.findIndex((r) => r.reviewId === review.reviewId);
    if (idx !== -1) reviewData[idx].replies = selectedReview.replies;
  } catch {
    selectedReview.replies = [];
  }

  updateReviewDetail(selectedReview);
}

// 상세 패널 갱신
function updateReviewDetail(review) {
    if (!review) return;

    const hasReply = review.replies && review.replies.length > 0;
    const status = hasReply ? 'completed' : 'pending';
    const statusText = hasReply ? '답변 완료' : '답변 대기';

  // 헤더
    const detailHeader = document.querySelector('.detail-header');
    if (detailHeader) {
        detailHeader.innerHTML = `
            <span class="review-id">#${String(review.reviewId).padStart(4, '0')}</span>
            <span class="status-badge ${status}">${statusText}</span>
        `;
    }

  // 평점
    const stars = document.querySelector('.stars');
    const ratingScore = document.querySelector('.rating-score');
    if (stars) stars.innerHTML = generateStars(review.rating || 0);
    if (ratingScore) ratingScore.textContent = review.rating || 0;

  // 기본 정보
    const detailInfo = document.querySelector('.detail-info');
    if (detailInfo) {
        detailInfo.innerHTML = `
      <h3>${escapeHtml(review.title || '제목 없음')}</h3>
      <p class="customer">고객 : ${escapeHtml(maskName(review.userName || '익명'))}</p>
            <div class="detail-meta">
                <span class="date">작성일: ${formatDate(review.createdAt)}</span>
        <span class="item">아이템: ${escapeHtml(review.itemName || '정보 없음')}</span>
            </div>
        `;
    }

  // 고객 리뷰 본문
    const customerReview = document.querySelector('.customer-review');
    if (customerReview) {
        customerReview.textContent = review.content || '내용 없음';
    }

  // 리뷰 이미지
    if (review.imageUrl) {
        const reviewContentBox = document.querySelector('.review-content-box');
        if (reviewContentBox) {
            const existingImage = reviewContentBox.querySelector('.review-image');
      if (existingImage) existingImage.remove();
            const imageDiv = document.createElement('div');
            imageDiv.className = 'review-image';
            imageDiv.innerHTML = `<img src="${review.imageUrl}" alt="리뷰 이미지" style="max-width: 100%; border-radius: 8px; margin-top: 10px;">`;
            reviewContentBox.appendChild(imageDiv);
        }
    }

  // 판매자 답변 섹션
    const replySection = document.querySelector('.reply-section');
    const replyEditSection = document.querySelector('.reply-edit-section');
    const editReplyBtn = document.querySelector('.edit-reply-btn');
    const textarea = document.querySelector('.reply-textarea');

  if (hasReply) {
    const reply = review.replies[0]; // 최신 하나만 노출
        const sellerReply = document.querySelector('.seller-reply');
    if (sellerReply) sellerReply.textContent = reply.body || '';
    if (textarea) textarea.value = reply.body || '';
        if (replySection) replySection.style.display = 'block';
        if (editReplyBtn) {
            editReplyBtn.textContent = '답변 수정';
            editReplyBtn.style.display = 'block';
        }
    } else {
        if (replySection) replySection.style.display = 'none';
        if (textarea) textarea.value = '';
        if (editReplyBtn) {
            editReplyBtn.textContent = '답변 작성';
            editReplyBtn.style.display = 'block';
        }
    }

  if (replyEditSection) replyEditSection.style.display = 'none';
}

// ========== 필터 / 검색 ==========
function setupFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            filterReviews(currentFilter);
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('reviewSearch');
  if (!searchInput) return;
  searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            filterReviews(currentFilter, searchTerm);
        });
}

function filterReviews(filter, searchTerm = '') {
    const reviewItems = document.querySelectorAll('.review-item');
    
  reviewItems.forEach((item) => {
    const reviewId = Number(item.dataset.reviewId);
    const review = reviewData.find((r) => r.reviewId === reviewId);
        if (!review) return;
        
        let shouldShow = true;
        const hasReply = review.replies && review.replies.length > 0;
        const status = hasReply ? 'completed' : 'pending';

        if (filter !== 'all') {
      if (filter === 'pending') shouldShow = status === 'pending';
      else if (filter === 'completed') shouldShow = status === 'completed';
      else if (filter === 'high-rating') shouldShow = (review.rating || 0) >= 4.5;
      else if (filter === 'low-rating') shouldShow = (review.rating || 0) < 4.5;
    }

        if (searchTerm && shouldShow) {
      const hay = [
        review.title || '',
        review.content || '',
        review.userName || '',
        review.itemName || ''
      ].join(' ').toLowerCase();
      shouldShow = hay.includes(searchTerm);
    }

        item.style.display = shouldShow ? 'block' : 'none';
    });

  const visible = Array.from(reviewItems).some((el) => el.style.display !== 'none');
  if (!visible) showNoResultsMessage(); else hideNoResultsMessage();
}

// ========== 통계 ==========
function updateStats() {
    const totalReviews = reviewData.length;
  const pendingReplies = reviewData.filter((r) => !r.replies || r.replies.length === 0).length;
  const completedReplies = totalReviews - pendingReplies;
    
    let averageRating = 0;
    if (totalReviews > 0) {
        const totalRating = reviewData.reduce((sum, r) => sum + (r.rating || 0), 0);
        averageRating = (totalRating / totalReviews).toFixed(1);
    }

    const totalElement = document.querySelector('.stats-cards .stat-card:nth-child(1) h3');
    const pendingElement = document.querySelector('.stats-cards .stat-card:nth-child(2) h3');
    const completedElement = document.querySelector('.stats-cards .stat-card:nth-child(3) h3');
    const averageElement = document.querySelector('.stats-cards .stat-card:nth-child(4) h3');

    if (totalElement) totalElement.textContent = totalReviews;
    if (pendingElement) pendingElement.textContent = pendingReplies;
    if (completedElement) completedElement.textContent = completedReplies;
    if (averageElement) averageElement.textContent = averageRating;
}

// ========== 답글 UI 토글 ==========
function showReplyEditSection() {
    const replySection = document.querySelector('.reply-section');
    const replyEditSection = document.querySelector('.reply-edit-section');
    const editReplyBtn = document.querySelector('.edit-reply-btn');
    
  if (replyEditSection) replyEditSection.style.display = 'block';
  if (replySection) replySection.style.display = 'none';
  if (editReplyBtn) editReplyBtn.style.display = 'none';

    const textarea = document.querySelector('.reply-textarea');
  if (textarea) textarea.focus();
}

function hideReplyEditSection() {
  const replySection = document.querySelector('.reply-section');
    const replyEditSection = document.querySelector('.reply-edit-section');
    const editReplyBtn = document.querySelector('.edit-reply-btn');
    
  if (replyEditSection) replyEditSection.style.display = 'none';
  if (replySection) replySection.style.display = 'block';
  if (editReplyBtn) editReplyBtn.style.display = 'block';
}

// ========== 답글 저장 (단일 버전) ==========
async function saveReply() {
    const textarea = document.querySelector('.reply-textarea');
  const replyText = (textarea?.value || '').trim();

    if (!replyText) {
        alert('답변을 입력해주세요.');
        return;
    }
    if (!selectedReview) {
        alert('리뷰를 선택해주세요.');
        return;
    }

    try {
    const hasReply = Array.isArray(selectedReview.replies) && selectedReview.replies.length > 0;
        
        if (hasReply) {
            const replyId = selectedReview.replies[0].replyId;
      await ReviewAPI.updateReply(replyId, replyText, true);
        } else {
            await ReviewAPI.createReply(selectedReview.reviewId, currentCompanyId, replyText, true);
        }

        showSuccessMessage('답변이 저장되었습니다.');

    // 최신 답글 재조회 → 상태 동기화
    const replies = await ReviewAPI.getRepliesByReview(selectedReview.reviewId);
    selectedReview.replies = Array.isArray(replies) ? replies : [];
    const idx = reviewData.findIndex((r) => r.reviewId === selectedReview.reviewId);
    if (idx !== -1) reviewData[idx].replies = selectedReview.replies;

    // UI 갱신
    renderReviewList(reviewData);
    const selectedItem = document.querySelector(`[data-review-id="${selectedReview.reviewId}"]`);
    if (selectedItem) selectedItem.classList.add('selected');
    updateReviewDetail(selectedReview);
        hideReplyEditSection();
        updateStats();
    } catch (error) {
        console.error('Failed to save reply:', error);
    alert('답변 저장에 실패했습니다: ' + (error.message || 'unknown'));
  }
}

// ========== 답글 버튼 이벤트 ==========
function setupReplyButtons() {
  const editReplyBtn = document.querySelector('.edit-reply-btn');
  if (editReplyBtn) {
    editReplyBtn.addEventListener('click', () => {
      if (!selectedReview) { alert('리뷰를 선택해주세요.'); return; }
      showReplyEditSection();
    });
  }

  const cancelBtn = document.querySelector('.cancel-btn');
  if (cancelBtn) cancelBtn.addEventListener('click', hideReplyEditSection);

  const saveBtn = document.querySelector('.save-btn');
  if (saveBtn) saveBtn.addEventListener('click', saveReply);
}

// ========== 기타 동작(선택) ==========
async function deleteReply(replyId, reviewId) {
  if (!confirm('정말로 이 답글을 삭제하시겠습니까?')) return;
  try {
    await ReviewAPI.deleteReply(replyId);
    showSuccessMessage('답글이 삭제되었습니다.');
    await loadRepliesForReview(reviewId);
  } catch (e) {
    console.error('답글 삭제 실패:', e);
    alert('답글 삭제에 실패했습니다.');
  }
}

async function toggleReplyVisibility(replyId, reviewId) {
  try {
    await ReviewAPI.toggleReplyVisibility(replyId);
    showSuccessMessage('답글 공개 설정이 변경되었습니다.');
    await loadRepliesForReview(reviewId);
  } catch (e) {
    console.error('답글 공개 설정 변경 실패:', e);
    alert('답글 공개 설정 변경에 실패했습니다.');
  }
}

async function loadRepliesForReview(reviewId) {
  try {
    const replies = await ReviewAPI.getRepliesByReview(reviewId);
    const idx = reviewData.findIndex((r) => r.reviewId === Number(reviewId));
    if (idx !== -1) reviewData[idx].replies = Array.isArray(replies) ? replies : [];

    if (selectedReview && selectedReview.reviewId === Number(reviewId)) {
      selectedReview.replies = reviewData[idx].replies;
      updateReviewDetail(selectedReview);
    }

    renderReviewList(reviewData);
    const selectedItem = document.querySelector(`[data-review-id="${reviewId}"]`);
    if (selectedItem) selectedItem.classList.add('selected');
    updateStats();
  } catch (e) {
    console.error('답글 로드 실패:', e);
  }
}

// ========== 유틸 ==========
function generateStars(rating) {
  let stars = '';
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  for (let i = 0; i < full; i++) stars += '<i class="fas fa-star"></i>';
  if (half) stars += '<i class="fas fa-star-half-alt"></i>';
  const empty = 5 - Math.ceil(rating);
  for (let i = 0; i < empty; i++) stars += '<i class="far fa-star"></i>';
    return stars;
}

function maskName(name) {
    if (!name || name.length < 2) return name;
    return name[0] + '*'.repeat(name.length - 1);
}

function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// ========== 메시지/스타일 ==========
function showNoReviewsMessage() {
  const detail = document.querySelector('.review-detail');
  if (detail) detail.innerHTML = '<div class="empty-message">아직 작성된 리뷰가 없습니다.</div>';
}

function showErrorMessage(message) {
  const list = document.querySelector('.review-list');
  if (list) list.innerHTML = `<div class="error-message">${escapeHtml(message)}</div>`;
}

function showNoResultsMessage() {
  let el = document.querySelector('.no-results-message');
  if (!el) {
    el = document.createElement('div');
    el.className = 'no-results-message';
    el.style.cssText = `
      text-align:center; padding:40px; color:#7f8c8d; font-size:16px;
    `;
    el.textContent = '검색 조건에 맞는 리뷰가 없습니다.';
    const list = document.querySelector('.review-list');
    if (list) list.appendChild(el);
  }
  el.style.display = 'block';
}

function hideNoResultsMessage() {
  const el = document.querySelector('.no-results-message');
  if (el) el.style.display = 'none';
}

function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
    position: fixed; top: 20px; right: 20px; background: #27ae60; color: white;
    padding: 12px 20px; border-radius: 6px; font-size: 14px; z-index: 1000;
    animation: slideIn 0.3s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => document.body.contains(toast) && document.body.removeChild(toast), 300);
    }, 3000);

if (!document.head.querySelector('style[data-review-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-review-animations', 'true');
    style.textContent = `
      @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
      .empty-message, .error-message { text-align:center; padding:40px; color:#7f8c8d; font-size:16px; }
      .error-message { color:#e74c3c; }
    `;
    document.head.appendChild(style);
}
}

// 데이터 출처 배너 (api/dummy/빈배열 확인용)
function showDataSourceBanner(text) {
  let el = document.getElementById('data-source-banner');
  if (!el) {
    el = document.createElement('div');
    el.id = 'data-source-banner';
    el.style.cssText = `
      position: fixed; bottom: 10px; right: 10px; z-index: 1000;
      background: rgba(0,0,0,0.7); color: #fff; padding: 6px 10px; border-radius: 4px;
      font-size: 12px; pointer-events: none;
    `;
    document.body.appendChild(el);
  }
  el.textContent = text;
}

// ========== 테스트 데이터 (폴백) ==========
function loadTestData() {
    reviewData = [
        {
      reviewId: 3, userId: 2, itemId: 1, bookingId: 4, rating: 4,
      title: '탱글탱글', content: '탱글탱글한 피부가 되었어요 ㅎㅎ',
      imageUrl: '/review/3/image', imageMime: 'image/png', isPublic: true,
      createdAt: '2025-10-17T18:44:11', updatedAt: '2025-10-17T19:23:41',
      itemName: '힙필러 시술', userName: '테스트 사용자', replies: []
    },
    {
      reviewId: 4, userId: 2, itemId: 1, bookingId: 6, rating: 5,
      title: '좋아요', content: '좋더라구요',
      imageUrl: '/review/4/image', imageMime: 'image/jpeg', isPublic: true,
      createdAt: '2025-10-17T19:25:31', updatedAt: '2025-10-17T19:25:31',
      itemName: '힙필러 시술', userName: '테스트 사용자', replies: []
    }
  ];

    renderReviewList(reviewData);
  if (reviewData.length > 0) selectReview(reviewData[0]);
}
