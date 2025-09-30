// 더미 데이터 30개 생성
window.faqData = Array.from({length: 30}, (_, i) => ({
  id: i+1,
  number: (i+1).toString().padStart(3, '0'),
  title: `FAQ 질문 ${i+1}`,
  author: `작성자${(i%3)+1}`,
  date: '2025-07-07'
}));

function renderFaqTablePaged(list, page=1, perPage=10) {
  const startIdx = (page-1)*perPage;
  const pageList = list.slice(startIdx, startIdx+perPage);
  const tbody = document.querySelector('.faq-table tbody');
  tbody.innerHTML = '';
  pageList.forEach(row => {
    tbody.innerHTML += `<tr class="faq-table-row" data-id="${row.id}">
      <td>${row.number}</td>
      <td>${row.title}</td>
      <td>${row.author}</td>
      <td>${row.date}</td>
    </tr>`;
  });
  renderFaqPagination(list.length, page, perPage);
  // 클릭 이벤트 재바인딩
  document.querySelectorAll('.faq-table-row').forEach(function(row) {
    row.style.cursor = 'pointer';
    row.addEventListener('click', function() {
      const id = row.getAttribute('data-id');
      window.location.href = `/faq/detail?n=${id}`;
    });
  });
}

function renderFaqPagination(total, page, perPage) {
  const pagDiv = document.querySelector('.faq-pagination');
  if (!pagDiv) return;
  const maxPage = 30;
  const groupSize = 10;
  const totalPages = maxPage;
  let html = '';
  const groupIdx = Math.floor((page - 1) / groupSize);
  const groupStart = groupIdx * groupSize + 1;
  const groupEnd = Math.min(groupStart + groupSize - 1, totalPages);
  if (groupStart > 1) {
    html += `<a href="#" class="page-prev-group" data-page="${groupStart - 1}">&lt;</a>`;
  }
  for (let i = groupStart; i <= groupEnd; i++) {
    html += `<a href="#" class="${i === page ? 'active' : ''}" data-page="${i}">${i}</a>`;
  }
  if (groupEnd < totalPages) {
    html += `<a href="#" class="page-next-group" data-page="${groupEnd + 1}">&gt;</a>`;
  }
  pagDiv.innerHTML = html;
  pagDiv.className = 'faq-pagination';
  pagDiv.querySelectorAll('a[data-page]').forEach(a => {
    a.onclick = function(e) {
      e.preventDefault();
      renderFaqTablePaged(window.faqData, parseInt(this.dataset.page), perPage);
    };
  });
}

document.addEventListener('DOMContentLoaded', function() {
  renderFaqTablePaged(window.faqData, 1, 10);
});