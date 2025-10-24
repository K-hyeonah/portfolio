// 다국어 지원 JavaScript
let i18nMessages = {};

// 메시지 로드
async function loadMessages() {
    try {
        const response = await fetch('/api/i18n/messages');
        if (response.ok) {
            i18nMessages = await response.json();
        } else {
            // 기본 한국어 메시지
            i18nMessages = {
                'main.title': 'HealnGo',
                'main.subtitle': '의료 관광의 모든 것',
                'main.hero.title': '한국의 최고 의료 서비스를 경험하세요',
                'main.hero.subtitle': '전문의료진과 최첨단 시설에서 안전하고 효과적인 치료를 받으세요',
                'main.categories.title': '카테고리별 서비스',
                'main.categories.subtitle': '원하는 의료 서비스를 선택하세요',
                'main.popular.title': '인기 의료기관',
                'main.popular.subtitle': '많은 분들이 선택한 신뢰할 수 있는 의료기관들',
                'main.community.title': '커뮤니티',
                'main.community.subtitle': '다른 분들의 경험담을 확인해보세요',
                'main.youtube.title': '의료 관광 가이드',
                'main.youtube.subtitle': '유튜브에서 더 많은 정보를 확인하세요',
                'header.login': '로그인',
                'header.register': '회원가입',
                'header.language': '언어',
                'footer.company': '회사소개',
                'footer.service': '서비스',
                'footer.support': '고객지원',
                'footer.contact': '연락처'
            };
        }
    } catch (error) {
        console.error('메시지 로드 실패:', error);
    }
}

// 다국어 적용
function applyI18n() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (i18nMessages[key]) {
            element.textContent = i18nMessages[key];
        }
    });
    
    const titleElements = document.querySelectorAll('[data-i18n-title]');
    titleElements.forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        if (i18nMessages[key]) {
            element.title = i18nMessages[key];
        }
    });
}

// 언어 변경
function changeLanguage(lang) {
    // 언어 변경 로직 (서버에 요청)
    fetch(`/api/i18n/change?lang=${lang}`, {
        method: 'POST'
    }).then(() => {
        location.reload();
    });
}
