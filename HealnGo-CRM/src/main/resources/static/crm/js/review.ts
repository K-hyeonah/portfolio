// 후기 페이지 TypeScript

// 후기 데이터 인터페이스
interface Review {
    id: number;
    number: string;
    title: string;
    date: string;
    clinic: string;
    category: string;
    image: string;
    hashtags: string[];
    beforeImage: string;
    afterImage: string;
    price: string;
    rating: number;
    reviewCount: number;
    comment?: string;
}

document.addEventListener('DOMContentLoaded', (): void => {
    // 후기 데이터 초기화
    initializeReviews();
    
    // 후기 선택 이벤트
    setupReviewSelection();
    
    // 페이지네이션 이벤트
    setupPagination();
    
    // 댓글 작성 이벤트
    setupCommentSubmission();
    
    // 별점 선택 이벤트
    setupStarRating();
});

// 후기 데이터 초기화
function initializeReviews(): void {
    const reviews: Review[] = [
        {
            id: 1,
            number: '0015',
            title: '자연스러운 기능 코 성형',
            date: 'Created Sep 12, 2020',
            clinic: '4월 31일 성형외과의원',
            category: '선크림 피부과',
            image: '/images/review1.jpg',
            hashtags: ['#코', '#코수술', '#코성형', '#콧대', '#콧볼', '#복코수술', '#매부리코', '#자려한코', '#예쁜콧대', '#자연스러움'],
            beforeImage: '/images/before1.jpg',
            afterImage: '/images/after1.jpg',
            price: '700,000원',
            rating: 4.8,
            reviewCount: 83,
        },
        {
            id: 2,
            number: '0014',
            title: '완벽한 눈 성형 후기',
            date: 'Created Sep 10, 2020',
            clinic: '강남 성형외과',
            category: '성형외과',
            image: '/images/review2.jpg',
            hashtags: ['#눈', '#눈성형', '#쌍꺼풀', '#눈매교정', '#자연스러움'],
            beforeImage: '/images/before2.jpg',
            afterImage: '/images/after2.jpg',
            price: '1,200,000원',
            rating: 4.9,
            reviewCount: 156,
        },
        {
            id: 3,
            number: '0013',
            title: '자연스러운 보톡스 시술',
            date: 'Created Sep 8, 2020',
            clinic: '서울 피부과',
            category: '피부과',
            image: '/images/review3.jpg',
            hashtags: ['#보톡스', '#주름', '#안티에이징', '#자연스러움'],
            beforeImage: '/images/before3.jpg',
            afterImage: '/images/after3.jpg',
            price: '300,000원',
            rating: 4.7,
            reviewCount: 92,
        },
        {
            id: 4,
            number: '0012',
            title: '완벽한 치아 교정 후기',
            date: 'Created Sep 5, 2020',
            clinic: '부산 치과',
            category: '치과',
            image: '/images/review4.jpg',
            hashtags: ['#치아교정', '#치과', '#미소', '#자연스러움'],
            beforeImage: '/images/before4.jpg',
            afterImage: '/images/after4.jpg',
            price: '2,500,000원',
            rating: 4.8,
            reviewCount: 67,
        },
        {
            id: 5,
            number: '0011',
            title: '자연스러운 리프팅 시술',
            date: 'Created Sep 3, 2020',
            clinic: '강남 피부과',
            category: '피부과',
            image: '/images/review5.jpg',
            hashtags: ['#리프팅', '#주름', '#안티에이징', '#자연스러움'],
            beforeImage: '/images/before5.jpg',
            afterImage: '/images/after5.jpg',
            price: '800,000원',
            rating: 4.6,
            reviewCount: 45,
        }
    ];
    
    renderReviewList(reviews);
    selectReview(reviews[0]); // 첫 번째 후기 선택
}

// 후기 목록 렌더링
function renderReviewList(reviews: Review[]): void {
    const container = document.querySelector('.review-list-section') as HTMLElement | null;
    if (!container) return;
    
    const listContainer = container.querySelector('.review-list') as HTMLElement || createReviewListContainer(container);
    
    let html = '';
    reviews.forEach(review => {
        html += createReviewItem(review);
    });
    
    listContainer.innerHTML = html;
    
    // 페이지네이션 추가
    addPagination(container);
}

// 후기 목록 컨테이너 생성
function createReviewListContainer(container: HTMLElement): HTMLElement {
    const listContainer = document.createElement('div');
    listContainer.className = 'review-list';
    container.appendChild(listContainer);
    return listContainer;
}

// 후기 아이템 생성
function createReviewItem(review: Review): string {
    return `
        <div class="review-item" data-review-id="${review.id}">
            <div class="review-icon">${review.number}</div>
            <div class="review-content">
                <div class="review-number">${review.number}</div>
                <div class="review-title">${review.title}</div>
                <div class="review-date">${review.date}</div>
                <div class="review-clinic">${review.clinic}</div>
            </div>
        </div>
    `;
}

// 후기 선택 이벤트
function setupReviewSelection(): void {
    document.addEventListener('click', (e: MouseEvent): void => {
        const target = e.target as HTMLElement;
        const reviewItem = target.closest('.review-item') as HTMLElement | null;
        if (reviewItem) {
            const reviewId = parseInt(reviewItem.dataset.reviewId || '0');
            selectReviewById(reviewId);
        }
    });
}

// ID로 후기 선택
function selectReviewById(reviewId: number): void {
    const reviews = getSampleReviews();
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
        selectReview(review);
    }
}

// 후기 선택
function selectReview(review: Review): void {
    // 모든 후기 아이템에서 active 클래스 제거
    document.querySelectorAll('.review-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 선택된 후기 아이템에 active 클래스 추가
    const selectedItem = document.querySelector(`[data-review-id="${review.id}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
    
    // 후기 상세 정보 렌더링
    renderReviewDetail(review);
}

// 후기 상세 정보 렌더링
function renderReviewDetail(review: Review): void {
    const detailSection = document.querySelector('.review-detail-section') as HTMLElement | null;
    if (!detailSection) return;
    
    const imageContainer = detailSection.querySelector('.review-detail-image') as HTMLElement | null;
    const contentContainer = detailSection.querySelector('.review-detail-content') as HTMLElement | null;
    
    if (imageContainer) {
        imageContainer.innerHTML = `
            <img src="${review.image}" alt="${review.title}" onerror="this.style.display='none'">
        `;
    }
    
    if (contentContainer) {
        contentContainer.innerHTML = `
            <h2 class="review-detail-title">${review.title}</h2>
            
            <div class="review-hashtags">
                ${review.hashtags.map(tag => `<span class="hashtag">${tag}</span>`).join('')}
            </div>
            
            <div class="review-before-after">
                <div class="before-after-item">
                    <div class="before-after-image">
                        <input type="file" id="beforeImage" accept="image/*" style="display: none;" onchange="handleBeforeImage(this)">
                        <div class="image-placeholder" onclick="document.getElementById('beforeImage').click()">
                            <i class="fas fa-camera"></i>
                            <span>시술 전 사진</span>
                        </div>
                        <img id="beforePreview" style="display: none; width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                    </div>
                    <div class="before-after-label">Before</div>
                </div>
                <div class="before-after-item">
                    <div class="before-after-image">
                        <input type="file" id="afterImage" accept="image/*" style="display: none;" onchange="handleAfterImage(this)">
                        <div class="image-placeholder" onclick="document.getElementById('afterImage').click()">
                            <i class="fas fa-camera"></i>
                            <span>시술 후 사진</span>
                        </div>
                        <img id="afterPreview" style="display: none; width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                    </div>
                    <div class="before-after-label">After</div>
                </div>
            </div>
            
            <div class="review-price-rating">
                <div class="review-price">${review.price}</div>
                <div class="review-rating">
                    <div class="stars">${'★'.repeat(Math.floor(review.rating))}${'☆'.repeat(5 - Math.floor(review.rating))}</div>
                    <span class="rating-text">${review.rating} (${review.reviewCount})</span>
                </div>
            </div>
            
            <div class="review-comment-section">
                <div class="comment-question">어떠셨나요?</div>
                <textarea class="comment-input" placeholder="댓글을 작성해주세요..."></textarea>
                <button class="register-btn" onclick="submitComment()">등록</button>
            </div>
        `;
    }
}

// 샘플 후기 데이터
function getSampleReviews(): Review[] {
    return [
        {
            id: 1,
            number: '0015',
            title: '자연스러운 기능 코 성형',
            date: 'Created Sep 12, 2020',
            clinic: '4월 31일 성형외과의원',
            category: '선크림 피부과',
            image: '/images/review1.jpg',
            hashtags: ['#코', '#코수술', '#코성형', '#콧대', '#콧볼', '#복코수술', '#매부리코', '#자려한코', '#예쁜콧대', '#자연스러움'],
            beforeImage: '/images/before1.jpg',
            afterImage: '/images/after1.jpg',
            price: '700,000원',
            rating: 4.8,
            reviewCount: 83,
            comment: '너무 친절했고 잘 됐어요 감사합니다~'
        },
        {
            id: 2,
            number: '0014',
            title: '완벽한 눈 성형 후기',
            date: 'Created Sep 10, 2020',
            clinic: '강남 성형외과',
            category: '성형외과',
            image: '/images/review2.jpg',
            hashtags: ['#눈', '#눈성형', '#쌍꺼풀', '#눈매교정', '#자연스러움'],
            beforeImage: '/images/before2.jpg',
            afterImage: '/images/after2.jpg',
            price: '1,200,000원',
            rating: 4.9,
            reviewCount: 156,
            comment: '정말 만족스러운 결과입니다!'
        },
        {
            id: 3,
            number: '0013',
            title: '자연스러운 보톡스 시술',
            date: 'Created Sep 8, 2020',
            clinic: '서울 피부과',
            category: '피부과',
            image: '/images/review3.jpg',
            hashtags: ['#보톡스', '#주름', '#안티에이징', '#자연스러움'],
            beforeImage: '/images/before3.jpg',
            afterImage: '/images/after3.jpg',
            price: '300,000원',
            rating: 4.7,
            reviewCount: 92,
            comment: '부작용 없이 깔끔하게 끝났어요.'
        },
        {
            id: 4,
            number: '0012',
            title: '완벽한 치아 교정 후기',
            date: 'Created Sep 5, 2020',
            clinic: '부산 치과',
            category: '치과',
            image: '/images/review4.jpg',
            hashtags: ['#치아교정', '#치과', '#미소', '#자연스러움'],
            beforeImage: '/images/before4.jpg',
            afterImage: '/images/after4.jpg',
            price: '2,500,000원',
            rating: 4.8,
            reviewCount: 67,
            comment: '교정 과정이 힘들었지만 결과가 만족스러워요.'
        },
        {
            id: 5,
            number: '0011',
            title: '자연스러운 리프팅 시술',
            date: 'Created Sep 3, 2020',
            clinic: '강남 피부과',
            category: '피부과',
            image: '/images/review5.jpg',
            hashtags: ['#리프팅', '#주름', '#안티에이징', '#자연스러움'],
            beforeImage: '/images/before5.jpg',
            afterImage: '/images/after5.jpg',
            price: '800,000원',
            rating: 4.6,
            reviewCount: 45,
            comment: '나이에 맞는 자연스러운 결과가 나왔어요.'
        }
    ];
}

// 페이지네이션 추가
function addPagination(container: HTMLElement): void {
    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    pagination.innerHTML = `
        <button onclick="goToPage(1)" class="active">1</button>
        <button onclick="goToPage(2)">2</button>
        <button onclick="goToPage(3)">3</button>
        <button onclick="goToPage(4)">4</button>
        <button onclick="goToPage(5)">5</button>
        <button onclick="nextPage()">></button>
        <button onclick="lastPage()">>></button>
    `;
    container.appendChild(pagination);
}

// 페이지네이션 이벤트
function setupPagination(): void {
    // 페이지네이션 이벤트는 HTML에서 onclick으로 처리
}

// 페이지 이동
function goToPage(page: number): void {
    // 모든 페이지 버튼에서 active 클래스 제거
    document.querySelectorAll('.pagination button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 선택된 페이지 버튼에 active 클래스 추가
    const targetButton = event?.target as HTMLButtonElement;
    if (targetButton) {
        targetButton.classList.add('active');
    }
    
    console.log(`페이지 ${page}로 이동`);
    // 여기서 실제 페이지 로딩 로직을 구현할 수 있습니다
}

// 다음 페이지
function nextPage(): void {
    const currentPage = document.querySelector('.pagination button.active') as HTMLButtonElement | null;
    const nextButton = currentPage?.nextElementSibling as HTMLButtonElement | null;
    if (nextButton && !nextButton.disabled) {
        nextButton.click();
    }
}

// 마지막 페이지
function lastPage(): void {
    const allButtons = document.querySelectorAll('.pagination button');
    const lastButton = allButtons[allButtons.length - 1] as HTMLButtonElement | null;
    if (lastButton) {
        lastButton.click();
    }
}

// 댓글 작성 이벤트
function setupCommentSubmission(): void {
    // 댓글 작성 이벤트는 HTML에서 onclick으로 처리
}

// 댓글 제출
function submitComment(): void {
    const commentInput = document.querySelector('.comment-input') as HTMLTextAreaElement | null;
    if (!commentInput) return;
    
    const comment = commentInput.value.trim();
    
    if (comment) {
        // 댓글 추가 로직
        const commentText = document.querySelector('.comment-text') as HTMLElement | null;
        if (commentText) {
            commentText.textContent = comment;
        }
        
        // 입력창 초기화
        commentInput.value = '';
        
        alert('댓글이 등록되었습니다!');
    } else {
        alert('댓글을 입력해주세요.');
    }
}

// 별점 선택 기능 설정
function setupStarRating(): void {
    // 별점 클릭 이벤트
    document.addEventListener('click', (e: MouseEvent): void => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('star-rating')) {
            const rating = parseInt(target.dataset.rating || '0');
            const container = target.closest('.star-container') as HTMLElement | null;
            if (container) {
                updateStarDisplay(container, rating);
                updateRatingValue(container, rating);
            }
        }
    });
    
    // 별점 호버 이벤트
    document.addEventListener('mouseover', (e: MouseEvent): void => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('star-rating')) {
            const rating = parseInt(target.dataset.rating || '0');
            const container = target.closest('.star-container') as HTMLElement | null;
            if (container) {
                highlightStars(container, rating);
            }
        }
    });
    
    // 별점 호버 아웃 이벤트
    document.addEventListener('mouseout', (e: MouseEvent): void => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('star-rating')) {
            const container = target.closest('.star-container') as HTMLElement | null;
            if (container) {
                const currentRating = getCurrentRating(container);
                updateStarDisplay(container, currentRating);
            }
        }
    });
}

// 별점 표시 업데이트
function updateStarDisplay(container: HTMLElement, rating: number): void {
    const stars = container.querySelectorAll('.star-rating');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// 별점 하이라이트 (호버 시)
function highlightStars(container: HTMLElement, rating: number): void {
    const stars = container.querySelectorAll('.star-rating');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('highlight');
        } else {
            star.classList.remove('highlight');
        }
    });
}

// 현재 별점 값 가져오기
function getCurrentRating(container: HTMLElement): number {
    const activeStars = container.querySelectorAll('.star-rating.active');
    return activeStars.length;
}

// 별점 값 업데이트
function updateRatingValue(container: HTMLElement, rating: number): void {
    const hiddenInput = container.querySelector('input[type="hidden"]') as HTMLInputElement | null;
    if (hiddenInput) {
        hiddenInput.value = rating.toString();
    }
    
    // 별점 텍스트 업데이트
    const ratingText = container.querySelector('.rating-text') as HTMLElement | null;
    if (ratingText) {
        ratingText.textContent = `${rating}점`;
    }
    
    console.log(`별점 선택: ${rating}점`);
}

// 별점 초기화
function resetStarRating(container: HTMLElement): void {
    const stars = container.querySelectorAll('.star-rating');
    stars.forEach(star => {
        star.classList.remove('active', 'highlight');
    });
    
    const hiddenInput = container.querySelector('input[type="hidden"]') as HTMLInputElement | null;
    if (hiddenInput) {
        hiddenInput.value = '0';
    }
    
    const ratingText = container.querySelector('.rating-text') as HTMLElement | null;
    if (ratingText) {
        ratingText.textContent = '별점을 선택해주세요';
    }
}

// 별점 평가 제출
function submitRating(): void {
    const starContainer = document.querySelector('.star-container') as HTMLElement | null;
    if (!starContainer) return;
    
    const rating = getCurrentRating(starContainer);
    
    if (rating === 0) {
        alert('별점을 선택해주세요.');
        return;
    }
    
    // 평가 제출 처리
    console.log(`평가 제출: ${rating}점`);
    alert(`${rating}점으로 평가가 제출되었습니다!`);
    
    // 평가 제출 후 초기화
    resetStarRating(starContainer);
}

// Before 이미지 처리
function handleBeforeImage(input: HTMLInputElement): void {
    const file = input.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>): void => {
            const preview = document.getElementById('beforePreview') as HTMLImageElement | null;
            const placeholder = input.parentElement?.querySelector('.image-placeholder') as HTMLElement | null;
            
            if (preview && e.target?.result) {
                preview.src = e.target.result as string;
                preview.style.display = 'block';
            }
            
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    }
}

// After 이미지 처리
function handleAfterImage(input: HTMLInputElement): void {
    const file = input.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>): void => {
            const preview = document.getElementById('afterPreview') as HTMLImageElement | null;
            const placeholder = input.parentElement?.querySelector('.image-placeholder') as HTMLElement | null;
            
            if (preview && e.target?.result) {
                preview.src = e.target.result as string;
                preview.style.display = 'block';
            }
            
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    }
}

// 전역 함수로 노출 (HTML에서 호출하기 위해)
(window as any).goToPage = goToPage;
(window as any).nextPage = nextPage;
(window as any).lastPage = lastPage;
(window as any).submitComment = submitComment;
(window as any).submitRating = submitRating;
(window as any).handleBeforeImage = handleBeforeImage;
(window as any).handleAfterImage = handleAfterImage;

