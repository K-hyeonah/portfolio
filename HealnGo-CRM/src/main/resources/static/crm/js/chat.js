// 채팅 페이지 JavaScript

// ===== 전역 변수 =====
let currentThreadId = null;
let conversations = [];
let stompClient = null;

// ===== 유틸리티 함수들 =====
// URL 파라미터에서 값 가져오기
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 로그인 상태 확인 함수
function isUserLoggedIn() {
    // 실제 로그인 상태 확인을 위해 서버 API 호출
    return fetch('/favorite/check-login', {
        method: 'GET',
        credentials: 'include' // 쿠키 포함
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return false;
        }
    })
    .then(data => {
        return data === true;
    })
    .catch(error => {
        console.error('로그인 상태 확인 실패:', error);
        return false;
    });
}

// 쿠키에서 값 가져오기
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// 세션 스토리지에서 값 가져오기
function getSessionStorage(name) {
    return sessionStorage.getItem(name);
}

// 자동으로 스레드 생성 (페이지 로드 시)
async function autoCreateThreadIfNeeded(companyId, companyName) {
    try {
        // 기존 스레드 확인
        const res = await fetch(`/api/chat/threads/user/${window.CURRENT_USER_ID}?page=1&size=30`);
        if (res.ok) {
            const page = await res.json();
            const threads = page.content || [];
            
            // 같은 업체와의 스레드가 있는지 확인
            const existingThread = threads.find(t => t.companyId == companyId);
            
            if (existingThread) {
                console.log('기존 스레드 발견:', existingThread.threadId);
                window.currentThreadId = existingThread.threadId;
                
                // 상담 완료 상태 확인
                if (existingThread.status === 'COMPLETED') {
                    const resumeConfirmed = confirm(`상담이 완료된 채팅입니다.\n\n"${companyName}"과의 상담을 재개하시겠습니까?`);
                    if (resumeConfirmed) {
                        // 상담 재개
                        try {
                            const statusRes = await fetch(`/api/chat/thread/${existingThread.threadId}/status?status=IN_PROGRESS`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                credentials: 'same-origin'
                            });
                            
                            if (statusRes.ok) {
                                console.log('상담이 재개되었습니다.');
                            }
                        } catch (error) {
                            console.error('상담 재개 실패:', error);
                        }
                    }
                }
                
                // 기존 대화 내용 로드 (chat.js의 함수 사용)
                if (typeof loadChatMessages === 'function') {
                    await loadChatMessages(existingThread.threadId);
                }
                
                // 정보 버튼 업데이트
                if (typeof updateActionBtnWithCompanyInfo === 'function') {
                    updateActionBtnWithCompanyInfo(existingThread.companyId, existingThread.title);
                }
                return;
            }
        }
        
        console.log('기존 스레드 없음. 새로 생성...');
        
        // 새 스레드 생성
        const headers = {
            'Content-Type': 'application/json'
        };
        
        const createRes = await fetch('/api/chat/threads/create', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                companyId: parseInt(companyId),
                title: `${companyName} 상담`,
                userId: window.CURRENT_USER_ID
            })
        });
        
        if (createRes.ok) {
            const result = await createRes.json();
            window.currentThreadId = result.threadId;
            console.log('새 스레드 생성 완료:', window.currentThreadId);
            
            // 정보 버튼 업데이트
            if (typeof updateActionBtnWithCompanyInfo === 'function') {
                updateActionBtnWithCompanyInfo(parseInt(companyId), companyName);
            }
            
            // 새 스레드는 메시지가 없으므로 빈 화면 표시
            const messagesContainer = document.querySelector('.chat-messages');
            if (messagesContainer) {
                messagesContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">메시지를 입력하여 상담을 시작하세요.</div>';
            }
        } else {
            const errorText = await createRes.text();
            console.error('스레드 생성 실패:', createRes.status, errorText);
        }
    } catch (error) {
        console.error('스레드 생성 중 오류:', error);
    }
}

// 대화 목록 새로고침
async function refreshConversationList() {
    try {
        const res = await fetch(`/api/chat/threads/user/${window.CURRENT_USER_ID}?page=1&size=30`);
        if (res.ok) {
            const page = await res.json();
            const threads = page.content || [];
            renderConversationsFromServer(threads);
        }
    } catch (e) {
        console.error('대화 목록 새로고침 실패:', e);
    }
}

// 서버에서 받은 스레드 목록으로 대화 목록 렌더링
function renderConversationsFromServer(threads) {
    const conversationsSection = document.querySelector('.conversations-section');
    if (!conversationsSection) return;
    
    if (threads.length === 0) {
        conversationsSection.innerHTML = '<div style="padding:16px; color:#9aa1ad;">대화가 없습니다.</div>';
        return;
    }
    
    const html = threads.map(t => {
        const name = t.title || `대화 #${t.threadId}`;
        const time = new Date(t.lastMsgAt).toLocaleString('ko-KR');
        const avatar = (name || 'U').charAt(0);
        
        return `
            <div class="conversation-item" data-conversation-id="${t.threadId}" data-company-id="${t.companyId}">
                <div class="conversation-avatar">${avatar}</div>
                <div class="conversation-info">
                    <div class="conversation-name">${name}</div>
                    <div class="conversation-last-message">${time}</div>
            </div>
                <div class="conversation-time">${time}</div>
        </div>
        `;
    }).join('');
    
    conversationsSection.innerHTML = html;
    console.log('서버 대화 목록 렌더링 완료:', threads.length + '개');
}

// 업체 정보 팝오버 표시
function showCompanyInfoPopover(companyInfo) {
    document.getElementById('popover-company-name').textContent = companyInfo.companyName || '업체명';
    document.getElementById('popover-company-address').textContent = companyInfo.address || '정보 없음';
    document.getElementById('popover-company-phone').textContent = companyInfo.phone || '정보 없음';
    document.getElementById('popover-company-email').textContent = companyInfo.email || '정보 없음';
    
    const popover = document.getElementById('company-info-popover');
    popover.style.display = 'block';
}

// 업체 정보 팝오버 닫기
function closeCompanyInfoPopover() {
    document.getElementById('company-info-popover').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', async function() {
    // 로그인 상태 확인
    const isLoggedIn = await isUserLoggedIn();
    if (!isLoggedIn) {
        alert('채팅을 이용하려면 로그인이 필요합니다.');
        window.location.href = '/login';
        return;
    }
    
    // hospital과 company 파라미터를 둘 다 지원
    const companyId = getUrlParameter('companyId') || getUrlParameter('hospitalId');
    const companyName = getUrlParameter('companyName') || getUrlParameter('hospitalName');
    const companyAddress = getUrlParameter('companyAddress') || getUrlParameter('hospitalAddress');
    const companyPhone = getUrlParameter('companyPhone') || getUrlParameter('hospitalPhone');
    
    console.log('파라미터 확인:', { companyId, companyName, companyAddress, companyPhone });
    
    if (companyId && companyName) {
        // list 페이지에서 넘어온 경우: 대화 목록 숨기고 직접 상담 시작
        document.querySelector('.chat-sidebar').style.display = 'none';

        // 업체 상담 시작 안내 표시
        document.getElementById('consultation-welcome').style.display = 'block';
        
        // 채팅 헤더에 업체 정보 표시
        document.getElementById('chat-title').textContent = companyName;
        document.getElementById('chat-members').textContent = (companyAddress && companyAddress !== 'null') ? companyAddress : '업체 상담';
        
        // chat-action-btn에 업체 정보 표시 (팝오버로)
        const actionBtn = document.querySelector('.chat-action-btn');
        if (actionBtn) {
            // 업체 정보로 팝오버 설정
            const companyInfo = {
                companyName: companyName,
                address: (companyAddress && companyAddress !== 'null') ? companyAddress : '정보 없음',
                phone: (companyPhone && companyPhone !== 'null') ? companyPhone : '정보 없음',
                email: '정보 없음' // list에서는 이메일 정보가 없음
            };
            
            // hover 시 팝오버 표시
            actionBtn.addEventListener('mouseenter', function() {
                showCompanyInfoPopover(companyInfo);
            });
            
            // 클릭 시에도 팝오버 표시
            actionBtn.addEventListener('click', function() {
                showCompanyInfoPopover(companyInfo);
            });
        }
        
        // URL 파라미터를 전역으로 저장
        window.chatCompanyId = companyId;
        window.chatCompanyName = companyName;
        
        console.log('새 상담 스레드 생성 시작...');
        
        // 자동으로 새 스레드 생성 (메시지 없이)
        await autoCreateThreadIfNeeded(companyId, companyName);
        
        // 입력창 활성화
        enableMessageInput();
        
        // 스레드 생성 후 대화 목록은 새로고침하지 않음 (사이드바 숨김)
    } else {
        // 마이페이지에서 넘어온 경우: 대화 목록 표시
        console.log('파라미터 없음. 기존 대화 목록 표시');
        document.getElementById('chat-title').textContent = '채팅';
        document.getElementById('chat-members').textContent = '대화 목록';
        
        // 입력창 비활성화 (대화 선택 전)
        disableMessageInput();
        
        // chat-action-btn 기본 설정
        const actionBtn = document.querySelector('.chat-action-btn');
        if (actionBtn) {
            actionBtn.title = '정보';
            actionBtn.onclick = function() {
                alert('대화를 선택하면 업체 정보를 확인할 수 있습니다.');
            };
        }
        
        // 기존 대화 목록 로드
        await refreshConversationList();
        
        // 대화 목록 초기화 (마이페이지에서 넘어온 경우)
    initializeConversations();
    }

    // 메시지 입력 이벤트
    setupMessageInput();
    
    // 대화 선택 이벤트
    setupConversationSelection();
    
    // 상세 정보 토글
    setupDetailsToggle();
    
    // 병원 정보 툴팁 설정
    setupHospitalInfoTooltip();
    
    // 팝오버 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
        const popover = document.getElementById('company-info-popover');
        const actionBtn = document.querySelector('.chat-action-btn');
        
        if (popover && popover.style.display === 'block' && 
            !popover.contains(e.target) && 
            !actionBtn.contains(e.target)) {
            closeCompanyInfoPopover();
        }
    });
});

// ===== 공통 =====
const CSRF_HEADER = document.querySelector('meta[name="_csrf_header"]')?.content;
const CSRF_TOKEN  = document.querySelector('meta[name="_csrf"]')?.content;

// 서버에서 템플릿으로 주입해둔 전역(예: 세션)
// window.CURRENT_USER_ID, window.SENDER_ROLE('SOCIAL' | 'COMPANY')를 사용한다고 가정
// currentThreadId를 window에 저장하여 chat.html과 공유
window.currentThreadId = window.currentThreadId || null;

// 날짜
function fmt(dt) {
    if (!dt) return '';
    const d = new Date(dt);
    return d.toLocaleString();
}

// WebSocket 연결
function connectWebSocket() {
    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    
    stompClient.connect({}, function(frame) {

        // 현재 스레드가 있으면 해당 스레드 구독
        if (window.currentThreadId) {
            subscribeToThread(window.currentThreadId);
        }
    }, function(error) {
        console.error('WebSocket 연결 실패:', error);
    });
}

// 스레드 구독
function subscribeToThread(threadId) {
    if (stompClient && stompClient.connected) {
        const destination = `/topic/chat/thread/${threadId}`;
        stompClient.subscribe(destination, function(message) {
            const messageData = JSON.parse(message.body);

            // 메시지 목록 새로고침
            loadChatMessages(threadId);
        });
    }
}

// 대화 목록 렌더링
async function initializeConversations() {
    try {
        const res = await fetch(`/api/chat/threads/user/${window.CURRENT_USER_ID}?page=1&size=30`);
        if (!res.ok) throw new Error('thread list fail');
        const page = await res.json();
        const threads = page.content || [];
        renderConversations(threads);

        // 파라미터가 없을 때만 첫 스레드 자동 선택
        // 파라미터가 있으면 autoCreateThreadIfNeeded에서 처리
        const hasParams = getUrlParameter('companyId') || getUrlParameter('hospitalId');
        if (threads.length > 0 && !hasParams) {
            selectConversation(threads[0].threadId);
        }
        
        // WebSocket 연결
        connectWebSocket();
    } catch (e) {
        console.error('스레드 로드 실패: ', e);
    }
}

// 대화 아이템 생성
function renderConversations(threads) {
    const container = document.querySelector('.conversations-section');
    if (!container) return;

    const html = threads.map(t => {
        const name = t.title || `대화 #${t.threadId}`;
        const time = fmt(t.lastMsgAt);
        const avatar = (name || 'U').charAt(0);

    return `
        <div class="conversation-item" data-conversation-id="${t.threadId}" data-company-id="${t.companyId}">
            <div class="conversation-avatar">
                ${avatar}
            </div>
            <div class="conversation-info">
                <div class="conversation-name">${name}</div>
                <div class="conversation-last-message">${time}</div>
            </div>
            <div class="conversation-time">${time}</div>
        </div>
    `;
    }).join('');

    container.innerHTML = html;
}

// 대화 선택 이벤트
function setupConversationSelection() {
    document.addEventListener('click', function(e) {
        const item = e.target.closest('.conversation-item');
        if (!item) return;

        // 모든 대화 아이템에서 active 클래스 제거
        document.querySelectorAll('.conversation-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');

        const threadId = Number(item.dataset.conversationId);
        selectConversation(threadId);
    });
}

// 대화 선택 > 메시지 로드
async function selectConversation(threadId) {
    window.currentThreadId = Number(threadId); // 전역으로도 저장
    console.log('대화 선택됨, 스레드 ID:', window.currentThreadId);
    
    // 입력창 활성화
    enableMessageInput();
    
    // WebSocket 구독
    subscribeToThread(window.currentThreadId);
    
    // 선택된 대화의 스레드 정보 가져오기
    try {
        const res = await fetch(`/api/chat/threads/user/${window.CURRENT_USER_ID}?page=1&size=30`);
        if (res.ok) {
            const page = await res.json();
            const threads = page.content || [];
            const selectedThread = threads.find(t => t.threadId === threadId);
            
            if (selectedThread) {
                // 헤더 업데이트
                const chatTitle = document.getElementById('chat-title');
                const chatMembers = document.getElementById('chat-members');
                
                if (chatTitle) {
                    chatTitle.textContent = selectedThread.title || `대화 #${threadId}`;
                }
                if (chatMembers) {
                    chatMembers.textContent = '업체 상담';
                }
                
                // chat-action-btn 업데이트 (업체 정보 표시)
                const actionBtn = document.querySelector('.chat-action-btn');
                if (actionBtn && selectedThread.companyId) {
                    // companyId로 업체 정보 가져오기
                    updateActionBtnWithCompanyInfo(selectedThread.companyId, selectedThread.title);
                }
                
                // 상담 완료 상태 확인 및 UI 업데이트
                checkAndUpdateConsultationStatus(selectedThread);
            }
        }
    } catch (e) {
        console.error('스레드 정보 로드 실패:', e);
    }
    
    // 채팅 내용 로드
    loadChatMessages(window.currentThreadId);
}

// 상담 완료 상태 확인 및 UI 업데이트
function checkAndUpdateConsultationStatus(thread) {
    const isCompleted = thread.status === 'COMPLETED';
    
    if (isCompleted) {
        // 상담 완료 상태 UI 표시
        showCompletedConsultationUI();
    } else {
        // 정상 채팅 UI 표시
        showNormalChatUI();
    }
}

// 상담 완료 상태 UI 표시
function showCompletedConsultationUI() {
    // 메시지 입력 영역 숨기기
    const chatInput = document.querySelector('.chat-input');
    if (chatInput) {
        chatInput.style.display = 'none';
    }
    
    // 상담 완료 안내 메시지 표시
    const messagesContainer = document.querySelector('.chat-messages');
    if (messagesContainer) {
        const completedMessage = `
            <div class="consultation-completed-notice">
                <div class="notice-content">
                    <i class="fas fa-check-circle"></i>
                    <h3>상담이 완료되었습니다</h3>
                    <p>이 상담은 완료 처리되었습니다. 새로운 상담을 시작하거나 기존 상담을 재개할 수 있습니다.</p>
                    <button class="resume-consultation-btn" onclick="resumeConsultation()">
                        <i class="fas fa-play"></i>
                        상담 재개하기
                    </button>
                </div>
            </div>
        `;
        
        // 기존 완료 안내 메시지가 있으면 제거
        const existingNotice = messagesContainer.querySelector('.consultation-completed-notice');
        if (existingNotice) {
            existingNotice.remove();
        }
        
        messagesContainer.insertAdjacentHTML('beforeend', completedMessage);
    }
}

// 정상 채팅 UI 표시
function showNormalChatUI() {
    // 메시지 입력 영역 보이기
    const chatInput = document.querySelector('.chat-input');
    if (chatInput) {
        chatInput.style.display = 'flex';
    }
    
    // 상담 완료 안내 메시지 제거
    const completedNotice = document.querySelector('.consultation-completed-notice');
    if (completedNotice) {
        completedNotice.remove();
    }
}

// 상담 재개하기
async function resumeConsultation() {
    if (!window.currentThreadId) return;
    
    const confirmed = confirm('상담을 재개하시겠습니까?\n\n재개하면 업체에 알림이 전송되고 새로운 메시지를 주고받을 수 있습니다.');
    if (!confirmed) return;
    
    try {
        // 스레드 상태를 IN_PROGRESS로 변경
        const res = await fetch(`/api/chat/thread/${window.currentThreadId}/status?status=IN_PROGRESS`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            credentials: 'same-origin'
        });
        
        if (res.ok) {
            // UI를 정상 채팅 모드로 변경
            showNormalChatUI();
            
            // 대화 목록 새로고침
            await initializeConversations();
            
            alert('상담이 재개되었습니다. 이제 메시지를 주고받을 수 있습니다.');
        } else {
            alert('상담 재개에 실패했습니다. 다시 시도해주세요.');
        }
    } catch (error) {
        console.error('상담 재개 실패:', error);
        alert('상담 재개 중 오류가 발생했습니다.');
    }
}

// 업체 정보로 액션 버튼 업데이트
async function updateActionBtnWithCompanyInfo(companyId, companyName) {
    try {
        // CompanyUser 정보 가져오기
        const res = await fetch(`/api/chat/company/${companyId}`);
        
        if (res.ok) {
            const company = await res.json();
            
            // 헤더의 chat-members에 주소 표시
            const chatMembers = document.getElementById('chat-members');
            if (chatMembers && company.address) {
                chatMembers.textContent = company.address;
            }
            
            // 액션 버튼 업데이트 - hover 시 팝오버 표시
            const actionBtn = document.querySelector('.chat-action-btn');
            if (actionBtn) {
                // 기존 이벤트 리스너 제거
                const newBtn = actionBtn.cloneNode(true);
                actionBtn.parentNode.replaceChild(newBtn, actionBtn);
                
                // hover 시 팝오버 표시 (마우스 오버)
                newBtn.addEventListener('mouseenter', function() {
                    if (typeof showCompanyInfoPopover === 'function') {
                        showCompanyInfoPopover(company);
                    }
                });
                
                // 클릭 시에도 팝오버 표시
                newBtn.addEventListener('click', function() {
                    if (typeof showCompanyInfoPopover === 'function') {
                        showCompanyInfoPopover(company);
                    }
                });
            }
        } else {
            // API 호출 실패 시 기본 정보만 표시
            const actionBtn = document.querySelector('.chat-action-btn');
            if (actionBtn) {
                actionBtn.title = `${companyName} 정보`;
                actionBtn.onclick = function() {
                    alert(`업체 정보\n\n업체명: ${companyName}\n업체 ID: ${companyId}`);
                };
            }
        }
    } catch (e) {
        console.error('업체 정보 로드 실패:', e);
    }
}

// 메시지 렌더링
async function loadChatMessages(threadId) {
    try {
        console.log('메시지 로드 시작, threadId:', threadId);
        const res = await fetch(`/api/chat/messages/${threadId}?page=1&size=50`);
        if (!res.ok) throw new Error('messages fail');
        const page = await res.json();

        // 서버는 보통 최신순(내림차순)
        // UI는 과거 > 현재 순으로 보여줌 reverse()
        const list = (page.content || []).slice().reverse();

        // DTO > UI모델 매핑
        const uiMessages = list.map(m => {

            const isMine = (m.senderRole === window.SENDER_ROLE) && (
                (window.SENDER_ROLE === 'SOCIAL' && m.senderUserId === window.CURRENT_USER_ID) ||
                (window.SENDER_ROLE === 'COMPANY' && m.senderCompanyId === window.CURRENT_USER_ID)
            );

            const uiMsg = {
                type: isMine ? 'sent' : 'received',
                sender: isMine ? null : (m.senderRole || 'USER'),
                content: m.body || (m.attachmentMime ? `[첨부파일: ${m.attachmentMime}]` : ''),
                time: fmt(m.createdAt),
                avatar: isMine ? 'Me' : (m.senderRole ? m.senderRole.charAt(0) : 'U')
            };
            
            return uiMsg;
        });

        renderMessages(uiMessages);
    }   catch (e) {
        console.error('메시지 로드 실패: ', e);
    }
}

// 메시지 요소 생성
function renderMessages(messages) {
    const messagesContainer = document.querySelector('.chat-messages');

    console.log('renderMessages 호출됨, 메시지 수:', messages.length);

    if(!messagesContainer) {
        console.error('메시지 컨테이너를 찾을 수 없습니다');
        return;
    }

    const html = messages.map(createMessageElement).join('');

    messagesContainer.innerHTML = html;

    // 맨 아래로 스크롤
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    console.log('메시지 렌더링 완료');
}

// 메시지 DOM 생성
function createMessageElement(message){

    const messageClass = message.type === 'sent' ? 'sent' : 'received';
    const avatar = message.avatar || message.sender?.charAt(0) || 'U';

    const html = `
        <div class="message ${messageClass}">
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                ${escapeHtml(message.content)}
                <div class="message-time">${message.time}</div>
            </div>
        </div>
    `;
    
    return html;
}

// XSS 최소 방어
function escapeHtml(str = '') {
    return str.replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

// 입력창 활성화
function enableMessageInput() {
    const messageInput = document.querySelector('.message-input');
    const sendBtn = document.querySelector('.send-btn');
    
    if (messageInput) {
        messageInput.disabled = false;
        messageInput.placeholder = '메시지를 입력하세요...';
    }
    if (sendBtn) {
        sendBtn.disabled = false;
    }
    console.log('입력창 활성화됨');
}

// 입력창 비활성화
function disableMessageInput() {
    const messageInput = document.querySelector('.message-input');
    const sendBtn = document.querySelector('.send-btn');
    
    if (messageInput) {
        messageInput.disabled = true;
        messageInput.placeholder = '대화를 선택하세요';
    }
    if (sendBtn) {
        sendBtn.disabled = true;
    }
    console.log('입력창 비활성화됨');
}

// 메시지를 입력 전송
function setupMessageInput() {
  const messageInput = document.querySelector('.message-input');
  const sendBtn = document.querySelector('.send-btn');
  const attachBtn = document.querySelector('.input-btn');

  console.log('setupMessageInput 초기화:', { messageInput, sendBtn, attachBtn });

  if (!messageInput || !sendBtn) {
    console.error('메시지 입력 요소를 찾을 수 없습니다.');
    return;
  }

  // 엔터(Shift+Enter는 줄바꿈)
  messageInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log('Enter 키로 메시지 전송');
      sendMessage();
    }
    // Shift+Enter는 줄바꿈 허용 (기본 동작)
  });

  // 버튼 클릭
  sendBtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('전송 버튼 클릭됨');
    sendMessage();
  });

  // 첨부 버튼
  if (attachBtn) {
    attachBtn.addEventListener('click', function(e) {
      e.preventDefault();
      attachFile();
    });
  }

  // 자동 높이
  messageInput.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });
}

async function sendMessage() {
  const input = document.querySelector('.message-input');
  
  if (!input) {
    console.error('메시지 입력창을 찾을 수 없습니다.');
    return;
  }
  
  // 비활성화 상태 체크
  if (input.disabled) {
    console.warn('입력창이 비활성화 상태입니다.');
    alert('대화를 먼저 선택해주세요.');
    return;
  }
  
  const content = input.value?.trim();
  
  if (!content) {
    console.log('메시지 내용이 비어있습니다.');
    return;
  }

  console.log('메시지 전송 시작:', content);
  console.log('현재 스레드 ID:', window.currentThreadId);

  // 업체 상담인 경우 새 스레드 생성 또는 기존 스레드 사용
  if (!window.currentThreadId) {
    console.log('스레드가 없어 새로 생성 시도...');
    
    // 파라미터로 온 업체 정보가 있는지 확인
    const hasCompanyParams = window.chatCompanyId || getUrlParameter('companyId') || getUrlParameter('hospitalId');
    
    if (!hasCompanyParams) {
      console.error('업체 정보도 없고 스레드도 없습니다. 대화를 선택해주세요.');
      alert('대화를 선택하거나 업체 페이지에서 상담을 시작해주세요.');
      return;
    }
    
    await createCompanyThread();
  }

  if (!window.currentThreadId) {
    console.error('스레드 생성 실패');
    alert('채팅을 시작할 수 없습니다. 다시 시도해주세요.');
    return;
  }

  console.log('메시지 전송 준비 완료, 스레드 ID:', window.currentThreadId);

  // 낙관적 UI 추가
  addMessageToChat({ type: 'sent', content, time: getCurrentTime(), avatar: 'Me' });

  // 서버 전송 - JSON 방식 사용 (/api/chat/send)
  const payload = {
    threadId: window.currentThreadId,
    senderRole: 'SOCIAL',
    senderUserId: window.CURRENT_USER_ID || 1,
    senderCompanyId: null,
    body: content
  };

  try {
    // WebSocket을 통해 실시간 전송
    if (stompClient && stompClient.connected) {
      stompClient.send("/app/chat.send", {}, JSON.stringify(payload));
      console.log('WebSocket으로 메시지 전송됨:', payload);
    } else {
      // WebSocket 연결이 없으면 기존 방식 사용
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (CSRF_HEADER && CSRF_TOKEN && typeof CSRF_HEADER === 'string' && CSRF_HEADER.trim() !== '') {
        headers[CSRF_HEADER] = CSRF_TOKEN;
      }

      console.log('HTTP로 전송 요청:', payload);

      const res = await fetch('/api/chat/send', { 
        method: 'POST', 
        headers: headers,
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('전송 실패 응답:', errorText);
        throw new Error('send fail: ' + res.status);
      }
      console.log('HTTP로 메시지 전송됨');
    }

    console.log('메시지 전송 성공');

    // 입력창 초기화
    input.value = '';
    input.style.height = 'auto';

    // 대화 목록 새로고침 (최신 메시지 시간 반영)
    await initializeConversations();
  } catch (e) {
    console.error('전송 실패:', e);
    alert('메시지 전송에 실패했습니다. 다시 시도해주세요.');
  }
}

// 업체와의 새 스레드 생성
async function createCompanyThread() {
  // hospital과 company 파라미터를 둘 다 지원
  const companyId = window.chatCompanyId || getUrlParameter('companyId') || getUrlParameter('hospitalId');
  const companyName = window.chatCompanyName || getUrlParameter('companyName') || getUrlParameter('hospitalName');
  
  console.log('스레드 생성 시도:', { companyId, companyName, userId: window.CURRENT_USER_ID });
  
  if (!companyId) {
    console.error('업체 ID가 없습니다.');
    alert('업체 정보를 찾을 수 없습니다. 다시 시도해주세요.');
    return;
  }

  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // CSRF 토큰이 있으면 추가
    if (CSRF_HEADER && CSRF_TOKEN && typeof CSRF_HEADER === 'string' && CSRF_HEADER.trim() !== '') {
      headers[CSRF_HEADER] = CSRF_TOKEN;
    }
    
    console.log('요청 헤더:', headers);
    
    const requestBody = {
      companyId: parseInt(companyId),
      title: `${companyName} 상담`,
      userId: window.CURRENT_USER_ID || 1
    };
    
    console.log('요청 본문:', requestBody);
    
    const response = await fetch('/api/chat/threads/create', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      const result = await response.json();
      window.currentThreadId = result.threadId; // 전역으로도 저장
      console.log('새 스레드 생성 성공:', window.currentThreadId);
      
      // 대화 목록 새로고침
      await initializeConversations();
    } else {
      const errorText = await response.text();
      console.error('스레드 생성 실패:', response.status, response.statusText, errorText);
      alert('채팅 스레드 생성에 실패했습니다: ' + response.status);
    }
  } catch (error) {
    console.error('스레드 생성 중 오류:', error);
    alert('채팅 스레드 생성 중 오류가 발생했습니다.');
  }
}

// URL 파라미터 가져오기
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// 메시지 추가(낙관적 UI)
function addMessageToChat(message) {
  const messagesContainer = document.querySelector('.chat-messages');
  if (!messagesContainer) return;

  const html = createMessageElement(message);
  messagesContainer.insertAdjacentHTML('beforeend', html);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 현재 시간(클라이언트 표시용)
function getCurrentTime() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${m} ${ampm}`;
}

// 상세 정보 토글 (필요 시 유지)
function setupDetailsToggle() {
  document.addEventListener('click', function (e) {
    if (!e.target.classList.contains('detail-section-title')) return;
    const section = e.target.closest('.detail-section');
    const content = section?.querySelector('.detail-section-content');
    if (content) content.style.display = content.style.display === 'none' ? 'block' : 'none';
  });
}

// 첨부 기능 (추후 구현)
function attachFile(){ alert('파일 첨부 기능은 준비 중입니다.'); }

// 업체 정보 툴팁 설정
function setupHospitalInfoTooltip() {
  const infoBtn = document.querySelector('.chat-action-btn[title="정보"]');
  // hospital과 company 파라미터를 둘 다 지원
  const companyName = getUrlParameter('companyName') || getUrlParameter('hospitalName');
  const companyAddress = getUrlParameter('companyAddress') || getUrlParameter('hospitalAddress');
  const companyPhone = getUrlParameter('companyPhone') || getUrlParameter('hospitalPhone');
  
  if (!infoBtn || !companyName) return;
  
  // 툴팁 요소 생성
  const tooltip = document.createElement('div');
  tooltip.className = 'hospital-info-tooltip';
  tooltip.innerHTML = `
    <div class="tooltip-header">업체 정보</div>
    <div class="tooltip-content">
      <div class="tooltip-item">
        <strong>업체명:</strong> ${companyName}
      </div>
      <div class="tooltip-item">
        <strong>주소:</strong> ${companyAddress || '정보 없음'}
      </div>
      <div class="tooltip-item">
        <strong>전화:</strong> ${companyPhone || '정보 없음'}
      </div>
    </div>
  `;
  tooltip.style.display = 'none';
  document.body.appendChild(tooltip);
  
  // 마우스 오버 이벤트
  infoBtn.addEventListener('mouseenter', function(e) {
    const rect = infoBtn.getBoundingClientRect();
    tooltip.style.display = 'block';
    tooltip.style.top = (rect.bottom + 10) + 'px';
    tooltip.style.left = (rect.left - 100) + 'px';
  });
  
  // 마우스 아웃 이벤트
  infoBtn.addEventListener('mouseleave', function() {
    tooltip.style.display = 'none';
  });
}