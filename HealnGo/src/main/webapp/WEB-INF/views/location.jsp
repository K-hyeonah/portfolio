<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><spring:message code="location.title"/></title>
    <!-- 부트스트랩 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- 공통 스타일시트 -->
    <link rel="stylesheet" href="/resources/css/styles.css">
    <!-- Font Awesome 5 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <style>
        :root { 
            --border: #e5e7eb; 
            --muted: #6b7280; 
            --text: #111827; 
            --bg: #ffffff; 
            --bg2: #f9fafb; 
            --black: #000; 
        }
        
        * { box-sizing: border-box; }
        
        body {
            margin: 0;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple SD Gothic Neo", "Noto Sans KR", "맑은 고딕", sans-serif;
            color: var(--text);
            background: var(--bg2);
        }
        
        /* 헤더와의 간격 조정 */
        .location-content {
            margin-top: 80px; /* 헤더 높이만큼 여백 추가 */
        }
        
        .container {
            max-width: 1120px;
            margin: 0 auto;
            padding: 16px;
        }
        
        .row {
            display: grid;
            gap: 12px;
        }
        
        @media (min-width: 900px) {
            .row {
                grid-template-columns: 240px 1fr;
            }
        }
        
        .card {
            background: #fff;
            border: 1px solid var(--border);
            border-radius: 12px;
        }
        
        .left {
            padding: 8px;
        }
        
        .right {
            padding: 12px;
        }
        
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
        }
        
        .title {
            font-size: 20px;
            font-weight: 600;
        }
        
        /* left nav */
        .sido {
            list-style: none;
            margin: 0;
            padding: 4px;
            max-height: 70vh;
            overflow: auto;
        }
        
        .sido li {
            border-radius: 8px;
        }
        
        .sido button {
            width: 100%;
            text-align: left;
            background: transparent;
            border: 0;
            cursor: pointer;
            padding: 10px 12px;
            border-radius: 8px;
            font-size: 14px;
            color: #374151;
        }
        
        .sido button:hover {
            background: #f3f4f6;
        }
        
        .sido .active {
            background: #a4d6a4cc !important;
            color: #fff !important;
            font-weight: 600;
        }
        
        /* right panel */
        .list {
            max-height: 64vh;
            overflow: auto;
            padding-right: 4px;
        }
        
        .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 12px;
            border-bottom: 1px solid var(--border);
            font-size: 14px;
            cursor: pointer;
        }
        
        .item:last-child {
            border-bottom: 0;
        }
        
        .item:hover {
            background: #f3f4f6;
        }
        
        .item .arrow {
            color: #9ca3af;
            font-size: 12px;
        }
        
        .back-btn {
            background: #a4d6a4cc;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            text-decoration: none;
            display: inline-block;
            margin-bottom: 20px;
            transition: background 0.3s ease;
        }
        
        .back-btn:hover {
            background: #005A66;
            color: white;
        }
    </style>
</head>
<body>
<%@include file = "/common/header.jsp"%>

<div class="location-content">
    <div class="container">
    <a href="/main" class="back-btn">
        <i class="fas fa-arrow-left"></i> <spring:message code="location.back.home"/>
    </a>
    
    <div class="row">
        <!-- 왼쪽: 시도 선택 -->
        <div class="card left">
            <ul class="sido" id="sidoList">
                <!-- JavaScript로 동적 생성 -->
            </ul>
        </div>
        
        <!-- 오른쪽: 세부 지역 선택 -->
        <div class="card right">
            <div class="header">
                <div class="title"><spring:message code="location.select.region"/></div>
                <i class="fas fa-chevron-up" id="scrollTop"></i>
            </div>
            
            <div class="list" id="distList">
                <!-- JavaScript로 동적 생성 -->
            </div>
        </div>
    </div>
    </div>
</div>


<%@include file = "/common/footer.jsp"%>

<!-- 부트스트랩 JS 및 의존성 -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<script>
(function() {
    // 지역 데이터
    const REGIONS = {
        'nation': {
            name: '<spring:message code="region.nation"/>',
            districts: ['<spring:message code="region.nation.nation"/>']
        },
        'seoul': {
            name: '<spring:message code="region.seoul"/>',
            districts: ['<spring:message code="region.seoul.gangnam"/>', '<spring:message code="region.seoul.gangbuk"/>', '<spring:message code="region.seoul.mapo"/>', '<spring:message code="region.seoul.yongsan"/>', '<spring:message code="region.seoul.seongdong"/>', '<spring:message code="region.seoul.dongdaemun"/>', '<spring:message code="region.seoul.jungnang"/>', '<spring:message code="region.seoul.seongbuk"/>', '<spring:message code="region.seoul.dobong"/>', '<spring:message code="region.seoul.nowon"/>', '<spring:message code="region.seoul.eunpyeong"/>', '<spring:message code="region.seoul.seodaemun"/>', '<spring:message code="region.seoul.seocho"/>', '<spring:message code="region.seoul.songpa"/>', '<spring:message code="region.seoul.gangdong"/>', '<spring:message code="region.seoul.gwangjin"/>', '<spring:message code="region.seoul.jung"/>', '<spring:message code="region.seoul.jongno"/>']
        },
        'gyeonggi': {
            name: '<spring:message code="region.gyeonggi"/>',
            districts: ['<spring:message code="region.gyeonggi.suwon"/>', '<spring:message code="region.gyeonggi.seongnam"/>', '<spring:message code="region.gyeonggi.anyang"/>', '<spring:message code="region.gyeonggi.bucheon"/>', '<spring:message code="region.gyeonggi.gwangmyeong"/>', '<spring:message code="region.gyeonggi.pyeongtaek"/>', '<spring:message code="region.gyeonggi.ansan"/>', '<spring:message code="region.gyeonggi.hwaseong"/>', '<spring:message code="region.gyeonggi.osan"/>', '<spring:message code="region.gyeonggi.yongin"/>', '<spring:message code="region.gyeonggi.ijeon"/>', '<spring:message code="region.gyeonggi.gunpo"/>', '<spring:message code="region.gyeonggi.uijeongbu"/>', '<spring:message code="region.gyeonggi.goyang"/>', '<spring:message code="region.gyeonggi.gimpo"/>', '<spring:message code="region.gyeonggi.paju"/>', '<spring:message code="region.gyeonggi.yangju"/>', '<spring:message code="region.gyeonggi.dongducheon"/>', '<spring:message code="region.gyeonggi.gapyeong"/>', '<spring:message code="region.gyeonggi.yangpyeong"/>', '<spring:message code="region.gyeonggi.yeoju"/>', '<spring:message code="region.gyeonggi.icheon"/>', '<spring:message code="region.gyeonggi.anseong"/>', '<spring:message code="region.gyeonggi.pocheon"/>', '<spring:message code="region.gyeonggi.yeoncheon"/>']
        },
        'incheon': {
            name: '<spring:message code="region.incheon"/>',
            districts: ['<spring:message code="region.incheon.jung"/>', '<spring:message code="region.incheon.dong"/>', '<spring:message code="region.incheon.michuhol"/>', '<spring:message code="region.incheon.yeonsu"/>', '<spring:message code="region.incheon.namdong"/>', '<spring:message code="region.incheon.bupyeong"/>', '<spring:message code="region.incheon.gyeyang"/>', '<spring:message code="region.incheon.seo"/>', '<spring:message code="region.incheon.ganghwa"/>', '<spring:message code="region.incheon.ongjin"/>']
        },
        'busan': {
            name: '<spring:message code="region.busan"/>',
            districts: ['<spring:message code="region.busan.jung"/>', '<spring:message code="region.busan.seo"/>', '<spring:message code="region.busan.dong"/>', '<spring:message code="region.busan.yeongdo"/>', '<spring:message code="region.busan.busanjin"/>', '<spring:message code="region.busan.dongnae"/>', '<spring:message code="region.busan.nam"/>', '<spring:message code="region.busan.buk"/>', '<spring:message code="region.busan.haeundae"/>', '<spring:message code="region.busan.saha"/>', '<spring:message code="region.busan.geumjeong"/>', '<spring:message code="region.busan.gangseo"/>', '<spring:message code="region.busan.yeonje"/>', '<spring:message code="region.busan.suyeong"/>', '<spring:message code="region.busan.sasang"/>', '<spring:message code="region.busan.gijang"/>']
        },
        'daegu': {
            name: '<spring:message code="region.daegu"/>',
            districts: ['<spring:message code="region.daegu.jung"/>', '<spring:message code="region.daegu.dong"/>', '<spring:message code="region.daegu.seo"/>', '<spring:message code="region.daegu.nam"/>', '<spring:message code="region.daegu.buk"/>', '<spring:message code="region.daegu.suseong"/>', '<spring:message code="region.daegu.dalseo"/>', '<spring:message code="region.daegu.dalseong"/>']
        },
        'daejeon': {
            name: '<spring:message code="region.daejeon"/>',
            districts: ['<spring:message code="region.daejeon.dong"/>', '<spring:message code="region.daejeon.jung"/>', '<spring:message code="region.daejeon.seo"/>', '<spring:message code="region.daejeon.yuseong"/>', '<spring:message code="region.daejeon.daedeok"/>']
        },
        'gwangju': {
            name: '<spring:message code="region.gwangju"/>',
            districts: ['<spring:message code="region.gwangju.dong"/>', '<spring:message code="region.gwangju.seo"/>', '<spring:message code="region.gwangju.nam"/>', '<spring:message code="region.gwangju.buk"/>', '<spring:message code="region.gwangju.gwangsan"/>']
        },
        'ulsan': {
            name: '<spring:message code="region.ulsan"/>',
            districts: ['<spring:message code="region.ulsan.jung"/>', '<spring:message code="region.ulsan.nam"/>', '<spring:message code="region.ulsan.dong"/>', '<spring:message code="region.ulsan.buk"/>', '<spring:message code="region.ulsan.ulju"/>']
        },
        'chungnam': {
            name: '<spring:message code="region.chungnam"/>',
            districts: ['<spring:message code="region.chungnam.cheonan"/>', '<spring:message code="region.chungnam.gongju"/>', '<spring:message code="region.chungnam.boryeong"/>', '<spring:message code="region.chungnam.asan"/>', '<spring:message code="region.chungnam.nonsan"/>', '<spring:message code="region.chungnam.gyeryong"/>', '<spring:message code="region.chungnam.dangjin"/>', '<spring:message code="region.chungnam.seosan"/>', '<spring:message code="region.chungnam.hongseong"/>', '<spring:message code="region.chungnam.cheongyang"/>', '<spring:message code="region.chungnam.boeun"/>', '<spring:message code="region.chungnam.okcheon"/>', '<spring:message code="region.chungnam.yeongdong"/>', '<spring:message code="region.chungnam.jincheon"/>', '<spring:message code="region.chungnam.goesan"/>', '<spring:message code="region.chungnam.eumseong"/>', '<spring:message code="region.chungnam.chungju"/>', '<spring:message code="region.chungnam.jecheon"/>', '<spring:message code="region.chungnam.taean"/>', '<spring:message code="region.chungnam.sejong"/>']
        },
        'chungbuk': {
            name: '<spring:message code="region.chungbuk"/>',
            districts: ['<spring:message code="region.chungbuk.cheongju"/>', '<spring:message code="region.chungbuk.chungju"/>', '<spring:message code="region.chungbuk.jecheon"/>', '<spring:message code="region.chungbuk.boeun"/>', '<spring:message code="region.chungbuk.okcheon"/>', '<spring:message code="region.chungbuk.yeongdong"/>', '<spring:message code="region.chungbuk.jincheon"/>', '<spring:message code="region.chungbuk.goesan"/>', '<spring:message code="region.chungbuk.eumseong"/>']
        },
        'jeonnam': {
            name: '<spring:message code="region.jeonnam"/>',
            districts: ['<spring:message code="region.jeonnam.mokpo"/>', '<spring:message code="region.jeonnam.yeosu"/>', '<spring:message code="region.jeonnam.suncheon"/>', '<spring:message code="region.jeonnam.naju"/>', '<spring:message code="region.jeonnam.gwangyang"/>', '<spring:message code="region.jeonnam.damyang"/>', '<spring:message code="region.jeonnam.gokseong"/>', '<spring:message code="region.jeonnam.gurye"/>', '<spring:message code="region.jeonnam.goheung"/>', '<spring:message code="region.jeonnam.boseong"/>', '<spring:message code="region.jeonnam.hwasun"/>', '<spring:message code="region.jeonnam.jangheung"/>', '<spring:message code="region.jeonnam.gangjin"/>', '<spring:message code="region.jeonnam.haenam"/>', '<spring:message code="region.jeonnam.yeongam"/>', '<spring:message code="region.jeonnam.muan"/>', '<spring:message code="region.jeonnam.shinan"/>', '<spring:message code="region.jeonnam.wando"/>', '<spring:message code="region.jeonnam.jindo"/>', '<spring:message code="region.jeonnam.jangseong"/>', '<spring:message code="region.jeonnam.hampyeong"/>', '<spring:message code="region.jeonnam.yeonggwang"/>']
        },
        'jeonbuk': {
            name: '<spring:message code="region.jeonbuk"/>',
            districts: ['<spring:message code="region.jeonbuk.jeonju"/>', '<spring:message code="region.jeonbuk.gunsan"/>', '<spring:message code="region.jeonbuk.iksan"/>', '<spring:message code="region.jeonbuk.jeongeup"/>', '<spring:message code="region.jeonbuk.namwon"/>', '<spring:message code="region.jeonbuk.gimje"/>', '<spring:message code="region.jeonbuk.wanju"/>', '<spring:message code="region.jeonbuk.jinan"/>', '<spring:message code="region.jeonbuk.muju"/>', '<spring:message code="region.jeonbuk.jangsu"/>', '<spring:message code="region.jeonbuk.imsil"/>', '<spring:message code="region.jeonbuk.sunchang"/>', '<spring:message code="region.jeonbuk.gochang"/>', '<spring:message code="region.jeonbuk.buan"/>']
        },
        'gyeongnam': {
            name: '<spring:message code="region.gyeongnam"/>',
            districts: ['<spring:message code="region.gyeongnam.changwon"/>', '<spring:message code="region.gyeongnam.gimhae"/>', '<spring:message code="region.gyeongnam.yangsan"/>', '<spring:message code="region.gyeongnam.geoje"/>', '<spring:message code="region.gyeongnam.tongyeong"/>', '<spring:message code="region.gyeongnam.sacheon"/>', '<spring:message code="region.gyeongnam.miryang"/>', '<spring:message code="region.gyeongnam.haman"/>', '<spring:message code="region.gyeongnam.geochang"/>', '<spring:message code="region.gyeongnam.changnyeong"/>', '<spring:message code="region.gyeongnam.goseong"/>', '<spring:message code="region.gyeongnam.namhae"/>', '<spring:message code="region.gyeongnam.hadong"/>', '<spring:message code="region.gyeongnam.sancheong"/>', '<spring:message code="region.gyeongnam.hamyang"/>', '<spring:message code="region.gyeongnam.georyeong"/>', '<spring:message code="region.gyeongnam.uiryeong"/>', '<spring:message code="region.gyeongnam.hapcheon"/>']
        },
        'gyeongbuk': {
            name: '<spring:message code="region.gyeongbuk"/>',
            districts: ['<spring:message code="region.gyeongbuk.pohang"/>', '<spring:message code="region.gyeongbuk.gyeongju"/>', '<spring:message code="region.gyeongbuk.gimcheon"/>', '<spring:message code="region.gyeongbuk.andong"/>', '<spring:message code="region.gyeongbuk.gumi"/>', '<spring:message code="region.gyeongbuk.yeongju"/>', '<spring:message code="region.gyeongbuk.yeongcheon"/>', '<spring:message code="region.gyeongbuk.sangju"/>', '<spring:message code="region.gyeongbuk.mungyeong"/>', '<spring:message code="region.gyeongbuk.cheongdo"/>', '<spring:message code="region.gyeongbuk.gyeongsan"/>', '<spring:message code="region.gyeongbuk.chilgok"/>', '<spring:message code="region.gyeongbuk.gunwi"/>', '<spring:message code="region.gyeongbuk.uiseong"/>', '<spring:message code="region.gyeongbuk.cheongsong"/>', '<spring:message code="region.gyeongbuk.yeongdeok"/>', '<spring:message code="region.gyeongbuk.uljin"/>', '<spring:message code="region.gyeongbuk.yeongyang"/>', '<spring:message code="region.gyeongbuk.bonghwa"/>']
        },
        'gangwon': {
            name: '<spring:message code="region.gangwon"/>',
            districts: ['<spring:message code="region.gangwon.chuncheon"/>', '<spring:message code="region.gangwon.wonju"/>', '<spring:message code="region.gangwon.gangneung"/>', '<spring:message code="region.gangwon.donghae"/>', '<spring:message code="region.gangwon.taebaek"/>', '<spring:message code="region.gangwon.sokcho"/>', '<spring:message code="region.gangwon.samcheok"/>', '<spring:message code="region.gangwon.hongcheon"/>', '<spring:message code="region.gangwon.cheorwon"/>', '<spring:message code="region.gangwon.hoengseong"/>', '<spring:message code="region.gangwon.pyeongchang"/>', '<spring:message code="region.gangwon.jeongseon"/>', '<spring:message code="region.gangwon.yeongwol"/>', '<spring:message code="region.gangwon.inje"/>', '<spring:message code="region.gangwon.goseong"/>', '<spring:message code="region.gangwon.yangyang"/>', '<spring:message code="region.gangwon.hwacheon"/>', '<spring:message code="region.gangwon.yanggu"/>']
        },
        'jeju': {
            name: '<spring:message code="region.jeju"/>',
            districts: ['<spring:message code="region.jeju.jeju"/>', '<spring:message code="region.jeju.seogwipo"/>']
        }
    };

    // DOM 요소들
    const sidoList = document.getElementById('sidoList');
    const distList = document.getElementById('distList');
    const scrollTop = document.getElementById('scrollTop');

    // 상태 변수들
    let current = 'nation'; // 현재 선택된 시도

    // 렌더링 함수들
    function renderSido() {
        sidoList.innerHTML = '';
        Object.keys(REGIONS).forEach(function(code) {
            var li = document.createElement('li');
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = (code === current ? 'active ' : '') + 'sido-btn';
            btn.textContent = REGIONS[code].name;
            btn.onclick = function() {
                // 이전 active 버튼에서 active 클래스 제거
                var prevActive = sidoList.querySelector('.active');
                if (prevActive) {
                    prevActive.classList.remove('active');
                }
                
                // 현재 버튼에 active 클래스 추가
                this.classList.add('active');
                
                current = code;
                renderDists();
            };
            li.appendChild(btn);
            sidoList.appendChild(li);
        });
    }

    function renderDists() {
        var list = REGIONS[current].districts;
        distList.innerHTML = '';
        list.forEach(function(name) {
            var row = document.createElement('div');
            row.className = 'item';
            var left = document.createElement('div');
            left.textContent = name;
            var right = document.createElement('div');
            right.className = 'arrow';
            right.textContent = '>';
            row.onclick = function() {
                console.log('Selected:', REGIONS[current].name, name);
                // URL 파라미터에서 카테고리 가져오기
                const urlParams = new URLSearchParams(window.location.search);
                const category = urlParams.get('category') || 'plastic';
                const region = REGIONS[current].name;
                const subRegion = name;
                
                // 번역된 파라미터를 한국어로 변환하는 함수
                function translateToKorean(text) {
                    if (!text) return text;
                    
                                         // 지역명 번역 매핑
                     const regionTranslations = {
                         'Seoul': '서울', 'Busan': '부산', 'Daegu': '대구', 'Incheon': '인천',
                         'Gwangju': '광주', 'Daejeon': '대전', 'Ulsan': '울산', 'Sejong': '세종',
                         'Gyeonggi': '경기', 'Gangwon': '강원', 'Chungbuk': '충북', 'Chungnam': '충남',
                         'Jeonbuk': '전북', 'Jeonnam': '전남', 'Gyeongbuk': '경북', 'Gyeongnam': '경남',
                         'Jeju': '제주', 'National': '전국',
                         // 추가 지역 매핑
                         'seoul': '서울', 'busan': '부산', 'daegu': '대구', 'incheon': '인천',
                         'gwangju': '광주', 'daejeon': '대전', 'ulsan': '울산', 'sejong': '세종',
                         'gyeonggi': '경기', 'gangwon': '강원', 'chungbuk': '충북', 'chungnam': '충남',
                         'jeonbuk': '전북', 'jeonnam': '전남', 'gyeongbuk': '경북', 'gyeongnam': '경남',
                         'jeju': '제주', 'national': '전국',
                         
                         // 영어 지역명 번역 (구/군)
                         'Gangnam-gu': '강남구', 'Gangdong-gu': '강동구', 'Gangbuk-gu': '강북구', 'Gangseo-gu': '강서구',
                         'Gwanak-gu': '관악구', 'Gwangjin-gu': '광진구', 'Guro-gu': '구로구', 'Geumcheon-gu': '금천구',
                         'Nowon-gu': '노원구', 'Dobong-gu': '도봉구', 'Dongdaemun-gu': '동대문구', 'Dongjak-gu': '동작구',
                         'Mapo-gu': '마포구', 'Seodaemun-gu': '서대문구', 'Seocho-gu': '서초구', 'Seongdong-gu': '성동구',
                         'Seongbuk-gu': '성북구', 'Songpa-gu': '송파구', 'Yangcheon-gu': '양천구', 'Yeongdeungpo-gu': '영등포구',
                         'Yongsan-gu': '용산구', 'Eunpyeong-gu': '은평구', 'Jongno-gu': '종로구', 'Jung-gu': '중구', 'Jungnang-gu': '중랑구',
                         
                         // 경기도 시/군 영어 번역
                         'Suwon-si': '수원시', 'Seongnam-si': '성남시', 'Anyang-si': '안양시', 'Bucheon-si': '부천시',
                         'Gwangmyeong-si': '광명시', 'Pyeongtaek-si': '평택시', 'Ansan-si': '안산시', 'Hwaseong-si': '화성시',
                         'Osan-si': '오산시', 'Yongin-si': '용인시', 'Icheon-si': '이천시', 'Gunpo-si': '군포시',
                         'Uijeongbu-si': '의정부시', 'Goyang-si': '고양시', 'Gimpo-si': '김포시', 'Paju-si': '파주시',
                         'Yangju-si': '양주시', 'Dongducheon-si': '동두천시', 'Gapyeong-gun': '가평군', 'Yangpyeong-gun': '양평군',
                         'Yeoju-si': '여주시', 'Anseong-si': '안성시', 'Pocheon-si': '포천시', 'Yeoncheon-gun': '연천군',
                         
                         // 인천시 구 영어 번역
                         'Michuhol-gu': '미추홀구', 'Yeonsu-gu': '연수구', 'Namdong-gu': '남동구', 'Bupyeong-gu': '부평구',
                         'Gyeyang-gu': '계양구', 'Ganghwa-gun': '강화군', 'Ongjin-gun': '옹진군',
                         
                         // 부산시 구 영어 번역
                         'Yeongdo-gu': '영도구', 'Busanjin-gu': '부산진구', 'Dongnae-gu': '동래구', 'Haeundae-gu': '해운대구',
                         'Saha-gu': '사하구', 'Geumjeong-gu': '금정구', 'Yeonje-gu': '연제구', 'Suyeong-gu': '수영구',
                         'Sasang-gu': '사상구', 'Gijang-gun': '기장군',
                         
                         // 대구시 구 영어 번역
                         'Jung-gu': '중구', 'Dong-gu': '동구', 'Seo-gu': '서구', 'Nam-gu': '남구',
                         'Buk-gu': '북구', 'Suseong-gu': '수성구', 'Dalseo-gu': '달서구', 'Dalseong-gun': '달성군',
                         
                         // 대전시 구 영어 번역
                         'Yuseong-gu': '유성구', 'Daedeok-gu': '대덕구',
                         
                         // 광주시 구 영어 번역
                         'Gwangsan-gu': '광산구',
                         
                         // 울산시 구 영어 번역
                         'Ulju-gun': '울주군',
                        // 서울시 구 번역
                        'Gangnam': '강남구', 'Gangdong': '강동구', 'Gangbuk': '강북구', 'Gangseo': '강서구',
                        'Gwanak': '관악구', 'Gwangjin': '광진구', 'Guro': '구로구', 'Geumcheon': '금천구',
                        'Nowon': '노원구', 'Dobong': '도봉구', 'Dongdaemun': '동대문구', 'Dongjak': '동작구',
                        'Mapo': '마포구', 'Seodaemun': '서대문구', 'Seocho': '서초구', 'Seongdong': '성동구',
                        'Seongbuk': '성북구', 'Songpa': '송파구', 'Yangcheon': '양천구', 'Yeongdeungpo': '영등포구',
                        'Yongsan': '용산구', 'Eunpyeong': '은평구', 'Jongno': '종로구', 'Jung': '중구', 'Jungnang': '중랑구',
                        // 추가 서울시 구 매핑
                        'gangnam': '강남구', 'gangdong': '강동구', 'gangbuk': '강북구', 'gangseo': '강서구',
                        'gwanak': '관악구', 'gwangjin': '광진구', 'guro': '구로구', 'geumcheon': '금천구',
                        'nowon': '노원구', 'dobong': '도봉구', 'dongdaemun': '동대문구', 'dongjak': '동작구',
                        'mapo': '마포구', 'seodaemun': '서대문구', 'seocho': '서초구', 'seongdong': '성동구',
                        'seongbuk': '성북구', 'songpa': '송파구', 'yangcheon': '양천구', 'yeongdeungpo': '영등포구',
                                                 'yongsan': '용산구', 'eunpyeong': '은평구', 'jongno': '종로구', 'jung': '중구', 'jungnang': '중랑구',
                         // 경기도 시/군 영문 매핑
                         'suwon': '수원시', 'seongnam': '성남시', 'anyang': '안양시', 'bucheon': '부천시',
                         'gwangmyeong': '광명시', 'pyeongtaek': '평택시', 'ansan': '안산시', 'hwaseong': '화성시',
                         'osan': '오산시', 'yongin': '용인시', 'icheon': '이천시', 'gunpo': '군포시',
                         'uijeongbu': '의정부시', 'goyang': '고양시', 'gimpo': '김포시', 'paju': '파주시',
                         'yangju': '양주시', 'dongducheon': '동두천시', 'gapyeong': '가평군', 'yangpyeong': '양평군',
                         'yeoju': '여주시', 'anseong': '안성시', 'pocheon': '포천시', 'yeoncheon': '연천군',
                         // 한국어 구명 직접 매핑
                         '강남구': '강남구', '강동구': '강동구', '강북구': '강북구', '강서구': '강서구',
                         '관악구': '관악구', '광진구': '광진구', '구로구': '구로구', '금천구': '금천구',
                         '노원구': '노원구', '도봉구': '도봉구', '동대문구': '동대문구', '동작구': '동작구',
                         '마포구': '마포구', '서대문구': '서대문구', '서초구': '서초구', '성동구': '성동구',
                         '성북구': '성북구', '송파구': '송파구', '양천구': '양천구', '영등포구': '영등포구',
                         '용산구': '용산구', '은평구': '은평구', '종로구': '종로구', '중구': '중구', '중랑구': '중랑구',
                         // 경기도 시/군
                         '수원시': '수원시', '성남시': '성남시', '안양시': '안양시', '부천시': '부천시',
                         '광명시': '광명시', '평택시': '평택시', '안산시': '안산시', '화성시': '화성시',
                         '오산시': '오산시', '용인시': '용인시', '이천시': '이천시', '군포시': '군포시',
                         '의정부시': '의정부시', '고양시': '고양시', '김포시': '김포시', '파주시': '파주시',
                         '양주시': '양주시', '동두천시': '동두천시', '가평군': '가평군', '양평군': '양평군',
                         '여주시': '여주시', '안성시': '안성시', '포천시': '포천시', '연천군': '연천군',
                         // 인천시 구
                         '미추홀구': '미추홀구', '연수구': '연수구', '남동구': '남동구', '부평구': '부평구',
                         '계양구': '계양구', '강화군': '강화군', '옹진군': '옹진군',
                         // 인천시 구 영문 매핑
                         'michuhol': '미추홀구', 'yeonsu': '연수구', 'namdong': '남동구', 'bupyeong': '부평구',
                         'gyeyang': '계양구', 'ganghwa': '강화군', 'ongjin': '옹진군',
                         // 대구시 구
                         '동구': '동구', '서구': '서구', '남구': '남구', '북구': '북구', '수성구': '수성구', '달서구': '달서구', '달성군': '달성군',
                         // 대구시 구 영문 매핑
                         'jung': '중구', 'dong': '동구', 'seo': '서구', 'nam': '남구', 'buk': '북구', 'suseong': '수성구', 'dalseo': '달서구', 'dalseong': '달성군',
                         // 부산시 구
                         '영도구': '영도구', '부산진구': '부산진구', '동래구': '동래구', '해운대구': '해운대구', '사하구': '사하구', '금정구': '금정구', '강서구': '강서구', '연제구': '연제구', '수영구': '수영구', '사상구': '사상구', '기장군': '기장군',
                         // 부산시 구 영문 매핑
                         'yeongdo': '영도구', 'busanjin': '부산진구', 'dongnae': '동래구', 'haeundae': '해운대구', 'saha': '사하구', 'geumjeong': '금정구', 'yeonje': '연제구', 'suyeong': '수영구', 'sasang': '사상구', 'gijang': '기장군',
                         // 대전시 구
                         '유성구': '유성구', '대덕구': '대덕구',
                         // 대전시 구 영문 매핑
                         'yuseong': '유성구', 'daedeok': '대덕구',
                         // 광주시 구
                         '광산구': '광산구',
                         // 광주시 구 영문 매핑
                         'gwangsan': '광산구',
                         // 울산시 구
                         '울주군': '울주군',
                         // 울산시 구 영문 매핑
                         'ulju': '울주군',
                                                 // 일본어 번역
                         'ソウル': '서울', '釜山': '부산', '大邱': '대구', '仁川': '인천', '光州': '광주', '大田': '대전',
                         '蔚山': '울산', '世宗': '세종', '京畿': '경기', '江原': '강원', '忠北': '충북', '忠南': '충남',
                         '全北': '전북', '全南': '전남', '慶北': '경북', '慶南': '경남', '済州': '제주', '全国': '전국',
                         
                         // 일본어 지역명 번역 (구/군)
                         '江南区': '강남구', '江东区': '강동구', '江北区': '강북구', '江西区': '강서구',
                         '冠岳区': '관악구', '广津区': '광진구', '九老区': '구로구', '衿川区': '금천구',
                         '芦原区': '노원구', '道峰区': '도봉구', '东大门区': '동대문구', '铜雀区': '동작구',
                         '麻浦区': '마포구', '西大门区': '서대문구', '瑞草区': '서초구', '城东区': '성동구',
                         '城北区': '성북구', '松坡区': '송파구', '阳川区': '양천구', '永登浦区': '영등포구',
                         '龙山区': '용산구', '恩平区': '은평구', '钟路区': '종로구', '中区': '중구', '中浪区': '중랑구',
                         
                         // 경기도 시/군 일본어 번역
                         '水原市': '수원시', '城南市': '성남시', '安养市': '안양시', '富川市': '부천시',
                         '光明市': '광명시', '平泽市': '평택시', '安山市': '안산시', '华城市': '화성시',
                         '乌山市': '오산시', '龙仁市': '용인시', '利川市': '이천시', '军浦市': '군포시',
                         '议政府市': '의정부시', '高阳市': '고양시', '金浦市': '김포시', '坡州市': '파주시',
                         '杨州市': '양주시', '东豆川市': '동두천시', '加平郡': '가평군', '杨平郡': '양평군',
                         '骊州市': '여주시', '安城市': '안성시', '抱川市': '포천시', '涟川郡': '연천군',
                         
                         // 인천시 구 일본어 번역
                         '弥邹忽区': '미추홀구', '延寿区': '연수구', '南洞区': '남동구', '富平区': '부평구',
                         '桂阳区': '계양구', '江华郡': '강화군', '瓮津郡': '옹진군',
                         
                         // 부산시 구 일본어 번역
                         '影岛区': '영도구', '釜山镇区': '부산진구', '东莱区': '동래구', '海云台区': '해운대구',
                         '沙下区': '사하구', '金井区': '금정구', '莲堤区': '연제구', '水营区': '수영구',
                         '沙上区': '사상구', '机张郡': '기장군',
                         
                         // 대구시 구 일본어 번역
                         '中区': '중구', '东区': '동구', '西区': '서구', '南区': '남구',
                         '北区': '북구', '寿城区': '수성구', '达西区': '달서구', '达城郡': '달성군',
                         
                         // 대전시 구 일본어 번역
                         '儒城区': '유성구', '大德区': '대덕구',
                         
                         // 광주시 구 일본어 번역
                         '光山区': '광산구',
                         
                         // 울산시 구 일본어 번역
                         '蔚州郡': '울주군',
                         
                         // 중국어 번역
                         '首尔': '서울', '釜山': '부산', '大邱': '대구', '仁川': '인천', '光州': '광주', '大田': '대전',
                         '蔚山': '울산', '世宗': '세종', '京畿': '경기', '江原': '강원', '忠北': '충북', '忠南': '충남',
                         '全北': '전북', '全南': '전남', '庆北': '경북', '庆南': '경남', '济州': '제주', '全国': '전국',
                         
                         // 중국어 지역명 번역 (구/군)
                         '江南区': '강남구', '江东区': '강동구', '江北区': '강북구', '江西区': '강서구',
                         '冠岳区': '관악구', '广津区': '광진구', '九老区': '구로구', '衿川区': '금천구',
                         '芦原区': '노원구', '道峰区': '도봉구', '东大门区': '동대문구', '铜雀区': '동작구',
                         '麻浦区': '마포구', '西大门区': '서대문구', '瑞草区': '서초구', '城东区': '성동구',
                         '城北区': '성북구', '松坡区': '송파구', '阳川区': '양천구', '永登浦区': '영등포구',
                         '龙山区': '용산구', '恩平区': '은평구', '钟路区': '종로구', '中区': '중구', '中浪区': '중랑구',
                         
                         // 경기도 시/군 중국어 번역
                         '水原市': '수원시', '城南市': '성남시', '安养市': '안양시', '富川市': '부천시',
                         '光明市': '광명시', '平泽市': '평택시', '安山市': '안산시', '华城市': '화성시',
                         '乌山市': '오산시', '龙仁市': '용인시', '利川市': '이천시', '军浦市': '군포시',
                         '议政府市': '의정부시', '高阳市': '고양시', '金浦市': '김포시', '坡州市': '파주시',
                         '杨州市': '양주시', '东豆川市': '동두천시', '加平郡': '가평군', '杨平郡': '양평군',
                         '骊州市': '여주시', '安城市': '안성시', '抱川市': '포천시', '涟川郡': '연천군',
                         
                         // 인천시 구 중국어 번역
                         '弥邹忽区': '미추홀구', '延寿区': '연수구', '南洞区': '남동구', '富平区': '부평구',
                         '桂阳区': '계양구', '江华郡': '강화군', '瓮津郡': '옹진군',
                         
                         // 부산시 구 중국어 번역
                         '影岛区': '영도구', '釜山镇区': '부산진구', '东莱区': '동래구', '海云台区': '해운대구',
                         '沙下区': '사하구', '金井区': '금정구', '莲堤区': '연제구', '水营区': '수영구',
                         '沙上区': '사상구', '机张郡': '기장군',
                         
                         // 대구시 구 중국어 번역
                         '中区': '중구', '东区': '동구', '西区': '서구', '南区': '남구',
                         '北区': '북구', '寿城区': '수성구', '达西区': '달서구', '达城郡': '달성군',
                         
                         // 대전시 구 중국어 번역
                         '儒城区': '유성구', '大德区': '대덕구',
                         
                         // 광주시 구 중국어 번역
                         '光山区': '광산구',
                         
                         // 울산시 구 중국어 번역
                         '蔚州郡': '울주군'
                    };
                    
                    // 카테고리 번역 매핑
                    const categoryTranslations = {
                        'Plastic Surgery': '성형', 'Skin Care': '피부', 'Dental': '치과', 'Pharmacy': '약국',
                        'Korean Medicine': '한의원', 'Massage': '마사지', 'Waxing': '왁싱', 'Tourism': '관광',
                        // 추가 카테고리 매핑
                        'plastic': '성형', 'skin': '피부', 'dental': '치과', 'pharmacy': '약국',
                        'korean.medicine': '한의원', 'massage': '마사지', 'waxing': '왁싱', 'tourism': '관광',
                        // 일본어 번역
                        '整形': '성형', '皮膚': '피부', '歯科': '치과', '薬局': '약국', '韓方': '한의원',
                        'マッサージ': '마사지', 'ワックス': '왁싱', '観光': '관광',
                        // 중국어 번역
                        '整形': '성형', '皮肤': '피부', '牙科': '치과', '药房': '약국', '韩医': '한의원',
                        '按摩': '마사지', '脱毛': '왁싱', '旅游': '관광'
                    };
                    
                    // 번역된 텍스트를 한국어로 변환
                    let koreanText = regionTranslations[text];
                    if (koreanText) return koreanText;
                    
                    koreanText = categoryTranslations[text];
                    if (koreanText) return koreanText;
                    
                    // 매핑되지 않은 경우 원본 반환
                    return text;
                }
                
                // 번역된 파라미터를 한국어로 변환
                const originalCategory = translateToKorean(category);
                const originalRegion = translateToKorean(region);
                const originalSubRegion = translateToKorean(subRegion);
                
                console.log('번역 전:', {category, region, subRegion});
                console.log('번역 후:', {originalCategory, originalRegion, originalSubRegion});
                
                // 리스트 페이지로 이동 (한국어 파라미터 사용)
                window.location.href = '/list?category=' + encodeURIComponent(originalCategory) + '&region=' + encodeURIComponent(originalRegion) + '&subRegion=' + encodeURIComponent(originalSubRegion);
            };
            row.appendChild(left);
            row.appendChild(right);
            distList.appendChild(row);
        });
    }

    // 이벤트 리스너들
    scrollTop.addEventListener('click', function() {
        distList.scrollTop = 0;
    });

    // 초기화
    (function init() {
        renderSido();
        renderDists();
    })();
})();
</script>
</body>
</html>
