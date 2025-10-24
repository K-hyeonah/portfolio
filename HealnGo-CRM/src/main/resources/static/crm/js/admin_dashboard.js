// 사용자 차트 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('Chart initialization started');
    
    // Chart.js 로드 확인
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return;
    }
    
    const ctx = document.getElementById('userChart');
    console.log('Canvas element:', ctx);
    
    if (ctx) {
        // 기존 차트가 있다면 제거
        if (window.userChartInstance) {
            window.userChartInstance.destroy();
        }
        
        try {
            // 월별 실제 데이터 가져오기 (Thymeleaf에서 전달된 데이터)
            const monthlyData = window.monthlyData || [];
            console.log('Monthly Data:', monthlyData);
            
            // 월별 라벨과 데이터 추출
            const labels = monthlyData.map(item => item.month + '월');
            const totalUsersData = monthlyData.map(item => parseInt(item.totalUsers) || 0);
            const activeUsersData = monthlyData.map(item => parseInt(item.activeUsers) || 0);
            const suspendedUsersData = monthlyData.map(item => parseInt(item.suspendedUsers) || 0);
            
            console.log('Chart Data:', { labels, totalUsersData, activeUsersData, suspendedUsersData });
            
            window.userChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '활성 사용자',
                        data: activeUsersData,
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: '정지 사용자',
                        data: suspendedUsersData,
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: '총 사용자',
                        data: totalUsersData,
                        borderColor: '#27ae60',
                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
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
        console.log('Chart created successfully');
        } catch (error) {
            console.error('Chart creation failed:', error);
        }
    } else {
        console.error('Canvas element not found');
    }
});