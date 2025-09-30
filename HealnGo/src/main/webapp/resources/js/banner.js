// 카테고리 버튼 클릭 이벤트 처리
document.addEventListener('DOMContentLoaded', function() {
    // 카테고리 버튼 선택
    const categoryButtons = document.querySelectorAll('.btn-category');

    // 버튼 클릭 이벤트 설정
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 모든 버튼에서 active 클래스 제거
            categoryButtons.forEach(btn => btn.classList.remove('active'));

            // 클릭된 버튼에 active 클래스 추가
            this.classList.add('active');

            // 여기에 카테고리 변경 로직 추가
            // 예: 카테고리별 배너 표시 등
            const category = this.textContent.trim();
            console.log('선택된 카테고리:', category);

            // 실제 구현에서는 여기에 Ajax 호출이나 배너 전환 로직이 들어갑니다
        });
    });
});
