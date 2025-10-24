// 카테고리 버튼 상호작용
document.addEventListener('DOMContentLoaded', function() {
    // 카테고리 버튼 선택
    const categoryButtons = document.querySelectorAll('.category-button');

    // 각 버튼에 마우스 오버/아웃 이벤트 추가
    categoryButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });

        // 클릭 시 효과 (선택적)
        button.addEventListener('click', function(e) {
            // 버튼이 링크로 작동하므로 필요한 경우 추가 로직 구현
            // 예: 분석 이벤트 발송
            console.log('카테고리 버튼 클릭:', this.querySelector('h3').textContent);
        });
    });
});
