// 마케팅 페이지 JavaScript

// 탭 전환
function switchTab(tabName) {
    // 모든 탭 비활성화
    document.querySelectorAll('.tab-item').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // 선택된 탭 활성화
    document.querySelector(`.tab-item[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// 탭 클릭 이벤트
document.addEventListener('DOMContentLoaded', function() {
    // 탭 클릭
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // 차트 초기화
    initCharts();
    
    // 에셋 탭 전환
    document.querySelectorAll('.asset-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.asset-tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 모든 에셋 그리드 숨기기
            document.getElementById('imagesTab').style.display = 'none';
            document.getElementById('videosTab').style.display = 'none';
            document.getElementById('templatesTab').style.display = 'none';
            
            // 선택된 탭만 표시
            const assetTab = this.getAttribute('data-asset-tab');
            if (assetTab === 'images') {
                document.getElementById('imagesTab').style.display = 'grid';
            } else if (assetTab === 'videos') {
                document.getElementById('videosTab').style.display = 'grid';
            } else if (assetTab === 'templates') {
                document.getElementById('templatesTab').style.display = 'grid';
            }
        });
    });
    
    // 도움말 탭 전환
    document.querySelectorAll('.help-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.help-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const tabName = this.dataset.helpTab;
            document.getElementById(`${tabName}Tab`).classList.add('active');
        });
    });
    
    // 발송 시점 라디오 버튼
    document.querySelectorAll('input[name="sendTime"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const scheduledTime = document.getElementById('scheduledTime');
            if (this.value === 'scheduled') {
                scheduledTime.style.display = 'block';
            } else {
                scheduledTime.style.display = 'none';
            }
        });
    });
});

// 차트 초기화
function initCharts() {
    // 클릭 추이 차트
    const trendsCtx = document.getElementById('trendsChart');
    if (trendsCtx) {
        // 서버 데이터 사용
        const chartData = typeof serverClickChartData !== 'undefined' ? serverClickChartData : [];
        
        // 날짜 레이블과 클릭수 데이터 추출
        const labels = chartData.map(item => {
            const date = new Date(item.date);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        });
        const clickCounts = chartData.map(item => item.count || 0);
        
        console.log('차트 레이블:', labels);
        console.log('클릭 데이터:', clickCounts);
        
        new Chart(trendsCtx, {
            type: 'line',
            data: {
                labels: labels.length > 0 ? labels : ['데이터 없음'],
                datasets: [{
                    label: '클릭수',
                    data: clickCounts.length > 0 ? clickCounts : [0],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2.5,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 13
                        },
                        bodyFont: {
                            size: 12
                        },
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed.y.toLocaleString();
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }
    
    // 퍼널 차트
    const funnelCtx = document.getElementById('funnelChart');
    if (funnelCtx) {
        new Chart(funnelCtx, {
            type: 'bar',
            data: {
                labels: ['노출', '클릭', '문의', '예약'],
                datasets: [{
                    label: '마케팅 퍼널',
                    data: [125000, 8500, 450, 180],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(241, 196, 15, 0.8)',
                        'rgba(231, 76, 60, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return context.parsed.x.toLocaleString() + '건';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // 슬롯별 성과 차트
    const slotCtx = document.getElementById('slotPerformanceChart');
    if (slotCtx) {
        new Chart(slotCtx, {
            type: 'bar',
            data: {
                labels: ['홈 히어로', '홈 카드', '카테고리', '상세', '푸시'],
                datasets: [{
                    label: '클릭수',
                    data: [2450, 1890, 1650, 1320, 1190],
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return '클릭수: ' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

// 노출 요청 모달
function openPlacementModal() {
    document.getElementById('placementModal').classList.add('active');
}

function closePlacementModal() {
    document.getElementById('placementModal').classList.remove('active');
}

// 쿠폰 모달
function openCouponModal() {
    document.getElementById('couponModal').classList.add('active');
}

function closeCouponModal() {
    document.getElementById('couponModal').classList.remove('active');
}

// 에셋 업로드
function openAssetUpload() {
    alert('파일 업로드 기능 (추후 구현)');
}

// 메시지 발송
// 예약 발송 시간 입력란 토글
function toggleScheduledTime() {
    const sendTimeValue = document.querySelector('input[name="sendTime"]:checked').value;
    const scheduledTime = document.getElementById('scheduledTime');
    if (sendTimeValue === 'SCHEDULED') {
        scheduledTime.style.display = 'block';
        scheduledTime.required = true;
    } else {
        scheduledTime.style.display = 'none';
        scheduledTime.required = false;
    }
}

// 메시지 미리보기
function previewMessage() {
    const title = document.getElementById('messageTitle').value;
    const content = document.getElementById('messageContent').value;
    
    if (!title || !content) {
        alert('제목과 본문을 입력해주세요.');
        return;
    }
    
    const previewHtml = `
        <div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: white; max-width: 400px;">
            <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #333;">${title}</h3>
            <p style="margin: 0; font-size: 14px; color: #666; white-space: pre-wrap;">${content}</p>
        </div>
    `;
    
    const previewWindow = window.open('', '_blank', 'width=450,height=300');
    previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>메시지 미리보기</title>
            <meta charset="UTF-8">
        </head>
        <body style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f5f5f5; margin: 0;">
            ${previewHtml}
        </body>
        </html>
    `);
}

// 메시지 발송
function submitMessage(event) {
    event.preventDefault();
    
    console.log('메시지 발송 함수 호출됨');
    
    // 폼 데이터 수집
    const targetSegment = document.getElementById('targetSegment').value;
    const targetChannel = document.getElementById('targetChannel').value;
    const title = document.getElementById('messageTitle').value;
    const content = document.getElementById('messageContent').value;
    const linkUrl = document.getElementById('linkUrl').value;
    const sendType = document.querySelector('input[name="sendTime"]:checked').value;
    const scheduledAt = document.getElementById('scheduledTime').value;
    
    console.log('발송 데이터:', {
        targetSegment, targetChannel, title, content, linkUrl, sendType, scheduledAt
    });
    
    // 유효성 검사
    if (!title || !content) {
        alert('제목과 본문을 입력해주세요.');
        return;
    }
    
    if (sendType === 'SCHEDULED' && !scheduledAt) {
        alert('예약 발송 시간을 선택해주세요.');
        return;
    }
    
    // 확인 메시지
    const confirmMsg = sendType === 'IMMEDIATE' 
        ? `메시지를 지금 발송하시겠습니까?\n대상: ${getSegmentText(targetSegment)}\n채널: ${getChannelText(targetChannel)}`
        : `메시지 발송을 예약하시겠습니까?\n발송 시간: ${scheduledAt}`;
    
    if (!confirm(confirmMsg)) {
        return;
    }
    
    // 발송 버튼 비활성화
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '발송 중...';
    
    // API 호출
    fetch('/company/api/marketing/message/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            targetSegment,
            targetChannel,
            title,
            content,
            linkUrl,
            sendType,
            scheduledAt
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('메시지 발송 응답:', data);
        submitBtn.disabled = false;
        submitBtn.textContent = '발송 요청';
        
        if (data.success) {
            alert(`메시지가 성공적으로 발송되었습니다!\n대상 고객: ${data.targetCount}명`);
            // 폼 초기화
            event.target.reset();
            toggleScheduledTime();
        } else {
            alert('메시지 발송 실패: ' + data.message);
        }
    })
    .catch(error => {
        console.error('메시지 발송 에러:', error);
        submitBtn.disabled = false;
        submitBtn.textContent = '발송 요청';
        alert('메시지 발송 중 오류가 발생했습니다: ' + error.message);
    });
}

// 세그먼트 텍스트 변환
function getSegmentText(segment) {
    const map = {
        'ALL': '전체 고객',
        'RECENT_30DAYS': '최근 30일 예약 고객',
        'VIP': 'VIP 고객',
        'INACTIVE': '장기 미방문 고객',
        'FIRST_TIME': '첫 방문 고객'
    };
    return map[segment] || segment;
}

// 채널 텍스트 변환
function getChannelText(channel) {
    const map = {
        'PUSH': '앱 푸시',
        'SMS': 'SMS',
        'EMAIL': '이메일'
    };
    return map[channel] || channel;
}

// 모달 외부 클릭 시 닫기
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
});

// 새 노출 요청 제출
function submitPlacement(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    console.log('노출 요청 제출 시작...');
    
    fetch('/company/api/marketing/placement/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('서버 응답:', data);
        if (data.success) {
            alert('노출 요청이 제출되었습니다. 관리자 승인 후 노출됩니다.');
            closePlacementModal();
            form.reset();
            location.reload(); // 페이지 새로고침
        } else {
            alert('제출 실패: ' + (data.message || '알 수 없는 오류'));
        }
    })
    .catch(error => {
        console.error('제출 에러:', error);
        alert('노출 요청 제출에 실패했습니다. 다시 시도해주세요.');
    });
}

// 쿠폰 생성 제출
function submitCoupon(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    console.log('쿠폰 생성 제출 시작...');
    
    fetch('/company/api/marketing/coupon/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('서버 응답:', data);
        if (data.success) {
            alert('쿠폰이 생성되었습니다. 관리자 승인 후 사용 가능합니다.');
            closeCouponModal();
            form.reset();
            location.reload(); // 페이지 새로고침
        } else {
            alert('제출 실패: ' + (data.message || '알 수 없는 오류'));
        }
    })
    .catch(error => {
        console.error('제출 에러:', error);
        alert('쿠폰 생성에 실패했습니다. 다시 시도해주세요.');
    });
}

// Placement 미리보기
function viewPlacement(id) {
    console.log('미리보기:', id);
    
    fetch(`/company/api/marketing/placement/${id}`)
    .then(response => response.json())
    .then(data => {
        console.log('Placement 데이터:', data);
        if (data) {
            document.getElementById('view-target').textContent = data.target || '-';
            document.getElementById('view-slot').textContent = data.slot || '-';
            document.getElementById('view-startDate').textContent = data.startDate || '-';
            document.getElementById('view-endDate').textContent = data.endDate || '-';
            document.getElementById('view-priority').textContent = data.priority || '-';
            document.getElementById('view-landingUrl').textContent = data.landingUrl || '-';
            document.getElementById('view-bannerImage').textContent = data.bannerImagePath || '없음';
            document.getElementById('view-status').textContent = data.approvalStatus || '-';
            document.getElementById('view-clicks').textContent = (data.clicks || 0).toLocaleString();
            
            document.getElementById('placementViewModal').classList.add('active');
        } else {
            alert('데이터를 불러올 수 없습니다.');
        }
    })
    .catch(error => {
        console.error('조회 에러:', error);
        alert('데이터 조회에 실패했습니다.');
    });
}

function closePlacementViewModal() {
    document.getElementById('placementViewModal').classList.remove('active');
}

// Placement 수정
let currentPlacementId = null;

function editPlacement(id) {
    console.log('수정:', id);
    currentPlacementId = id;
    
    fetch(`/company/api/marketing/placement/${id}`)
    .then(response => response.json())
    .then(data => {
        console.log('Placement 데이터:', data);
        if (data) {
            document.getElementById('edit-id').value = data.id;
            document.getElementById('edit-target').value = data.target || '';
            document.getElementById('edit-slot').value = data.slot || '';
            document.getElementById('edit-startDate').value = data.startDate || '';
            document.getElementById('edit-endDate').value = data.endDate || '';
            document.getElementById('edit-priority').value = data.priority || 'NORMAL';
            document.getElementById('edit-landingUrl').value = data.landingUrl || '';
            
            document.getElementById('placementEditModal').classList.add('active');
        } else {
            alert('데이터를 불러올 수 없습니다.');
        }
    })
    .catch(error => {
        console.error('조회 에러:', error);
        alert('데이터 조회에 실패했습니다.');
    });
}

function closePlacementEditModal() {
    document.getElementById('placementEditModal').classList.remove('active');
    currentPlacementId = null;
}

// Placement 업데이트
function updatePlacement(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const id = document.getElementById('edit-id').value;
    
    console.log('Placement 업데이트:', id);
    
    fetch(`/company/api/marketing/placement/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            target: formData.get('target'),
            slot: formData.get('slot'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            priority: formData.get('priority'),
            landingUrl: formData.get('landingUrl')
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('서버 응답:', data);
        if (data.success) {
            alert('노출 요청이 수정되었습니다.');
            closePlacementEditModal();
            location.reload();
        } else {
            alert('수정 실패: ' + (data.message || '알 수 없는 오류'));
        }
    })
    .catch(error => {
        console.error('수정 에러:', error);
        alert('수정에 실패했습니다. 다시 시도해주세요.');
    });
}

// Placement 삭제
function deletePlacement() {
    if (!currentPlacementId) {
        alert('삭제할 항목을 찾을 수 없습니다.');
        return;
    }
    
    if (!confirm('정말 삭제하시겠습니까?')) {
        return;
    }
    
    console.log('Placement 삭제:', currentPlacementId);
    
    fetch(`/company/api/marketing/placement/${currentPlacementId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('서버 응답:', data);
        if (data.success) {
            alert('노출 요청이 삭제되었습니다.');
            closePlacementEditModal();
            location.reload();
        } else {
            alert('삭제 실패: ' + (data.message || '알 수 없는 오류'));
        }
    })
    .catch(error => {
        console.error('삭제 에러:', error);
        alert('삭제에 실패했습니다. 다시 시도해주세요.');
    });
}

// Coupon 수정
let currentCouponId = null;

function editCoupon(id) {
    console.log('쿠폰 수정:', id);
    currentCouponId = id;
    
    fetch(`/company/api/marketing/coupon/${id}`)
    .then(response => response.json())
    .then(data => {
        console.log('Coupon 데이터:', data);
        if (data) {
            document.getElementById('coupon-edit-id').value = data.id;
            document.getElementById('coupon-edit-name').value = data.name || '';
            document.getElementById('coupon-edit-type').value = data.couponType || 'PERCENT';
            document.getElementById('coupon-edit-discount').value = data.discountValue || '';
            document.getElementById('coupon-edit-minPayment').value = data.minPaymentAmount || '';
            document.getElementById('coupon-edit-description').value = data.description || '';
            document.getElementById('coupon-edit-issueLimit').value = data.issueLimit || '';
            document.getElementById('coupon-edit-validFrom').value = data.validFrom || '';
            document.getElementById('coupon-edit-validUntil').value = data.validUntil || '';
            
            document.getElementById('couponEditModal').classList.add('active');
        } else {
            alert('데이터를 불러올 수 없습니다.');
        }
    })
    .catch(error => {
        console.error('조회 에러:', error);
        alert('데이터 조회에 실패했습니다.');
    });
}

function closeCouponEditModal() {
    document.getElementById('couponEditModal').classList.remove('active');
    currentCouponId = null;
}

// Coupon 업데이트
function updateCoupon(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const id = document.getElementById('coupon-edit-id').value;
    
    console.log('Coupon 업데이트:', id);
    
    fetch(`/company/api/marketing/coupon/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: formData.get('name'),
            couponType: formData.get('couponType'),
            discountValue: formData.get('discountValue'),
            minPaymentAmount: formData.get('minPaymentAmount'),
            description: formData.get('description'),
            issueLimit: formData.get('issueLimit'),
            validFrom: formData.get('validFrom'),
            validUntil: formData.get('validUntil')
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('서버 응답:', data);
        if (data.success) {
            alert('쿠폰이 수정되었습니다.');
            closeCouponEditModal();
            location.reload();
        } else {
            alert('수정 실패: ' + (data.message || '알 수 없는 오류'));
        }
    })
    .catch(error => {
        console.error('수정 에러:', error);
        alert('수정에 실패했습니다. 다시 시도해주세요.');
    });
}

// Coupon 삭제
function deleteCoupon(id) {
    // id가 파라미터로 전달된 경우 (버튼에서 직접 호출)
    const couponId = id || currentCouponId;
    
    if (!couponId) {
        alert('삭제할 항목을 찾을 수 없습니다.');
        return;
    }
    
    if (!confirm('정말 삭제하시겠습니까?')) {
        return;
    }
    
    console.log('Coupon 삭제:', couponId);
    
    fetch(`/company/api/marketing/coupon/${couponId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('서버 응답:', data);
        if (data.success) {
            alert('쿠폰이 삭제되었습니다.');
            if (currentCouponId) {
                closeCouponEditModal();
            }
            location.reload();
        } else {
            alert('삭제 실패: ' + (data.message || '알 수 없는 오류'));
        }
    })
    .catch(error => {
        console.error('삭제 에러:', error);
        alert('삭제에 실패했습니다. 다시 시도해주세요.');
    });
}

// 문구 템플릿 미리보기
function viewCouponTemplate(id) {
    console.log('쿠폰 템플릿 미리보기:', id);
    
    fetch(`/company/api/marketing/coupon/${id}`)
    .then(response => response.json())
    .then(data => {
        console.log('Coupon 데이터:', data);
        if (data) {
            const message = `
쿠폰명: ${data.name}
유형: ${data.couponType === 'PERCENT' ? '정율 할인' : '정액 할인'}
할인값: ${data.discountValue}${data.couponType === 'PERCENT' ? '%' : '원'}
최소결제금액: ${data.minPaymentAmount ? data.minPaymentAmount.toLocaleString() + '원' : '없음'}
발급한도: ${data.issueLimit || '무제한'}
유효기간: ${data.validFrom} ~ ${data.validUntil}

설명:
${data.description || '설명 없음'}
            `;
            alert(message);
        } else {
            alert('데이터를 불러올 수 없습니다.');
        }
    })
    .catch(error => {
        console.error('조회 에러:', error);
        alert('데이터 조회에 실패했습니다.');
    });
}

// 에셋 삭제 (에셋 탭에서 호출)
function deleteAsset(id, type) {
    if (type === 'placement') {
        currentPlacementId = id;
        deletePlacement();
    } else if (type === 'coupon') {
        deleteCoupon(id);
    }
}

