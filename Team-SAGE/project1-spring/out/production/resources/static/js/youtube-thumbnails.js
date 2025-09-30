// YouTube 썸네일 관련 함수들
function getYouTubeThumbnail(url) {
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return null;
}

function getYouTubeThumbnailMedium(url) {
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    return null;
}

function getYouTubeThumbnailHigh(url) {
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return null;
}

function extractYouTubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// 썸네일 로드 실패 시 대체 이미지 설정
function handleThumbnailError(img) {
    img.onerror = function() {
        // 고화질 썸네일이 없으면 중간 화질로 시도
        const currentSrc = this.src;
        if (currentSrc.includes('maxresdefault.jpg')) {
            this.src = currentSrc.replace('maxresdefault.jpg', 'mqdefault.jpg');
        } else if (currentSrc.includes('mqdefault.jpg')) {
            this.src = currentSrc.replace('mqdefault.jpg', 'hqdefault.jpg');
        } else {
            // 모든 썸네일이 실패하면 기본 이미지 사용
            this.src = '/img/default-youtube.jpg';
        }
    };
}

// 페이지 로드 시 YouTube 썸네일 적용
document.addEventListener('DOMContentLoaded', function() {
    // main.html의 YouTube 카드들에 썸네일 적용
    const youtubeCards = document.querySelectorAll('.pick-card-v3');
    youtubeCards.forEach((card, index) => {
        const link = card.getAttribute('onclick');
        if (link && link.includes('youtube.com')) {
            const urlMatch = link.match(/window\.open\('([^']+)'/);
            if (urlMatch) {
                const youtubeUrl = urlMatch[1];
                const img = card.querySelector('img');
                if (img) {
                    const thumbnailUrl = getYouTubeThumbnail(youtubeUrl);
                    if (thumbnailUrl) {
                        img.src = thumbnailUrl;
                        handleThumbnailError(img);
                    }
                }
            }
        }
    });

    // youtube.html의 YouTube 카드들에 썸네일 적용
    const youtubeUrls = [
        'https://www.youtube.com/watch?v=4zDk16TJUnk&t=1s',
        'https://www.youtube.com/watch?v=AJrCXjPT1Pg',
        'https://www.youtube.com/watch?v=-JWyAuNiEYI',
        'https://www.youtube.com/watch?v=R4CRmTIpwfU',
        'https://www.youtube.com/watch?v=m3tq71zsBSw',
        'https://www.youtube.com/watch?v=Ylr_s0CCTB0'
    ];

    const youtubeListCards = document.querySelectorAll('.youtube-card');
    youtubeListCards.forEach((card, index) => {
        if (index < youtubeUrls.length) {
            const img = card.querySelector('.youtube-thumb');
            if (img) {
                const thumbnailUrl = getYouTubeThumbnail(youtubeUrls[index]);
                if (thumbnailUrl) {
                    img.src = thumbnailUrl;
                    handleThumbnailError(img);
                }
            }
        }
    });
});

// 동적으로 YouTube 썸네일을 설정하는 함수
function setYouTubeThumbnail(element, youtubeUrl) {
    const thumbnailUrl = getYouTubeThumbnail(youtubeUrl);
    if (thumbnailUrl && element) {
        element.src = thumbnailUrl;
        handleThumbnailError(element);
        return true;
    }
    return false;
}
