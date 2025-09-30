// notice.js

document.addEventListener('DOMContentLoaded', function() {
    // 공지사항 상세 페이지로 이동하는 클릭 이벤트 리스너를 바인딩합니다.
    document.querySelectorAll('.notice-table-row').forEach(function(row) {
        row.style.cursor = 'pointer'; // 마우스를 올리면 포인터 모양으로 변경
        row.addEventListener('click', function() {
            // Thymeleaf가 설정한 data-id 속성에서 ID를 가져옵니다.
            const id = row.getAttribute('data-id');
            // '/notice/{id}' 형식의 URL로 이동합니다.
            window.location.href = `/notice/${id}`;
        });
    });
});