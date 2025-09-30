// Header JavaScript 기능
document.addEventListener('DOMContentLoaded', function () {
    console.log('Header JavaScript 로드됨');

    // 로그인 여부 확인 (JSP 변수 전달)
    const isLoggedIn = <%= (loginUser != null) ? "true" : "false" %>;

    // 헤더 생성 함수
    function createHeader() {
        const header = document.createElement('header');
        header.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 0;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;

        header.innerHTML = `
            <div style="max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center;">
                <a href="/" style="font-size: 1.8rem; font-weight: bold; text-decoration: none; color: white;">
                    <i class="fas fa-code"></i> ApiRound
                </a>
                <nav>
                    <ul style="display: flex; list-style: none; margin: 0; padding: 0; gap: 2rem;">
                        <li><a href="/" style="color: white; text-decoration: none; font-weight: 500;">홈</a></li>
                        <li><a href="/category" style="color: white; text-decoration: none; font-weight: 500;">카테고리</a></li>
                        <li><a href="/cities" style="color: white; text-decoration: none; font-weight: 500;">도시별</a></li>
                        <li><a href="/companies" style="color: white; text-decoration: none; font-weight: 500;">업체</a></li>
                        <li>
                            <a href="#" id="favorite-link" style="color: white; text-decoration: none; font-weight: 500;">
                                <i class="fa-solid fa-heart"></i> 찜
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        `;

        return header;
    }

    // 메인 콘텐츠 생성 함수
    function createMainContent() {
        const main = document.createElement('main');
        main.style.cssText = `
            margin-top: 80px;
            padding: 2rem;
        `;

        main.innerHTML = `
            <div style="max-width: 1200px; margin: 0 auto;">
                <h1 style="color: #333; margin-bottom: 1rem;">ApiRound에 오신 것을 환영합니다!</h1>
                <p style="color: #666; font-size: 1.1rem; margin-bottom: 2rem;">건강과 웰니스 서비스를 찾아보세요.</p>
                <div style="margin-top: 2rem;">
                    <iframe src="main.jsp" width="100%" height="500" frameborder="0"></iframe>
                </div>
            </div>
        `;

        return main;
    }

    // 페이지에 헤더와 메인 콘텐츠 추가
    const body = document.body;
    body.innerHTML = '';

    // Font Awesome 아이콘 추가
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(fontAwesome);

    // 헤더 추가
    body.appendChild(createHeader());

    // 메인 콘텐츠 추가
    body.appendChild(createMainContent());

    // 스크롤 효과 추가
    window.addEventListener('scroll', function () {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(102, 126, 234, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                header.style.backdropFilter = 'none';
            }
        }
    });

    console.log('헤더와 메인 콘텐츠가 JavaScript로 생성되었습니다!');

    // ⭐ 찜 아이콘 클릭 시 로그인 여부에 따라 동작
    document.addEventListener('click', function (e) {
        const target = e.target.closest('#favorite-link');
        if (target) {
            e.preventDefault();
            if (isLoggedIn) {
                window.location.href = '/favorite'; // 로그인 유저 찜 페이지
            } else {
                window.location.href = '/guest-favorite'; // 비로그인 찜 페이지
            }
        }
    });
});