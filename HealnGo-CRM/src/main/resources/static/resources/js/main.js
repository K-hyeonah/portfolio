// API에서 데이터 로드
async function loadMainData() {
    try {
        // TOP3 업체 데이터 로드
        const companiesResponse = await fetch('/api/main/top-companies');
        const companies = await companiesResponse.json();
        renderTopCompanies(companies);

        // 커뮤니티 포스트 데이터 로드
        const postsResponse = await fetch('/api/main/community-posts');
        const posts = await postsResponse.json();
        renderCommunityPosts(posts);

    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
}

// TOP3 업체 렌더링
function renderTopCompanies(companies) {
    const container = document.getElementById('top-companies');
    container.innerHTML = '';

    companies.slice(0, 3).forEach((company, index) => {
        const companyCard = document.createElement('a');
        companyCard.className = 'company-card';
        companyCard.href = `/list?category=${company.category}&region=${company.region}&Id=${company.companyId}&name=${company.companyName}`;
        
        companyCard.innerHTML = `
            <div class="card-image">
                <img src="" alt="업체 이미지: ${company.companyName}" 
                     data-gquery="${company.companyName} ${company.subregion || company.region}" 
                     loading="lazy" 
                     onerror="this.onerror=null;this.src='/resources/images/dump.jpg';">
                <div class="card-badge">TOP ${index + 1}</div>
            </div>
            <div class="card-content">
                <h4 class="company-name">${company.companyName}</h4>
                <div class="company-details">
                    <span class="location">
                        <i class="fas fa-map-marker-alt"></i> 위치: ${company.subregion || company.region}
                    </span>
                </div>
                <span class="specialty-tag">전문분야: ${company.category}</span>
            </div>
        `;
        
        container.appendChild(companyCard);
    });
}

// 커뮤니티 포스트 렌더링
function renderCommunityPosts(posts) {
    const container = document.getElementById('community-posts');
    container.innerHTML = '';

    posts.slice(0, 5).forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'comment-card';
        
        const createDate = new Date(post.createAt).toLocaleDateString('ko-KR');
        
        postCard.innerHTML = `
            <div class="user">
                <img class="avatar" 
                     src="${post.profileImage || 'https://i.pravatar.cc/72?img=1'}" 
                     alt="프로필 이미지"
                     onerror="this.onerror=null;this.src='https://i.pravatar.cc/72?img=1';">
                <div class="meta">
                    <div class="nickname">${post.userId || '익명'}</div>
                    <div class="date">${createDate}</div>
                </div>
            </div>
            <div class="content">
                <span class="tag">${post.category}</span>
                <div class="text">${post.content}</div>
            </div>
            <div class="actions">
                <span><i class="far fa-thumbs-up"></i> ${post.likeCount || 0}</span>
            </div>
        `;
        
        container.appendChild(postCard);
    });
}

// YouTube 스크롤 기능
function scrollYouTube(direction) {
    const grid = document.getElementById('youtube-videos');
    const scrollAmount = 300;

    if (direction === 'left') {
        grid.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    } else {
        grid.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}

// YouTube 모달 열기
function openYouTubeModal(videoId) {
    const modal = document.getElementById('youtubeModal');
    const iframe = document.getElementById('youtubeIframe');

    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    modal.style.display = 'block';

    // 모달 외부 클릭 시 닫기
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeYouTubeModal();
        }
    };
}

// YouTube 모달 닫기
function closeYouTubeModal() {
    const modal = document.getElementById('youtubeModal');
    const iframe = document.getElementById('youtubeIframe');

    iframe.src = '';
    modal.style.display = 'none';
    // 스크롤 복원
    document.body.style.overflow = '';
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeYouTubeModal();
    }
});

// YouTube 버튼 이벤트
document.addEventListener('DOMContentLoaded', function() {
    // HTML include 초기화
    includeHTML();
    
    loadMainData();
    
    // YouTube 버튼 이벤트 리스너
    document.querySelectorAll('.youtube-button').forEach(button => {
        button.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video');
            openYouTubeModal(videoId);
        });
    });
});