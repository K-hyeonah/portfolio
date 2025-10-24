// ===== 상태 =====
  let currentThreadId = null;
  let threads = []; // 서버에서 받은 스레드 캐시
  let currentFilter = 'all'; // all, new, in-progress, completed
  let stompClient = null;

  // ===== 유틸 =====
  function fmtTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  function firstLetter(text) {
    return (text?.trim()?.[0] || '-');
  }

  // ===== WebSocket 연결 =====
  function connectWebSocket() {
    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    
    stompClient.connect({}, function(frame) {
      console.log('업체 WebSocket 연결됨: ' + frame);
      
      // 현재 스레드가 있으면 해당 스레드 구독
      if (currentThreadId) {
        subscribeToThread(currentThreadId);
      }
    }, function(error) {
      console.error('업체 WebSocket 연결 실패:', error);
    });
  }

  // 스레드 구독
  function subscribeToThread(threadId) {
    if (stompClient && stompClient.connected) {
      const destination = `/topic/chat/thread/${threadId}`;
      stompClient.subscribe(destination, function(message) {
        const messageData = JSON.parse(message.body);
        console.log('업체 실시간 메시지 수신:', messageData);
        
        // 메시지 목록 새로고침
        loadMessages(threadId);
      });
    }
  }

  // ===== 스레드 목록 =====
  async function loadThreads() {
    const companyId = window.CURRENT_COMPANY_ID;
    if (!companyId) return;

    const res = await fetch(`/api/chat/threads?companyId=${companyId}&page=1&size=50`, { credentials: 'same-origin' });
    if (!res.ok) { console.error('thread load failed'); return; }
    const page = await res.json(); // Spring Data Page<ChatThreadDto>
    threads = page.content || [];
    filterThreads(); // 필터 적용하여 렌더링
    
    // WebSocket 연결
    connectWebSocket();
  }

  async function renderThreadList(list) {
    const el = document.getElementById('threadList');
    if (!el) return;
    if (!list.length) {
      el.innerHTML = `<div style="padding:16px; color:#9aa1ad;">대화가 없습니다.</div>`;
      return;
    }
    
    // 각 스레드의 고객명 가져오기
    const threadsWithUserNames = await Promise.all(list.map(async (t) => {
      let customerName = '고객';
      
      if (t.userId) {
        try {
          const userRes = await fetch(`/api/user/${t.userId}`, { credentials: 'same-origin' });
          if (userRes.ok) {
            const user = await userRes.json();
            customerName = user.name || user.email || '고객';
          }
        } catch (e) {
          console.error('사용자 정보 로드 실패:', e);
        }
      }
      
      return { ...t, customerName };
    }));
    
    el.innerHTML = threadsWithUserNames.map(t => {
      const statusClass = (t.status || 'new').toLowerCase().replace('_', '-');
      const statusLabel = getStatusLabel(t.status);
      return `
        <div class="thread-item" data-thread-id="${t.threadId}" data-status="${statusClass}">
          <div class="thread-avatar">${firstLetter(t.customerName)}</div>
          <div class="thread-main">
            <div class="thread-title">${t.customerName}</div>
            <div class="thread-preview">${t.lastMessagePreview || ''}</div>
            <div class="inquiry-status">
              <span class="inquiry-status-badge ${statusClass}">${statusLabel}</span>
              ${t.unreadCount ? `<span class="inquiry-unread-count">${t.unreadCount > 99 ? '99+' : t.unreadCount}</span>` : ''}
            </div>
          </div>
          <div class="thread-right">
            <div class="thread-time">${t.lastMsgAt ? fmtTime(t.lastMsgAt) : ''}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  function getStatusLabel(status) {
    const statusMap = {
      'NEW': '신규',
      'IN_PROGRESS': '진행중',
      'COMPLETED': '완료'
    };
    return statusMap[status] || '신규';
  }

  function filterThreads() {
    const filtered = currentFilter === 'all' 
      ? threads 
      : threads.filter(t => {
          const status = (t.status || 'NEW').toLowerCase().replace('_', '-');
          return status === currentFilter;
        });
    renderThreadList(filtered);
  }

  // 스레드 클릭 핸들러
  document.addEventListener('click', (e) => {
    const item = e.target.closest('.thread-item');
    if (!item) return;
    document.querySelectorAll('.thread-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    const threadId = Number(item.dataset.threadId);
    const t = threads.find(x => x.threadId === threadId);
    onSelectThread(t);
  });

  async function onSelectThread(thread) {
    console.log('스레드 선택됨:', thread);
    currentThreadId = thread.threadId;
    
    // WebSocket 구독
    subscribeToThread(currentThreadId);
    
    // 사용자 정보 가져오기
    let userName = '고객';
    let userInfo = '';
    
    if (thread.userId) {
      try {
        console.log('사용자 정보 조회 시작:', thread.userId);
        // SocialUsers 정보 조회
        const userRes = await fetch(`/api/user/${thread.userId}`, { credentials: 'same-origin' });
        if (userRes.ok) {
          const user = await userRes.json();
          console.log('사용자 정보:', user);
          userName = user.name || user.email || '고객';
          userInfo = user.email ? `(${user.email})` : '';
        } else {
          console.error('사용자 정보 조회 실패:', userRes.status);
        }
      } catch (e) {
        console.error('사용자 정보 조회 오류:', e);
      }
    }
    
    // 헤더 표시
    const peerAvatar = document.getElementById('peerAvatar');
    const peerTitle = document.getElementById('peerTitle');
    const peerSub = document.getElementById('peerSub');
    
    if (peerAvatar) peerAvatar.textContent = firstLetter(userName);
    if (peerTitle) peerTitle.textContent = userName;
    if (peerSub) peerSub.textContent = `${thread.title || '상담'} ${userInfo}`;

    // 입력/버튼 활성화
    const btnSend = document.getElementById('btnSend');
    const inputMessage = document.getElementById('inputMessage');
    const btnMarkDone = document.getElementById('btnMarkDone');
    const btnReserve = document.getElementById('btnReserve');
    
    if (btnSend) btnSend.disabled = false;
    if (inputMessage) inputMessage.disabled = false;
    if (btnMarkDone) btnMarkDone.disabled = false;
    if (btnReserve) btnReserve.disabled = false;
    
    console.log('요소 활성화 완료, 메시지 로드 시작');
    
    // 빈 화면 힌트 숨기기
    const emptyHint = document.getElementById('emptyHint');
    if (emptyHint) {
      emptyHint.style.display = 'none';
      console.log('emptyHint 숨김');
    }

    // 메시지 가져오기
    await loadMessages(thread.threadId);
    console.log('메시지 로드 완료');
  }

  // ===== 메시지 =====
  async function loadMessages(threadId) {
    console.log('메시지 로드 시작:', threadId);
    const box = document.getElementById('messageList');
    
    if (!box) {
      console.error('messageList 요소를 찾을 수 없습니다');
      return;
    }
    
    box.innerHTML = '';
    
    try {
      const res = await fetch(`/api/chat/messages/${threadId}?page=1&size=50`, { credentials: 'same-origin' });
      console.log('메시지 API 응답:', res.status);
      
      if (!res.ok) { 
        const errorText = await res.text();
        console.error('메시지 로드 실패:', errorText);
        box.innerHTML = `<div class="inquiry-empty">메시지를 불러오지 못했습니다.</div>`; 
        return; 
      }
      
      const page = await res.json();
      console.log('메시지 페이지 데이터:', page);
      const list = page.content || [];
      console.log('메시지 목록:', list.length, '개');

      // 서버가 최신순(Desc)으로 준다면 UI는 시간순(Asc)로 보여주기 위해 뒤집기
      list.reverse();
      renderMessages(list);
    } catch (error) {
      console.error('메시지 로드 중 오류:', error);
      box.innerHTML = `<div class="inquiry-empty">메시지를 불러오는 중 오류가 발생했습니다.</div>`;
    }
  }

  function renderMessages(list) {
    const box = document.getElementById('messageList');
    if (!list.length) { box.innerHTML = `<div class="inquiry-empty">메시지가 없습니다. 첫 메시지를 보내보세요.</div>`; return; }

    box.innerHTML = '';
    let lastDate = '';
    list.forEach(m => {
      const d = new Date(m.createdAt);
      const dayStr = d.toLocaleDateString('ko-KR');
      if (dayStr !== lastDate) {
        lastDate = dayStr;
        box.insertAdjacentHTML('beforeend', `<div class="date-sep">${dayStr}</div>`);
      }
      const mine = (m.senderRole === 'COMPANY'); // 업체 화면: 업체 메시지는 오른쪽
      const who = mine ? '업체' : '고객';
      
      // 빈 메시지 처리
      const messageBody = m.body ? escapeHtml(m.body) : '<i style="color:#999;">메시지 없음</i>';
      
      box.insertAdjacentHTML('beforeend', `
        <div class="inquiry-chat-message ${mine ? 'user' : ''}">
          <div class="inquiry-chat-message-avatar">${mine ? '업' : '고'}</div>
          <div class="inquiry-chat-message-content">
            <div class="inquiry-chat-message-bubble">${messageBody}</div>
            <div class="inquiry-chat-message-time">${fmtTime(m.createdAt)}</div>
          </div>
        </div>
      `);
    });
    box.scrollTop = box.scrollHeight;
  }

  // ===== 전송 =====
  async function sendMessage() {
    const input = document.getElementById('inputMessage');
    const text = (input.value || '').trim();
    
    if (!currentThreadId) {
      alert('먼저 대화를 선택해주세요.');
      console.log('메시지 전송 조건 미충족: currentThreadId가 없음');
      return;
    }
    
    if (!text) {
      console.log('메시지 전송 조건 미충족: 메시지가 비어있음');
      return;
    }

    const payload = {
      threadId: currentThreadId,
      senderRole: 'COMPANY',                // 업체 화면 고정
      senderUserId: null,                   // 회사가 보냄 -> null
      senderCompanyId: window.CURRENT_COMPANY_ID,
      body: text
    };

    console.log('메시지 전송 시도:', payload);
    console.log('WebSocket 상태:', { stompClient: !!stompClient, connected: stompClient?.connected });

    try {
      // WebSocket을 통해 실시간 전송
      if (stompClient && stompClient.connected) {
        stompClient.send("/app/chat.send", {}, JSON.stringify(payload));
        console.log('업체 WebSocket으로 메시지 전송됨');
      } else {
        // WebSocket 연결이 없으면 기존 방식 사용
        console.log('WebSocket 미연결, HTTP 방식으로 전송');
        const headers = { 'Content-Type':'application/json' };
        if (window.CSRF_HEADER && window.CSRF_TOKEN) headers[window.CSRF_HEADER] = window.CSRF_TOKEN;

        const res = await fetch('/api/chat/send', {
          method: 'POST',
          headers,
          credentials: 'same-origin',
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('메시지 전송 실패:', errorText);
          alert('메시지 전송 실패');
          return;
        }
        console.log('업체 HTTP로 메시지 전송됨');
      }

      // 낙관적 UI 반영 (즉시 화면에 표시)
      const messagesContainer = document.getElementById('messageList');
      if (messagesContainer) {
        const messageElement = `
          <div class="inquiry-chat-message user">
            <div class="inquiry-chat-message-avatar">업</div>
            <div class="inquiry-chat-message-content">
              <div class="inquiry-chat-message-bubble">${escapeHtml(text)}</div>
              <div class="inquiry-chat-message-time">${fmtTime(new Date().toISOString())}</div>
            </div>
          </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }

      // 입력창 초기화
      input.value = '';
      input.style.height = 'auto';

      // 스레드 목록 새로고침
      await loadThreads();
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      alert('메시지 전송에 실패했습니다.');
    }
  }

  // 상담 완료 처리
  async function markAsDone() {
    if (!currentThreadId) return;
    if (!confirm('이 상담을 완료 처리하시겠습니까?')) return;

    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    if (window.CSRF_HEADER && window.CSRF_TOKEN) headers[window.CSRF_HEADER] = window.CSRF_TOKEN;

    const res = await fetch(`/api/chat/thread/${currentThreadId}/status?status=COMPLETED`, {
      method: 'POST',
      headers,
      credentials: 'same-origin'
    });

    if (res.ok) {
      alert('상담이 완료되었습니다.');
      // 스레드 목록 새로고침
      await loadThreads();
    } else {
      alert('상담 완료 처리에 실패했습니다.');
    }
  }

  // 버튼/입력 이벤트
  document.addEventListener('DOMContentLoaded', () => {
    // 초기에 스레드 로드
    loadThreads();

    const input = document.getElementById('inputMessage');
    const btn = document.getElementById('btnSend');
    const btnMarkDone = document.getElementById('btnMarkDone');
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    input.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 140) + 'px';
      
      // 입력값이 있으면 전송 버튼 활성화
      if (currentThreadId && this.value.trim()) {
        btn.disabled = false;
      } else {
        btn.disabled = true;
      }
    });
    btn.addEventListener('click', sendMessage);
    btnMarkDone.addEventListener('click', markAsDone);

    // 필터 탭 클릭 이벤트
    document.querySelectorAll('.inquiry-filter-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        // 활성 탭 변경
        document.querySelectorAll('.inquiry-filter-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        
        // 필터 적용
        currentFilter = e.target.dataset.filter;
        filterThreads();
      });
    });
  });

  // XSS 간단 이스케이프
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }