# 카테고리 아이콘 디렉토리

이 디렉토리에는 메인 페이지의 카테고리 버튼에 사용되는 아이콘 이미지를 저장합니다.

## 권장 아이콘 목록

1. `tourism.png` - 관광 카테고리 아이콘 (비행기 아이콘)
2. `plastic-surgery.png` - 성형 카테고리 아이콘 (병원/의료 아이콘)
3. `skincare.png` - 피부 카테고리 아이콘 (마스크팩/물방울 아이콘)
4. `dental.png` - 치과 카테고리 아이콘 (치아 아이콘)
5. `pharmacy.png` - 약국 카테고리 아이콘 (약/의약품 아이콘)
6. `checkup.png` - 검진 카테고리 아이콘 (청진기/의료 체크 아이콘)

## 아이콘 요구사항

- **크기**: 50px x 50px (또는 1:1 비율)
- **형식**: PNG 또는 SVG (투명 배경 권장)
- **스타일**: 심플하고 명확한 아이콘 디자인

아이콘을 추가한 후에는 main.jsp 파일에서 Font Awesome 아이콘 대신 이 이미지를 사용하도록 변경할 수 있습니다:

```html
<div class="category-button-icon">
    <img src="/resources/images/category-icons/portfolio.png" alt="포트폴리오">
</div>
```
