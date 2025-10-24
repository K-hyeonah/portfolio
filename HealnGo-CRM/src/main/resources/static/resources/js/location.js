(function() {
    // 지역 데이터
    const REGIONS = {
        'nation': {
            name: '전국',
            districts: ['전국']
        },
        'seoul': {
            name: '서울',
            districts: ['강남구', '강북구', '마포구', '용산구', '성동구', '동대문구', '중랑구', '성북구', '도봉구', '노원구', '은평구', '서대문구', '서초구', '송파구', '강동구', '광진구', '중구', '종로구']
        },
        'gyeonggi': {
            name: '경기',
            districts: ['수원시', '성남시', '안양시', '부천시', '광명시', '평택시', '안산시', '화성시', '오산시', '용인시', '이천시', '군포시', '의정부시', '고양시', '김포시', '파주시', '양주시', '동두천시', '가평군', '양평군', '여주시', '안성시', '포천시', '연천군']
        },
        'incheon': {
            name: '인천',
            districts: ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군']
        },
        'busan': {
            name: '부산',
            districts: ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군']
        },
        'daegu': {
            name: '대구',
            districts: ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군']
        },
        'daejeon': {
            name: '대전',
            districts: ['동구', '중구', '서구', '유성구', '대덕구']
        },
        'gwangju': {
            name: '광주',
            districts: ['동구', '서구', '남구', '북구', '광산구']
        },
        'ulsan': {
            name: '울산',
            districts: ['중구', '남구', '동구', '북구', '울주군']
        },
        'chungnam': {
            name: '충남',
            districts: ['천안시', '공주시', '보령시', '아산시', '논산시', '계룡시', '당진시', '서산시', '홍성군', '청양군', '부여군', '예산군', '서천군', '청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '진천군', '괴산군', '음성군', '단양군', '증평군', '태안군', '세종시']
        },
        'chungbuk': {
            name: '충북',
            districts: ['청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '진천군', '괴산군', '음성군', '단양군', '증평군']
        },
        'jeonnam': {
            name: '전남',
            districts: ['목포시', '여수시', '순천시', '나주시', '광양시', '담양군', '곡성군', '구례군', '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군', '무안군', '신안군', '완도군', '진도군', '장성군', '함평군', '영광군']
        },
        'jeonbuk': {
            name: '전북',
            districts: ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군']
        },
        'gyeongnam': {
            name: '경남',
            districts: ['창원시', '김해시', '양산시', '거제시', '통영시', '사천시', '밀양시', '함안군', '거창군', '창녕군', '고성군', '남해군', '하동군', '산청군', '함양군', '거리군', '의령군', '합천군']
        },
        'gyeongbuk': {
            name: '경북',
            districts: ['포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시', '문경시', '경산시', '군위군', '의성군', '청송군', '영양군', '영덕군', '청도군', '고령군', '성주군', '칠곡군', '예천군', '봉화군', '울진군', '울릉군']
        },
        'gangwon': {
            name: '강원',
            districts: ['춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '홍천군', '철원군', '횡성군', '평창군', '정선군', '영월군', '인제군', '고성군', '양양군']
        },
        'jeju': {
            name: '제주',
            districts: ['제주시', '서귀포시']
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
